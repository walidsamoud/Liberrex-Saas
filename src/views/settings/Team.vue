<template>
  <vs-row vs-justify="center" id="team-box">
    <vs-col type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-xs="12">
      <vs-card>
        <vs-table
                @search="handleSearch"
                @sort="handleSort"
                v-model="selected"
                :total="totalItems"
                max-items="10"
                search
                :data="teamMembers">
          <div slot="header">
            <vs-button id="add-team-form" icon="add" color="primary" @click="activePrompt = true">{{$t('Team.AddTeamMemberButton')}}</vs-button>
            <!---Edit Working Days --->
            <vs-prompt
                    color="primary"
                    class="lg-modal"
                    @accept="submitWorkingDaysUpdate"
                    @close="close"
                    @cancel="close"
                    :active.sync="workingDaysActivePrompt"
                    :title="$t('Team.WorkingDaysPrompt.Title', {name: selected.fname+' '+selected.lname})"
                    :accept-text="$t('Team.WorkingDaysPrompt.SubmitButton')"
                    :cancel-text="$t('Team.WorkingDaysPrompt.CancelButton')"
            >
              <div v-bar class="vs-scrollable">
                <div>
                  <div class="con-exemple-prompt px-4 py-3">
                    <TeamWorkingDay :key="index" v-for="(day, index) in selected.workingDays" :day="day"></TeamWorkingDay>
                  </div>
                </div>
              </div>
            </vs-prompt>

            <!---Add Member --->
            <vs-prompt
                    color="primary"
                    @accept="submitForm"
                    @close="close"
                    @cancel="close"
                    :active.sync="activePrompt"
                    :title="$t('Team.AddTeamMemberPrompt.Title')"
                    :accept-text="$t('Team.AddTeamMemberPrompt.SubmitButton')"
                    :cancel-text="$t('Team.AddTeamMemberPrompt.CancelButton')"
            >
              <v-tour name="TeamB" :steps="steps">
                <template slot-scope="tour">
                  <transition name="fade">
                    <v-step
                            v-if="tour.currentStep === index"
                            v-for="(step, index) of tour.steps"
                            :key="index"
                            :step="step"
                            :previous-step="tour.previousStep"
                            :next-step="tour.nextStep"
                            :stop="tour.stop"
                            :is-first="tour.isFirst"
                            :is-last="tour.isLast"
                            :labels="tour.labels"
                    >
                      <template v-if="tour.currentStep === 0">
                        <div slot="actions" class="v-step__buttons">
                          <button @click="promptShowNew" class="v-step__button">Next</button>
                        </div>
                      </template>
                      <!--<template v-if="tour.currentStep === 1">
                          <div slot="actions" @click="promptShow">
                              <button @click="tour.nextStep" class="btn btn-primary btn-lg outline">Next step</button>
                          </div>
                      </template>-->
                    </v-step>
                  </transition>
                </template>
              </v-tour>
              <div v-bar class="vs-scrollable">
                <div>
                  <div class="con-exemple-prompt px-4 py-3">
                    <vs-row>
                      <vs-col vs-w="6"><vs-input :danger="errors.fname"
                                                 :danger-text="$t('Errors.InvalidPolite', {field: $t('Profile.FirstName')})"
                                                 :label="$t('Profile.FirstName')" v-model="fname" class="w-100 mb-2" /></vs-col>
                      <vs-col vs-w="6"><vs-input :danger="errors.lname"
                                                 :danger-text="$t('Errors.InvalidPolite', {field: $t('Profile.LastName')})"
                                                 :label="$t('Profile.LastName')" v-model="lname" class="w-100 mb-2" /></vs-col>
                    </vs-row>

                    <vs-input
                            :danger="errors.email"
                            :danger-text="$t('Errors.InvalidPolite', {field: $t('Profile.Email')})"
                            :label="$t('Profile.Email')" v-model="email" class="w-100 mb-2" required/>
                    <vs-input :danger="errors.telephone"
                              :danger-text="$t('Errors.InvalidPolite', {field: $t('Profile.PhoneNumber')})"
                              :label="$t('Profile.PhoneNumber')" v-model="telephone" class="w-100 mb-2" />

                    <vs-row>
                      <vs-col vs-w="6"><vs-input
                              :danger="errors.password"
                              :danger-text="$t('Errors.InvalidPolite', {field: $t('Profile.Password')})"
                              :label="$t('Profile.Password')" v-model="password" type="password"  class="w-100 mb-2" /></vs-col>
                      <vs-col vs-w="6"><vs-input
                             :danger="errors.password_confirm"
                             :danger-text="$t('Errors.InvalidPolite', {field: $t('Profile.PasswordConfirm')})"
                             :label="$t('Profile.PasswordConfirm')" type="password" v-model="password_confirm" class="w-100 mb-2" /></vs-col>
                    </vs-row>

                    <vs-select class="w-100 mb-2"
                               :danger="errors.role"
                               :danger-text="$t('Errors.Required', {field: $t('Profile.Role')})"
                               :label="$t('Profile.Role')" v-model="role">
                      <vs-select-item
                              :key="index"
                              :value="item.value"
                              :text="item.text"
                              v-for="(item,index) in positions"
                      />
                    </vs-select>

                    <vs-select class="w-100 mb-2" :label="$t('Profile.Department')" v-if="departments.length" v-model="department"  autocomplete multiple>
                      <vs-select-item
                              :key="index"
                              :value="item.id"
                              :text="item.name"
                              v-for="(item,index) in departments"
                      />
                    </vs-select>
                    <vs-input type="file" class="w-100 mt-2" id="fileInput" :label="$t('Profile.Photo')" v-model="photo"/>
                  </div>
                </div>
              </div>
            </vs-prompt>

            <vs-prompt
                    color="warning"
                    @accept="updateTeamMember"
                    @close="close"
                    @cancel="close"
                    :active.sync="activeUpdatePrompt"
                    :title="$t('Team.EditTeamMemberPrompt.Title')"
                    :accept-text="$t('Team.EditTeamMemberPrompt.SubmitButton')"
                    :cancel-text="$t('Team.EditTeamMemberPrompt.CancelButton')"
            >
              <div v-bar class="vs-scrollable">
                <div>
                  <div class="con-exemple-prompt px-4 py-3">
                    <vs-row>
                      <vs-col vs-w="6"><vs-input
                              :danger="errors.selected.fname"
                              :danger-text="$t('Errors.InvalidPolite', {field: $t('Profile.FirstName')})"
                              :label="$t('Profile.FirstName')" v-model="selected.fname" class="w-100 mb-2" /></vs-col>
                      <vs-col vs-w="6"><vs-input
                              :danger="errors.selected.lname"
                              :danger-text="$t('Errors.InvalidPolite', {field: $t('Profile.LastName')})"
                              :label="$t('Profile.LastName')" v-model="selected.lname" class="w-100 mb-2" /></vs-col>
                    </vs-row>

                    <vs-input
                            :danger="errors.selected.email"
                            :danger-text="$t('Errors.InvalidPolite', {field: $t('Profile.Email')})"
                            :label="$t('Profile.Email')" v-model="selected.email" class="w-100 mb-2" />
                    <vs-input
                            :danger="errors.selected.telephone"
                            :danger-text="$t('Errors.InvalidPolite', {field: $t('Profile.PhoneNumber')})"
                            :label="$t('Profile.PhoneNumber')" v-model="selected.telephone" class="w-100 mb-2" />

                    <vs-select class="w-100 mb-2"
                               :danger="errors.selected.role"
                               :danger-text="$t('Errors.InvalidPolite', {field: $t('Profile.Role')})"
                               :label="$t('Profile.Role')" v-model="selected.role">
                      <vs-select-item
                              :key="index"
                              :value="item.value"
                              :text="item.text"
                              v-for="(item,index) in positions"
                      />
                    </vs-select>

                    <vs-select class="w-100 mb-2" :placeholder="$t('Profile.Department')" :label="$t('Profile.Department')" v-if="departments.length" v-model="selected_departments" autocomplete multiple>
                      <vs-select-item
                              :key="index"
                              :value="item.id"
                              :text="item.name"
                              v-for="(item,index) in departments"
                      />
                    </vs-select>
                    <vs-row>
                      <vs-col vs-w="3">
                        <vs-avatar class="mt-3" :src="selected.photo ? selected.photo : require('@/assets/images/users/1.jpg')" size="64px"></vs-avatar>
                      </vs-col>
                      <vs-col vs-w="9">
                        <vs-input type="file" class="w-100 mt-2" id="editFileInput" :label="$t('Profile.Photo')" v-model="editPhoto"/>
                      </vs-col>
                    </vs-row>
                  </div>
                </div>
              </div>
            </vs-prompt>
          </div>
          <template slot="thead">
            <vs-th sort-key="photo">{{$t('Profile.Photo')}}</vs-th>
            <vs-th sort-key="fname">{{$t('Profile.FirstName')}}</vs-th>
            <vs-th sort-key="lname">{{$t('Profile.LastName')}}</vs-th>
            <vs-th sort-key="email">{{$t('Profile.Email')}}</vs-th>
            <vs-th sort-key="position">{{$t('Profile.Role')}}</vs-th>
            <vs-th sort-key="position">{{$t('Profile.Department')}}</vs-th>
            <vs-th sort-key="created_at">{{$t('Team.CreatedAt')}}</vs-th>
            <vs-th >{{$t('Team.Options')}}</vs-th>
          </template>

          <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">

              <vs-td :data="data[indextr].fname">
                <div class="d-flex align-items-center text-center">
                  <vs-avatar class="" :src="data[indextr].photo ? data[indextr].photo : require('@/assets/images/users/1.jpg')" size="42px"></vs-avatar>
                </div>
              </vs-td>

              <vs-td :data="data[indextr].fname">
                <div class="d-flex align-items-center">
                  <h5 class="mb-0 font-12">{{data[indextr].fname}}</h5>
                </div>
              </vs-td>

              <vs-td :data="data[indextr].lname">
                <div class="d-flex align-items-center">
                  <h5 class="mb-0 font-12">{{data[indextr].lname}}</h5>
                </div>
              </vs-td>

              <vs-td :data="data[indextr].email">
                <div class="d-flex align-items-center">
                  <span class="">{{data[indextr].email}}</span>
                </div>
              </vs-td>

              <vs-td :data="data[indextr].role">
                <div class="d-flex align-items-center">
                  <span class="">{{$t('Team.Positions.'+(data[indextr].role.charAt(0).toUpperCase() + data[indextr].role.toLowerCase().slice(1)))}}</span>
                </div>
              </vs-td>

              <vs-td :data="data[indextr].role">
                <div>
                  <p class="mb-1 font-12 badge badge-light mb-2"  style="box-shadow: 0px 0px 8px 1px #aaa;border-radius: 5px;margin-right: 5px;display: block;"
                    v-for="dep in data[indextr].department_relation" :key="dep.id"
                  >
                    {{dep.name}}
                  </p>
                </div>
              </vs-td>

              <vs-td :data="data[indextr].created_at">
                <div class="d-flex align-items-center">
                  <i class="mdi mdi-calendar-text mr-2 display-8"></i>
                  {{formatDate(data[indextr].created_at)}}
                </div>
              </vs-td>

              <vs-td>
                <div class="btn-alignment">
                  <vs-button radius color="primary" type="border" icon="calendar_today" @click="workingDaysActivePrompt = true"></vs-button>
                  <vs-button radius color="warning" type="border" id="edit-team-button" icon="edit" @click="selectDepartments(data[indextr].department_relation)"></vs-button>
                  <vs-button radius color="danger" type="border" icon="delete" @click="deleteMember(data[indextr])"></vs-button>
                </div>
              </vs-td>

            </vs-tr>
          </template>
        </vs-table>
        <vs-pagination :total="totalPages" @change="handleChangePage" v-model="currentPage"></vs-pagination>
      </vs-card>
      <!--V-Tour start-->
      <v-tour name="TeamA" :steps="steps">
        <template slot-scope="tour">
          <transition name="fade">
            <v-step
                    v-if="tour.currentStep === index"
                    v-for="(step, index) of tour.steps"
                    :key="index"
                    :step="step"
                    :previous-step="tour.previousStep"
                    :next-step="tour.nextStep"
                    :stop="tour.stop"
                    :is-first="tour.isFirst"
                    :is-last="tour.isLast"
                    :labels="tour.labels"
            >
              <template v-if="tour.currentStep === 0">
                <div slot="actions" class="v-step__buttons">
                  <button @click="promptShow" class="v-step__button">Next</button>
                </div>
              </template>
              <template v-if="tour.currentStep === 1">
                <div slot="actions" class="v-step__buttons">
                  <button @click="tour.previousStep" class="v-step__button">Previous</button>
                  <button @click="goToNextPage" class="v-step__button">Next</button>
                </div>
              </template>
            </v-step>
          </transition>
        </template>
      </v-tour>
    </vs-col>
  </vs-row>
