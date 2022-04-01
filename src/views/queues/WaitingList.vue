<template>
  <vs-row vs-justify="center" id="queue-box">
    <vs-col
      type="flex"
      vs-justify="center"
      vs-align="center"
      vs-lg="4"
      vs-md="4"
      vs-sm="12"
      vs-xs="12"
    >
      <vs-card>
        <div slot="header">
          <h3>{{queue.title}}</h3>
        </div>

        <div>
          <vs-row class="text-center">
            <vs-col vs-w="6">
              <h3 style="color: #333">
                <i class="mdi mdi-account-multiple"></i>
                {{total_waiting}}
              </h3>
              <p style="color: #aaa">{{$t('Components.Queue.QueueItem.WaitingInLine')}}</p>
            </vs-col>
            <vs-col vs-w="6" style="border-left: 1px solid #efefef">
              <h3 style="color: #333">
                <i class="mdi mdi-clock"></i>
                {{waitingTimeFormated}}
              </h3>
              <p style="color: #aaa">{{$t('Components.Queue.QueueItem.WaitingTime')}}</p>
            </vs-col>
          </vs-row>
          <vs-row>
            <vs-col vs-w="12" class="mb-2">
              <vs-alert :active="delayStr != false" color="danger" icon="notification_important">
                <span>{{$t('Queue.WaitingList.DelayText', {delay: delayStr})}}</span>
              </vs-alert>
            </vs-col>
            <vs-col vs-w="12">
              <vs-alert
                :active="requests.length > 0"
                color="primary"
                icon="contact_support"
                @click="pendingRequestsPopupActive = true"
              >
                <span>{{$tc('Components.Queue.QueueItem.PendingRequests', requests.length, {total: requests.length})}}</span>
              </vs-alert>
              <vs-popup :active.sync="pendingRequestsPopupActive" title="Pending Requests">
                <vs-alert
                  title="No requests"
                  color="warning"
                  v-if="requests.length == 0"
                  :active="pendingRequestsPopupActive"
                >{{$t('Queue.WaitingList.RequestsEmpty')}}</vs-alert>
                <RequestItem
                  @approve="requestApproved"
                  @reject="requestRejected"
                  :key="index"
                  :request="item"
                  v-for="(item,index) in requests"
                ></RequestItem>
              </vs-popup>
            </vs-col>
          </vs-row>
          <vs-row>
            <vs-col>
              <vs-button
                color="warning"
                type="filled"
                class="w-100"
                @click="openAddDelayPrompt"
                v-if="!delay"
              >
                <AddDelayPrompt
                  v-on:updateDelay="update_delay"
                  ref="addDelayPrompt"
                  :queue_id="queue.id"
                ></AddDelayPrompt>
                <i class="mdi mdi-timer-sand"></i>
                {{$t('Queue.WaitingList.CreateDelayButton')}}
              </vs-button>
              <vs-button
                color="success"
                type="filled"
                class="w-100"
                @click="resumeService"
                v-if="delay"
              >
                <i class="mdi mdi-play"></i>
                {{$t('Queue.WaitingList.Resume')}}
              </vs-button>
            </vs-col>
          </vs-row>
        </div>
      </vs-card>
    </vs-col>

    <vs-col
      type="flex"
      vs-justify="center"
      vs-align="center"
      vs-lg="8"
      vs-md="8"
      vs-sm="12"
      vs-xs="12"
    >
      <vs-row class="mb-4">
        <vs-col vs-lg="3" vs-md="3" vs-sm="12" vs-xs="12" class="p-2">
          <vs-button color="dark" type="filled" class="w-100" @click="openAddCustomerPrompt">
            <i class="mdi mdi-account-plus"></i>
            {{$t('Queue.WaitingList.PushButton')}}
          </vs-button>
          <CustomizerAddCustomer
            @create="loadWaitingList"
            ref="AddCustomerCustomizer"
            :teamMembers="queue.members"
            :queue_id="queue.id"
            :servicesList="servicesList"
            :queue = true
            :side-bar-title="$t('Components.Queue.AddCustomerPrompt.Title')"
          ></CustomizerAddCustomer>
        </vs-col>
        <vs-col vs-lg="3" vs-md="3" vs-sm="12" vs-xs="12" class="p-2">
          <vs-select
            v-if="queue.counters.length > 0 && !queue.config "
            :placeholder="$t('Queue.WaitingList.PleaseChooseCounter')"
            class="w-100"
            v-model="targetCounter"
            @change="updateTargetCounter"
          >
            <vs-select-item
              :key="'counter_'+index"
              :value="item.id"
              :text="item.name"
              v-for="(item,index) in queue.counters"
            />
          </vs-select>
        </vs-col>
        <vs-col vs-lg="3" vs-md="3" vs-sm="12" vs-xs="12" class="p-2">
          <vs-button
            v-if="targetCounter"
            color="danger"
            type="filled"
            class="w-100"
            @click="closeTargetCounter"
          >
            <i class="mdi mdi-close"></i>
            {{$t('Queue.WaitingList.CloseCounterButton')}}
          </vs-button>
        </vs-col>
        <vs-col vs-lg="3" vs-md="3" vs-sm="12" vs-xs="12" class="p-2">
          <vs-button color="success" type="filled" class="w-100" @click="callNext">
            <i class="mdi mdi-arrow-right"></i>
            {{$t('Queue.WaitingList.CallNextButton')}}
          </vs-button>

          <vs-popup
            :active.sync="activeChooseCounterPopup"
            :title="$t('Queue.WaitingList.CallNextButton')"
          >
            <div>
              <vs-row>
                <vs-button color="success" type="filled" class="w-100 p-2" @click="callNext">
                  <i class="mdi mdi-arrow-right"></i>
                  {{$t('Queue.WaitingList.SelectCounterButton')}}
                </vs-button>
              </vs-row>
            </div>
          </vs-popup>
        </vs-col>
      </vs-row>
      <vs-row>
        <vs-col vs-w="12">
          <vs-card v-if="this.queue.counters.length > 0">
            <vs-alert
              :active="!targetCounter"
              color="danger"
              class="mb-0"
            >{{$t('Queue.WaitingList.PleaseChooseCounterLabel')}}</vs-alert>
            <h3 v-if="targetCounter">
              {{$t('Queue.WaitingList.NowServingCounter')}}:
              <span
                class="font-weight-light"
              >{{queue.counters.find((obj) => {return obj.id == targetCounter}).name}}</span>
            </h3>
          </vs-card>
          <vs-card v-if="waiting_list.length == 0">
            <vs-alert
              :title="$t('Queue.WaitingList.WaitingListEmptyTitle')"
              active="true"
              color="warning"
              class="mb-0"
            >{{$t('Queue.WaitingList.WaitingListEmpty')}}</vs-alert>
          </vs-card>
          <draggable :list="waiting_list" class="cursor-move" @end="move">
            <WaitingListItem
              @delete="loadWaitingList"
              @update="loadWaitingList"
              :members="queue.members"
              :startCount="getInService()[0] != null"
              :choosable="queue.choosable == 1"
              :key="index"
              :item="item"
              :rank="index+1"
              v-for="(item,index) in waiting_list"
            ></WaitingListItem>
          </draggable>
        </vs-col>
      </vs-row>
    </vs-col>
  </vs-row>
