<template>
  <div style="background-image: url('https://i.pinimg.com/originals/32/b8/77/32b877ed4aa7778cc7d43ebb7d95a6f1.png')">
    <vs-row class="text-white p-3 m-0" style="background: rgba(0,0,0,0.28);">
      <vs-col vs-w="6">
        <h5 style="color: #ffffffa1;">Welcome to</h5>
        <h2>{{queue.title}}</h2>
      </vs-col>
      <vs-col vs-w="2" class="border-left border-light">
        <h1>{{total_waiting}}</h1>
        <h5 style="color: #ffffffa1;">Customers in line</h5>
      </vs-col>
      <vs-col vs-w="2"  class="border-left border-light">
        <h1>{{waitingTimeFormated}}</h1>
        <h6 style="color: #ffffffa1;">Estimated Waiting Time</h6>
      </vs-col>
      <vs-col vs-w="2"  class="border-left border-light">
        <h1 class="mt-1">{{datenow}}</h1>
        <h6 style="color: #ffffffa1;">Time</h6>
      </vs-col>
    </vs-row>
    <vs-row vs-justify="center" id="queue-box" class="mt-4  m-0">
      <vs-col vs-w="6" class="p-4">
        <img src="https://capeoffice.co.za/site/wp-content/uploads/2017/06/video-placeholder.png">
      </vs-col>
      <vs-col vs-w="6" class="p-4">
        <vs-row>

          <vs-col vs-w="12">
            <vs-card :key="index" :item="item" v-for="(item,index) in waiting_list" class="pd-0">
              <vs-row>
                <vs-col vs-lg="6" vs-md="6" vs-sm="6" vs-xs="6" class="mr-0 border-right text-center pd-3">
                  <h1 class="ticket-header">{{item.public_identifier}}</h1>
                  <small class="text-cyan extra-details">{{$t('Components.Queue.TicketItem.Rank')}}</small>
                </vs-col>
                <vs-col vs-lg="6" vs-md="6" vs-sm="6" vs-xs="6" class="mr-0 text-center pd-3">
                  <h1 class="ticket-header">M</h1>
                  <small class="text-cyan extra-details">{{$t('Components.Queue.TicketItem.TicketNumber')}}</small>
                </vs-col>
              </vs-row>
            </vs-card>
          </vs-col>

        </vs-row>
      </vs-col>
    </vs-row>
  </div>
</template>

<script>
import { queueService, queueRequestService } from '../../_services'
import { mapState } from 'vuex'

var getWaitingListCallBack;
var getRequestsCallBack;

