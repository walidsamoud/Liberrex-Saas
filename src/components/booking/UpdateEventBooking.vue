<template>
        <div class >
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
        <vs-tabs alignment="fixed"   >
        <vs-tab :label="$t('Customer.Tabs.Booking')">
            <div class="text-center">
            <h4 class="mb-4">{{selectedEvent.fullName}}</h4>
          </div>
          <vs-select
            v-if="departments.length>0"
            v-model="selectedEvent.department_id"
            :placeholder="$t('Booking.CreatePrompt.ChooseTargetDepartment')"
            :label="$t('Booking.CreatePrompt.DepartmentLabel')"
            :disabled="!admin"
            class="w-100 mb-3"
          >
            <vs-select-item
              :key="index"
              :value="item.id"
              :text="item.name"
              v-for="(item,index) in departments"
            />
          </vs-select>
          <div class="member" v-if="selectedEvent.member!=null">
                  <div class="d-flex align-items-center booked-for">
                    <span>
                      <b class="title">{{$t('Booking.Table.BookedFor')}}:</b><br><br>
                      <img class="booked-for-image" :src="selectedEvent.member.photo!=null && selectedEvent.member.photo!='' ? selectedEvent.member.photo : require('@/assets/images/users/1.jpg')" alt="User"/>
                      {{ selectedEvent.member.fname }} {{ selectedEvent.member.lname }}
                    </span>
                  </div><br>
          </div>
          <vs-input
            :label="$t('Booking.CreatePrompt.StartDate')"
            timezone="FR-fr"
            :min="new Date().toISOString().split('T')[0]"
            type="date"
            class="w-100 mb-3"
            v-model="selectedEvent.date"
            @change="getAvailableSlots('edit')"
          />

          <vs-alert :active="selectedEvent.no_slots==1" class="mb-3" color="primary">
            {{$t('Booking.CreatePrompt.BookingsAvailable')}}:
            <b>{{selectedEvent.slotsLeft}}</b>
          </vs-alert>

          <!-- <vs-checkbox
            class="justify-content-start w-100 mb-3"
            v-model="selectedEvent.no_slots"
          >{{$t('Booking.CreatePrompt.WithoutSlots')}}</vs-checkbox> -->
          
          <vs-row>
            <vs-col vs-w="12">
              <vs-select
                :placeholder="selectedEvent.time"
                class="w-100 mb-3"
                :label="$t('Booking.CreatePrompt.TimeLabel')"
                v-model="selectedEvent.time"
                v-if="!selectedEvent.no_slots"
              >
                <vs-select-item
                  :key="index"
                  :value="item.value"
                  :disabled="item.status==0"
                  :text="item.value"
                  v-for="(item,index) in availableSlots"
                />
              </vs-select>
            </vs-col>
          </vs-row>

          

          <vs-select v-if="servicesList_bool"
            :placeholder="$t('Booking.CreatePrompt.ServicePlaceholder')"
            class="w-100 mb-3"
            :label="$t('Booking.CreatePrompt.ServiceLabel')"
            autocomplete
            multiple
            v-model="selectedEvent.services"
            @change="getQueuesForServices()"

          >
            <vs-select-item
              :key="index"
              :value="item.id"
              :text="item.name"
              v-for="(item,index) in servicesList"
            />
          </vs-select>
          

                
          <vs-select
            :placeholder="$t('Booking.CreatePrompt.QueuePlaceholder')"
            class="w-100 mb-2"
            :label="$t('Booking.Queue')"
            autocomplete
            v-model="selectedEvent.queue_auto_call"
          >
            <vs-select-item
              :key="index"
              :value="item.id"
              :text="item.name"
              v-for="(item,index) in queuesList"
            />
          </vs-select>
          <vs-checkbox
            v-if="selectedEvent.additionalData"
            class="justify-content-start w-100 mb-3"
            v-model="showAdditionalData"
          >{{$t('Booking.CreatePrompt.ShowAdditionalData')}}</vs-checkbox>
          
          <vs-row v-if="showAdditionalData == true">
            <vs-col vs-w="12">
              <vs-input
                v-if="selectedEvent.additionalData.lat"
                :label="$t('Forms.Booking.Lat')"
                v-model="selectedEvent.additionalData.lat"
                class="w-100 mb-3"
              />
              <vs-input
                v-if="selectedEvent.additionalData.lng"
                :label="$t('Forms.Booking.Lng')"
                v-model="selectedEvent.additionalData.lng"
                class="w-100 mb-3"
              />
            </vs-col> 
            <vs-col vs-w="12" v-for="(item,index_inputs) in selectedEvent.additionalData" :key="index_inputs"> 
                <vs-input
                  v-if="typeof item === 'object' && $i18n.locale == 'en'"
                  :label="item.en"
                  v-model="item.Data"
                  class="w-100 mb-3"
                />
                <vs-input
                  v-if="typeof item === 'object' && $i18n.locale == 'fr'"
                  :label="item.fr"
                  v-model="item.Data"
                  class="w-100 mb-3"
                />
                <vs-input
                  v-if="typeof item === 'object' && $i18n.locale == 'ar'"
                  :label="item.ar"
                  v-model="item.Data"
                  class="w-100 mb-3"
                />
                <vs-input
                  v-if="typeof item === 'object' && $i18n.locale == 'ru'"
                  :label="item.ru"
                  v-model="item.Data"
                  class="w-100 mb-3"
                />
            </vs-col>
          </vs-row>



          <vs-row>
            <vs-col vs-w="4">

              <vs-button
                color="warning"
                type="gradient"
                icon="directions"
                @click="redirectToQueue(selectedEvent)"
                class="w-100 mb-2"
              >{{$t('Booking.EditPrompt.RedirectButton')}}</vs-button>
            </vs-col>
            <vs-col vs-w="4">
              <vs-button
                color="danger"
                type="gradient"
                icon="delete"
                @click="deleteBooking"
                class="w-100 mb-2"
              >{{$t('Booking.EditPrompt.DeleteButton')}}</vs-button>
                          </vs-col>
            <vs-col vs-w="4">
              <vs-button
                color="primary"
                type="gradient"
                @click="updateEvent()"
                class="w-100 mb-2"
              >{{$t('Booking.EditPrompt.SubmitButton')}}</vs-button>
            </vs-col>
          </vs-row>
        </vs-tab>

        <vs-tab :label="$t('New.BookingPayment')">
            <BookingPayment 
              :booking_id="selectedEvent.id" 
              :customer="selectedEvent.customer" 
              :services="servicesList.filter((obj)=>{ if(selectedEvent.services.find(x => x === obj.id))return true; else return false; })" 
            />
        </vs-tab>

        <vs-tab :label="$t('Customer.Tabs.Attachments')+' ('+selectedEvent.files.length+')'" @click="getCustomer">
            <vs-row class="mt-2">
                <vs-col vs-lg="12" vs-xs="12" vs-sm="12" v-for="(file, index) in selectedEvent.files" :key="index">
                    <vs-button
                            @click="openFile('data:'+file.mime+';base64,'+file.base64)"
                            color="light"
                            size="large"
                            class="m-2 w-100 btn-outline-light text-dark"
                    ><i class="mdi mdi-attachment"></i> {{file.title}}</vs-button>
                </vs-col>
            </vs-row>
            <vs-button @click="close()" type="border" color="primary" class="border-0 border-bottom mr-4"> {{$t('Components.Queue.AddCustomerPrompt.CancelButton')}} </vs-button>
        </vs-tab>

        <vs-tab :label="$t('Customer.Tabs.Customer')" @click="getCustomer">
            <CustomerDetails :selected="customer"></CustomerDetails>
            <vs-button @click="close()" type="border" color="primary" class="border-0 border-bottom mr-4"> {{$t('Components.Queue.AddCustomerPrompt.CancelButton')}} </vs-button>
        </vs-tab>

        <vs-tab :label="$t('Customer.Tabs.ArchiveBooking')">
            <Bookings :customer="selectedEvent.customer" bookings_type="archived_bookings">
                </Bookings>
          <vs-button @click="close()" type="border" color="primary" class="border-0 border-bottom mr-4"> {{$t('Components.Queue.AddCustomerPrompt.CancelButton')}} </vs-button>

        </vs-tab>
      </vs-tabs>
      <vs-popup
        fullscreen
        :title="$t('Components.Booking.RequestItem.File')"
        :active.sync="filePopupActive"
        style="z-index : 100000"
      >
        <iframe style="width: 100%;height: 720px;" :src="file"></iframe>
      </vs-popup>
    </div>
    
