<template>
  <vs-row vs-justify="center" id="queue-box">
    <vs-popup class="holamundo" title="Lorem ipsum dolor sit amet" :active.sync="activeSlots">
      <div>
        <vs-row class="mb-3" v-for="(item,index) in vipQueueSlots" :key="'vipQueueSlots'+index">
          <vs-col>
            <vs-row>
              <vs-col vs-lg="3" vs-md="3" vs-sm="3" vs-xs="3">
                <vs-input type="time" v-model="item.start" label="Translate : start" />
              </vs-col>
              <vs-col vs-lg="3" vs-md="3" vs-sm="3" vs-xs="3">
                <vs-input type="time" v-model="item.end" label="Translate : end" />
              </vs-col>
              <vs-col vs-lg="3" vs-md="3" vs-sm="3" vs-xs="3">
                <vs-input
                  type="number"
                  v-model="item.availability_befor_book"
                  label="Translate : time before book"
                />
              </vs-col>

              <vs-col class="mt-4" vs-lg="3" vs-md="3" vs-sm="3" vs-xs="3">
                <vs-button
                  v-if="index+1 == vipQueueSlots.length"
                  color="primary"
                  class="w-100"
                  type="filled"
                  @click="addVipQueueSlots"
                >
                  <i class="mdi mdi-plus-box"></i>
                </vs-button>
                <vs-button
                  v-if="index+1 < vipQueueSlots.length"
                  color="danger"
                  class="w-100"
                  type="filled"
                  @click="deleteVipQueueSlots(index)"
                >
                  <i class="mdi mdi-delete"></i>
                </vs-button>
              </vs-col>
            </vs-row>
          </vs-col>
        </vs-row>
        <vs-row class="mt-5">
          <vs-col vs-w="3" vs-offset="9">
            <vs-button
              color="success"
              class="w-100"
              type="filled"
              @click="updateSlots"
            >
              {{$t('Queue.Edit.SubmitButton')}}
            </vs-button>
          </vs-col>
        </vs-row>
      </div>
    </vs-popup>
    <vs-col type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-xs="12">
      <vs-card>
        <vs-input
          class="inputx w-100 mb-4"
          :label="$t('Queue.Create.QueueName')"
          :placeholder="$t('Queue.Create.QueueName')"
          v-model="queue.title"
          :danger="errors.name"
          :danger-text="$t('Errors.InvalidPolite', {field: $t('Queue.Create.QueueName')})"
        />

        <vs-select
          :danger="errors.services"
          :danger-text="$t('Errors.Required', {field: $t('Queue.Create.AvailableServices')})"
          :placeholder="$t('Queue.Create.AvailableServices')"
          class="w-100 mb-4"
          :label="$t('Queue.Create.AvailableServices')"
          autocomplete
          multiple
          v-model="queue.services"
        >
          <vs-select-item
            :key="index"
            :value="item.id"
            :text="item.name"
            v-for="(item,index) in servicesList"
          />
        </vs-select>

        <vs-select
          :danger="errors.members"
          :danger-text="$t('Errors.Required', {field: $t('Queue.Create.TeamMembers')})"
          :placeholder="$t('Queue.Create.TeamMembers')"
          class="w-100 mb-4"
          :label="$t('Queue.Create.TeamMembers')"
          autocomplete
          multiple
          v-model="queue.members"
        >
          <vs-select-item
            :key="'team_'+index"
            :value="item.id"
            :text="item.name"
            v-for="(item,index) in teamMembersList"
          />
        </vs-select>

        <vs-row>
          <vs-col vs-w="4">
            <vs-select
              :placeholder="$t('Queue.Create.TicketNumberType')"
              class="w-100 mb-4"
              :label="$t('Queue.Create.TicketNumberType')"
              v-model="queue.ticket_number_type"
            >
              <vs-select-item value="Rand" :text="$t('Queue.Create.TicketNumberTypeRand')" />
              <vs-select-item value="Incr" :text="$t('Queue.Create.TicketNumberTypeIncr')" />
            </vs-select>
          </vs-col>
          <vs-col vs-w="4">
            <vs-input
              class="inputx w-100 mb-4"
              :label="$t('Queue.Create.TicketNumberStart')"
              v-model="queue.ticket_start"
            />
          </vs-col>
          <vs-col vs-w="4">
            <vs-input
              class="inputx w-100 mb-4"
              :label="$t('Queue.Create.TicketPrefix')"
              v-model="queue.ticket_prefix"
            />
          </vs-col>
        </vs-row>

        <vs-checkbox
          class="justify-content-start w-100 mb-4"
          v-model="queue.ask_covid"
        >{{$t('Queue.Create.AskCovid')}}</vs-checkbox>

        <vs-checkbox
          class="justify-content-start w-100 mb-4"
          v-model="queue.require_booking"
        >{{$t('Queue.Create.RequireBooking')}}</vs-checkbox>

        <vs-checkbox
          class="justify-content-start w-100 mb-4"
          v-model="queue.choosable"
        >{{$t('Queue.Create.TeamMembersChoosable')}}</vs-checkbox>

        <vs-checkbox
          class="justify-content-start w-100 mb-4"
          v-model="queue.auto_call"
        >{{$t('Queue.Create.AutoCall')}}</vs-checkbox>

                <vs-checkbox
          class="justify-content-start w-100 mb-4"
          v-model="synchronized"
        >{{$t('Queue.Create.Synchronized')}}</vs-checkbox>

        <div v-if="synchronized">
                  <label class="vs-input--label mb-2">{{$t('Booking.CreatePrompt.QueuePlaceholder')}}:</label>
             <vs-row v-for="(item,index) in queue_cf" :key="'queue_'+index">
          <vs-col vs-lg="5" vs-md="11" vs-sm="10" vs-xs="9" vs-w="2">
            <vs-select
                            :placeholder="$t('Booking.CreatePrompt.QueuePlaceholder')"
                            class="w-100 mb-2"
                            :label="$t('Queue.Create.QueuePriority')+(index+1)"
                            autocomplete
                            v-model="item.id"
                    >
                        <vs-select-item
                                :key="index"
                                :value="item.id"
                                :text="item.title"
                                v-for="(item,index) in queuesList"
                        />
                    </vs-select>
          </vs-col>
          

                    <vs-col vs-lg="5" vs-md="11" vs-sm="10" vs-xs="9">
              <vs-input
              class="inputx w-100 mb-4"
              :placeholder="$t('Queue.Create.NumberCustomers')"
              :label= "$t('Queue.Create.NumberCustomers')"
              v-model="item.customers"
            />
                    </vs-col>
                        <vs-col vs-w="2">
            <vs-row>
             
                            <vs-col vs-w="6">

            <vs-button
              v-if="index < queue_cf.length"
              color="danger"
              class="w-100"
              type="filled"
              @click="deleteQueue(index)"
            >
              <i class="mdi mdi-delete"></i>
            </vs-button>
                            </vs-col>

                             <vs-col vs-w="6">
            <vs-button
              v-if="index+1 == queue_cf.length"
              color="primary"
              class="w-100"
              type="filled"
              @click="addQueue"
            >
              <i class="mdi mdi-plus-box"></i>
            </vs-button>
              </vs-col>
            </vs-row>
          </vs-col>
             </vs-row>
        </div>


        <vs-checkbox
            class="justify-content-start w-100 mb-4"
            v-model="auto_push"
          >{{$t('Queue.Create.AutoPushBookings')}}</vs-checkbox>

          <div class="department-choose" v-if="auto_push" style="border-bottom: 1px solid #ddd;padding-bottom: 30px;">
            <vs-select
                              :placeholder="$t('Queue.Create.Department')"
                              class="w-100 mb-2"
                              :label="$t('Queue.Create.DepartmentPlaceholder')"
                              autocomplete
                              multiple
                              v-model="target_department"
                      >
                          <vs-select-item
                                  :key="index"
                                  :value="item.id"
                                  :text="item.name"
                                  v-for="(item,index) in departments"
                          />
            </vs-select>
          </div>

        <label class="vs-input--label mb-2">{{$t('Queue.Create.Counters')}}:</label>

        <vs-row v-for="(item,index) in queue.counters" :key="'counter_'+index">
          <vs-col vs-w="10">
            <vs-input
              :disabled="true"
              class="inputx w-100 mb-4"
              :placeholder="$t('Queue.Create.CounterName')"
              v-model="item.name"
            />
          </vs-col>
          <vs-col vs-w="2">
            <vs-row>
              <vs-col vs-w="6">
                <vs-button
                  class="w-100"
                  color="danger"
                  type="filled"
                  @click="deleteCounter(item, index)"
                >
                  <i class="mdi mdi-delete"></i>
                </vs-button>
              </vs-col>
              <vs-col vs-w="6">
                <vs-button
                  class="w-100"
                  color="warning"
                  type="filled"
                  @click="selected = item; activeUpdatePrompt = true"
                >
                  <i class="mdi mdi-pencil"></i>
                </vs-button>
              </vs-col>
            </vs-row>
          </vs-col>
        </vs-row>

        <vs-row class="mb-4">
          <vs-col vs-w="10"></vs-col>
          <vs-col vs-w="2">
            <vs-col vs-w="12">
              <vs-button
                color="primary"
                class="w-100"
                type="filled"
                @click="activeCreatePrompt = true"
              >
                <i class="mdi mdi-plus-box"></i>
              </vs-button>
            </vs-col>
          </vs-col>
        </vs-row>

        <label class="vs-input--label mb-2">{{$t('Queue.Create.WorkingDays')}}:</label>
        <QueueWorkingDay :key="index" v-for="(day, index) in queue.working_days" :day="day"></QueueWorkingDay>

        <hr class="custom-hr mt-5" />
        <vs-row>
          <vs-button
            color="primary"
            type="filled"
            @click="activeSlots = true"
            id="create-submit-button"
          >traslate : slots</vs-button>
        </vs-row>
        <div class="btn-alignment align-items-end" style="overflow: overlay;">
          <vs-button
            color="primary"
            class="float-right ml-3"
            type="filled"
            @click="submitForm"
          >{{$t('Queue.Edit.SubmitButton')}}</vs-button>
          <vs-button
            color="success"
            class="float-right"
            icon="translate"
            type="filled"
            @click="activeTranslatePrompt=true"
          >{{$t('Queue.Edit.TranslateButton')}}</vs-button>
        </div>

        <vs-prompt
          color="warning"
          @accept="updateCounter"
          @close="close"
          @cancel="close"
          :active.sync="activeUpdatePrompt"
          :title="$t('Queue.Counter.EditPrompt.Title')"
          :accept-text="$t('Queue.Counter.EditPrompt.SubmitButton')"
          :cancel-text="$t('Queue.Counter.EditPrompt.CancelButton')"
        >
          <div v-bar class="vs-scrollable">
            <div>
              <div class="con-exemple-prompt px-4 py-3">
                <vs-input
                  :danger="errors.counter.name"
                  :danger-text="$t('Errors.InvalidPolite', {field: $t('Queue.Create.CounterName')})"
                  :label="$t('Queue.Create.CounterName')"
                  v-model="selected.name"
                  class="w-100 mb-4"
                />
              </div>
            </div>
          </div>
        </vs-prompt>

        <vs-prompt
          color="primary"
          @accept="createCounter"
          @close="close"
          @cancel="close"
          :active.sync="activeCreatePrompt"
          :title="$t('Queue.Counter.CreatePrompt.Title')"
          :accept-text="$t('Queue.Counter.CreatePrompt.SubmitButton')"
          :cancel-text="$t('Queue.Counter.CreatePrompt.CancelButton')"
        >
          <div v-bar class="vs-scrollable">
            <div>
              <div class="con-exemple-prompt px-4 py-3">
                <vs-input
                  :danger="errors.counter.name"
                  :danger-text="$t('Errors.InvalidPolite', {field: $t('Queue.Create.CounterName')})"
                  :label="$t('Queue.Create.CounterName')"
                  v-model="counterName"
                  class="w-100 mb-4"
                />
              </div>
            </div>
          </div>
        </vs-prompt>

        <vs-prompt
          color="success"
          @accept="updateQueueTranslations"
          @close="close"
          @cancel="close"
          :active.sync="activeTranslatePrompt"
          :title="$t('Queue.Edit.TranslationPrompt.Title')"
          :accept-text="$t('Queue.Edit.TranslationPrompt.SubmitButton')"
          :cancel-text="$t('Queue.Edit.TranslationPrompt.CancelButton')"
        >
          <div v-bar class="vs-scrollable">
            <div>
              <div class="con-exemple-prompt px-4 py-3">
                <vs-row>
                  <vs-col vs-w="12" v-for="(item, index) in languages" :key="index">
                    <vs-input
                      :placeholder="item"
                      :label="item"
                      v-model="queue_translations[item]"
                      class="w-100 mt-2 mb-2"
                    ></vs-input>
                  </vs-col>
                </vs-row>
              </div>
            </div>
          </div>
        </vs-prompt>
      </vs-card>
    </vs-col>
  </vs-row>
