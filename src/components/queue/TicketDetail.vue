<template>
  <div>
     <vs-tabs alignment="fixed">
        <vs-tab :label="$t('Customer.Tabs.Ticket')">

                <div class="Ticket ">
        <vs-row>
        <vs-col vs-lg="12" class="border-bottom text-center mb-2 pb-2">
          <h2 v-if="ticket.fname || ticket.lname">{{ticket.fname}} {{ticket.lname}}</h2>
          <h2 v-if="!(ticket.fname || ticket.lname)">{{$t('Components.Queue.TicketItem.Anonymous')}}</h2>
          <p>
            <span v-if="ticket.phone_number && ticket.phone_number.length" class="border-right pr-2">
              <i class="mdi mdi-phone"></i> {{ticket.phone_number}}
            </span>
            <span v-if="ticket.internal_id" class="ml-2">
              <i class="mdi mdi-information"></i> {{ticket.internal_id}}
            </span>
          </p>
          <p v-if="ticket.notes && ticket.notes.length" class="border border-danger p-2 text-danger">
            {{ticket.notes}}
          </p>

        </vs-col>
      </vs-row>
      <vs-row class="border-bottom">
        <vs-col vs-lg="6" vs-xs="6" class="mb-2 pb-2 border-right text-center">
          <h2 class="">#{{rank}}</h2>
          <small class="text-cyan">{{$t('Components.Queue.TicketItem.Rank')}}</small>
        </vs-col>
        <vs-col vs-lg="6" vs-xs="6" class="mb-2 pb-2 text-center">
          <h2 class="">{{ticket.public_identifier}}</h2>
          <small class="text-cyan">{{$t('Components.Queue.TicketItem.TicketNumber')}}</small>
        </vs-col>
      </vs-row>
      <vs-row class="mt-2 mb-2 pt-2 pb-2 border-bottom">
        <vs-col vs-lg="6" vs-xs="6" class="mr-0 border-right text-center">
          <h2 class="">{{waitingTimeFormated}}</h2>
          <small class="text-cyan">{{$t('Components.Queue.TicketItem.EstimatedWaitingTime')}}</small>
        </vs-col>
        <vs-col vs-lg="6" vs-xs="6" class="mr-0 text-center">
          <h2 class="">{{ticket.checkinTime.substring(0,5)}}</h2>
          <small class="text-cyan">{{$t('Components.Queue.TicketItem.CheckInTime')}}</small>
        </vs-col>
      </vs-row>
                </div>
      <vs-row  class="mt-2 mb-2 pt-2 pb-2">
        <vs-col vs-w="12" class="pl-4 text-center">
          <h4>{{$tc('Shared.Service', ticket.service_names.split(",").length)}}: </h4>
          <p>{{ticket.service_names}}</p>
        </vs-col>

        <vs-col vs-w="12" class="text-center" v-if="choosable && ticket.member_id != -1">
          <div class="d-flex align-items-center text-center border border-dark">
            <vs-avatar class="" :src="ticket.requested_member.photo ? ticket.requested_member.photo : require('@/assets/images/users/1.jpg')" size="42px"></vs-avatar>
            <h4 class="pl-4">{{ticket.requested_member.fname}} {{ticket.requested_member.lname}}</h4>
          </div>
        </vs-col>
      </vs-row>
      <vs-row>
        <vs-col vs-w="12">
          <span class="d-flex mb-4 mt-0">
            <vs-switch color="danger" id="urgency" v-model="ticket.urgent" @change="updateUrgentStatus"/>
            <label for="urgency" class="ml-2 mb-0">{{$t('Components.Queue.TicketPopup.Actions.UrgentSwitch')}}</label>
          </span>
        </vs-col>
        <vs-col vs-w="12">
          <vs-select
                     :placeholder="$t('Components.Queue.TicketPopup.Actions.Placeholder')"
                     class="w-100 mb-4"
                     :label="$t('Components.Queue.TicketPopup.Actions.Label')"
                     v-model="action"
                     @change="actionChange"
          >
            <vs-select-item value="redirect" :text="$t('Components.Queue.TicketPopup.Actions.Redirect')"/>
            <vs-select-item value="pushback" :text="$t('Components.Queue.TicketPopup.Actions.PushBack')"/>
            <vs-select-item value="swap" :text="$t('Components.Queue.TicketPopup.Actions.Swap')"/>
            <vs-select-item v-if="choosable" value="selectmember" :text="$t('Components.Queue.TicketPopup.Actions.UpdateMember')"/>
            <vs-select-item value="noshow" :text="$t('Components.Queue.TicketPopup.Actions.NoShow')"/>
            <vs-select-item value="note" :text="$t('Components.Queue.TicketPopup.Actions.AddNotes')"/>
            <vs-select-item value="delete" :text="$t('Components.Queue.TicketPopup.Actions.Delete')"/>
          </vs-select>
        </vs-col>
        <vs-col vs-w="12" v-if="updateMemberActive">
          <vs-checkbox class="justify-content-start w-100 mb-4" v-model="selectMember">
            {{$t('Components.Queue.AddCustomerPrompt.MemberCheckboxLabel')}}
          </vs-checkbox>

          <vs-select v-if="selectMember"
                     :placeholder="$t('Components.Queue.AddCustomerPrompt.MemberPlaceholder')"
                     class="w-100 mb-4"
                     :label="$t('Components.Queue.AddCustomerPrompt.MemberLabel')"
                     autocomplete
                     v-model="member"
          >
            <vs-select-item :key="'member_'+index" :value="item.id" :text="item.fname+' '+item.lname" v-for="(item,index) in members" />
          </vs-select>
        </vs-col>

        <vs-col vs-w="12" v-if="swapActive">
          <vs-select :placeholder="$t('Components.Queue.TicketPopup.SwapPlaceholder')"
                     class="w-100 mb-4"
                     :label="$t('Components.Queue.TicketPopup.SwapLabel')"
                     autocomplete
                     v-model="swapTicket"
          >
            <vs-select-item :key="'ticket_'+index" :value="item.ticket_id" :text="(item.fname ? item.fname+' '+item.lname : $t('Components.Queue.TicketItem.Anonymous'))+ (item.phone_number ? '( ' + item.phone_number+' )' : '')" v-for="(item,index) in waiting_list" />
          </vs-select>
        </vs-col>

        <vs-col vs-w="12" v-if="addNoteActive">
          <vs-textarea counter="500" class="w-100" :label="$t('Customer.Notes')"
                  :placeholder="$t('Customer.Notes')" :description-text="$t('Customer.NotesHint')" v-model="ticket.notes" />
        </vs-col>


        <vs-col vs-w="12">

          <vs-button @click="close()" type="border" color="primary" class="border-0 border-bottom mr-4"> {{$t('Components.Queue.AddCustomerPrompt.CancelButton')}} </vs-button>
          <vs-button @click="submitAction" :disabled="false" color="primary" class="pr-5 pl-5 float-right"> {{$t('Components.Queue.TicketPopup.Actions.SubmitButton')}} </vs-button>
 
        </vs-col>
        <vs-col vs-lg="12">
          <vs-popup :title="$t('Components.Queue.TicketPopup.RedirectTitle')" :active.sync="redirectPopupActive">
            <vs-select
                    :placeholder="$t('Components.Queue.TicketPopup.RedirectTargetQueuePlaceholder')"
                    class="w-100 mb-4"
                    :label="$t('Components.Queue.TicketPopup.RedirectTargetQueueLabel')"
                    autocomplete
                    v-model="queue"
            >
              <vs-select-item :key="index" :value="queue.id" :disabled="queue.id == queue_id" :text="queue.title" v-for="(queue,index) in queues" />
            </vs-select>

            <vs-checkbox class="justify-content-start w-100 mb-4" v-model="keepTicket">
              {{$t('Components.Queue.TicketPopup.KeepSameTicket')}}
            </vs-checkbox>

            <vs-button color="success" type="filled" class="w-100" @click="redirectCustomer">
              <i class="mdi mdi-directions"></i> {{$t('Components.Queue.TicketPopup.RedirectButton')}}
            </vs-button>
          </vs-popup>
        </vs-col>
      </vs-row>
        </vs-tab>

        <vs-tab :label="$t('Customer.Tabs.Customer')" @click="getCustomer">
          <CustomerDetails :selected="customer">
          </CustomerDetails>
                    <vs-button @click="close()" type="border" color="primary" class="border-0 border-bottom mr-4"> {{$t('Components.Queue.AddCustomerPrompt.CancelButton')}} </vs-button>

        </vs-tab>
        <vs-tab :label="$t('Customer.Tabs.ArchiveQueue')">

           <QueueArchive v-if="archive" :data_archive ="archive">
                </QueueArchive>
                <vs-button @click="close()" type="border" color="primary" class="border-0 border-bottom mr-4"> {{$t('Components.Queue.AddCustomerPrompt.CancelButton')}} </vs-button>

        </vs-tab>


              </vs-tabs>

      

  </div>
  