export default {
  name: "WaitingList",
  data: () => ({
    title: "Waiting List",
    queue: {
      title: '',
      working_days: [ ],
      services: [],
      counters: [],
      members: [],
    },
    total_waiting: 0,
    waiting_time: 0,
    delayStr: '',
    targetCounter: null,
    requests: [],
    pending: '',
    pendingRequestsPopupActive: false,
    activeChooseCounterPopup: false,
    servicesList: [],
    waiting_list: [],
    datenow: ''

  }),
  methods: {
    notify(title, text, type) {
      this.$vs.notify({
        color: type,
        title: title,
        text: text
      });
    },
    time() {
      this.datenow = this.$moment().format('HH:mm:ss');
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
    openAddCustomerPrompt(){
      this.$refs.addCustomerPrompt.show()
    },
    loadWaitingList(){
      queueService.getWaitingList(this.$route.params.id).then(function (data) {
        this.waiting_list = data.waiting_list;
        this.total_waiting = data.totalWaiting;
        this.waiting_time = data.waiting_time;
      }.bind(this))
    },
    showChooseCounterPopup(){
      this.activeChooseCounterPopup = true;
    },
    callNext(){
      if(this.queue.counters.length > 1 && this.targetCounter == null) {
        this.$vs.dialog({
          type: 'alert',
          color: 'danger',
          title: this.$t('Queue.WaitingList.PleaseChooseCounter'),
          text: this.$t('Queue.WaitingList.PleaseChooseCounterLabel'),
          acceptText: this.$t('Toasts.AcceptButton'),
          cancelText: this.$t('Toasts.CancelButton'),
          buttonAccept: false,
          buttonCancel: true,
        });
        return
      }
      this.showLoading();
      queueService.callNext(this.$route.params.id).then(function () {
        this.loadWaitingList();
        this.notify(this.$t('Toasts.Successful'), this.$t('Queue.WaitingList.CallNextToastSuccess'), 'success');
      }.bind(this)).catch(function () {
        this.notify(this.$t('Toasts.Error'), this.$t('Queue.WaitingList.CallNextToastFail'), 'danger');
      }.bind(this)).finally(function () {
        this.hideLoading();
      }.bind(this));
    },
    getInService(){
      return this.waiting_list.filter(function (obj) {
        return obj.status == 'inservice';
      })
    },
    calculateDelay(){
      let inService = this.getInService()[0];
      if(inService == undefined) return false;
      let statusUpdateTimestamp = inService.statusUpdateTimestamp;
      let diff = this.$moment().diff(this.$moment(statusUpdateTimestamp).add(inService.estimatedTimeToSpend, 'minutes'), 'minutes');
      if(diff < 5) return false;
      let diffStr = this.$moment().startOf('day').add(diff, 'minutes').format('HH:mm');
      return diffStr;
    },
    calculateWaitingTime(){
      let inService = this.getInService()[0];
      if(this.waiting_time == 0 || inService == undefined){
        return this.waiting_time;
      }
      else if(!this.delayStr){
        return this.waiting_time - 1;
      } else return this.waiting_time + 1;
    },
    requestApproved(){

    },
    requestRejected(){

    },
    getQueueRequests(){
      queueRequestService.getAll(this.$route.params.id).then(function (data) {
        this.requests = data.requests;
      }.bind(this));
    },
    subscribeToPusher () {
      getWaitingListCallBack = function() { this.loadWaitingList(); };
      getRequestsCallBack = function() { this.getQueueRequests(); };
      this.$pusher.subscribe('private-queue-'+this.$route.params.id);
      this.$pusher.bind('ticket-created', getWaitingListCallBack, this);
      this.$pusher.bind('ticket-deleted', getWaitingListCallBack, this);
      this.$pusher.bind('queue-request-created', getRequestsCallBack, this);
      this.$pusher.bind('queue-request-deleted', getRequestsCallBack, this);
    },
    unsubscribeFromPusher () {
      this.$pusher.unsubscribe('private-queue-'+this.$route.params.id);
      this.$pusher.unbind('ticket-created', getRequestsCallBack);
      this.$pusher.unbind('ticket-deleted', getRequestsCallBack);
      this.$pusher.unbind('queue-request-created', getRequestsCallBack);
      this.$pusher.unbind('queue-request-deleted', getRequestsCallBack);
    },
    updateTargetCounter(){

      let counterSotrage = JSON.parse(localStorage.getItem('targetCounter'));
      if(counterSotrage != null && counterSotrage.find((obj) => {return obj.counter_id == this.targetCounter})) return;

      if(this.targetCounter != null){
        this.showLoading();
        queueService.openCounter(this.queue.id, this.targetCounter).then(function () {
          this.notify(this.$t('Toasts.Successful'), this.$t('Queue.WaitingList.OpenCounterAlert.ToastSuccess'), 'success');
          counterSotrage = counterSotrage ?  counterSotrage.filter((obj) => {return obj.queue_id != this.queue.id}) : [];
          counterSotrage.push({queue_id: this.queue.id, counter_id: this.targetCounter});
          localStorage.setItem('targetCounter', JSON.stringify(counterSotrage));
        }.bind(this)).catch(function () {
          this.notify(this.$t('Toasts.Error'), this.$t('Queue.WaitingList.OpenCounterAlert.ToastFail'), 'danger');
          this.$vs.dialog({
            type: 'confirm',
            color: 'danger',
            title: this.$t('Queue.WaitingList.OpenCounterAlert.Title'),
            text: this.$t('Queue.WaitingList.OpenCounterAlert.Text'),
            acceptText: this.$t('Toasts.AcceptButton'),
            cancelText: this.$t('Toasts.CancelButton'),
            accept: function () {
              this.showLoading();
              queueService.closeCounter(this.queue.id, this.targetCounter).then(function () {
                this.notify(this.$t('Toasts.Successful'), this.$t('Queue.WaitingList.CloseCounterAlert.ToastSuccess'), 'success');
              }.bind(this)).catch(function () {
                this.notify(this.$t('Toasts.Error'), this.$t('Queue.WaitingList.CloseCounterAlert.ToastFail'), 'danger');
              }.bind(this)).finally(function () {
                counterSotrage = counterSotrage.filter((obj) => {return obj.queue_id != this.queue.id});
                localStorage.setItem('targetCounter', JSON.stringify(counterSotrage));
                this.targetCounter = null;
                this.hideLoading();
              }.bind(this));
            }.bind(this)
          });
        }.bind(this)).finally(function () {
          this.hideLoading();
        }.bind(this));
      }
    },
    closeTargetCounter(){
      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: this.$t('Queue.WaitingList.CloseCounterAlert.Title'),
        text: this.$t('Queue.WaitingList.CloseCounterAlert.Text'),
        acceptText: this.$t('Toasts.AcceptButton'),
        cancelText: this.$t('Toasts.CancelButton'),
        accept: function () {
          this.showLoading();
          queueService.closeCounter(this.queue.id, this.targetCounter).then(function () {
            this.notify(this.$t('Toasts.Successful'), this.$t('Queue.WaitingList.CloseCounterAlert.ToastSuccess'), 'success');
          }.bind(this)).catch(function () {
            this.notify(this.$t('Toasts.Error'), this.$t('Queue.WaitingList.CloseCounterAlert.ToastFail'), 'danger');
          }.bind(this)).finally(function () {
            let counterSotrage = JSON.parse(localStorage.getItem('targetCounter'));
            counterSotrage = counterSotrage.filter((obj) => {return obj.queue_id != this.queue.id});
            localStorage.setItem('targetCounter', JSON.stringify(counterSotrage));
            this.targetCounter = null;
            this.hideLoading();
          }.bind(this));
        }.bind(this)
      });
    }
  },
  computed: {
    ...mapState({
      workingDays: state => state.account.user.working_days,
    }),
    waitingTimeFormated: function () {
      return this.$moment().startOf('day').add(this.waiting_time, 'seconds').format('HH:mm:ss');
    }
  },
  beforeDestroy(){
    this.unsubscribeFromPusher();
  },
  created () {
  },
  mounted(){
    setInterval(this.time, 1000);
    queueService.getById(this.$route.params.id).then(function (data) {
      this.queue = data.queue;
      this.pending = data.pending;
      this.servicesList = data.services;
      this.total_waiting = data.totalWaiting;
      this.waiting_time = data.waiting_time;
      this.queue.services = data.services.map(obj => {
        return obj.id
      });
    }.bind(this)).finally(function () {

      let counterSotrage = JSON.parse(localStorage.getItem('targetCounter'));

      let selectedCounter = counterSotrage ? counterSotrage.find((obj) => obj.queue_id == this.queue.id) : null;
      this.targetCounter = selectedCounter ? selectedCounter.counter_id : null;

      this.subscribeToPusher();
      var self = this;
      self.delayStr = self.calculateDelay();
      self.waiting_time = self.calculateWaitingTime();
      setInterval(function () {
        self.delayStr = self.calculateDelay();
      }, 1000);
      setInterval(function () {
        self.waiting_time = self.calculateWaitingTime();
      }, 1000)
    }.bind(this));
    this.loadWaitingList();
    this.getQueueRequests();


  },
  components:{
  }
};
</script>
