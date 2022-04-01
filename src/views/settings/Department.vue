<template>
  <vs-row vs-justify="center" id="department-box">
    <vs-col type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-xs="12">
      <vs-card>
        <vs-table
                @search="handleSearch"
                @sort="handleSort"
                v-model="selected"
                :total="totalItems"
                max-items="10"
                search
                :data="departments">
          <div slot="header">
            <vs-button id="add-team-form" icon="add" color="primary" @click="activePrompt = true">{{$t('Department.AddDepartmentButton')}}</vs-button>
            <!---Edit Working Days --->


            <!---Add Member --->
            <vs-prompt
                    color="primary"
                    @accept="submitForm"
                    @close="close"
                    @cancel="close"
                    :active.sync="activePrompt"
                    :title="$t('Department.AddDepartmentPrompt.Title')"
                    :accept-text="$t('Department.AddDepartmentPrompt.SubmitButton')"
                    :cancel-text="$t('Department.AddDepartmentPrompt.CancelButton')"
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


                    <vs-input :danger="errors.name"
                            :danger-text="$t('Errors.InvalidPolite', {field: $t('Department.Name')})"
                            :label="$t('Department.Name')" v-model="name" class="w-100 mb-2" />

                    <vs-input
                            :danger="errors.max_daily_bookings"
                            :danger-text="$t('Errors.InvalidPolite', {field: $t('Department.MaxDailyBookings')})"
                            :label="$t('Department.MaxDailyBookings')" v-model="max_daily_bookings" class="w-100 mb-2" />

                    <vs-input
                            :danger="errors.max_booking_per_slot"
                            :danger-text="$t('Errors.InvalidPolite', {field: $t('Department.MaxBookingsPerSlot')})"
                            :label="$t('Department.MaxBookingsPerSlot')" v-model="max_booking_per_slot" class="w-100 mb-2" />

                    <vs-select
                      :danger="errors.services"
                      :danger-text="$t('Errors.Required', {field: $t('Queue.Create.AvailableServices')})"
                      :placeholder="$t('Queue.Create.AvailableServices')"
                      class="w-100 mb-4"
                      :label="$t('Queue.Create.AvailableServices')"
                      autocomplete
                      multiple
                      v-model="services"
                    >
                      <vs-select-item
                        :key="'service_'+index"
                        :value="item.id"
                        :text="item.name"
                        v-for="(item,index) in servicesList"
                      />
                    </vs-select>


                    <div class="vs-component vs-con-input-label vs-input w-100 mb-2 vs-input-primary">
                      <label class="vs-input--label" for="color-add">{{$t('Department.Color')}}</label>
                      <input id="color-add" v-model="color" type="color" class="w-100"/>
                    </div>

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
                    :title="$t('Department.EditDepartmentPrompt.Title')"
                    :accept-text="$t('Department.EditDepartmentPrompt.SubmitButton')"
                    :cancel-text="$t('Department.EditDepartmentPrompt.CancelButton')"
            >
              <div v-bar class="vs-scrollable">
                <div>
                  <div class="con-exemple-prompt px-4 py-3">

                    <vs-input
                            :danger="errors.selected.name"
                            :danger-text="$t('Errors.InvalidPolite', {field: $t('Department.Name')})"
                            :label="$t('Department.Name')" v-model="selected.name" class="w-100 mb-2" />

                    <vs-input
                            :danger="errors.selected.max_daily_bookings"
                            :danger-text="$t('Errors.InvalidPolite', {field: $t('Department.MaxDailyBookings')})"
                            :label="$t('Department.MaxDailyBookings')" v-model="selected.max_daily_bookings" class="w-100 mb-2" />

                    <vs-input
                            :danger="errors.selected.max_booking_per_slot"
                            :danger-text="$t('Errors.InvalidPolite', {field: $t('Department.MaxBookingsPerSlot')})"
                            :label="$t('Department.MaxBookingsPerSlot')" v-model="selected.max_booking_per_slot" class="w-100 mb-2" />

                    <vs-select
                      :danger="errors.selected.services"
                      :danger-text="$t('Errors.Required', {field: $t('Queue.Create.AvailableServices')})"
                      :placeholder="$t('Queue.Create.AvailableServices')"
                      class="w-100 mb-4"
                      :label="$t('Queue.Create.AvailableServices')"
                      autocomplete
                      multiple
                      v-model="custom.services"
                      @input="aze"
                    >
                      <vs-select-item
                        :key="index"
                        :value="item.id"
                        :text="item.name"
                        v-for="(item,index) in servicesList"
                      />
                    </vs-select>

                    <div class="vs-component vs-con-input-label vs-input w-100 mb-2 vs-input-primary">
                      <label class="vs-input--label" for="color-add-edit">{{$t('Department.Color')}}</label>
                      <input id="color-add-edit" v-model="selected.color" type="color" class="w-100"/>
                    </div>
                  </div>
                </div>
              </div>
            </vs-prompt>

            <vs-prompt
                    color="success"
                    @accept="updateTranslations"
                    @close="close"
                    @cancel="close"
                    :active.sync="activeTranslatePrompt"
                    :title="$t('Department.TranslationPrompt.Title')"
                    :accept-text="$t('Department.TranslationPrompt.SubmitButton')"
                    :cancel-text="$t('Department.TranslationPrompt.CancelButton')"
            >
              <div v-bar class="vs-scrollable">
                <div>
                  <div class="con-exemple-prompt px-4 py-3">
                    <vs-row>
                      <vs-col vs-w="12" v-for="(item, index) in languages" :key="index">
                        <vs-input :placeholder="item" :label="item" v-model="selected.translations.translations[item]" class="w-100 mt-2 mb-2"></vs-input>
                      </vs-col>
                    </vs-row>
                  </div>
                </div>
              </div>
            </vs-prompt>
          </div>
          <template slot="thead">
            <vs-th sort-key="photo">{{$t('Department.Name')}}</vs-th>
            <vs-th sort-key="created_at">{{$t('Department.MaxDailyBookings')}}</vs-th>
            <vs-th sort-key="created_at">{{$t('Department.MaxBookingsPerSlot')}}</vs-th>
            <vs-th sort-key="created_at">{{$t('Department.Color')}}</vs-th>
            <vs-th sort-key="created_at">{{$t('Menu.Services')}}</vs-th>
            <vs-th sort-key="created_at">{{$t('Department.CreatedAt')}}</vs-th>
            <vs-th >{{$t('Department.Options')}}</vs-th>
          </template>

          <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data" style="border-bottom: 1px solid #ddd;">

              <vs-td :data="data[indextr].name">
                <div class="d-flex align-items-center">
                  <h5 class="mb-0 font-12">{{data[indextr].name}}</h5>
                </div>
              </vs-td>

              <vs-td :data="data[indextr].max_daily_bookings">
                <div class="d-flex align-items-center">
                  <h5 class="mb-0 font-12">{{data[indextr].max_daily_bookings}}</h5>
                </div>
              </vs-td>

              <vs-td :data="data[indextr].max_booking_per_slot">
                <div class="d-flex align-items-center">
                  <h5 class="mb-0 font-12">{{data[indextr].max_booking_per_slot}}</h5>
                </div>
              </vs-td>

              <vs-td :data="data[indextr].color">
                <div class="d-flex align-items-center">
                  <vs-chip :color="data[indextr].color">{{data[indextr].color}}</vs-chip>
                </div>
              </vs-td>

              <vs-td :data="data[indextr].color">
                <div>
                  <p class="mb-1 font-12 badge badge-light"  style="box-shadow: 0px 0px 8px 1px #aaa;border-radius: 5px;margin-right: 5px;display: block;"
                    v-for="service in data[indextr].services" :key="service.id"
                  >
                    {{service.title}}
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
                  <vs-button radius color="warning" type="border" id="edit-team-button" icon="edit" @click="handleUpdate(data[indextr].services)"></vs-button>
                  <vs-button radius color="primary" type="border" icon="translate" @click="activeTranslatePrompt = true"></vs-button>
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
  import {departmentService, privateServiceService} from '../../_services'
