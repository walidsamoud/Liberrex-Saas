<template>
      
              <div >
                <div>
                  <div class="con-exemple-prompt px-4 py-3">
                    <vs-row>
                      <vs-col vs-w="6">
                        <vs-input
                          :danger="errors.firstName"
                          :danger-text="$t('Errors.InvalidPolite', {field: $t('Customer.FirstName')})"
                          :label="$t('Customer.FirstName')"
                          v-model="fname"
                          @change="getNextUid()"
                          class="w-100 mb-2"
                        />
                      </vs-col>
                      <vs-col vs-w="6">
                        <vs-input
                          :danger="errors.lastName"
                          :danger-text="$t('Errors.InvalidPolite', {field: $t('Customer.LastName')})"
                          :label="$t('Customer.LastName')"
                          v-model="lname"
                          class="w-100 mb-2"
                        />
                      </vs-col>
                    </vs-row>
                    <vs-row>
                    <vs-col vs-w="6">

                    <vs-input
                      :danger="errors.email"
                      :danger-text="$t('Errors.InvalidPolite', {field: $t('Customer.Email')})"
                      type="email"
                      :label="$t('Customer.Email')"
                      v-model="email"
                      class="w-100 mb-2"
                    />
                    </vs-col>
                    <vs-col vs-w="6">
                    <div :label="$t('Customer.PhoneNumber')">
                    <label for="" class="vs-input--label">{{$t('Customer.PhoneNumber')}}</label>
                    <vue-tel-input
                        :danger="errors.phone_number"
                      :danger-text="$t('Errors.InvalidPolite', {field: $t('Customer.Email')})"
                      v-model="phone_number"
                      defaultCountry="TN"
                      :onlyCountries="onlyCountries"
                      :validCharactersOnly="true"
                      :placeholder="phone_number ? phone_number : $t('Customer.PhoneNumber')"
                      @country-changed="countryChanged"
                        class="mb-2"
                    ></vue-tel-input>
                    
                  </div>
                    </vs-col>

                    <vs-col vs-w="6">
                    <div :label="$t('Customer.PhoneNumber2')">
                    <label for="" class="vs-input--label">{{$t('Customer.PhoneNumber2')}}</label>
                    <vue-tel-input
                        :danger="errors.phone_number_2"
                      :danger-text="$t('Errors.InvalidPolite', {field: $t('Customer.Email')})"
                      v-model="phone_number_2"
                      defaultCountry="TN"
                      :onlyCountries="onlyCountries"
                      :validCharactersOnly="true"
                      :placeholder="phone_number_2 ? phone_number_2 : $t('Customer.PhoneNumber')"
                      @country-changed="countryChanged2"
                        class="mb-2"
                    ></vue-tel-input>
                    
                  </div>
                    </vs-col>

                    </vs-row>
                    <vs-row>
                      <vs-col vs-w="6">
                        <vs-input
                          type="date"
                          :label="$t('Customer.DateOfBirth')"
                          v-model="dateOfBirth"
                          class="w-100 mb-2"
                        />
                      </vs-col>
                      <vs-col vs-w="6">
                         <vs-select
                                  v-model="nationality"
                                  :label="$t('Customer.Nationality')"
                                  @change="getAvailableSlots('create')"
                                  class="w-100 mb-4"
                                >
                                  <vs-select-item
                                    :key="index"
                                    :value="item.code"
                                    :text="item.name"
                                    v-for="(item,index) in countries"
                                  />
                              </vs-select>
                      </vs-col>
                    </vs-row>
                    <vs-row>

                      <vs-col vs-w="6">
                              <vs-select
                                  v-model="preferred_language"
                                  :label="$t('Customer.PreferredLanguage')"
                                  @change="getAvailableSlots('create')"
                                  class="w-100 mb-4"
                                >
                                  <vs-select-item
                                    :key="index"
                                    :value="item.value"
                                    :text="item.name"
                                    v-for="(item,index) in languages"
                                  />
                              </vs-select>

                      </vs-col>


                      <vs-col vs-w="6">
                        <vs-input
                          :label="$t('Customer.InternalId')"
                          v-model="internalId"
                          class="w-100 mb-2"
                        />
                      </vs-col>
                    </vs-row>
                        <vs-input
                          :label="$t('Customer.Address')"
                          v-model="address"
                          class="w-100 mb-2"
                        />
                        
                    <vs-textarea
                      counter="500"
                      class="w-100 mt-2"
                      :label="$t('Customer.Notes')"
                      :placeholder="$t('Customer.Notes')"
                      :description-text="$t('Customer.NotesHint')"
                      v-model="notes"
                    />
                    <vs-col vs-w="12" class="text-right mt-4">
                        <vs-button @click="close()" type="border" color="primary" class="border-0 border-bottom mr-4"> {{$t('Components.Queue.AddCustomerPrompt.CancelButton')}} </vs-button>
                        <vs-button @click="acceptAlert()" color="primary" class="pr-5 pl-5 float-right"> {{$t('Components.Queue.AddCustomerPrompt.PushButton')}} </vs-button>
                    </vs-col>
                  </div>
                    
                </div>
               
              </div>
             
