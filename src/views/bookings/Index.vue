<template>
  <vs-row vs-justify="center" id="booking-box">
    <vs-col
      type="flex"
      vs-justify="center"
      vs-align="center"
      vs-lg="12"
      vs-xs="12"
      id="bookings-calendar"
    >
      <vs-card>
        <vs-row>
          <vs-col vs-lg="6" vs-md="8" vs-sm="4" vs-xs="12">
            <vs-select
              v-if="departments.length>0"
              v-model="selectedDepartment"
              :placeholder="$t('Booking.DepartmentFilterPlaceholder')"
              class="w-100"
              @change="filterBookingByDepartment"
            >
              <vs-select-item
                :key="index"
                :value="item.id"
                :text="item.name"
                v-for="(item,index) in departments"
              />
            </vs-select>
          </vs-col>
          <vs-col vs-lg="3" vs-md="3" vs-sm="4" vs-xs="12" class="d-flex align-items-center">
            <vs-dropdown class="w-100">
              <vs-button
                class="btn-drop w-100"
                color="dark"
                type="filled"
                icon="settings"
              >{{$t('Booking.ActionsBookingsButton')}}</vs-button>
              <vs-dropdown-menu>
                <vs-dropdown-item @click="csvExport(rawEvents)">
                  <download-csv
                    :data="rawEvents"
                    :fields="['fname', 'lname', 'phone_number', 'start_datetime', 'service_names']"
                    :separator-excel="true"
                    name="bookings.csv"
                  >
                    <i class="fa fa-download"></i>
                    {{$t('Booking.ExportBookingsButton')}}
                  </download-csv>
                </vs-dropdown-item>
                <vs-dropdown-item @click="activeUploadPrompt=true">
                  <i class="fa fa-upload"></i>
                  {{$t('Booking.ImportBookingsButton')}}
                </vs-dropdown-item>
              </vs-dropdown-menu>
            </vs-dropdown>
          </vs-col>
          <vs-col vs-lg="3" vs-md="3" vs-sm="4" vs-xs="12" class="d-flex align-items-center">
            <vs-button
              icon="add"
              color="primary"
              @click="addEvent"
              class="flex-shrink-0 ml-auto w-100"
              id="create-booking"
            >{{$t('Booking.CreateBookingButton')}}</vs-button>
          </vs-col>
        </vs-row>
      </vs-card>

      <vs-card>
        <FullCalendar
          id="mycalendar"
          defaultView="dayGridMonth"
          ref="fullCalendar"
          :plugins="calendarPlugins"
          :weekends="true"
          :firstDay="firstDayMonday"
          :buttonText="buttonText"
          :header="header"
          :events="events"
          :config="calendarConfig"
          @dateClick="handleDateClick"
          @eventClick="eventSelected"
          @datesRender="handleDateRangeChange"
          class="w-100"
        />
      </vs-card>

      <!--
      <vs-tabs>
        <vs-tab label="Calendar">
          <div class="con-tab-ejemplo">
            <vs-card>

            </vs-card>
          </div>
        </vs-tab>
        <vs-tab label="Tab mode">
          <div class="con-tab-ejemplo">
            <vs-card>
              <vs-table>
                <template slot="thead">
                  <vs-th >{{$t('Booking.CreatePrompt.TimeLabel')}}</vs-th>
                  <vs-th >{{$t('Customer.Table.UserInfo')}}</vs-th>
                  <vs-th >{{$t('Booking.CreatePrompt.ServiceLabel')}}</vs-th>
                  <vs-th>{{$t('Customer.Table.Options')}}</vs-th>
                </template>
                <template slot-scope="{data}">
                  <vs-tr v-for="(event,i) in events" >
                    <vs-td>
                      {{event.dateTime}}
                    </vs-td>
                    <vs-td>
                      {{event.title}}
                    </vs-td>
                    <vs-td>
                      {{event.services}}
                    </vs-td>
                    <vs-td>
                      <vs-button
                        id="edit-customer-button"
                        radius
                        color="warning"
                        type="border"
                        icon="edit"
                        @click="eventSelected(event)"
                    ></vs-button>
                    </vs-td>
                  </vs-tr>
                </template>
              </vs-table>

            </vs-card>

          </div>
        </vs-tab>
      </vs-tabs>
      -->
      <!---Calendar card --->

      <!--- Redirect to Queue --->
      <vs-prompt
        color="success"
        @accept="pushToQueue"
        @cancel="reset"
        @close="reset"
        :active.sync="activeQueuePrompt"
        :title="$t('Booking.QueuePrompt.Title')"
        :accept-text="$t('Booking.QueuePrompt.SubmitButton')"
        :cancel-text="$t('Booking.QueuePrompt.CancelButton')"
      >
        <div class>
          <vs-select
            :placeholder="$t('Booking.CreatePrompt.CustomerPlaceholder')"
            class="w-100 mb-4 customer-select"
            :label="$t('Booking.CreatePrompt.CustomerLabel')"
            autocomplete
            v-model="selectedEvent.customer"
            :disabled="true"
          >
            <vs-select-item
              :key="index"
              :value="item.id"
              :text="item.name"
              v-for="(item,index) in customersList"
            />
          </vs-select>

          <vs-select
            :placeholder="$t('Components.Queue.TicketPopup.RedirectTargetQueuePlaceholder')"
            class="w-100 mb-4"
            :label="$t('Components.Queue.TicketPopup.RedirectTargetQueueLabel')"
            autocomplete
            v-model="targetQueue"
            @change="loadSelectedQueueServices"
          >
            <vs-select-item
              :key="index"
              :value="queue.id"
              :text="queue.title"
              v-for="(queue,index) in queues"
            />
          </vs-select>

          <vs-select
            :placeholder="$t('Components.Queue.AddCustomerPrompt.ServicesPlaceholder')"
            class="w-100 mb-4"
            :label="$t('Components.Queue.AddCustomerPrompt.ServicesLabel')"
            autocomplete
            multiple
            v-model="selectedTargetServices"
            :disabled="!targetQueue"
          >
            <vs-select-item
              :key="'service_'+index"
              :value="item.id"
              :text="item.title"
              v-for="(item,index) in targetQueueServices"
            />
          </vs-select>
        </div>
      </vs-prompt>

          <CustomizerAddCustomer
            ref="AddCustomerCustomizer"
            :servicesList="servicesList"
            :booking= true
            :side-bar-title="$t('Booking.CreatePrompt.Title')"
          ></CustomizerAddCustomer>

          <CustomizerAddCustomer  v-if="selectedEvent_bool"
            ref="AddCustomerCustomizerBookingUpdate"
            :servicesList="servicesList"
            :bookingUpdate= true
            :selectedEvent="selectedEvent"
            :side-bar-title="$t('Booking.EditPrompt.Title')"
            @refresh_bookings="refresh_bookings"
          ></CustomizerAddCustomer>

      <!-- show map popup -->

      <vs-popup
        :title="$t('Booking.CreatePrompt.ShowMap')"
        :active.sync="showMap"
        style="z-index : 100000"
      >
        <vs-row id="mapInput" class="w-100 mb-2" style="margin-bottom: 5%" v-if="bookingSettings.map == 1">
          <GmapMap
            :center="{lat: coordinates.lat, lng:coordinates.lng }"
            :zoom="14"
            map-type-id="terrain"
            style="width: 100%; height: 300px"
            :options="{
              zoomControl: true,
              mapTypeControl: false,
              scaleControl: false,
              streetViewControl: false,
              rotateControl: false,
              fullscreenControl: true,
              disableDefaultUi: true,
              ZoomControlOptions: google && {position: google.maps.ControlPosition.TOP_LEFT}
            }"
          >
            <GmapMarker
              :key="index"
              v-for="(m, index) in markers"
              :position="{lat: coordinates.lat, lng:coordinates.lng }"
              :clickable="true"
              :draggable="true"
              :options="{class: 'business-marker'}"
              @click="center=m.position"
              @dragend="getCoordinates"
            />
          </GmapMap>
        </vs-row>
      </vs-popup>


      <!---Upload Booking --->
      <vs-prompt
        color="dark"
        @accept="uploadFile"
        @cancel="reset"
        @close="reset"
        :active.sync="activeUploadPrompt"
        :title="$t('Booking.UploadPrompt.Title')"
        :accept-text="$t('Booking.UploadPrompt.SubmitButton')"
        :cancel-text="$t('Booking.UploadPrompt.CancelButton')"
      >
        <div class>
          <vs-input
            type="file"
            class="w-100 mt-3 mb-3"
            id="fileInput"
            :label="$t('Booking.UploadPrompt.FileLabel')"
            v-model="importModal.file"
          />

          <vs-select
            v-if="departments.length>0"
            v-model="importModal.targetDepartment"
            class="w-100 mb-3"
            :placeholder="$t('Booking.CreatePrompt.ChooseTargetDepartment')"
            :label="$t('Booking.CreatePrompt.DepartmentLabel')"
          >
            <vs-select-item
              :key="index"
              :value="item.id"
              :text="item.name"
              v-for="(item,index) in departments"
            />
          </vs-select>

          <vs-checkbox
            class="justify-content-start w-100 mb-3"
            v-model="importModal.notify"
          >{{$t('Booking.UploadPrompt.NotifyCustomers')}}</vs-checkbox>
        </div>
      </vs-prompt>
    </vs-col>
    
    <v-tour name="BookingA" :steps="steps">
      <template slot-scope="tour">
        <transition name="fade">
          <v-step
            v-if="tour.currentStep===index"
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
                <button @click="tour.stop" class="v-step__button">Skip Tour</button>
                <button @click="promptShow" class="v-step__button">Next</button>
              </div>
            </template>
            <template v-if="tour.currentStep === 1">
              <div slot="actions" class="v-step__buttons">
                <button @click="tour.stop" class="v-step__button">Skip Tour</button>
                <button @click="goToNextPage" class="v-step__button">Next</button>
              </div>
            </template>
          </v-step>
        </transition>
      </template>
    </v-tour>
  </vs-row>