</template>

<script>
import AddCustomerPrompt from "../../components/queue/AddCustomerPrompt";
import AddDelayPrompt from "../../components/queue/AddDelayPrompt";
import WaitingListItem from "../../components/queue/WaitingListItem";
import RequestItem from "../../components/queue/RequestItem";
import {
  queueService,
  queueRequestService,
  counterService,
} from "../../_services";
import { mapState } from "vuex";
import draggable from "vuedraggable";
import CustomizerAddCustomer from '../../layout/full/customizer/CustomizerAddCustomer.vue';

var getWaitingListCallBack;
var getRequestsCallBack;

export default {
  name: "WaitingList",
  data: () => ({
    title: "Waiting List",
    queue: {
      title: "",
      working_days: [],
      services: [],
      counters: [],
      members: [],
      config: "",
    },
    isCallingNext : false,
    total_waiting: 0,
    waiting_time: 0,
    delayTime : 0,
    delayStr: "",
    targetCounter: null,
    delay: null,
    requests: [],
    pending: "",
    pendingRequestsPopupActive: false,
    activeChooseCounterPopup: false,
    servicesList: [],
    waiting_list: [],
  }),
  methods: {
    update_delay(delay) {
      queueService
      .getById(this.$route.params.id)
      .then(
        function (data) {
          
          this.queue = data.queue;
          this.delay = data.delay;
          this.pending = data.pending;
          this.servicesList = data.services;
          this.total_waiting = data.totalWaiting;
          this.waiting_time = data.waiting_time;
          this.queue.services = data.services.map((obj) => {
            return obj.id;
          });
        }.bind(this)
      ).finally(()=>{
        this.delayTime=this.delay.delay;
      })
    },
    notify(title, text, type) {
      this.$vs.notify({
        color: type,
        title: title,
        text: text,
      });
    },
    showLoading() {
      this.$vs.loading({
        container: "#queue-box",
        scale: 0.6,
      });
    },
    hideLoading() {
      this.$vs.loading.close("#queue-box > .con-vs-loading");
    },
    openAddCustomerPrompt() {
      this.$refs.AddCustomerCustomizer.show();
      //this.$refs.servicesList = this.servicesList;
      // this.$refs.addCustomerPrompt.show();
    },
    openAddDelayPrompt() {
      this.$refs.addDelayPrompt.show();
    },
    loadWaitingList() {
      queueService.getWaitingList(this.$route.params.id).then(
        function (data) {
          this.waiting_list = data.waiting_list;
          this.total_waiting = data.totalWaiting;
          this.waiting_time = data.waiting_time;
        }.bind(this)
      );
    },
    showChooseCounterPopup() {
      this.activeChooseCounterPopup = true;
    },
    callNext() {
      if (this.delay) {this.resumeService();
        this.isCallingNext = true;
      }
      if (!this.delay) {
        if (this.queue.counters.length > 1 && this.targetCounter == null) {
          this.$vs.dialog({
            type: "alert",
            color: "danger",
            title: this.$t("Queue.WaitingList.PleaseChooseCounter"),
            text: this.$t("Queue.WaitingList.PleaseChooseCounterLabel"),
            acceptText: this.$t("Toasts.AcceptButton"),
            cancelText: this.$t("Toasts.CancelButton"),
            buttonAccept: false,
            buttonCancel: true,
          });
          return;
        }
        this.showLoading();
        queueService
          .callNext(this.$route.params.id)
          .then(
            function () {
              this.loadWaitingList();
              this.notify(
                this.$t("Toasts.Successful"),
                this.$t("Queue.WaitingList.CallNextToastSuccess"),
                "success"
              );
            }.bind(this)
          )
          .catch(
            function () {
              this.notify(
                this.$t("Toasts.Error"),
                this.$t("Queue.WaitingList.CallNextToastFail"),
                "danger"
              );
            }.bind(this)
          )
          .finally(
            function () {
              this.hideLoading();
            }.bind(this)
          );
      }
    },
    getInService() {
      return this.waiting_list.filter(function (obj) {
        return obj.status == "inservice";
      });
    },
    calculateDelay() {
      let inService = this.getInService()[0];
      if (inService == undefined) return false;
      let statusUpdateTimestamp = inService.statusUpdateTimestamp;
      let diff = this.$moment().diff(
        this.$moment(statusUpdateTimestamp).add(
          inService.estimatedTimeToSpend,
          "minutes"
        ),
        "minutes"
      );
      if (diff < 5) return false;
      let diffStr = this.$moment()
        .startOf("day")
        .add(diff, "minutes")
        .format("HH:mm");
      return diffStr;
    },
    calculateWaitingTime() {
      let inService = this.getInService()[0];
      if ((this.waiting_time == 0 || inService == undefined) && (!this.delay||this.delayTime==0)) {
        return this.waiting_time;
      }
      else {
        this.delayTime--;
        return this.waiting_time - 1;
      }
    },
    requestApproved() {},
    requestRejected() {},
    getQueueRequests() {
      queueRequestService.getAll(this.$route.params.id).then(
        function (data) {
          this.requests = data.requests;
        }.bind(this)
      );
    },
    subscribeToPusher() {
      getWaitingListCallBack = function () {
        this.loadWaitingList();
      };
      getRequestsCallBack = function () {
        this.getQueueRequests();
      };
      this.$pusher.subscribe("private-queue-" + this.$route.params.id);
      this.$pusher.bind("ticket-created", getWaitingListCallBack, this);
      this.$pusher.bind("ticket-deleted", getWaitingListCallBack, this);
      this.$pusher.bind("queue-request-created", getRequestsCallBack, this);
      this.$pusher.bind("queue-request-deleted", getRequestsCallBack, this);
    },
    unsubscribeFromPusher() {
      this.$pusher.unsubscribe("private-queue-" + this.$route.params.id);
      this.$pusher.unbind("ticket-created", getRequestsCallBack);
      this.$pusher.unbind("ticket-deleted", getRequestsCallBack);
      this.$pusher.unbind("queue-request-created", getRequestsCallBack);
      this.$pusher.unbind("queue-request-deleted", getRequestsCallBack);
    },
    updateTargetCounter() {
      let counterSotrage = JSON.parse(localStorage.getItem("targetCounter"));
      if (
        counterSotrage != null &&
        counterSotrage.find((obj) => {
          return obj.counter_id == this.targetCounter;
        })
      )
        return;

      if (this.targetCounter != null) {
        this.showLoading();
        counterService
          .open(this.queue.id, this.targetCounter)
          .then(
            function () {
              this.notify(
                this.$t("Toasts.Successful"),
                this.$t("Queue.WaitingList.OpenCounterAlert.ToastSuccess"),
                "success"
              );
              counterSotrage = counterSotrage
                ? counterSotrage.filter((obj) => {
                    return obj.queue_id != this.queue.id;
                  })
                : [];
              counterSotrage.push({
                queue_id: this.queue.id,
                counter_id: this.targetCounter,
              });
              localStorage.setItem(
                "targetCounter",
                JSON.stringify(counterSotrage)
              );
            }.bind(this)
          )
          .catch(
            function () {
              this.notify(
                this.$t("Toasts.Error"),
                this.$t("Queue.WaitingList.OpenCounterAlert.ToastFail"),
                "danger"
              );
              this.$vs.dialog({
                type: "confirm",
                color: "danger",
                title: this.$t("Queue.WaitingList.OpenCounterAlert.Title"),
                text: this.$t("Queue.WaitingList.OpenCounterAlert.Text"),
                acceptText: this.$t("Toasts.AcceptButton"),
                cancelText: this.$t("Toasts.CancelButton"),
                accept: function () {
                  this.showLoading();
                  counterService
                    .close(this.queue.id, this.targetCounter)
                    .then(
                      function () {
                        this.notify(
                          this.$t("Toasts.Successful"),
                          this.$t(
                            "Queue.WaitingList.CloseCounterAlert.ToastSuccess"
                          ),
                          "success"
                        );
                      }.bind(this)
                    )
                    .catch(
                      function () {
                        this.notify(
                          this.$t("Toasts.Error"),
                          this.$t(
                            "Queue.WaitingList.CloseCounterAlert.ToastFail"
                          ),
                          "danger"
                        );
                      }.bind(this)
                    )
                    .finally(
                      function () {
                        counterSotrage = counterSotrage
                          ? counterSotrage.filter((obj) => {
                              return obj.queue_id != this.queue.id;
                            })
                          : [];
                        localStorage.setItem(
                          "targetCounter",
                          JSON.stringify(counterSotrage)
                        );
                        this.targetCounter = null;
                        this.hideLoading();
                      }.bind(this)
                    );
                }.bind(this),
              });
            }.bind(this)
          )
          .finally(
            function () {
              this.hideLoading();
            }.bind(this)
          );
      }
    },
    resumeService() {
      this.$vs.dialog({
        type: "confirm",
        color: "success",
        title: this.$t("Queue.WaitingList.ResumeServiceAlert.Title"),
        text: this.$t("Queue.WaitingList.ResumeServiceAlert.Text"),
        acceptText: this.$t("Toasts.AcceptButton"),
        cancelText: this.$t("Toasts.CancelButton"),
        accept: function () {
          
            
          this.showLoading();
          queueService
            .resumeService(this.queue.id)
            .then(
              function () {
                this.notify(
                  this.$t("Toasts.Successful"),
                  this.$t("Queue.WaitingList.ResumeServiceAlert.ToastSuccess"),
                  "success"
                );
                this.delay = null;
              }.bind(this)
            )
            .catch(
              function () {
                this.notify(
                  this.$t("Toasts.Error"),
                  this.$t("Queue.WaitingList.ResumeServiceAlert.ToastFail"),
                  "danger"
                );
              }.bind(this)
            )
            .finally(
              function () {
                queueService
      .getById(this.$route.params.id)
      .then(
        function (data) {
          this.queue = data.queue;
          this.delay = data.delay;
          this.pending = data.pending;
          this.servicesList = data.services;
          this.total_waiting = data.totalWaiting;
          this.waiting_time = data.waiting_time;
          this.queue.services = data.services.map((obj) => {
            return obj.id;
          });
        }.bind(this)
      ).finally(()=>{
        if(this.isCallingNext)
          {
            this.callNext();
            this.isCallingNext=false;
          }
      })
                this.hideLoading();

              }.bind(this)
            );
        }.bind(this),
      });
    },
    closeTargetCounter() {
      this.$vs.dialog({
        type: "confirm",
        color: "danger",
        title: this.$t("Queue.WaitingList.CloseCounterAlert.Title"),
        text: this.$t("Queue.WaitingList.CloseCounterAlert.Text"),
        acceptText: this.$t("Toasts.AcceptButton"),
        cancelText: this.$t("Toasts.CancelButton"),
        accept: function () {
          this.showLoading();
          counterService
            .close(this.queue.id, this.targetCounter)
            .then(
              function () {
                this.notify(
                  this.$t("Toasts.Successful"),
                  this.$t("Queue.WaitingList.CloseCounterAlert.ToastSuccess"),
                  "success"
                );
              }.bind(this)
            )
            .catch(
              function () {
                this.notify(
                  this.$t("Toasts.Error"),
                  this.$t("Queue.WaitingList.CloseCounterAlert.ToastFail"),
                  "danger"
                );
              }.bind(this)
            )
            .finally(
              function () {
                let counterSotrage = JSON.parse(
                  localStorage.getItem("targetCounter")
                );
                counterSotrage = counterSotrage.filter((obj) => {
                  return obj.queue_id != this.queue.id;
                });
                localStorage.setItem(
                  "targetCounter",
                  JSON.stringify(counterSotrage)
                );
                this.targetCounter = null;
                this.hideLoading();
              }.bind(this)
            );
        }.bind(this),
      });
    },
    move(e) {
      if (e.newIndex != e.oldIndex) {
        this.$vs.dialog({
          type: "confirm",
          color: "danger",
          title: this.$t("Queue.WaitingList.MoveTicketAlert.Title"),
          text: this.$t("Queue.WaitingList.MoveTicketAlert.Text"),
          acceptText: this.$t("Toasts.AcceptButton"),
          cancelText: this.$t("Toasts.CancelButton"),
          accept: function () {
            this.showLoading();
            let ticket = this.waiting_list[e.newIndex];
            queueService
              .move(this.queue.id, ticket.ticket_id, e.oldIndex, e.newIndex)
              .then(
                function () {
                  this.notify(
                    this.$t("Toasts.Successful"),
                    this.$t("Queue.WaitingList.MoveTicketAlert.ToastSuccess"),
                    "success"
                  );
                }.bind(this)
              )
              .catch(
                function () {
                  this.notify(
                    this.$t("Toasts.Error"),
                    this.$t("Queue.WaitingList.MoveTicketAlert.ToastFail"),
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
          cancel: function () {
            this.loadWaitingList();
          }.bind(this),
        });
      } else {
        //console.log('popup')
      }
    },
  },
  computed: {
    ...mapState({
      workingDays: (state) => state.account.user.working_days,
    }),
    waitingTimeFormated: function () {
      return this.$moment()
        .startOf("day")
        .add(this.waiting_time, "seconds")
        .format("HH:mm:ss");
    },
  },
  beforeDestroy() {
    this.unsubscribeFromPusher();
  },
  created() {},
  mounted() {
    queueService
      .getById(this.$route.params.id)
      .then(
        function (data) {

          this.queue = data.queue;
          this.delay = data.delay;
          this.pending = data.pending;
          this.servicesList = data.services;
          this.total_waiting = data.totalWaiting;
          this.waiting_time = data.waiting_time;
          this.queue.services = data.services.map((obj) => {
            return obj.id;
          });
        }.bind(this)
      )
      .finally(
        function () {
          if(this.delay)
            this.delayTime=this.delay.delay;
          let counterSotrage = JSON.parse(
            localStorage.getItem("targetCounter")
          );

          let selectedCounter = counterSotrage
            ? counterSotrage.find((obj) => obj.queue_id == this.queue.id)
            : null;
          this.targetCounter = selectedCounter
            ? selectedCounter.counter_id
            : null;

          this.subscribeToPusher();
          var self = this;
          self.delayStr = self.calculateDelay();
          self.waiting_time = self.calculateWaitingTime();
          setInterval(function () {
            self.delayStr = self.calculateDelay();
          }, 1000);
          setInterval(function () {
            self.waiting_time = self.calculateWaitingTime();
          }, 1000);
        }.bind(this)
      );
    this.loadWaitingList();
    this.getQueueRequests();
  },
  components: {
    AddDelayPrompt,
    WaitingListItem,
    RequestItem,
    draggable,
    CustomizerAddCustomer,
  },
};
</script>
<style>
.animation {
  transition: all 0.5s;
}
</style>