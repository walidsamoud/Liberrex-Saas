<template>
    <div class="p-4">

          <vs-row>
              <vs-col vs-w="8">
                  <CustomerSelectFilter v-if="!createCustomer" :customer_id="customer_id" ref="customerFilter" class="mb-3"></CustomerSelectFilter>
              </vs-col>
              <vs-col vs-w="4">
                  <vs-button class="w-100" @click="addNewCustomerClick">{{$t('Booking.CreatePrompt.CreateNewCustomer')}}</vs-button>
              </vs-col>
          </vs-row>



          <vs-select
            v-if="departments.length>0 "
            v-model="targetDepartment"
            :placeholder="$t('Booking.CreatePrompt.ChooseTargetDepartment')"
            :label="$t('Booking.CreatePrompt.DepartmentLabel')"
            @change="getAvailableSlots('create')"
            class="w-100 mb-4"
          >
            <vs-select-item
              :key="index"
              :value="item.id"
              :text="item.name"
              v-for="(item,index) in departments"
            />
          </vs-select>  
            <vs-col class="date_time mb-3">
                <vs-row>
                    <vs-col vs-xl="6" vs-lg="6" vs-md="12" vs-sm="12" style="text-align: center;">
                      <datepicker
                        v-model="start"
                        :inline="true"
                        :disabled-dates="disabledDates"
                        :monday-first="true"
                        @input="getAvailableSlots('create')"
                        @change="getAvailableSlots('create')"
                        :danger="errors.start"
                        :danger-text="$t('Errors.InvalidPolite', {field: $t('Booking.CreatePrompt.StartDate')})"
                        style="width: 100% !important;text-align: center;"
                      ></datepicker>
                    </vs-col>

                    <vs-col vs-xl="6" vs-lg="6" vs-md="12" vs-sm="12">
                      <h6 v-if="!loading" class="mb-2">{{$t('Booking.CreatePrompt.TimeLabel')}}:</h6>
                      <div class="text-center mt-5" v-if="loading">
                        <b-spinner variant="primary" label="Loading..."></b-spinner>
                      </div>

                      <div class="time-slots row m-0" v-if="availableSlots.length && !loading">
                        <vs-col vs-sm="3" vs-lg="4"
                          v-for="(item,index) in availableSlots"
                          :key="index"
                          class="time-slot"
                        >
                          <input
                            type="radio"
                            v-model="start_time"
                            name="timeslot"
                            :value="item.value"
                            :id="'timeslot-'+index"
                          />
                          <label v-if="!item.active" :for="'timeslot-'+index">
                            <strike>{{item.value}}</strike>
                          </label>
                          <label
                            class="time-slot-inactive"
                            v-if="item.active"
                            :for="'timeslot-'+index"
                          >{{item.slot}}</label>
                        </vs-col>
                      </div>
                      <div v-else-if="!loading && start">
                        <div class="btn badge-warning" v-if="holidays.length" style="border-radius: 5px;width: 100%;font-size: 15px;">
                          {{ $t('Slot.holiday') + ' ' +$t('Holiday.'+holidays[0].status) }}
                        </div>
                        <div class="btn badge-danger" v-else style="border-radius: 5px;width: 100%;font-size: 15px;">
                          {{ $t('Slot.empty') }}
                        </div>
                      </div>
                    </vs-col>
                </vs-row>

            </vs-col>
          <vs-alert :active="noSlots" class="mb-2" color="primary">
            {{$t('Booking.CreatePrompt.BookingsAvailable')}}:
            <b>{{slotsLeft}}</b>
          </vs-alert>

          
            <vs-row>
                <vs-col vs-w="6">
                    <vs-select
                            :danger="errors.services"
                            :danger-text="$t('Errors.Required', {field: $t('services')})"
                            :placeholder="$t('Booking.CreatePrompt.ServicePlaceholder')"
                            class="w-100 mb-2"
                            :label="$t('Booking.Services')"
                            autocomplete
                            multiple
                            v-model="services"
                            @change="getQueuesForServices()"

                    >
                        <vs-select-item
                                :key="index"
                                :value="item.id"
                                :text="item.name"
                                v-for="(item,index) in servicesList"
                        />
                    </vs-select>
                </vs-col>
                <vs-col vs-w="6">
                    <vs-select
                            :placeholder="$t('Booking.CreatePrompt.QueuePlaceholder')"
                            class="w-100 mb-2"
                            :label="$t('Booking.Queue')"
                            autocomplete
                            v-model="queue_auto_call"
                    >
                        <vs-select-item
                                :key="index"
                                :value="item.id"
                                :text="item.name"
                                v-for="(item,index) in queuesList"
                        />
                    </vs-select>
                </vs-col>
            </vs-row>



        <vs-checkbox
            v-if="bookingSettings"
            class="justify-content-start w-100 mb-3"
            v-model="showCreateAdditionalData"
          >{{$t('Booking.CreatePrompt.ShowAdditionalData')}}</vs-checkbox>
        
        <vs-row v-if="showCreateAdditionalData == true">
          <vs-col vs-w="12">
            <vs-button
              v-if="bookingSettings.map == 1 && showMap == false"
              color="success"
              type="gradient"
              icon="map"
              @click="showMap = true"
              class="w-100 mb-2"
            >{{$t('Booking.CreatePrompt.ShowMap')}}</vs-button>
          </vs-col>
        </vs-row>

        

        <vs-row v-if="showCreateAdditionalData == true && JSON.parse(bookingSettings.input) && Object.keys(JSON.parse(bookingSettings.input)).length != 0">
          <vs-col vs-w="12" v-for="(item,index_inputs) in JSON.parse(bookingSettings.input)" :key="index_inputs">
            <vs-input
              v-if="$i18n.locale == 'en'"
              :label="item.name.en"
              :id="index_inputs"
              v-model="inputs[index_inputs]"
              :type="item.type"
              class="w-100 mb-3"
            />
            <vs-input
                v-if="$i18n.locale == 'fr'"
                :label="item.name.fr"
                :id="index_inputs"
                v-model="inputs[index_inputs]"
                :type="item.type"
                class="w-100 mb-3"
              />
              <vs-input
                v-if="$i18n.locale == 'ar'"
                :label="item.name.ar"
                :id="index_inputs"
                v-model="inputs[index_inputs]"
                :type="item.type"
                class="w-100 mb-3"
              />
              <vs-input
                v-if="$i18n.locale == 'ru'"
                :label="item.name.ru"
                :id="index_inputs"
                v-model="inputs[index_inputs]"
                :type="item.type"
                class="w-100 mb-3"
              />
          </vs-col>
        </vs-row>

        <vs-col vs-w="12" class="text-right mt-4">
            <vs-button @click="close()" type="border" color="primary" class="border-0 border-bottom mr-4"> {{$t('Components.Queue.AddCustomerPrompt.CancelButton')}} </vs-button>
            <vs-button @click="createEvent()" color="primary" class="pr-5 pl-5 float-right"> {{$t('Components.Queue.AddCustomerPrompt.PushButton')}} </vs-button>
        </vs-col>
         
        
    </div>