</template>

<script>
import QueueWorkingDay from "../../components/queue/QueueWorkingDay";
import {
  counterService,
  privateServiceService,
  queueService,
  teamService,
  departmentService
} from "../../_services";
import router from "../../_helpers/router";
import { mapState } from "vuex";
export default {
  name: "CreateRule",
  data: () => ({
    title: "New Queue",
    activeUpdatePrompt: false,
    synchronized:false,
    queue_cf:[],
    activeCreatePrompt: false,
    activeTranslatePrompt: false,
    queue: {
      title: "",
      working_days: [],
      services: [],
      counters: [],
      members: [],
      queue_config: {},
    },
    activeSlots: false,
    vipQueueSlots: [{ name: "", start: "", end: "", availability_befor_book: 0 }],
    errors: {
      name: false,
      services: false,
      members: false,
      counter: {
        name: false,
      },
    },
    counterName: "",
    selected: {
      id: "",
      name: "",
    },
    servicesList: [],
    teamMembersList: [],
    queueWorkingDays: [],
    counters: [{ name: "" }],
    languages: [],
    queue_translations: {
      ar: "",
      fr: "",
      en: "",
      de: "",
      es: "",
      ru: "",
      pt: "",
    },
    departments: [],
    target_department: [],
    auto_push: false
  }),
  methods: {
    updateSlots(){
      this.showLoading()
      this.vipQueueSlots.pop();
      queueService.updateQueueSlots(this.$route.params.id,{
        slots : this.vipQueueSlots
      }).then(data=>{
        this.vipQueueSlots=data.slots;
        this.vipQueueSlots.push({start: "", end: "", numberSlot:1});
      }).finally(()=>{
        this.hideLoading();
      })
    },
    notify(title, text, type) {
      this.$vs.notify({
        color: type,
        title: title,
        text: text,
      });
    },
    validateFields() {
      this.errors.name = this.queue.title ? false : true;
      this.errors.services = this.queue.services.length > 0 ? false : true;
      this.errors.members = this.queue.members.length > 0 ? false : true;

      let { name, services, members } = this.errors;
      return !(name || services || members);
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
    updateCounter() {
      this.showLoading();
      counterService
        .update(this.queue.id, this.selected)
        .then(
          function () {
            this.notify(
              this.$t("Toasts.Successful"),
              this.$t("Queue.Counter.EditPrompt.ToastSuccess"),
              "success"
            );
          }.bind(this)
        )
        .catch(
          function () {
            this.notify(
              this.$t("Toasts.Error"),
              this.$t("Queue.Counter.EditPrompt.ToastFail"),
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
    addQueue() {
      this.queue_cf.push({ value: "" });
    },
      deleteQueue(index) {
      this.queue_cf.splice(index, 1);
    },
    createCounter() {
      this.showLoading();
      counterService
        .create(this.queue.id, { name: this.counterName })
        .then(
          function (data) {
            this.queue.counters.push(data.counter);
            this.notify(
              this.$t("Toasts.Successful"),
              this.$t("Queue.Counter.CreatePrompt.ToastSuccess"),
              "success"
            );
          }.bind(this)
        )
        .catch(
          function () {
            this.notify(
              this.$t("Toasts.Error"),
              this.$t("Queue.Counter.CreatePrompt.ToastFail"),
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
    addVipQueueSlots() {
      this.vipQueueSlots.push({  start: "", end: "", numberSlot: 1 });
    },
    deleteVipQueueSlots(index) {
      this.vipQueueSlots.splice(index, 1);
    },
    submitForm() {
      let res = this.validateFields();
      if (!res) {
        return false;
      }
      this.showLoading();
      console.log(this.queue.queue_config);
      let queue = {
        id: this.queue.id,
        title: this.queue.title,
        services: this.queue.services.join(),
        members: this.queue.members.join(),
        counters: this.queue.counters.map(function (obj) {
          return obj.name;
        }),
        choosable: this.queue.choosable,
        ask_covid: this.queue.ask_covid,
        auto_call: this.queue.auto_call,
        require_booking: this.queue.require_booking,
        ticket_number_type: this.queue.ticket_number_type,
        ticket_prefix: this.queue.ticket_prefix,
        ticket_start: this.queue.ticket_start,
        working_days: JSON.stringify(this.queue.working_days),
        target_department: this.target_department.join(),
        auto_push: this.auto_push
      };
      if (this.queue.queue_config){
        // console.log(this.queue_cf);
        this.queue.queue_config.queues=[];
        this.queue.queue_config.customers=[];
        for (let i=0; i< this.queue_cf.length; i++){
          this.queue.queue_config.queues.push(this.queue_cf[i].id);
          this.queue.queue_config.customers.push(this.queue_cf[i].customers);
        }
        queue.queue_config = this.queue.queue_config;
      }
      if (!this.synchronized){
        queue.queue_config = null;

      }

      queueService
        .update(queue)
        .then(
          function () {
            this.notify(
              this.$t("Toasts.Successful"),
              this.$t("Queue.Edit.ToastSuccess"),
              "success"
            );
            // router.go(-1);
          }.bind(this)
        )
        .catch(
          function () {
            this.notify(
              this.$t("Toasts.Error"),
              this.$t("Queue.Edit.ToastFail"),
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
    addCounter() {},
    deleteCounter(item, index) {
      this.activeEditPrompt = false;
      this.$vs.dialog({
        type: "confirm",
        color: "danger",
        title: this.$t("Queue.Counter.DeletePrompt.Title"),
        text: this.$t("Queue.Counter.DeletePrompt.Text"),
        acceptText: this.$t("Toasts.AcceptButton"),
        cancelText: this.$t("Toasts.CancelButton"),
        accept: function () {
          this.showLoading();
          counterService
            .delete(this.queue.id, item.id)
            .then(
              function () {
                this.queue.counters.splice(index, 1);
                this.notify(
                  this.$t("Toasts.Successful"),
                  this.$t("Queue.Counter.DeletePrompt.ToastSuccess"),
                  "success"
                );
              }.bind(this)
            )
            .catch(
              function () {
                this.notify(
                  this.$t("Toasts.Error"),
                  this.$t("Queue.Counter.DeletePrompt.ToastFail"),
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
    close() {
      this.selected = { name: "", id: "" };
      this.queue_translations = {
        ar: "",
        fr: "",
        en: "",
        de: "",
        es: "",
        ru: "",
        pt: "",
      };
    },
    updateQueueTranslations() {
      this.showLoading();
      queueService
        .updateTranslations(this.$route.params.id, {
          translations: this.queue_translations,
        })
        .then(
          function () {
            this.notify(
              this.$t("Toasts.Successful"),
              this.$t("Queue.Edit.TranslationPrompt.ToastSuccess"),
              "success"
            );
          }.bind(this)
        )
        .catch(
          function () {
            this.notify(
              this.$t("Toasts.Error"),
              this.$t("Queue.Edit.TranslationPrompt.ToastFail"),
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
  },
  computed: {
    ...mapState({
      workingDays: (state) => state.account.user.working_days,
    }),
  },
  mounted() {
     queueService.getAll().then( function (data) {
    this.queuesList = data.queues.data;
  }.bind(this))
    this.showLoading();
    this.languages = this.$i18n.availableLocales;
    queueService.getQueueSlots(this.$route.params.id).then(data =>{
      this.vipQueueSlots=data.slots;
      this.vipQueueSlots.push({start: "", end: "", numberSlot: 1 })
    })

    this.queueWorkingDays = { ...this.workingDays };
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
        }.bind(this)
      );

    teamService.getAll().then(
      function (data) {
        this.teamMembersList = data.team.data.map(function (obj) {
          return { id: obj.id, name: obj.fname + " " + obj.lname };
        });
      }.bind(this)
    );

    queueService.getById(this.$route.params.id).then(
      function (data) {
        this.queue = data.queue;
        this.queue.services = data.services.map((obj) => {
          return obj.id;
        });
        this.queue.members = data.queue.members.map((obj) => {
          return obj.id;
        });
        this.queue.queue_config = JSON.parse(data.queue.queue_config);

        this.queue.counters = data.queue.counters;
        this.queue.working_days = data.working_days;

        if(data.queue.targeted_departments.length>0){
          const self= this;
          this.auto_push= true;
          data.queue.targeted_departments.map((obj)=>{
            self.target_department.push(obj.department_id);
            return obj;
          });
        }

        if (data.queue.queue_config.queue_lead_id == this.$route.params.id){
          this.synchronized = true;
          for (let i = 0; i < this.queue.queue_config.queues.length; i++) {
            this.queue_cf.push({"id":this.queue.queue_config.queues[i],"customers":this.queue.queue_config.customers[i]});
          }
        }

      }.bind(this)
    );

    queueService.getTranslations(this.$route.params.id).then(
      function (data) {
        if (data.translations.translations != null) {
          this.queue_translations = data.translations.translations;
        }
      }.bind(this)
    ).finally(()=>{
      this.hideLoading();
    });

    departmentService.getAll().then(function (data) {
      this.departments = data.departments;
      console.log(this.departments);
    }.bind(this));
  },
  components: {
    QueueWorkingDay,
  },
};
</script>
<style >
.vs-popup {
  width: 45% !important;
}
</style>