// moment
import router from "../../_helpers/router";
export default {
  name: "Team",
  data: () => ({
    title: "Team",
    activePrompt: false,
    activeUpdatePrompt: false,
    activeTranslatePrompt: false,
    departments: [],
    positions: [

    ],
    name:'',
    max_daily_bookings: 0,
    max_booking_per_slot: 1,
    color: '#00ffff',
    selected: {
      translations: {translations: []},
      services: [],
    },
    custom: {
      services: []
    },
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    maxItems:0,
    languages: [],
    department_translations: {ar: '', fr: '', en: '', de: '', es: '', ru: '', pt: ''},
    errors:{
      services: false,
      name : false,
      max_daily_bookings: false,
      max_booking_per_slot: false,
      color: '',
      selected:{
        services: false,
        name : false,
        max_daily_bookings: false,
        max_booking_per_slot: false,
        color: false
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
    servicesList: [],
    services: []
  }),
  methods: {
    notify(title, text, type) {
      this.$vs.notify({
        color: type,
        title: title,
        text: text
      });
    },
    validateFields() {
      this.errors.name = (!this.name || (this.name.length < 3)) ? true : false;
      let {name} = this.errors;

      this.errors.services = this.services.length==0;
      return !(name) && !this.errors.services;
    },
    validateUpdateCustomerFields() {
      this.errors.selected.name = this.selected.name ? this.selected.name.length < 3 ? true : false : true;
      this.errors.selected.name = this.selected.name ? this.selected.name.length < 3 ? true : false : true;

      let {name} = this.errors.selected;

      this.errors.selected.services = this.custom.services.length==0;
      return !(name)&& !this.errors.selected.services;
    },
    reset() {
      this.name = '';
    },
    showLoading(){
      this.$vs.loading({
        container: '#department-box',
        scale: 0.6
      });
    },
    hideLoading(){
      this.$vs.loading.close('#department-box > .con-vs-loading')
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

      departmentService.create({services: this.services.join(), name: this.name, max_daily_bookings: this.max_daily_bookings,max_booking_per_slot: this.max_booking_per_slot, color: this.color}).then(function (data) {
        this.departments.push(data.department);
        this.close();
        this.activePrompt = false;
        this.notify(this.$t('Toasts.Successful'), this.$t('Department.AddDepartmentPrompt.ToastSuccess'), 'success');
      }.bind(this)).catch(function () {
        this.notify(this.$t('Toasts.Error'), this.$t('Department.AddDepartmentPrompt.ToastFail'), 'danger');
      }.bind(this)).finally(function () {
        this.hideLoading();
        this.reset();
      }.bind(this));
    },
    close() {
      this.name = '';
    },
    handleSearch(keyword) {
      if(keyword == ''){
        departmentService.getAll().then(function (data) {
          this.departments = data.departments.data;
          this.totalItems = data.departments.total;
          this.totalPages = data.departments.last_page;
          this.maxItems = data.departments.per_page;
        }.bind(this));
      }
      departmentService.filter(keyword).then(function (data) {
        this.departments = data.departments.data;
        this.totalItems = data.departments.total;
      }.bind(this));
    },
    handleChangePage(page) {
      departmentService.getPage(page).then(function (data) {
        this.departments = data.departments.data;
      }.bind(this));
    },
    updateTeamMember(){
      let res = this.validateUpdateCustomerFields();

      if (!res) {
        this.activeUpdatePrompt = true;
        return false;
      }
      this.showLoading();

      let payload = {
        name: this.selected.name,
        max_daily_bookings: this.selected.max_daily_bookings,
        max_booking_per_slot: this.selected.max_booking_per_slot,
        color: this.selected.color,
        services: this.custom.services.join()
      };

      departmentService.update(this.selected.id, payload).then(function () {
        this.handleChangePage(this.currentPage);
        this.activeUpdatePrompt = false;
        this.notify(this.$t('Toasts.Successful'), this.$t('Department.EditDepartmentPrompt.ToastSuccess'), 'success');
      }.bind(this)).catch(function () {
        this.notify(this.$t('Toasts.Error'), this.$t('Department.EditDepartmentPrompt.ToastFail'), 'danger');
      }.bind(this)).finally(function () {
        this.hideLoading();
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
    deleteMember(department) {
      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: this.$t('Department.DeleteDepartmentPrompt.Title'),
        text: this.$t('Department.DeleteDepartmentPrompt.Text', {name: department.name}),
        acceptText: this.$t('Toasts.AcceptButton'),
        cancelText: this.$t('Toasts.CancelButton'),
        accept: function () {
          this.showLoading();
          departmentService.delete(department.id).then(function (data) {
            this.handleChangePage(this.currentPage);
            this.notify(this.$t('Toasts.Successful'), this.$t('Department.DeleteDepartmentPrompt.ToastSuccess'), 'warning');
          }.bind(this)).catch(function () {
            this.notify(this.$t('Toasts.Error'), this.$t('Department.DeleteDepartmentPrompt.ToastFail'), 'danger');
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
    updateTranslations(){
      this.showLoading();
      departmentService.updateTranslations(this.selected.id, {translations: this.selected.translations.translations}).then(function () {
        this.notify(this.$t('Toasts.Successful'), this.$t('Department.TranslationPrompt.ToastSuccess'), 'success');
      }.bind(this))
              .catch(function () {
                this.notify(this.$t('Toasts.Error'), this.$t('Department.TranslationPrompt.ToastFail'), 'danger');
              }.bind(this))
              .finally(function () {
                this.hideLoading();
              }.bind(this));
    },
    handleUpdate(services){
      const self= this;
      this.activeUpdatePrompt = true;
      this.custom.services = [];
      services.forEach((obj) => {
          self.custom.services.push(obj.id);
          return obj;
      });
      console.log(self.custom.services)
    },
    aze(){
      console.log(this.custom.services)
    },
  },
  computed: {

  },
  mounted(){

    this.languages = this.$i18n.availableLocales;

    departmentService.getPage(1).then(function (data) {
      this.departments = data.departments.data;
      this.totalItems = data.departments.total;
      this.maxItems = data.departments.per_page;
      this.totalPages = data.departments.last_page;
      this.$t('Department.Content').map((content,index)=> (
              this.steps[index].content = content
      ));
      this.$route.query.istour && localStorage.getItem('skipTour') !='true' ? this.$tours['TeamA'].start() : '';
    }.bind(this));

    //Get ALl services
    privateServiceService
      .getAll()
      .then(
        function (data) {
          this.servicesList = [];
          data.services.forEach((obj) => {
            this.servicesList.push({ id: obj.service_id, name: obj.title });
          });
        }.bind(this)
      )
      .finally(
        function () {
          if (this.servicesList.length == 0) {
            this.$vs.dialog({
              type: "confirm",
              color: "danger",
              title: this.$t("Service.NoServiceAlert.Title"),
              text: this.$t("Service.NoServiceAlert.Text"),
              acceptText: this.$t("Service.NoServiceAlert.GoToServicesButton"),
              cancelText: this.$t("Toasts.CancelButton"),
              accept: function () {
                this.$router.push("/settings/services");
              }.bind(this),
              cancel: function () {
                this.$router.back();
              }.bind(this),
            });
          }
          this.$route.query.istour ? this.$tours["Queues"].start() : "";
        }.bind(this)
      );
  },
  components: {

  }
};
</script>