</template>

<script>
import { teamService, departmentService } from '../../_services'
// moment
import TeamWorkingDay from '../../components/settings/TeamWorkingDay'
import router from "../../_helpers/router";
export default {
  name: "Team",
  data: () => ({
    title: "Team",
    activePrompt: false,
    activeUpdatePrompt: false,
    workingDaysActivePrompt: false,
    teamMembers: [],
    positions: [ ],
    departments: [ ],
    fname:'',
    lname:'',
    telephone:'',
    email:'',
    password:'',
    password_confirm:'',
    role:'',
    department:'',
    photo: '',
    editPhoto: '',
    selected: {},
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    maxItems:0,
    errors:{
      fname : false,
      lname : false,
      telephone : false,
      email : false,
      password : false,
      password_confirm : false,
      role : false,
      selected:{
        fname : false,
        lname : false,
        telephone : false,
        email : false,
        password : false,
        password_confirm : false,
        role : false,
      }
    },
    steps: [
      {
        target: '#add-team-form',  // We're using document.querySelector() under the hood
        params: {
          placement: 'right' // Any valid Popper.js placement. See https://popper.js.org/popper-documentation.html#Popper.placements
        }
      },
      {
        target: '#edit-team-button',
        params: {
          placement: 'right' // Any valid Popper.js placement. See https://popper.js.org/popper-documentation.html#Popper.placements
        }
      }
    ],
    selected_departments: []
  }),
  methods: {
    selectDepartments(departments){
      this.activeUpdatePrompt = true;
      this.selected_departments = [];

      departments.map((obj)=>{
        this.selected_departments.push(obj.id);
      })
    },
    notify(title, text, type) {
      this.$vs.notify({
        color: type,
        title: title,
        text: text
      });
    },
    validateFields() {
      this.errors.fname = (!this.fname || (this.fname.length < 3)) ? true : false;
      this.errors.lname = (!this.lname || (this.lname.length < 3)) ? true : false;
      this.errors.telephone = !((this.telephone.length < 3) || !this.isValidPhoneNumber(this.telephone)) ? false : true;
      this.errors.password = this.password ? false : true;
      this.errors.password_confirm = this.password_confirm ? this.password == this.password_confirm ? false : true : true;
      this.errors.role = this.role ? false : true;
      if (this.email.length > 0) {
        this.errors.email = this.isValidEmail(this.email) ? false : true;
      } else {
        this.errors.email = false;
      }

      let {fname, lname, telephone, email, password, password_confirm, role} = this.errors;
      return !(fname || lname || telephone || email || password || password_confirm || role);
    },
    validateUpdateCustomerFields() {
      this.errors.selected.fname = this.selected.fname ? this.selected.fname.length < 3 ? true : false : true;
      this.errors.selected.lname = this.selected.lname ? this.selected.lname.length < 3 ? true : false : true;
      this.errors.selected.telephone = this.selected.telephone ? this.isValidPhoneNumber(this.selected.telephone) ? false : true : true;
      this.errors.selected.role = this.selected.role ? false : true;
      if (this.selected.email.length > 0) {
        this.errors.selected.email = this.isValidEmail(this.selected.email) ? false : true;
      } else {
        this.errors.selected.email = false;
      }

      let {fname, lname, telephone, email, role} = this.errors.selected;
      return !(fname || lname || telephone || email ||  role);
    },
    reset() {
      this.fname = '';
      this.lname = '';
      this.email = '';
      this.telephone = '';
      this.password = '';
      this.password_confirm = '';
      this.role = '';
      this.photo = '';

    },
    isValidPhoneNumber(value) {
      // let phoneNumber = this.phone_number;
      return /^\d+$/.test(value);
    },
    isValidEmail: function (value) {
      let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(value);
    },
    showLoading(){
      this.$vs.loading({
        container: '#team-box',
        scale: 0.6
      });
    },
    hideLoading(){
      this.$vs.loading.close('#team-box > .con-vs-loading')
    },
    handleSelected(){
      /* eslint-disable */
      console.log(this.selected);
    },
    submitForm() {
      let res = this.validateFields();
      if (!res) {
        this.activePrompt = true;
        return false;
      }
      this.showLoading();

      let member = new FormData();
      member.append('fname', this.fname);
      member.append('lname', this.lname);
      member.append('telephone', this.telephone);
      member.append('email', this.email);
      member.append('password', this.password);
      member.append('password_confirm', this.password_confirm);
      member.append('role', this.role);
      member.append('department_id', 0);
      member.append('departments', this.department.join());
      member.append('_method', 'PUT');

      if(document.getElementById("fileInput").files[0]){
        member.append('photo', document.getElementById("fileInput").files[0]);
      }

      teamService.create(member).then(function (data) {
        this.teamMembers.push(data.team_member);
        this.close();
        this.activePrompt = false;
        this.notify(this.$t('Toasts.Successful'), this.$t('Team.AddTeamMemberPrompt.ToastSuccess'), 'success');
      }.bind(this)).catch(function () {
        this.notify(this.$t('Toasts.Error'), this.$t('Team.AddTeamMemberPrompt.ToastFail'), 'danger');
      }.bind(this)).finally(function () {
        this.hideLoading();
        this.reset();
      }.bind(this));
    },
    close() {
      this.fname = '';
      this.lname = '';
      this.telephone = '';
      this.email = '';
      this.password = '';
      this.password_confirm = '';
      this.role = '';
    },
    handleSearch(keyword) {
      if(keyword == ''){
        teamService.getAll().then(function (data) {
          this.teamMembers = data.team.data;
          this.totalItems = data.team.total;
          this.totalPages = data.team.last_page;
          this.maxItems = data.team.per_page;
        }.bind(this));
      }
      teamService.filter(keyword).then(function (data) {
        this.teamMembers = data.team.data;
        this.totalItems = data.team.total;
      }.bind(this));
    },
    handleChangePage(page) {
      teamService.getPage(page).then(function (data) {
        this.teamMembers = data.team.data;
      }.bind(this));
    },
    updateTeamMember(){
      let res = this.validateUpdateCustomerFields();
      console.log('ressss', res);
      if (!res) {
        this.activeUpdatePrompt = true;
        return false;
      }
      this.showLoading();

      let member = new FormData();
      member.append('fname', this.selected.fname);
      member.append('lname', this.selected.lname);
      member.append('telephone', this.selected.telephone);
      member.append('email', this.selected.email);
      member.append('role', this.selected.role);
      member.append('department_id', this.selected.department_id);
      member.append('departments', this.selected_departments);
      

      if(document.getElementById("editFileInput").files[0]){
        member.append('photo', document.getElementById("editFileInput").files[0]);
      }

      teamService.update(this.selected.id, member).then(function () {
        this.handleChangePage(this.currentPage);
        this.activeUpdatePrompt = false;
        this.notify(this.$t('Toasts.Successful'), this.$t('Team.EditTeamMemberPrompt.ToastSuccess'), 'success');
      }.bind(this)).catch(function () {
        this.notify(this.$t('Toasts.Error'), this.$t('Team.EditTeamMemberPrompt.ToastFail'), 'danger');
      }.bind(this)).finally(function () {
        this.hideLoading();
      }.bind(this));
    },
    submitWorkingDaysUpdate(){
      this.showLoading();
      this.workingDaysActivePrompt = true;

      teamService.updateWorkingDays(this.selected.id, {working_days: JSON.stringify(this.selected.workingDays)}).then(function () {
        this.handleChangePage(this.currentPage);
        this.workingDaysActivePrompt = false;
        this.notify(this.$t('Toasts.Successful'), this.$t('Team.WorkingDaysPrompt.ToastSuccess'), 'success');
      }.bind(this)).catch(function () {
        this.notify(this.$t('Toasts.Error'), this.$t('Team.WorkingDaysPrompt.ToastFail'), 'danger');
      }.bind(this)).finally(function () {
        this.hideLoading()
      }.bind(this));
    },
    handleSort(key, active) {
      /* eslint-disable */
      console.log({key, active});
    },
    formatDate: function (value) {
      let date = this.$moment(value).format('DD MMMM YYYY');
      return date;
    },
    deleteMember(member) {
      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: this.$t('Team.DeleteTeamMemberPrompt.Title'),
        text: this.$t('Team.DeleteTeamMemberPrompt.Text', {name: member.fname+' '+member.lname}),
        acceptText: this.$t('Toasts.AcceptButton'),
        cancelText: this.$t('Toasts.CancelButton'),
        accept: function () {
          this.showLoading();
          teamService.delete(member.id).then(function (data) {
            this.handleChangePage(this.currentPage);
            this.notify(this.$t('Toasts.Successful'), this.$t('Team.DeleteTeamMemberPrompt.ToastSuccess'), 'warning');
          }.bind(this)).catch(function () {
            this.notify(this.$t('Toasts.Error'), this.$t('Team.DeleteTeamMemberPrompt.ToastFail'), 'danger');
          }.bind(this)).finally(function () {
            this.hideLoading();
          }.bind(this));
        }.bind(this)
      });
    },
    promptShow(){
      this.$tours['TeamA'].stop();
      this.activePrompt=true
      this.steps[0].content=this.$t('Customer.Prompt.Content');
      this.steps[0].target='footer .vs-button-filled';
      this.steps[0].params.placement="auto";
      setTimeout(() => this.$tours['TeamB'].start(), 500);

    },
    promptShowNew(){
      this.$tours['TeamB'].stop();
      this.activePrompt = false;
      setTimeout(() => this.$tours['TeamA'].start(1), 500);

    },
    goToNextPage(){
      router.push({ path: "/settings/services?istour=on" });
    },
  },
  computed: {

  },
  mounted(){
    this.positions = [
      {value: "ADMIN", text: this.$t("Profile.Positions.Admin") }, // ADMIN ACCESS
      {value: "MANAGER", text: this.$t("Profile.Positions.Manager") }, // MANAGE ALL BOOKINGS & QUEUES
      {value: "EMPLOYEE", text: this.$t("Profile.Positions.Employee") } // MANAGE ONLY ASSIGNED QUEUES AND PERSONAL BOOKINGS
    ];
    teamService.getAll().then(function (data) {
      this.teamMembers = data.team.data;
      this.totalItems = data.team.total;
      this.maxItems = data.team.per_page;
      this.totalPages = data.team.last_page;
      this.$t('Team.Content').map((content,index)=> (
              this.steps[index].content = content
      ));
      this.$route.query.istour && localStorage.getItem('skipTour') !='true' ? this.$tours['TeamA'].start() : '';
    }.bind(this));

    departmentService.getAll().then(function (data) {
      this.departments = data.departments;
    }.bind(this));

  },
  components: {
    TeamWorkingDay
  }
};
</script>