</template>

<script>
import {
  queueService,
  bookingService,
  bookingRequestService,
  customerService,
  privateServiceService,
  departmentService,
  bookingSettingsService
} from "../../_services";

import CustomerSelectFilter from "../../components/shared/CustomerSelectFilter";
import { mapState } from "vuex";
import router from "../../_helpers/router";
import Datepicker from "vuejs-datepicker";

var getBookingsCallBack;
var getRequestsCallBack;

export default {
  name: "AddCustomerBooking",
  data: () => ({
    holidays: [],
    loading: false,
    //disabledDates:false,
    isActiveChangeDateHandler : false,
    bookingsList: [],
    title: "AddCustomerBooking",
    customer: "",
    slotsLeft: 0,
    selectedDepartment: -1,
    playSound: true,
    createCustomer: false,
    activePrompt2: false,
    activeEditPrompt: false,
    activeUploadPrompt: false,
    activeQueuePrompt: false,
    errors: {
      customer: false,
      start: false,
      start_time: false,
      duration: false,
      services: false,
    },
    importModal: {
      file: null,
      targetDepartment: null,
      notify: false,
    },
    start: "",
    fname: "",
    lname: "",
    email: "",
    phone_number: "",
    internalId: "",
    services: [],
    start_time: "",
     queuesList: [],
    queue_auto_call: "",
    noSlots: false,
    targetDepartment: null,
    targetQueue: null,
    targetQueueServices: [],
    selectedTargetServices: [],
    chooseTargetDepartment: false,
    disabledDates: {
      to:  new Date(new Date().setDate(new Date().getDate()-1)), // Disable all dates up to specific date
      days: [] // Disable Saturday's and Sunday's
    },
    duration: 0,
    end: "",
    desc: "",
    requests: [],
    queues: [],
    steps: [
      {
        target: "#bookings-calendar", // We're using document.querySelector() under the hood
        header: {
          title: "Bookings Calender",
        },
        params: {
          placement: "auto",
        },
      },
      {
        target: "#recent-bookings", // We're using document.querySelector() under the hood
      },
    ],
    bookingSettings : {
      map : 0,
      input : {}
    },
    events: [
      // initial event data
      { title: "Loading Events..", start: new Date() },
    ],
    customersList: [],
    departments: [],
    servicesList: [],
    availableSlots: [],
    durationOptions: [
      { text: "00:15 minutes", value: 15 },
      { text: "00:30 minutes", value: 30 },
      { text: "00:45 minutes", value: 45 },
      { text: "1:00 Hour", value: 60 },
      { text: "1:30 Hour", value: 90 },
      { text: "2:00 Hours", value: 120 },
    ],
    config: {
      defaultView: "month",
    },
    props: {
      customer_id: Number,
      date: {
        type: Number,
        
      },
    },
    
    
    showAdditionalData : false,
    showCreateAdditionalData : false,
    inputs : [],
    showMap : false,
    markers: [{position: {}}],
    coordinates : {lat : 0, lng : 0}
  }),
  props:{
    customer_id: Number,
  },
  methods: {

    addNewCustomerClick(){
      this.createCustomer = !this.createCustomer;
      this.$emit('newCustomer', ['customer','booking']);
    },
    notify(title, text, type) {
      this.$vs.notify({
        color: type,
        title: title,
        text: text,
      });
    },
    promptShow() {
      this.$tours["BookingA"].stop();
      this.activePrompt2 = true;
      this.steps[0].content = this.$t("Booking.Prompt.Content");
      this.steps[0].target = ".vs-button-primary";
      // this.steps[0].params.placement='auto';
      setTimeout(() => this.$tours["BookingB"].start(), 500);
    },
    promptShowNew() {
      this.$tours["BookingB"].stop();
      this.activePrompt2 = false;
      setTimeout(() => this.$tours["BookingA"].start(1), 500);
    },
    getQueuesForServices(){
      console.log("selected")
      console.log(this.services)
      let searched_values = [];
      this.queuesList = [];
      let queue_target_cache;
      let iterator;
      if (this.activeEditPrompt==true){
          iterator = this.selectedEvent.services.values();
          queue_target_cache = this.selectedEvent.queue_auto_call;
          this.selectedEvent.queue_auto_call="";
      }
      else{
      iterator = this.services.values(); 
      queue_target_cache = this.queue_auto_call;
      this.queue_auto_call="";

      }
      this.queue_auto_call=[];
      for (let elements of iterator) { 
      searched_values.push(elements)
      } 
      queueService
        .getForService({"services":searched_values.toString()})
        .then(
          function (data) {   
            data.queues.forEach((obj) => {
              if (queue_target_cache == obj.id){
                this.selectedEvent.queue_auto_call=queue_target_cache;
                this.queue_auto_call=queue_target_cache;
              }
          this.queuesList.push({
            id: obj.id,
            name: obj.title,
           });
           });

          }.bind(this)
        );
    },
    goToNextPage() {
      router.push({ path: "/customers?istour=on" });
    },
    validateFields() {
      this.errors.customer = this.createCustomer
        ? false
        : !this.$refs.customerFilter.value;
      this.errors.start = this.noSlots ? false : !this.start ? true : false;
      // this.errors.start_time = (this.accountFormData.telephone=="null" || this.accountFormData.telephone.length < 3 || !this.isValidPhoneNumber(this.accountFormData.telephone)) ? true : false;
      //this.errors.duration = this.noSlots ? false :  (!this.duration ? true : false);
      this.errors.services = !this.services ? true : false;

      let { customer, start, duration, services } = this.errors;
      return !(customer || start || duration || services);
    },
    showLoading() {
      this.$vs.loading({
        container: "#booking-box",
        scale: 0.6,
      });
    },
    hideLoading() {
      this.$vs.loading.close("#booking-box > .con-vs-loading");
    },
    getAvailableSlots(target) {
      this.showLoading();
      this.loading= true;
      console.log(this.start);
      let date = this.$moment(this.start).format("YYYY-MM-DD");
      this.start = date;
      // this.showLoading();
      // let date = target == "create" ? this.start : this.selectedEvent.date;
      let dep =
        target == "create"
          ? this.targetDepartment
          : this.selectedEvent.department_id;
      this.availableSlots = [];
      bookingService
        .availableSlots(date, { department: dep })
        .then(
          function (data) {
            console.log(data);
            if (target == "create") {
              this.slotsLeft = data.available;
            } else {
              this.selectedEvent.slotsLeft = data.available;
            }
            this.holidays= data.holidays;
            data.slots.forEach((obj) => {
              if (obj.active){
              this.availableSlots.push({
                value: obj.slot,
                status: obj.active,
              });
              }
            });
          }.bind(this)
        )
        .catch(
          function () {
            if (target == "create") {
              this.slotsLeft = 0;
            } else {
              this.selectedEvent.slotsLeft = 0;
            }
          }.bind(this)
        )
        .finally(
          function () {
            this.hideLoading();
            this.loading= false;
          }.bind(this)
        );

      //get department services
      this.getServicesByDepartment();
    },
    getServicesByDepartment(){
      privateServiceService.getServicesByDepartment(this.targetDepartment).then(function(data){
        console.log(data)

        this.servicesList = [];
        this.services = [];
      
        data.services.forEach((obj) => {
          this.servicesList.push({
            id: obj.id,
            name: obj.title,
            duration: obj.duration,
          });
        });
          
        if (this.servicesList.length == 1) {
          this.services[0]= this.servicesList[0].id;
        }
      }.bind(this)).catch(function(){
            this.notify(
              this.$t("Toasts.Error"),
              this.$t("Booking.CreatePrompt.ToastFail"),
              "danger"
            );
      }.bind(this));
    },
    clearData() {
      this.title = this.end = this.desc = "";
    },
    addEvent(customer = null) {
      if (customer) {
        this.activeEditPrompt = false;
        this.customer = customer;
      }
      this.$refs.AddCustomerCustomizer.show();

      // this.clearData();
      // this.activePrompt2 = true;
    },
    createEvent() {
      let names = []
      let additionalInputs = {};

      let res = this.validateFields();
      if (!res) {
        this.activePrompt2 = true;
        return false;
      }
      // console.log('res',res);
      this.showLoading();
      this.activePrompt2 = true;

      this.start_time = !this.start_time
        ? this.working_days[this.$moment().weekday()].start_time
        : this.start_time;
      let durationSum = 0;
      this.servicesList.forEach((obj) => {
        this.services.forEach((id) => {
          if (id == obj.id) durationSum += obj.duration;
        });
      });

      if(this.bookingSettings.input){
        Object.values(JSON.parse(this.bookingSettings.input)).forEach((data,index) => {
          names.push([data.name.en,data.name.fr,data.name.ar,data.name.ru]);

          for(var x = 0 ; x< names.length; x++) {
            additionalInputs[names[x][0]] = {
              "Data" : this.inputs[x],
              "en": names[x][0],
              "fr": names[x][1],
              "ar": names[x][2],
              "ru": names[x][3]
            };
           
          }
        });
        
      }
      if(this.bookingSettings.map == 1) {
        additionalInputs.lat = this.markers[0].position.lat;
        additionalInputs.lng = this.markers[0].position.lng;
      }

      this.duration = durationSum;

      let booking = {
        customer_id: this.$refs.customerFilter
          ? this.$refs.customerFilter.value.id
          : null,
        add_customer: this.createCustomer,
        fname: this.fname,
        lname: this.lname,
        email: this.email,
        phone_number: this.phone_number,
        internal_id: this.internalId,
        no_slots: this.noSlots,
        department_id: this.targetDepartment,
        start_datetime: this.$moment(this.start + " " + this.start_time).format(
          "YYYY-MM-DD HH:mm:ss"
        ),
        end_datetime: this.$moment(this.start + " " + this.start_time)
          .add(this.duration, "minutes")
          .format("YYYY-MM-DD HH:mm:ss"),
        services: this.services.join() 
      };
       if(this.queue_auto_call != ""){
        booking.queue_target = this.queue_auto_call;
       }
      if(this.bookingSettings.input || this.bookingSettings.map == 1){
        booking.additionalData = JSON.stringify(additionalInputs); 
      }
      // console.log(booking);
      bookingService
        .create(booking)
        .then(
          function () {
            this.getAllBookings();
            this.close();

            this.activePrompt = false;
            this.notify(
              this.$t("Toasts.Successful"),
              this.$t("Booking.CreatePrompt.ToastSuccess"),
              "success"
            );
            this.reset();
          }.bind(this)
        )
        .catch(
          function () {
            this.notify(
              this.$t("Toasts.Error"),
              this.$t("Booking.CreatePrompt.ToastFail"),
              "danger"
            );
          }.bind(this)
        )
        .finally(
          function () {
            this.hideLoading();
          }.bind(this)
        );
    },
    close(){
      this.$emit('updateSidebar', 'close');

    },

    handleDateClick(/*arg*/) {
      //console.log('date clicked: '+arg.dateStr)
      //console.log(arg)
    },
    getAllRequests() {
      bookingRequestService.getAll().then(
        function (data) {
          this.requests = data.requests.data;
        }.bind(this)
      );
    },
    requestApproved() {
      this.getAllRequests();
      this.getAllBookings();
    },
    requestRejected() {
      this.getAllRequests();
    },
    getAllBookings() {
      let obj={
      start : this.$moment().subtract(1, 'months').endOf('month').startOf('isoweek').format("YYYY-MM-DD"),
      end : this.$moment().add(1, 'months').startOf('month').add(1, 'week').endOf('isoweek').format("YYYY-MM-DD")
      }
      bookingService
        .range(obj)
        .then(
          function (data) {
            this.events = [];
            this.rawEvents = data.bookings;
            data.bookings.forEach((obj) => {
              let endTime = this.$moment(obj.end_datetime);
              let diffMin = this.$moment(obj.end_datetime).diff(
                this.$moment(obj.start_datetime),
                "minutes"
              );

              if (diffMin < 30) {
                endTime = this.$moment(obj.start_datetime).add(30, "minutes");
              }

              this.events.push({
                title: obj.fname + " " + obj.lname,
                allDay: false,
                start: this.$moment(obj.start_datetime)._i,
                dateTime: this.$moment(obj.start_datetime).format(
                  "Do MMMM, h:mm"
                ),
                end: endTime._i,
                color: obj.color,
                textColor: "#fff",
                data: obj,
                services: obj.services_array
                  .map((s) => {
                    return s.title;
                  })
                  .join(","),
              });
            });
          }.bind(this)
        )
        .finally(
          function () {
            this.hideLoading();
            this.isActiveChangeDateHandler=true;
          }.bind(this)
        );
    },
    deleteBooking() {
      this.activeEditPrompt = false;
      this.$vs.dialog({
        type: "confirm",
        color: "danger",
        title: this.$t("Booking.DeletePrompt.Title"),
        text: this.$t("Booking.DeletePrompt.Text"),
        acceptText: this.$t("Toasts.AcceptButton"),
        cancelText: this.$t("Toasts.CancelButton"),
        accept: function () {
          this.showLoading();
          bookingService
            .delete(this.selectedEvent.id)
            .then(
              function () {
                this.getAllBookings();
                this.notify(
                  this.$t("Toasts.Successful"),
                  this.$t("Booking.DeletePrompt.ToastSuccess"),
                  "success"
                );
              }.bind(this)
            )
            .catch(
              function () {
                this.notify(
                  this.$t("Toasts.Error"),
                  this.$t("Booking.DeletePrompt.ToastFail"),
                  "danger"
                );
              }.bind(this)
            )
            .finally(
              function () {
                this.hideLoading();
              }.bind(this)
            );
        }.bind(this),
      });
    },
    subscribeToPusher() {
      getBookingsCallBack = function () {
        this.getAllBookings();
      };
      getRequestsCallBack = function () {
        this.getAllRequests();
      };
      this.$pusher.subscribe("private-business-" + this.business_info.id);
      this.$pusher.bind("booking-created", getBookingsCallBack, this);
      this.$pusher.bind("booking-deleted", getBookingsCallBack, this);
      this.$pusher.bind("booking-request-created", getRequestsCallBack, this);
      this.$pusher.bind("booking-request-deleted", getRequestsCallBack, this);
    },
    unsubscribeFromPusher() {
      this.$pusher.unsubscribe("private-business-" + this.$route.params.id);
      this.$pusher.unbind("booking-created", getBookingsCallBack);
      this.$pusher.unbind("booking-deleted", getBookingsCallBack);
      this.$pusher.unbind("booking-request-created", getRequestsCallBack);
      this.$pusher.unbind("booking-request-deleted", getRequestsCallBack);
    },
    reset() {
      this.customer = "";
      this.activePrompt2 = false;
      this.activeEditPrompt = false;
      this.start = "";
      this.services = "";
      this.start_time = "";
      this.duration = 0;
      this.slotsLeft = 0;
      this.end = "";
      this.desc = "";
      this.requests = [];
      (this.importModal = {
        file: null,
        targetDepartment: null,
        notify: false,
      }),
        (this.selectedEvent = {
          id: "",
          customer: "",
          date: "",
          services: "",
          time: "",
          duration: 0,
          department_id: 0,
          slotsLeft: 0,
          no_slots: false,
          additionalData : {}
        });
    },
    filterBookingByDepartment() {
      if (this.selectedDepartment == -1) {
        this.getAllBookings();
        return;
      }
      this.showLoading();
      bookingService
        .getByDepartment(this.selectedDepartment)
        .then(
          function (data) {
            this.events = [];
            this.rawEvents = data.bookings;
            data.bookings.forEach((obj) => {
              let endTime = this.$moment(obj.end_datetime);
              let diffMin = this.$moment(obj.end_datetime).diff(
                this.$moment(obj.start_datetime),
                "minutes"
              );
              if (diffMin < 30) {
                endTime = this.$moment(obj.start_datetime).add(30, "minutes");
              }
              this.events.push({
                title: obj.fname + " " + obj.lname,
                allDay: false,
                start: this.$moment(obj.start_datetime)._i,
                end: endTime._i,
                color: obj.color,
                textColor: "#fff",
                data: obj,
              });
            });
          }.bind(this)
        )
        .finally(
          function () {
            this.hideLoading();
          }.bind(this)
        );
    },
    uploadFile() {
      this.playSound = false;
      let importForm = new FormData();
      importForm.append("department_id", this.importModal.targetDepartment);
      importForm.append("notify", this.importModal.notify);
      importForm.append("file", document.getElementById("fileInput").files[0]);
      this.showLoading();
      bookingService
        .upload(importForm)
        .then(
          function () {
            window.location.reload();
          }.bind(this)
        )
        .catch(function () {}.bind(this))
        .finally(
          function () {
            this.hideLoading();
          }.bind(this)
        );
    },
    redirectToQueue(event) {
      this.activeEditPrompt = false;
      this.showLoading();
      queueService
        .getAllWithSummary()
        .then(
          function (data) {
            this.queues = data.queues.map((obj) => {
              return obj.queue;
            });
          }.bind(this)
        )
        .finally(
          function () {
            this.hideLoading();
          }.bind(this)
        );
      this.activeQueuePrompt = true;
    },

    loadSelectedQueueServices() {
      this.showLoading();
      queueService
        .getById(this.targetQueue)
        .then(
          function (data) {
            this.targetQueueServices = data.services;
          }.bind(this)
        )
        .finally(
          function () {
            this.hideLoading();
          }.bind(this)
        );
    },

    pinLocation(){

    },
    getCoordinates(location) {
      this.markers[0].position = {
        lat: location.latLng.lat(),
        lng: location.latLng.lng()
      };
      this.coordinates.lat=parseFloat(this.markers[0].position.lat);
      this.coordinates.lng=parseFloat(this.markers[0].position.lng);
    },
  },
  computed: {
      ...mapState({
      account_info: state => state.account.user ? state.account.user.user : {user: {photo: ""}},
        business_info: (state) => state.account.user.business,
      working_days: (state) => state.account.user.working_days,
      }),
    createHasSlots() {
      return this.slotsLeft > 0;
    },
    updateHasSlots() {
      return this.selectedEvent.slotsLeft > 0;
    },
    ...mapState({

    }),
  },
  components: {
    CustomerSelectFilter,
    Datepicker
  },
  mounted() {
    this.working_days.forEach((obj, index) => {
            if (obj.active == 0) {
              this.disabledDates.days.push(index == 6 ? 0 : index+1);
            }
          });
    //console.log(this.working_days);
    this.targetDepartment = this.account_info.department_id;
    this.getServicesByDepartment();
    customerService.getAll().then(
      function (data) {
        this.customersList = [];
        data.customers.data.forEach((obj) => {
          this.customersList.push({
            id: obj.id,
            name: obj.fname + " " + obj.lname,
            internal_id: obj.internal_id,
          });
        });
      }.bind(this)
    );
    departmentService.getAll().then(
      function (data) {
        this.departments.push({
          name: this.$t("Booking.DepartmentAllOption"),
          id: -1,
        });
        this.departments = this.departments.concat(data.departments);
      }.bind(this)
    );
    privateServiceService.getAll().then(
      function (data) {
        this.servicesList = [];
        this.services = [];
      
        data.services.forEach((obj) => {
          this.servicesList.push({
            id: obj.id,
            name: obj.title,
            duration: obj.duration,
          });
        });
          
        if (this.servicesList.length == 1) {
          this.services[0]= this.servicesList[0].id;
        }
      }.bind(this)
    );

    bookingSettingsService.getSettings().then(function (data) {
        this.bookingSettings = data.BookingSettings;
    }.bind(this))

    this.getAllRequests();
    this.$t("Booking.Content").map(
      (content, index) => (this.steps[index].content = content)
    );
    this.$route.query.istour && localStorage.getItem("skipTour") != "true"
      ? this.$tours["BookingA"].start()
      : "";
  },

  created() {
    this.getAllBookings();
    this.subscribeToPusher();
  },
  beforeDestroy() {
    this.unsubscribeFromPusher();
  },
};
</script>
<style >

.fc-button-primary {
  color: #fff;
  background-color: #3aa6fe;
  border-color: #3aa6fe;
}
.fc-button-primary:hover {
  color: #fff;
  background-color: #057eff;
  border-color: #057eff;
}
.fc-button-primary:not(:disabled):active,
.fc-button-primary:not(:disabled).fc-button-active {
  color: #fff;
  background-color: #057eff;
  border-color: #057eff;
}
.fc-button-primary:disabled {
  color: #fff;
  background-color: #249aff;
  border-color: #249aff;
}
.vdp-datepicker__calendar {
  border: none !important;
  
}
.vdp-datepicker__calendar .cell.selected {
  background: #48b7ff !important;
  color: white;
  
}
.time-slot {
    text-align: center;
    border: 1px solid #fff;
    padding: 10px 5px;
    background: #48b7ff12;
    display: inline-block;
    height: 45px;
    color: #040107;
    font-weight: 500;
}
.vdp-datepicker__calendar{
  width: 100% !important;
}
</style>

