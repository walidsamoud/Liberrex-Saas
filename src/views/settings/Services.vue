<template>
  <vs-row vs-justify="center" id="services-box">
    <vs-col type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-xs="12">
      <vs-card>
        <vs-table
                @search="handleSearch"
                @sort="handleSort"
                v-model="selected"
                :total="totalItems"
                max-items="10"
                search
                :data="services">
          <div slot="header">
            <vs-button id="add-service-form" icon="add" color="primary" @click="activePrompt = true">{{$t('Service.AddServiceButton')}}</vs-button>
            <!---Add Contact --->
            <vs-prompt
                    color="primary"
                    @accept="acceptAlert"
                    @close="close"
                    @cancel="close"
                    :active.sync="activePrompt"
                    :title="$t('Service.AddServicePrompt.Title')"
                    :accept-text="$t('Service.AddServicePrompt.SubmitButton')"
                    :cancel-text="$t('Service.AddServicePrompt.CancelButton')"
            >
              <div v-bar class="vs-scrollable">
                <div>
                  <div class="con-exemple-prompt px-4 py-3">

                    <vs-select
                            :danger="errors.service_id"
                            :danger-text="$t('Errors.Required', {field: $t('Service.AddServicePrompt.ServiceLabel')})"
                            class="w-100 mb-2 mt-2"
                            size="large"
                            autocomplete
                            :placeholder="$t('Service.AddServicePrompt.ServicePlaceholder')"
                            :label="$t('Service.AddServicePrompt.ServiceLabel')"
                            v-model="promptData.service_id"
                    >
                      <vs-select-item :key="index" :value="item.id" :text="item.title" v-for="(item,index) in industryServices" />
                    </vs-select>

                    <vs-input :danger="errors.duration"
                              :danger-text="$t('Errors.InvalidPolite', {field: $t('Service.AddServicePrompt.Duration')})"
                              :label="$t('Service.AddServicePrompt.Duration')" v-model="promptData.duration" class="w-100 mb-4" />
                    <vs-input :danger="errors.price"
                              :danger-text="$t('Errors.InvalidPolite', {field: $t('Service.AddServicePrompt.Price')})"
                              :label="$t('Service.AddServicePrompt.Price')" v-model="promptData.price" class="w-100 mb-4" />
                  </div>
                </div>
              </div>
            </vs-prompt>

            <vs-prompt
                    color="warning"
                    @accept="updateService"
                    @close="close"
                    @cancel="close"
                    :active.sync="activeUpdatePrompt"
                    :title="$t('Service.EditServicePrompt.Title')"
                    :accept-text="$t('Service.EditServicePrompt.SubmitButton')"
                    :cancel-text="$t('Service.EditServicePrompt.CancelButton')"
            >
              <div v-bar class="vs-scrollable">
                <div>
                  <div class="con-exemple-prompt px-4 py-3">
                    <h4 class="w-100 mb-4">{{$t('Service.AddServicePrompt.ServiceLabel')}}: <b>{{selected.title}}</b></h4>
                    <!-- <vs-select
            :label="$t('Booking.DepartmentFilterPlaceholder')"
            v-if="departments.length>0"
            v-model="selectedDepartment"
            :placeholder="$t('Booking.DepartmentFilterPlaceholder')"
            class="w-100"
            @change="getServiceTimeByDepartment"
          >
            <vs-select-item
              :key="index"
              :value="item.id"
              :text="item.name"
              v-for="(item,index) in departments"
            />
          </vs-select> -->
                    <vs-input :danger="errors.selected.duration"
                              :danger-text="$t('Errors.InvalidPolite', {field: $t('Service.AddServicePrompt.Duration')})"
                              :label="$t('Service.AddServicePrompt.Duration')" v-model="selected.duration" class="w-100 mb-4" />
                    <vs-input :danger="errors.selected.price"
                              :danger-text="$t('Errors.InvalidPolite', {field: $t('Service.AddServicePrompt.Price')})"
                              :label="$t('Service.AddServicePrompt.Price')" v-model="selected.price" class="w-100 mb-4" />
                  </div>
                </div>
              </div>
              <v-tour name="ServicesB" :steps="steps">
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
            </vs-prompt>
          </div>
          <template slot="thead">
            <vs-th sort-key="service">{{$t('Service.Table.Service')}}</vs-th>
            <vs-th sort-key="duration">{{$t('Service.Table.EstimatedDuration')}}</vs-th>
            <vs-th sort-key="price">{{$t('Service.Table.Price')}}</vs-th>
            <vs-th sort-key="created_at">{{$t('Service.Table.CreatedAt')}}</vs-th>
            <vs-th >{{$t('Service.Table.Options')}}</vs-th>
          </template>

          <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">

              <vs-td :data="data[indextr].title">
                <div class="d-flex align-items-center">
                  <h5 class="mb-0 font-12">{{data[indextr].title}}</h5>
                </div>
              </vs-td>

              <vs-td :data="data[indextr].duration">
                <div class="d-flex align-items-center">
                  <i class="mdi mdi-clock mr-2 display-8"></i>
                  <span class="">{{data[indextr].duration}} {{$tc('Shared.Minute', data[indextr].duration)}}</span>
                </div>
              </vs-td>
              
              <vs-td :data="data[indextr].price">
                <div class="d-flex align-items-center">
                  <i class="mdi mdi-cash mr-2 display-8"></i>
                  <span class="">{{data[indextr].price}}</span>
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
                  <vs-button id="edit-service-button" radius color="warning" type="border" icon="edit" @click="activeUpdatePrompt = true"></vs-button>
                  <vs-button radius color="danger" type="border" icon="delete" @click="deleteService(data[indextr])"></vs-button>
                </div>
              </vs-td>

            </vs-tr>
          </template>
        </vs-table>
        <!--V-Tour start-->
        <v-tour name="ServicesA" :steps="steps">
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
        <vs-pagination :total="totalPages" @change="handleChangePage" v-model="currentPage"></vs-pagination>
      </vs-card>
    </vs-col>
  </vs-row>