</template>

<script>
import FullCalendar from "@fullcalendar/vue";
import frLocale from "@fullcalendar/core/locales/fr";
import enLocale from "@fullcalendar/core/locales/en-au";
import ruLocale from "@fullcalendar/core/locales/ru";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import CustomizerAddCustomer from '../../layout/full/customizer/CustomizerAddCustomer.vue';

import {
  queueService,
  bookingService,
  bookingRequestService,
  customerService,
  privateServiceService,
  departmentService,
  bookingSettingsService,
  businessService
} from "../../_services";
import BookingRequestItem from "../../components/booking/BookingRequestItem";
import CustomerSelectFilter from "../../components/shared/CustomerSelectFilter";
import { mapState } from "vuex";
import router from "../../_helpers/router";
import { gmapApi } from "vue2-google-maps";
import moment from 'moment';
import $ from 'jquery';
// import UpdateEvent from "../../components/booking/UpdateEvent";

var getBookingsCallBack;
var getRequestsCallBack;

export default {
  name: "Calendar",
  data: () => ({
    isActiveChangeDateHandler : false,
    bookingsList: [],
    title: "Calendar",
    customer: "",
    selectedEvent_bool:false,
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
    firstDayMonday: 1,
    buttonText: {
      today: "today",
      month: "month",
      week: "week",
      day: "day",
      list: "list",
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
    services: "",
    start_time: "",
    queue_auto_call: "",
    noSlots: true,
    targetDepartment: null,
    targetQueue: null,
    targetQueueServices: [],
    selectedTargetServices: [],
    chooseTargetDepartment: false,
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
    selectedEvent: {
      id: "",
      fullName: "",
      customer: "",
      date: "",
      services: "",
      queue_auto_call: "",
      time: "",
      duration: 0,
      department_id: 0,
      slotsLeft: 0,
      no_slots: false,
      additionalData: {},
      member: null
    },
    bookingSettings : {
      map : 0,
      input : {}
    },
    rawEvents: [],
    csv_data: [],
    events: [
      // initial event data
      { title: "Loading Events..", start: new Date() },
    ],
    customersList: [],
    departments: [],
    servicesList: [],
    queuesList: [],
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
      date: {
        type: Number,
      },
    },
    header: {
      left:
        localStorage.getItem("Language") == "ar"
          ? "next,prev today"
          : "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
    },
    calendarConfig: {
      themeSystem: "bootstrap4",
      locales: [frLocale, enLocale, ruLocale],
    },
    calendarPlugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    showAdditionalData : false,
    showCreateAdditionalData : false,
    inputs : [],
    showMap : false,
    markers: [{position: {}}],
    coordinates : {lat : 0, lng : 0},
    holidays: []
  }),
  methods: {
    handleDateRangeChange(dateInfo) {
      let obj = {};
      if (this.isActiveChangeDateHandler) {
        if (this.selectedDepartment == -1)
          obj = {
            start: this.$moment(dateInfo.view.activeStart).format("YYYY-MM-DD"),
            end: this.$moment(dateInfo.view.activeEnd).format("YYYY-MM-DD"),
          };
        else
          obj = {
            start: this.$moment(dateInfo.view.activeStart).format("YYYY-MM-DD"),
            end: this.$moment(dateInfo.view.activeEnd).format("YYYY-MM-DD"),
            department_id: this.selectedDepartment,
          };
        this.showLoading();
        bookingService.range(obj).then((data) => {
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
          }).finally(()=>{
          this.hideLoading();
        });
      }
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
    eventSelected(event) {
      this.selectedEvent_bool = true;
      this.showLoading();
      let dataEvent;
      if (event.event) dataEvent = event.event.extendedProps.data;
      else dataEvent = event.data;
      this.availableSlots = [];
      let department = {};
      department.department = dataEvent.department_id;
      bookingService
        .getById(dataEvent.id).then( function (data) {
          this.selectedEvent.files = data.booking.attachment;
          console.log(data);
        }.bind(this));
      bookingService
        .availableSlots(
          this.$moment(dataEvent.start_datetime).format("YYYY-MM-DD"),department
        )
        .then(
          function (data) {
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
        .finally(
          function () {
            this.selectedEvent.id = dataEvent.id;
            this.selectedEvent.member = dataEvent.member;
             this.selectedEvent.queue_auto_call = dataEvent.queue_target;

            this.selectedEvent.customer = dataEvent.customer_id;
            this.selectedEvent.fullName =
              dataEvent.fname + " " + dataEvent.lname;
            this.selectedEvent.date = this.$moment(
              dataEvent.start_datetime
            ).format("YYYY-MM-DD");
            this.selectedEvent.time = this.$moment(
              dataEvent.start_datetime
            ).format("HH:mm");
            this.selectedEvent.duration = this.$moment(
              dataEvent.end_datetime
            ).diff(this.$moment(dataEvent.start_datetime), "minutes");
            this.selectedEvent.services = dataEvent.services_array.map(
              (obj) => {
                return obj.id;
              }
            );
                    this.queuesList = [];
      let searched_values = [];
      let iterator = this.selectedEvent.services.values(); 
      for (let elements of iterator) { 
      searched_values.push(elements)
      } 
      queueService
        .getForService({"services":searched_values.toString()})
        .then(
          function (data) {   
            data.queues.forEach((obj) => {
          this.queuesList.push({
            id: obj.id,
            name: obj.title,
           });
           });
           
          }.bind(this)
        );
            this.selectedEvent.no_slots = dataEvent.no_slots;
            this.selectedEvent.department_id = dataEvent.department_id;
            if(dataEvent.additionalData) {
              this.selectedEvent.additionalData = JSON.parse(dataEvent.additionalData);
            }
            // this.activeEditPrompt = true;
            this.$refs.AddCustomerCustomizerBookingUpdate.update_prop(this.selectedEvent,"booking_update");
                        this.$refs.AddCustomerCustomizerBookingUpdate.show();


            this.hideLoading();
          }.bind(this)
        );
    },
    getAvailableSlots(target) {
      
      this.showLoading();
      let date = target == "create" ? this.start : this.selectedEvent.date;
      let dep =
        target == "create"
          ? this.targetDepartment
          : this.selectedEvent.department_id;
      this.availableSlots = [];
      bookingService
        .availableSlots(date, { department: dep })
        .then(
          function (data) {
            if (target == "create") {
              this.slotsLeft = data.available;
            } else {
              this.selectedEvent.slotsLeft = data.available;
            }

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
          }.bind(this)
        );
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
      bookingService
        .create(booking)
        .then(
          function () {
            this.getAllBookings();
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
      this.activePrompt2 = false;
    },
    updateEvent() {
      this.activeEditPrompt = true;
      this.showLoading();

      this.selectedEvent.start_time = !this.selectedEvent.start_time
        ? this.working_days[this.$moment().weekday()].start_time
        : this.selectedEvent.start_time;

      let booking = {
        id: this.selectedEvent.id,
        customer_id: this.selectedEvent.customer,
        no_slots: this.selectedEvent.noSlots,
        start_datetime: this.$moment(
          this.selectedEvent.date + " " + this.selectedEvent.time
        ).format("YYYY-MM-DD HH:mm:ss"),
        end_datetime: this.$moment(
          this.selectedEvent.date + " " + this.selectedEvent.time
        )
          .add(this.selectedEvent.duration, "minutes")
          .format("YYYY-MM-DD HH:mm:ss"),
        services: this.selectedEvent.services.join(),
        additionalData : JSON.stringify(this.selectedEvent.additionalData),
        queue_target: this.selectedEvent.queue_auto_call

      };
      bookingService
        .update(booking)
        .then(
          function (data) {
            let booking = data.booking;

            this.events.forEach(
              function (obj, i) {
                if (obj.data.id == booking.id) {
                  let updatedEvent = {
                    title: booking.fname + " " + booking.lname,
                    allDay: false,
                    start: this.$moment(booking.start_datetime)._i,
                    end: this.$moment(booking.end_datetime)._i,
                    color: obj.color,
                    textColor: "#fff",
                    data: booking,
                  };
                  this.events.splice(i, 1);
                  this.events.push(updatedEvent);
                }
              }.bind(this)
            );

            this.notify(
              this.$t("Toasts.Successful"),
              this.$t("Booking.EditPrompt.ToastSuccess"),
              "success"
            );
            this.activeEditPrompt = false;
          }.bind(this)
        )
        .catch(
          function () {
            this.notify(
              this.$t("Toasts.Error"),
              this.$t("Booking.EditPrompt.ToastFail"),
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
    refresh_bookings(){
      this.getAllBookings();
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
    pushToQueue() {
      this.showLoading();
      let customer = {
        booking_time: this.selectedEvent.time.toString(),
        queue_id: this.targetQueue,
        services: this.selectedTargetServices.join(),
        customer_id: this.selectedEvent.customer,
        member_id: -1,
        create_customer: 0,
      };
      queueService
        .push(customer)
        .then(
          function () {
            this.notify(
              this.$t("Toasts.Successful"),
              this.$t("Components.Queue.AddCustomerPrompt.ToastSuccessMessage"),
              "success"
            );
          }.bind(this)
        )
        .catch(
          function () {
            this.notify(
              this.$t("Toasts.Error"),
              this.$t("Components.Queue.AddCustomerPrompt.ToastErrorMessage"),
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
    allowRedirect(date) {
      let today = new Date();
      let eventDate = new Date(date);
      return !(
        today.getFullYear == eventDate.getFullYear &&
        today.getMonth() == eventDate.getMonth() &&
        today.getDay() == eventDate.getDay()
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
    createHasSlots() {
      return this.slotsLeft > 0;
    },
    updateHasSlots() {
      return this.selectedEvent.slotsLeft > 0;
    },
    ...mapState({
      business_info: (state) => state.account.user.business,
      working_days: (state) => state.account.user.working_days,
    }),
  },
  components: {
    FullCalendar,
    BookingRequestItem,
    CustomerSelectFilter,
    CustomizerAddCustomer,
    
  },
  mounted() {
    this.coordinates.lat = parseFloat(this.business_info.lat);
    this.coordinates.lng = parseFloat(this.business_info.lng);

    let calendarApi = this.$refs.fullCalendar.getApi();

    calendarApi.setOption(
      "locale",
      localStorage.getItem("Language") == "ar"
        ? "ar-tn"
        : localStorage.getItem("Language")
    );
    calendarApi.setOption(
      "dir",
      localStorage.getItem("Language") == "ar" ? "rtl" : "ltr"
    );
    calendarApi.setOption("eventLimit", 6);
    calendarApi.setOption("eventLimitText", this.$t("Booking.Calendar.More"));
    //calendarApi.setOption('displayEventTime', false);
    this.buttonText = {
      today: this.$t("Booking.Calendar.Today"),
      month: this.$t("Booking.Calendar.Month"),
      week: this.$t("Booking.Calendar.Week"),
      day: this.$t("Booking.Calendar.Day"),
      list: this.$t("Booking.Calendar.List"),
    };
    window.globalThis = this;
    
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
        data.services.forEach((obj) => {
          this.servicesList.push({
            id: obj.id,
            name: obj.title,
            duration: obj.duration,
          });
        });
        if (this.servicesList.length == 1) {
          this.services = this.servicesList[0];
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
      this.selectedEvent = this.events[0];

    businessService.getAllHolidays().then(function (data) {
        this.holidays= data.holidays.map((element)=>{
          if(element.member_id==0){
            let now = moment()
  
            let fromDate = moment(element.start_date)
            let toDate = moment(element.end_date)
  
            // if (fromDate > now && toDate > now) {
              while (fromDate <= toDate) {
                let ld = fromDate.format('YYYY-MM-DD')
                console.log(ld)
                fromDate = moment(fromDate).add(1,'days');
                $("[data-date="+ld+"]").css('background-color', '#a4ff80')
              }
            // }
            return element;
          }
        });
    }.bind(this));
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
.comp-full-calendar {
  max-width: 100%;
}
.full-calendar-header .header-center .title {
  font-size: 18px;
  font-weight: 600;
}
.full-calendar-header .header-center .prev-month,
.full-calendar-header .header-center .next-month {
  padding: 9px 14px;
  border-radius: 100%;
  border: 1px solid #dadada;
}
.full-calendar-body
  .dates
  .dates-events
  .events-week
  .events-day
  .event-box
  .event-item {
  background-color: rgba(var(--vs-primary), 1);
  color: #fff;
}
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

.fc-day-grid-event{
  color: #fff !important;
  font-size: 18px !important;
  border: 1px solid #fff !important;
}
</style>