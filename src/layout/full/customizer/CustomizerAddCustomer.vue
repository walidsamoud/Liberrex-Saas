<template>
  <div>
    <vs-sidebar :click-not-close="true"
                :active.sync="activeSidebar"
                position-right parent="body"
                default-index="2"
                color="primary"
                class="customizer-panel"
                spacer v-model="activeSidebar">


            <div class="d-flex">
                <h4 class="font-weight-bold"> {{sideBarTitleVar}}</h4>
                <span @click.stop="away()" class="cursor-pointer ml-auto"><vs-icon icon="close"></vs-icon></span>
            </div>

            <vs-divider></vs-divider>

            <div v-if="queue_prop">
                <AddCustomerQueue
                ref="AddCustomerQueue"
                :teamMembers="teamMembers"
                :queue_id="queue_id"
                :servicesList="servicesList"
                :customer_id="customer_id"
                @updateSidebar="hide"
                @newCustomer="updateSidebar"></AddCustomerQueue>
            </div>
            <div v-if="ticket_prop" :key="ticket.id">
                <TicketDetail
                ref="AddCustomerQueue"
                :teamMembers="teamMembers"
                :queue_id="queue_id"
                :servicesList="servicesList"
                :customer_id="customer_id"
                :members="members"
                :ticket="ticket"
                :rank="rank"
                @archive_queue="updateSidebar"
                @refreshWaitingList="refreshWaitingList"
                @updateSidebar="hide"
                ></TicketDetail>
            </div>

            <div v-if="booking_prop">
                <AddCustomerBooking
                ref="AddCustomerBooking"
                :servicesList="servicesList"
                :customer_id="customer_id"
                @newCustomer="updateSidebar"
                @updateSidebar="hide"
                ></AddCustomerBooking>
            </div>

            <div v-if="customer_prop">
                <AddNewCustomer
                ref="AddCustomerBooking"
                :queue_id="queue_id"
                :booking="booking"
                @updateSidebar ="updateSidebar"
                @hide="hide"
                @customer_id ="customerId"
                ></AddNewCustomer>
            </div>

            <div v-if="customer_archive_queue_prop">
                <CustomerQueueArchive
                ref="CustomerTicketArchive"
                :archive="customer_archive_queue_prop"
                @updateSidebar ="updateSidebar"
                @hide="hide"
                @customer_id ="customerId"
                ></CustomerQueueArchive>
            </div>

            <div v-if="create_kiosk_prop">
                <CreateKiosk
                ref="CreateKiosk"
                @updateSidebar ="updateSidebar"
                @hide="hide"
                ></CreateKiosk>
            </div>

            <div v-if="bookingUpdate_prop" :key="selectedEvent_prop.id">
                <UpdateEventBooking
                ref="UpdateEventBookingref"
                :selectedEvent="selectedEvent_prop"
                :servicesListProp="servicesList"
                
                @updateSidebar ="updateSidebar"
                @hide="hide"
                @refresh_bookings="refresh_bookings"
                ></UpdateEventBooking>
            </div>

            <div v-if="edit_kiosk_prop">
                <EditKiosk
                ref="EditKiosk"
                @updateSidebar ="updateSidebar"
                @hide="hide"
                :kiosk_data_edit ="kiosk_data_prop"
                ></EditKiosk>
            </div>

            <div v-if="customer_summary_prop" :key="selectedCustomer_prop.id">
                <Customer
                ref="Customer"
                :customer ="selectedCustomer_prop"
                @updateSidebar ="updateSidebar"
                @hide="hide"
                ></Customer>
            </div>
            <div v-if="notifyCustomer_prop">
                <Notify
                ref="Notify"
                @updateSidebar ="updateSidebar"
                @hide="hide"
                ></Notify>
            </div>
           
            <div v-if="activeSidebar" class="outside" v-on:click="away()"></div>

          </vs-sidebar>

    <!-- </vs-prompt> -->
  </div>
</template>

<script>