</template>

<script>
import { mapState } from 'vuex'
import MultipleCustomerSelectFilter from '../../components/shared/MultipleCustomerSelectFilter'
import { customerService, customerBookService } from "../../_services";
import router from "../../_helpers/router";
import VsPrism from '../prism/VsPrism.vue';
import vueCountryRegionSelect from 'vue-country-region-select';
import vuecountryselect from "vue-country-select"  ;
// moment

export default {
    
  name: "AddNewCustomer",
  data: () => ({
    countries: require("../../_helpers/countries-selector.js"),
    title: "AddNewCustomer",
    onlyCountries: ["GB", "FR", "TN", "US", "DZ", "LY", "MA", "CI"],
    country: "",
    country2: "",
    customer_id : 0,
    languages: [{"name":"عربية","value":"ar"},{"name":"Français","value":"fr"},{"name":"English","value":"en"}],
    errors: {
      firstName: false,
      lastName: false,
      email: false,
      phone_number: false,
      phone_number_2: false,
      libID: false,
      selected: {
        firstName: false,
        lastName: false,
        email: false,
        phone_number: false,
        phone_number_2: false,
        libID: false
      }
    },
    fname: "",
    lname: "",
    phone_number: "",
    phone_number_2: "",
    address: "",
    email: "",
    notes: "",
    internalId: "",
    dateOfBirth: "",
    nationality: "TN",
    placeOfBirth: "",
    address: "",
    searchKeyword: "",
    preferred_language: "",
  }),
  props: {
    servicesList: Array,
    teamMembers: Array,
    queue_id: Number,
    booking: Boolean,
    queue: Boolean,
    customer: Boolean,
    booking: Boolean,
  },
  methods: {
    notify(title, text, type) {
      this.$vs.notify({
        color: type,
        title: title,
        text: text
      });
    },
    countryChanged(data) {
      this.country = data.dialCode;
    },
    countryChanged2(data) {
      this.country2 = data.dialCode;
    },
    showLoading() {
      this.$vs.loading({
        container: "#customers-box",
        scale: 0.6
      });
    },
    hideLoading() {
      this.$vs.loading.close("#customers-box > .con-vs-loading");
    },
    close(){
      if(this.queue_id){
        this.$emit('updateSidebar', ['queue','customer']);

      }
      else if (this.booking){
      this.$emit('updateSidebar', ['booking','customer']);
      }
      else{
        this.$emit('hide', 'close');

      }
    },
    getNextUid(){

      if (this.account_info.business_id == 18){
        let name = {
        name:this.fname
      }
      customerService.getNextUid(name)
            .then(
              function (data){
                this.internalId = data['internal_id'];

              }.bind(this)
              ).catch(
          function(data) {
            //console.log(data);
          }.bind(this)
        )
      }
    },
    acceptAlert() {
      let res = this.validateFields();

      if (!res) {
          //console.log(this.phone_number);
        this.activePrompt = true;
        this.$emit('updateSidebar', 'queue');
        return false;
      }
      // this.showLoading();

      let user = {
        fname: this.fname,
        lname: this.lname,
        email: this.email,
        phone_number: this.phone_number,
        phone_number_2: this.phone_number_2,
        address: this.address,
        dateofbirth: this.dateOfBirth,
        internal_id: this.internalId,
        notes: this.notes,
        preferred_language: this.preferred_language,
        address: this.address,
        nationality: this.nationality,
        phone_number: this.phone_number? ("+"+this.country+this.phone_number).replace(/\s/g, '') : "00000000",
        phone_number_2: this.phone_number_2? ("+"+this.country2+this.phone_number_2).replace(/\s/g, '') : ""

      };
      customerService
        .create(user)
        .then(
          function(data) {
            this.customer_id = data.customer.id;
            this.redirectToQueueOrBooking();
            
            this.notify(
              this.$t("Toasts.Successful"),
              this.$t("Customer.AddCustomerPrompt.ToastSuccessMessage"),
              "success"
            );
            this.activePrompt = false;
          }.bind(this)
        )
        .catch(
          function() {
            this.notify(
              this.$t("Toasts.Error"),
              this.$t("Customer.AddCustomerPrompt.ToastFailMessage"),
              "danger"
            );
          }.bind(this)
        )
        .finally(
          function() {
            this.hideLoading();
          }.bind(this)
        );

    },
    redirectToQueueOrBooking(){
      this.$emit('customer_id',this.customer_id);
      if (this.queue_id){
      this.$emit('updateSidebar', ['queue','customer']);
      return;
      }
      else if (this.booking){
        this.$emit('updateSidebar', ['booking','customer']);
        return;
      }
      else{
        this.$emit('hide', 'close');
        return;

      }
    },
    handleSort(key, active) {
      /* eslint-disable */
      console.log({ key, active });
    },
    formatDate: function(value) {
      let date = this.$moment(value).fromNow();
      return date;
    },
    reset() {
      this.activePrompt = false;
      this.activeUpdatePrompt = false;
      this.activeBookPrompt = false;
      this.selected = [];
      this.fname = "";
      this.lname = "";
      this.phone_number = "";
      this.phone_number_2 = "";
      this.address = "";
      this.email = "";
      this.notes = "";
      this.importModal = { file: null };
    },
    validateFields() {
      this.errors.firstName = this.fname.length < 3 ? true : false;
      this.errors.lastName = this.lname.length < 3 ? true : false;
      this.errors.phone_number =
        (this.phone_number.length < 8 && this.phone_number.length !=0) ||
        !this.isValidPhoneNumber(this.phone_number)
          ? true
          : false;
      if (this.email.length > 0) {
        this.errors.email = this.isValidEmail(this.email) ? false : true;
      } else {
        this.errors.email = false;
      }

      let { firstName, lastName, phone_number, email } = this.errors;
      return !(firstName || lastName || phone_number || email);
    },    
    isValidPhoneNumber(value) {
      // let phoneNumber = this.phone_number;
        value=("+"+this.country+this.phone_number).replace(/\s/g, '');

      return /^[+\d]\d+$/.test(value);
    },
    isValidEmail: function(value) {
      let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(value);
    },
 

  },
  computed: {
    ...mapState({
      account_info: state => state.account.user ? state.account.user.user : {user: {photo: ""}},
    }),
    events() {
      return this.$store.state.contactEvents;
    },
    validateAddCustomerForm() {
      // return this.fname.length > 0;
      // return true
    },
 
  },
  components: {
    MultipleCustomerSelectFilter,
    vueCountryRegionSelect,
    vuecountryselect
  },
  mounted() {
  }
};
    VsPrism
</script>