</template>
<script>
import PageViewsData from '../../views/widgets/chart-widgets/page-views/PageViewsData.vue';

import {queueService,customerService} from "../../_services";
import CustomerDetails from "../../components/shared/CustomerDetails"
import QueueArchive from "../../components/shared/CustomerQueueArchive"

export default {
  
  name: "TicketDetailsPopup",
  data: () => ({
    title: "TicketDetailsPopup",
    isActive: false,
    redirectPopupActive: false,
    swapActive: false,
    keepTicket: false,
    updateMemberActive: false,
    addNoteActive: false,
    showHistory: false,
    queue_id: 0,
    member: -1,
    customer: {},
    archive: [],
    queues: [],
    waiting_list: [],
    queue: {},
    action: null,
    selectMember: 0,
    swapTicket: 0
  }),
  props: {
    ticket: Object,
    rank: Number,
    members: Array,
    choosable: Boolean
  },
  methods: {
    notify(title, text, type) {
      this.$vs.notify({
        color: type,
        title: title,
        text: text
      });
    },
    showLoading(){
      this.$vs.loading({
        container: '#queue-box',
        scale: 0.6
      });
    },
    hideLoading(){
      this.$vs.loading.close('#queue-box > .con-vs-loading')
    },
    close(){
      this.$emit('updateSidebar', 'close');
    },
    show(){
      this.isActive = true;
    },
    hide(){
      this.isActive = false
    },
 

    deleteTicket() {

      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: this.$t('Components.Queue.TicketItem.Delete.Title'),
        text: this.$t('Components.Queue.TicketItem.Delete.Text'),
        acceptText: this.$t('Toasts.AcceptButton'),
        cancelText: this.$t('Toasts.CancelButton'),
        accept: function () {
          this.showLoading();
          let ticket = {
            queue_id: this.queue_id,
            customer_id: this.ticket.id
          };
          queueService.revokeTicket(ticket).then(function (data) {
            this.hide();
            console.log(data);
            // this.$emit('delete');
            this.notify(this.$t('Toasts.Successful'), this.$t('Components.Queue.TicketItem.Delete.ToastSuccess'), 'success');
          }.bind(this)).catch(function () {
            this.notify(this.$t('Toasts.Error'), this.$t('Components.Queue.TicketItem.Delete.ToastFail'), 'danger');
          }.bind(this)).finally(function () {
            this.hideLoading();
            this.refreshWaitingList();
          }.bind(this));
        }.bind(this)
      });
    },
    getCustomer(){

    },
    pushBack() {
      this.$vs.dialog({
        type: 'confirm',
        color: 'primary',
        title: this.$t('Components.Queue.TicketItem.PushBack.Title'),
        text: this.$t('Components.Queue.TicketItem.PushBack.Text'),
        acceptText: this.$t('Toasts.AcceptButton'),
        cancelText: this.$t('Toasts.CancelButton'),
        accept: function () {
          this.showLoading();
          queueService.pushBack(this.queue_id, this.ticket.ticket_id).then(function () {
            this.hide();
            this.$emit('change');
            this.notify(this.$t('Toasts.Successful'), this.$t('Components.Queue.TicketItem.PushBack.ToastSuccess'), 'success');
          }.bind(this)).catch(function () {
            this.notify(this.$t('Toasts.Error'), this.$t('Components.Queue.TicketItem.PushBack.ToastFail'), 'danger');
          }.bind(this)).finally(function () {
            this.hideLoading();
            this.refreshWaitingList();
          }.bind(this))
        }.bind(this)
      });
    },
    markAsNoShow() {
      this.$vs.dialog({
        type: 'confirm',
        color: 'dark',
        title: this.$t('Components.Queue.TicketItem.NoShow.Title'),
        text: this.$t('Components.Queue.TicketItem.NoShow.Text'),
        acceptText: this.$t('Toasts.AcceptButton'),
        cancelText: this.$t('Toasts.CancelButton'),
        accept: function () {
          this.showLoading();
          queueService.markAsNoShow(this.queue_id, this.ticket.id).then(function () {
            this.hide();
            this.$emit('delete');
            this.notify(this.$t('Toasts.Successful'), this.$t('Components.Queue.TicketItem.NoShow.ToastSuccess'), 'success');
          }.bind(this)).catch(function () {
            this.notify(this.$t('Toasts.Error'), this.$t('Components.Queue.TicketItem.NoShow.ToastFail'), 'danger');
          }.bind(this)).finally(function () {
            this.hideLoading();
            this.refreshWaitingList();
          }.bind(this))
        }.bind(this)
      });
    },
    swapCustomers() {
      this.$vs.dialog({
        type: 'confirm',
        color: 'primary',
        title: this.$t('Components.Queue.TicketItem.SwapCustomers.Title'),
        text: this.$t('Components.Queue.TicketItem.SwapCustomers.Text'),
        acceptText: this.$t('Toasts.AcceptButton'),
        cancelText: this.$t('Toasts.CancelButton'),
        accept: function () {
          this.showLoading();
          queueService.swap(this.queue_id, this.ticket.ticket_id, this.swapTicket).then(function () {
            this.hide();
            this.$emit('change');
            this.notify(this.$t('Toasts.Successful'), this.$t('Components.Queue.TicketItem.SwapCustomers.ToastSuccess'), 'success');
          }.bind(this)).catch(function () {
            this.notify(this.$t('Toasts.Error'), this.$t('Components.Queue.TicketItem.SwapCustomers.ToastFail'), 'danger');
          }.bind(this)).finally(function () {
            this.hideLoading();
            this.refreshWaitingList();
          }.bind(this))
        }.bind(this)
      });
    },
    redirectCustomer(){

      this.showLoading();
      this.redirectPopupActive = true;

      let ticket = {
        queue_id: this.queue_id,
        customer_id: this.ticket.id,
        target_id: this.queue,
        keepTicket: this.keepTicket ? 1 : 0
      };
      queueService.redirect(ticket).then(function () {
        this.redirectPopupActive = false;
        this.hide();
        this.$emit('delete');
        this.redirectPopupActive = false;
        this.notify(this.$t('Toasts.Successful'), this.$t('Components.Queue.TicketItem.Redirect.ToastSuccess'), 'success');
      }.bind(this)).catch(function () {
        this.notify(this.$t('Toasts.Error'), this.$t('Components.Queue.TicketItem.Redirect.ToastFail'), 'danger');
      }.bind(this)).finally(function () {
        this.hideLoading();
        this.refreshWaitingList();
      }.bind(this));
    },
    submitAction(){
      this.close();
      switch (this.action) {
        case 'delete':
          this.deleteTicket();
          this.refreshWaitingList();
          break;
        case 'redirect':
          this.redirectPopupActive = true;
          break;
        case 'pushback':
          this.pushBack();
          this.refreshWaitingList();
          break;
        case 'swap':
          this.swapCustomers();
          this.refreshWaitingList();
          break;
        case 'note':
          this.updateNotes();
          this.refreshWaitingList();
          break;
        case 'noshow':
          this.markAsNoShow();
          this.refreshWaitingList();
          break;
        case 'selectmember':
          this.submitUpdateMember();
          this.refreshWaitingList();
          break;
      }
    },
    refreshWaitingList(){
      this.$emit("refreshWaitingList","refreshWaitingList");
    },
    actionChange(){

      // Close everything first
      this.swapActive = false;
      this.updateMemberActive = false;

      switch (this.action) {
        case 'swap':
          this.swapActive = true;
          queueService.getWaitingList(this.$route.params.id).then(function (data) {
            this.waiting_list = data.waiting_list.filter(function (obj) {
              return obj.ticket_id != this.ticket.ticket_id
            }.bind(this));
          }.bind(this))
          break;
        case 'selectmember':
          this.updateMemberActive = true;
          break;
        case 'note':
          this.addNoteActive = true;
          break;
      }
    },
    submitUpdateMember(){
      this.showLoading();
      let payload = {
        member_id: this.selectMember ? (this.member != -1 ? this.member : -1) : -1,
      };
      queueService.updateMember(this.queue_id, this.ticket.ticket_id, payload).then(function () {
        this.redirectPopupActive = false;
        this.hide();
        this.$emit('update');
        this.redirectPopupActive = false;
        this.notify(this.$t('Toasts.Successful'), this.$t('Components.Queue.TicketItem.Redirect.ToastSuccess'), 'success');
      }.bind(this)).catch(function () {
        this.notify(this.$t('Toasts.Error'), this.$t('Components.Queue.TicketItem.Redirect.ToastFail'), 'danger');
      }.bind(this)).finally(function () {
        this.hideLoading();
        this.refreshWaitingList();
      }.bind(this));
    },
    updateNotes(){
      this.showLoading();
      let payload = { notes: this.ticket.notes };
      queueService.addNote(this.queue_id, this.ticket.ticket_id, payload).then(function () {
        this.hide();
        this.$emit('update');
        this.notify(this.$t('Toasts.Successful'), this.$t('Components.Queue.TicketItem.Redirect.ToastSuccess'), 'success');
      }.bind(this)).catch(function () {
        this.notify(this.$t('Toasts.Error'), this.$t('Components.Queue.TicketItem.Redirect.ToastFail'), 'danger');
      }.bind(this)).finally(function () {
        this.hideLoading();
        this.refreshWaitingList();
      }.bind(this));
    },
    reset(){
      this.action = null;
      this.redirectPopupActive = false;
      this.swapActive = false;
      this.updateMemberActive = false;
      this.member = -1;
      this.queue = {};
      this.selectMember = 0;
      this.swapTicket = 0;
    },
    updateUrgentStatus(){
      this.showLoading();
      queueService.updateUrgentStatus(this.queue_id, this.ticket.ticket_id, {urgent: this.ticket.urgent}).finally(function () {
        this.hideLoading();
        this.hide();
        this.$emit('change');
        this.refreshWaitingList();
      }.bind(this));
    }
  },
  computed: {
    waitingTimeFormated: function () {
      return this.$moment().startOf('day').add(this.ticket.cumulative_waiting_time, 'minutes').format('HH:mm');
    }
  },
  mounted() {
    this.selectMember = this.ticket.member_id ? 1 : 0;
    this.member = this.ticket.member_id ? this.ticket.member_id : -1;
    this.queue_id = this.$route.params.id;
    queueService.getAllWithSummary().then(function (data) {
      this.queues = data.queues.map(obj => {
        return obj.queue;
      });   
    }.bind(this))
    let customer = {
        customer_id:this.ticket.id
      }
     customerService.getArchivedTickets(customer).then(function (data) {
      this.archive = data;
    }.bind(this));
        customerService.getById(this.ticket.id).then(function (data){
          this.customer=data.customer;
        }.bind(this))
        },
  components:{
    CustomerDetails,
    QueueArchive
  }
};
</script>
<style>
  .ticketPopup > .vs-popup{
    width: 400px;
  }
    .animation {
    transition: all 0.5s;
  }
</style>