import AddCustomerQueue from '../../../components/queue/AddCustomerQueue'
import TicketDetail from '../../../components/queue/TicketDetail'
import AddCustomerBooking from '../../../components/booking/AddCustomerBooking'
import AddNewCustomer from '../../../components/shared/AddNewCustomer'
import CustomerQueueArchive from '../../../components/queue/QueueArchive'
import CreateKiosk from '../../../components/kiosk/CreateKiosk'
import EditKiosk from '../../../components/kiosk/EditKiosk'
import UpdateEventBooking from "../../../components/booking/UpdateEventBooking";
import Customer from "../../../components/customer/customer";
import Notify from "../../../components/customer/NotifyCustomer ";

// export const close_sidebar = {
//   hide: function(param) {
// this.activeSidebar = false;
// console.log(this.activeSidebar);  }
// };
export default {
  name: "AddCustomerCustomizer",
  data: () => ({
    themeColors: ['#4e31ef', '#36bea6', '#f62d51', '#ffbc34', '#212529'],
	topbarColor: '#2962ff',
	updatedThemeColor: '#2962ff',
    addCustomerIsValid : false,
    title: "AddCustomerCustomizer",
    isActive: false,
    active: "",
    activeSidebar: false,
    queue_prop: false,
    customer_prop: false,
    booking_prop: false,
    ticket_prop: false,
    customer_id: 0,
    sideBarTitleVar: "",
    customer_archive_queue_prop: false,
    create_kiosk_prop: false,
    edit_kiosk_prop: false,
    kiosk_data_prop: {},
    selectedEvent_prop: {},
    selectedCustomer_prop: {},
    customer_summary_prop: false,
    notifyCustomer_prop: false,
    bookingUpdate_prop: false

  }),
  props: {
    activeSidebar_prop: Boolean,
    servicesList: Array,
    teamMembers: Array,
    queue_id: Number,
    booking: Boolean,
    bookingUpdate: Boolean,
    queue: Boolean,
    customer: Boolean,
    sideBarTitle: String,
    members: Array,
    ticket: Object,
    rank: Number,
    customer_archive_queue: Object,
    create_kiosk: Boolean,
    edit_kiosk: Boolean,
    kiosk_data: Object,
    selectedEvent: Object,
    customerSummary: Boolean,
    selectedCustomer: Object,
    notifyCustomer: Boolean,

  },
  methods: {
    
    showLoading(){
      this.$vs.loading({
        container: '#queue-box',
        scale: 0.6
      });
    },
    hideLoading(){
      this.$vs.loading.close('#queue-box > .con-vs-loading')
    },
    show(){
      this.customer_prop = this.customer;
      this.queue_prop = this.queue;
      this.booking_prop = this.booking;
      this.ticket_prop = this.ticket;
      this.customer_archive_queue_prop = this.customer_archive_queue;
      this.sideBarTitleVar = this.sideBarTitle;
      this.create_kiosk_prop = this.create_kiosk;
      this.kiosk_data_prop = this.kiosk_data;
      this.edit_kiosk_prop = this.edit_kiosk;
      // this.selectedEvent_prop = this.selectedEvent;
      // this.selectedCustomer_prop = this.selectedCustomer;
      this.customer_summary_prop = this.customerSummary;
      this.notifyCustomer_prop = this.notifyCustomer;
      this.bookingUpdate_prop = this.bookingUpdate;
      this.activeSidebar = true;


    },
    refresh_bookings(){
      this.$emit("refresh_bookings","refresh_bookings");
    },
    refreshWaitingList(){
      this.$emit("refreshWaitingList","refreshWaitingList");
    },
    update_prop(prop_value,prop_name){
      if (prop_name == "customer"){
        this.selectedCustomer_prop = prop_value;
      }
      else if (prop_name == "sidebar_title"){
        this.sideBarTitleVar = prop_value;
      }
      else if (prop_name == "booking_update"){
        // this.selectedEvent = prop_value;
        this.selectedEvent_prop = prop_value;

        // this.bookingUpdate_prop = true;
        // this.$refs.UpdateEventBookingref.refresh(prop_value);
        // console.log(this.selectedEvent);
      }

    },
    hide(){
      this.activeSidebar = false;
      this.customer_prop = false;
      this.queue_prop = false;
      this.booking_prop = false;
      this.ticket_prop = false;
      this.customer_archive_queue_prop = false;
      this.create_kiosk_prop = false;
      this.kiosk_data_prop = {};
      this.edit_kiosk_prop = false;
      this.selectedEvent_prop = {};
      // this.selectedCustomer_prop = this.selectedCustomer;
      this.customer_summary_prop = false;
      this.notifyCustomer_prop = false;
      this.bookingUpdate_prop = false;

    },
   
    away() {
      this.activeSidebar = false
    },

    customLabel({ title }) {
      
        return `${title}`;
      
    },
    customerId(value){
      this.customer_id = value;
            //console.log(this.customer_id);
    },

    updateSidebar(value){
      //console.log(value);
      if (value[0] == 'customer'){
          if (value[1] == 'booking'){
            this.customer_prop = true;
            this.booking_prop = false;
          }
          else{
            this.customer_prop = true;
            this.queue_prop = false;
          }
          this.sideBarTitleVar = this.$t('Customer.AddCustomerPrompt.Title')
      }
      if (value[0] == 'queue'){
        this.customer_prop = false;
        this.queue_prop = true;
          this.sideBarTitleVar = this.sideBarTitle;
      }
      if (value[0] == 'booking'){
        this.customer_prop = false;
        this.booking_prop = true;
          this.sideBarTitleVar = this.sideBarTitle;
      }
      if(value[0] == 'archive'){
        if (value[1]== 'queue'){
          this.ticket_prop = false;
          this.customer_archive_queue_prop = value[2];
        }

      }
     }
  },
  computed: {
      topbarColorControl: {
            get() { return this.topbarColor; },
            set(val) { this.$emit('updateTopbarColor', val) }
        }

  },
  mounted() {
      // this.queue_prop = this.queue;
      // this.customer_prop = this.customer;
      // this.booking_prop = this.booking;
      // this.activeSidebar = this.activeSidebar_prop;
      // this.sideBarTitleVar = this.sideBarTitle;
      // this.ticket_prop = this.ticket;
  },
 
  components: {
    //CustomerSelectFilter,
    AddCustomerQueue,
    AddCustomerBooking,
    AddNewCustomer,
    TicketDetail,
    CustomerQueueArchive,
    CreateKiosk,
    EditKiosk,
    UpdateEventBooking,
    Customer,
    Notify
  }
};
</script>
<style>
  .multiselect__content-wrapper {
    z-index: 40000;
  }

  .multiselect__option--highlight {
    background: #48b7ff;
    outline: none;
    color: #fff;
    z-index: 40000;

  }
.multiselect__tag {
    outline: none;
    color: rgb(0, 0, 0);
    background: rgb(94, 155, 236);

  }
.multiselect__option {
    outline: none;
    color: rgb(0, 0, 0);
    z-index: 40000;
  }
  .multiselect__tags {
    min-height: 20px !important;
    display: block;
    padding: 6px 40px 0 8px !important;;
    border-radius: 5px;
    border: 1px solid #e8e8e8;
    background: #fff;
    font-size: 14px;
  }
  .multiselect__element{
    z-index: 40000;
  }
  .multiselect__current{
  line-height: 1rem;
  min-height: 2.5rem;
  box-sizing: border-box;
  display: block;
  overflow: hidden;
  padding: 0.5rem 0.75rem 0;
  padding-right: 1.875rem;
  white-space: nowrap;
  margin: 0;
  text-decoration: none;
  border-radius: 0.3125rem;
  border: 1px solid #E8E8E8;
  cursor: pointer;
  }
  .outside {
  width: 49vw;
  height: 100vh;
  position: fixed;
  top: 0px;
  left: 0px;
}



</style>