</template>

<script>
import {
  queueService,
  bookingService,
  customerService,
  privateServiceService,
  departmentService,
} from "../../_services";
import CustomerDetails from "../../components/shared/CustomerDetails"
import { mapState } from "vuex";
import Bookings from "../../components/shared/CustomerBookings"
import BookingPayment from "../../components/shared/BookingPayment"

export default {
     name: "Calendar",
    data: () => ({
        showAdditionalData : false,
        departments: [],
        availableSlots: [],
        file: "",
        filePopupActive: false,
        events:[],
        // selectedEvent: {},
        queuesList: [],
        servicesList: [],
        customer: {},
        targetQueueServices: [],
        targetQueue: null,
        servicesList_bool: false,
        activeQueuePrompt: false,
        selectedTargetServices: [],
        queues: [],
        admin: false,

    }),
    props:{
    selectedEvent: Object,
    servicesListProp: Array,
},
methods:{
    allowRedirect(date) {
      let today = new Date();
      let eventDate = new Date(date);
      return !(
        today.getFullYear == eventDate.getFullYear &&
        today.getMonth() == eventDate.getMonth() &&
        today.getDay() == eventDate.getDay()
      );
    },
      openFile(file) {
      this.file = file;
      this.filePopupActive = true;
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
            this.close();
            this.getAllBookings();
            this.notify(
              this.$t("Toasts.Successful"),
              this.$t("Booking.EditPrompt.ToastSuccess"),
              "success"
            );
            // 
            // this.activeEditPrompt = false;
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
            // window.location.reload();
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
     redirectToQueue(selectedEvent) {
      // this.activeEditPrompt = false;
      // this.showLoading();
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
    deleteBooking(){
        this.close();
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
    showLoading() {
      this.$vs.loading({
        container: "#booking-box",
        scale: 0.6,
      });
    },
    hideLoading() {
      this.$vs.loading.close("#booking-box > .con-vs-loading");
    },
    notify(title, text, type) {
      this.$vs.notify({
        color: type,
        title: title,
        text: text,
      });
    },
    getAllBookings(){
      this.$emit("refresh_bookings","refresh_bookings");
    },
    getAvailableSlots(target) {    
      // this.showLoading();
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
            // this.hideLoading();
          }.bind(this)
        );
    },
    getQueuesForServices(){
      let searched_values = [];
      this.queuesList = [];
      let queue_target_cache;
      let iterator;
          iterator = this.selectedEvent.services.values();
          queue_target_cache = this.selectedEvent.queue_auto_call;
          this.selectedEvent.queue_auto_call="";
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
    // refresh(value){
    //   this.selectedEvent = value;
    // },
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
    getCustomer(){
        if (this.customer.id != this.selectedEvent.customer){
            customerService.getById(this.selectedEvent.customer).then(function (data){
          this.customer=data.customer;
        }.bind(this))
        }
    },
    close(){
      this.$emit('hide', 'close');
    }
},
mounted(){
  // this.showLoading();
    // this.selectedEvent = this.selectedEventProp;
    let department = {};
    this.file= "",
    this.filePopupActive= false,
      department.department = this.selectedEvent.department_id;
    bookingService
        .availableSlots(
          this.$moment(this.selectedEvent.date).format("YYYY-MM-DD"),department
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
            price: obj.price,
          });
        });
        if (this.servicesList.length == 1) {
          this.services = this.servicesList[0];
        }
        this.servicesList_bool = true;
      }.bind(this)
    );
        // console.log(this.selectedEvent);
    // this.hideLoading();
},
components: {
    CustomerDetails,
    Bookings,
    BookingPayment
},
computed: {
    refresh(){
      this.selectedEvent = this.selectedEventprop;
    },
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

};

</script>

<style scoped>
  .booked-for{
    border: 1px solid #eee;
    padding: 10px;
    font-weight: bold;
  }
  .booked-for-image{
    width: 40px;
    border-radius: 50px;
    margin-right: 10px;
  }
</style>