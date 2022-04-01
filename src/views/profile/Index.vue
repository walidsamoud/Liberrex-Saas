<template>
  <vs-row vs-justify="center" id="profile-box">
    <vs-col type="flex" vs-justify="left" vs-align="left" vs-lg="4" vs-xs="12">
      <vs-card>
        <ProfileSummary :user="account_info"></ProfileSummary>
      </vs-card>
    </vs-col>
    <vs-col type="flex" vs-justify="left" vs-align="left" vs-lg="8" vs-xs="12">
      <vs-card id="form">

        <h4 class>{{$t('Profile.PersonalInformation')}}</h4>
        <hr class="custom-hr" />
        <vs-row>
          <vs-col vs-lg="6" vs-xs="12" vs-sm="6">
            <vs-input :danger="errors.firstName"
                      :danger-text="$t('Errors.InvalidPolite', {field: $t('Profile.FirstName')})"
                      :label="$t('Profile.FirstName')"
                      :placeholder="$t('Profile.FirstName')"
                      v-model="accountFormData.fname"
                      class="w-100"
            />
            <vs-input
                    :label="$t('Profile.Email')"
                    :placeholder="$t('Profile.Email')"
                    v-model="accountFormData.email"
                    class="w-100 mt-4"
                    :disabled="true"
            />
            <vs-select class="w-100 mt-4" :label="$t('Profile.Role')" v-model="accountFormData.role">
              <vs-select-item
                      :key="index"
                      :value="item.value"
                      :text="item.text"
                      v-for="(item,index) in positions"
              />
            </vs-select>
          </vs-col>
          <vs-col vs-lg="6" vs-xs="12" vs-sm="6">
            <vs-input :danger="errors.lastName"
                      :danger-text="$t('Errors.InvalidPolite', {field: $t('Profile.LastName')})"
                      :label="$t('Profile.LastName')"
                      :placeholder="$t('Profile.LastName')"
                      v-model="accountFormData.lname"
                      class="w-100 mt-4 mt-md-0"
            />
            <vs-input :danger="errors.phoneNumber"
                      :danger-text="$t('Errors.InvalidPolite', {field: $t('Profile.PhoneNumber')})"
                      :label="$t('Profile.PhoneNumber')"
                      :placeholder="$t('Profile.PhoneNumber')"
                      v-model="accountFormData.telephone"
                      class="w-100 mt-4"
            />
            <vs-input type="file" class="w-100 mt-4" id="fileInput" :label="$t('Profile.Photo')" v-model="photo"/>

          </vs-col>
        </vs-row>

        <div class="btn-alignment mt-4">
          <vs-button color="primary" type="filled" @click="updateAccount">{{$t('Profile.UpdateSubmitButton')}}</vs-button>
        </div>
      </vs-card>
    </vs-col>
  </vs-row>
</template>

<script>
import ProfileSummary from "../../components/widgets/profile/ProfileSummary";
import { mapState, mapActions } from 'vuex'
import { userService } from '../../_services'
export default {
  name: "Profile",
  data: () => ({
    title: "Profile",
    activePrompt: false,
    positions: [ ],
    accountFormData: {
      fname: "",
      lname: "",
      telephone: "",
    },
    errors: {
      firstName: false,
      lastName: false,
      phoneNumber: false,
    },
    photo: ''
  }),
  methods: {
    ...mapActions('account', ['updateUserObject']),
    notify(title, text, type) {
      this.$vs.notify({
        color: type,
        title: title,
        text: text
      });
    },
    validateFields() {
      this.errors.firstName = (this.accountFormData.telephone=="null" || this.accountFormData.fname.length < 3) ? true : false;
      this.errors.lastName = (this.accountFormData.telephone=="null" || this.accountFormData.lname.length < 3) ? true : false;
      this.errors.phoneNumber = (this.accountFormData.telephone=="null" || this.accountFormData.telephone.length < 3 || !this.isValidPhoneNumber(this.accountFormData.telephone)) ? true : false;

      let {firstName, lastName, phoneNumber} = this.errors;
      return !(firstName || lastName || phoneNumber);
    },
    isValidPhoneNumber(value) {
      // let phoneNumber = this.phone_number;
      return /^\d+$/.test(value);
    },
    showLoading(){
      this.$vs.loading({
        container: '#profile-box',
        scale: 0.6
      });
    },
    hideLoading(){
      this.$vs.loading.close('#profile-box > .con-vs-loading')
    },
    updateAccount(){
      let res = this.validateFields();
      if (!res) {
        this.activePrompt = true;
        return false;
      }
      this.showLoading();

      let user = new FormData()
      user.append('fname', this.accountFormData.fname);
      user.append('lname',this.accountFormData.lname);
      user.append('email',this.accountFormData.email);
      if(document.getElementById("fileInput").files[0]){
        user.append('photo', document.getElementById("fileInput").files[0]);
      }
      user.append('telephone', this.accountFormData.telephone);
      user.append('position', this.accountFormData.role);

      userService.update(user)
              .then(function (data) {
                let userOld = JSON.parse(localStorage.getItem('user'));
                userOld.user = data.account;
                localStorage.setItem('user', JSON.stringify(userOld));
                this.updateUserObject();
                this.notify(this.$t('Toasts.Successful'), this.$t('Profile.UpdatePersonalInformation.ToastSuccess'), 'success');
              }.bind(this))
              .catch(function () {
                this.notify(this.$t('Toasts.Error'), this.$t('Profile.UpdatePersonalInformation.ToastFail'), 'danger');
              }.bind(this))
              .finally(function () {
                this.hideLoading();
              }.bind(this));
    }
  },
  computed: {
    ...mapState({
      account_info: state => state.account.user.user,
      business_info: state => state.account.user.business,
    }),
    events() {
      return this.$store.state.contactEvents;
    },
    validName() {
      return this.queues.length > 0;
    },
    queueGrids() {
      return this.queues.filter(
        item =>
                item.queue.title
            .toLowerCase()
            .includes(this.search.toLowerCase())
      );
    }
  },
  mounted(){
    this.positions = [
      {value: "ADMIN", text: this.$t("Profile.Positions.Admin") }, // ADMIN ACCESS
      {value: "MANAGER", text: this.$t("Profile.Positions.Manager") }, // MANAGE ALL BOOKINGS & QUEUES
      {value: "EMPLOYEE", text: this.$t("Profile.Positions.Employee") } // MANAGE ONLY ASSIGNED QUEUES AND PERSONAL BOOKINGS
    ];
    this.accountFormData = this.account_info;
  },
  components: {
    ProfileSummary
  }
};
</script>