</template>

<script>
import { privateServiceService, helpersService, departmentService } from '../../_services'
// moment
import router from "../../_helpers/router";

export default {
  name: "Services",
  data: () => ({
    departments : [],
    title: "Services",
    activePrompt: false,
    activeUpdatePrompt: false,
    services: [],
    industryServices: [],
    selectedDepartment : -1 ,
    promptData: {service_id: 0, duration: '',price : ''},
    errors: {
      service_id: false,
      duration: false,
      price : false,
      selected:{
        duration: false,
        price : false
      }
    },
    selected: {},
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    maxItems:0,
    steps: [
      {
        target: '#add-service-form',  // We're using document.querySelector() under the hood
        params: {
          placement: 'right' // Any valid Popper.js placement. See https://popper.js.org/popper-documentation.html#Popper.placements
        }
      },
      {
        target: '#edit-service-button',
        params: {
          placement: 'auto' // Any valid Popper.js placement. See https://popper.js.org/popper-documentation.html#Popper.placements
        }
      }
    ],
  }),
  methods: {
    test(){
      this.activeUpdatePrompt = true;
      console.log(this.selected.id);
    },
    getServiceTimeByDepartment(){
      this.showLoading();
      privateServiceService.getDurationByDepartment(this.selected.service_id,this.selectedDepartment).then(data=>{
        console.log(data);
        this.selected.duration=data.servicesDuration;
        this.selected.price=data.price;
        console.log(this.selected);
      }).finally(()=>{
        this.hideLoading();
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
      this.errors.service_id = this.promptData.service_id ? isNaN(this.promptData.service_id)  ? true : false : true;
      this.errors.duration = this.promptData.duration  ? false : true;


      let {service_id, duration} = this.errors;
      return !(service_id || duration);
    },
    validateUpdatedFields() {
      this.errors.selected.duration = this.selected.duration ? isNaN(this.selected.duration)  ? true : false : true;
      let {duration} = this.errors.selected;
      return !(duration);
    },
    showLoading(){
      this.$vs.loading({
        container: '#services-box',
        scale: 0.6
      });
    },
    hideLoading(){
      this.$vs.loading.close('#services-box > .con-vs-loading')
    },
    handleSelected(){
      /* eslint-disable */
      console.log(this.selected);
    },
    acceptAlert() {
      let res = this.validateFields();
      if (!res) {
        this.activePrompt = true;
        return false;
      }
      this.showLoading();
      privateServiceService.create(this.promptData).then(function (data) {
        this.handleChangePage(1);
        this.activePrompt = false;
        helpersService.getAllServices().then(function (data) {
          this.industryServices = data.services.data;
        }.bind(this));
        this.notify(this.$t('Toasts.Successful'), this.$t('Service.AddServicePrompt.ToastSuccess'), 'success');
      }.bind(this)).catch(function () {
        this.notify(this.$t('Toasts.Error'), this.$t('Service.AddServicePrompt.ToastFail'), 'danger');
      }.bind(this)).finally(function () {
        this.hideLoading();
        this.reset();
      }.bind(this));
    },
    reset() {
      this.promptData={service_id: 0, duration: ''}
    },
    close() {
      this.activePrompt = false;
      this.activeUpdatePrompt = false;
      this.promptData = {service_id: 0, duration: ''};
      this.selected = {};
    },
    handleSearch(keyword) {
      if(keyword == ''){
        privateServiceService.getAll().then(function (data) {
          this.services = data.services.data;
          this.totalItems = data.services.total;
          this.totalPages = data.services.last_page;
          this.maxItems = data.services.per_page;
        }.bind(this));
      }
      privateServiceService.filter(keyword).then(function (data) {
        this.services = data.services.data;
        this.totalItems = data.services.total;
      }.bind(this));
    },
    handleChangePage(page) {
      this.showLoading();
      privateServiceService.getPage(page).then(function (data) {
        this.services = data.services.data;
      }.bind(this)).finally(()=>{
        this.hideLoading();
      });
    },
    updateService(){
      let res = this.validateUpdatedFields();
      console.log('rest', res);
      if (!res) {
        this.activeUpdatePrompt = true;
        return false;
      }
      this.showLoading();
      if(this.selectedDepartment!=-1){
        this.selected = {
          id : this.selected.id,
          duration : this.selected.duration,
          price : this.selected.price,
          department_id : this.selectedDepartment,
          service_id : this.selected.service_id

        }
      }
      privateServiceService.update(this.selected).then(function (data) {
        this.handleChangePage(this.currentPage);
        this.activeEditPrompt = false;
        this.selectedDepartment=-1;
        this.notify(this.$t('Toasts.Successful'), this.$t('Service.EditServicePrompt.ToastSuccess'), 'success');
      }.bind(this)).catch(function () {
        this.notify(this.$t('Toasts.Error'), this.$t('Service.EditServicePrompt.ToastFail'), 'danger');
      }.bind(this)).finally(function () {
        this.hideLoading();
      }.bind(this));
    },
    handleSort(key, active) {
      /* eslint-disable */
      console.log({key, active});
    },
    formatDate: function (value) {
      let date = this.$moment(value).format('DD MMMM YYYY [at] HH:mm');
      return date;
    },
    deleteService(service) {
      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: this.$t('Service.DeleteServicePrompt.Title'),
        text: this.$t('Service.DeleteServicePrompt.Text', {name: service.title}),
        acceptText: this.$t('Toasts.AcceptButton'),
        cancelText: this.$t('Toasts.CancelButton'),
        accept: function () {
          this.showLoading();
          privateServiceService.delete(service.id).then(function (data) {
            this.handleChangePage(this.currentPage);
            helpersService.getAllServices().then(function (data) {
              this.industryServices = data.services.data;
            }.bind(this));
            this.notify(this.$t('Toasts.Successful'), this.$t('Service.DeleteServicePrompt.ToastSuccess'), 'success');
          }.bind(this)).catch(function () {
            this.notify(this.$t('Toasts.Error'), this.$t('Service.DeleteServicePrompt.ToastFail'), 'danger');
          }.bind(this)).finally(function () {
            this.hideLoading();
          }.bind(this));
        }.bind(this)
      });
    },
    promptShow(){
      this.$tours['ServicesA'].stop();
      this.activeUpdatePrompt=true
      this.steps[0].content=this.$t('Customer.Prompt.Content');
      this.steps[0].target='footer .vs-button-warning';
      this.steps[0].params.placement="auto";
      setTimeout(() => this.$tours['ServicesB'].start(), 500);

    },
    promptShowNew(){
      this.$tours['ServicesB'].stop();
      this.activeUpdatePrompt = false;
      setTimeout(() => this.$tours['ServicesA'].start(1), 500);

    },
    goToNextPage(){
      router.push({ path: "/settings/rules?istour=on" });
    },
  },
  computed: {

  },
  mounted(){
    this.showLoading();
    privateServiceService.getPage(1).then(function (data) {
      this.services = data.services.data;
      this.totalItems = data.services.total;
      this.maxItems = data.services.per_page;
      this.totalPages = data.services.last_page;
      this.$t('Service.Content').map((content,index)=> (
              this.steps[index].content = content
      ));
      this.$route.query.istour && localStorage.getItem('skipTour') !='true' ? this.$tours['ServicesA'].start() : '';
    }.bind(this)).finally(()=>{
      this.hideLoading();
    });

    helpersService.getAllServices().then(function (data) {
      this.industryServices = data.services.data;
    }.bind(this));

    departmentService.getAll().then(
      function(data) {
        this.departments.push({
          name: this.$t("Booking.DepartmentAllOption"),
          id: -1
        });
        this.departments = this.departments.concat(data.departments);
      }.bind(this)
    );

  }
};
</script>
