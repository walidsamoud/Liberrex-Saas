<template>
  <vs-row vs-justify="center" id="queue-box">
    <vs-col type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-xs="12">
      <vs-card id="queue-create-form">
        <vs-input
          class="inputx w-100 mb-4"
          :label="$t('Queue.Create.QueueName')"
          :placeholder="$t('Queue.Create.QueueName')"
          v-model="name"
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
          v-model="services"
        >
          <vs-select-item
            :key="'service_'+index"
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
          v-model="members"
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
              v-model="ticket_number_type"
            >
              <vs-select-item value="Rand" :text="$t('Queue.Create.TicketNumberTypeRand')" />
              <vs-select-item value="Incr" :text="$t('Queue.Create.TicketNumberTypeIncr')" />
            </vs-select>
          </vs-col>
          <vs-col vs-w="4">
            <vs-input
              class="inputx w-100 mb-4"
              :label="$t('Queue.Create.TicketNumberStart')"
              v-model="ticket_start"
            />
          </vs-col>
          <vs-col vs-w="4">
            <vs-input
              class="inputx w-100 mb-4"
              :label="$t('Queue.Create.TicketPrefix')"
              v-model="ticket_prefix"
            />
          </vs-col>
        </vs-row>

        <vs-checkbox
          class="justify-content-start w-100 mb-4"
          v-model="ask_covid"
        >{{$t('Queue.Create.AskCovid')}}</vs-checkbox>

        <vs-checkbox
          class="justify-content-start w-100 mb-4"
          v-model="require_booking"
        >{{$t('Queue.Create.RequireBooking')}}</vs-checkbox>

        <vs-checkbox
          class="justify-content-start w-100 mb-4"
          v-model="choosable"
        >{{$t('Queue.Create.TeamMembersChoosable')}}</vs-checkbox>

        <vs-checkbox
          class="justify-content-start w-100 mb-4"
          v-model="auto_call"
        >{{$t('Queue.Create.AutoCall')}}</vs-checkbox>

                <vs-checkbox
          class="justify-content-start w-100 mb-4"
          v-model="synchronized"
        >{{$t('Queue.Create.Synchronized')}}</vs-checkbox>

        <div v-if="synchronized">
                  <label class="vs-input--label mb-2">{{$t('Booking.CreatePrompt.QueuePlaceholder')}}:</label>
             <vs-row v-for="(item,index) in queues" :key="'queue_'+index">
          <vs-col vs-lg="5" vs-md="11" vs-sm="10" vs-xs="9">
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
              v-model="item.number"
            />
                    </vs-col>
          <vs-col vs-lg="1" vs-md="1" vs-sm="2" vs-xs="13">
            <vs-button
              v-if="index+1 == queues.length"
              color="primary"
              class="w-100"
              type="filled"
              @click="addQueue"
            >
              <i class="mdi mdi-plus-box"></i>
            </vs-button>
            <vs-button
              v-if="index+1 < queues.length"
              color="danger"
              class="w-100"
              type="filled"
              @click="deleteQueue(index)"
            >
              <i class="mdi mdi-delete"></i>
            </vs-button>
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
        <vs-row v-for="(item,index) in counters" :key="'counter_'+index">
          <vs-col vs-lg="11" vs-md="11" vs-sm="10" vs-xs="9">
            <vs-input
              class="inputx w-100 mb-4"
              :placeholder="$t('Queue.Create.CounterName')"
              v-model="item.name"
            />
          </vs-col>
          <vs-col vs-lg="1" vs-md="1" vs-sm="2" vs-xs="3">
            <vs-button
              v-if="index+1 == counters.length"
              color="primary"
              class="w-100"
              type="filled"
              @click="addCounter"
            >
              <i class="mdi mdi-plus-box"></i>
            </vs-button>
            <vs-button
              v-if="index+1 < counters.length"
              color="danger"
              class="w-100"
              type="filled"
              @click="deleteCounter(index)"
            >
              <i class="mdi mdi-delete"></i>
            </vs-button>
          </vs-col>
        </vs-row>

        <label class="vs-input--label mb-2 mt-3">{{$t('Queue.Create.WorkingDays')}}:</label>
        <QueueWorkingDay :key="index" v-for="(day, index) in queueWorkingDays" :day="day"></QueueWorkingDay>
        <label class="vs-input--label mb-2">Translate : Vip slots</label>
        
        <hr class="custom-hr mt-5" />
        <div class="btn-alignment text-right">
          <vs-button
            color="primary"
            type="filled"
            @click="submitForm"
            id="create-submit-button"
          >{{$t('Queue.Create.SubmitButton')}}</vs-button>
        </div>
      </vs-card>
      <!--V-Tour start-->
      <v-tour name="QueuesCreate" :steps="steps">
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
                  <button @click="tour.nextStep" class="v-step__button">Next</button>
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
import QueueWorkingDay from "../../components/queue/QueueWorkingDay";
import {
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
    name: "",
    choosable: 0,
    ticket_start: 0,
    ticket_prefix: "",
    ask_covid: false,
    auto_call: false,
    synchronized: false,
    require_booking: false,
    ticket_number_type: "Rand",
    queueWorkingDays: [],
    servicesList: [],
    queuesList: [],
    queues: [{ title: "" }],
    teamMembersList: [],
    services: [],
    members: [],
    errors: {
      name: false,
      services: false,
      members: false,
    },
    counters: [{ name: "" }],
    
    steps: [
      {
        target: "#queue-create-form", // We're using document.querySelector() under the hood
        header: {
          title: "New queue form",
        },
        params: {
          placement: "top-start", // Any valid Popper.js placement. See https://popper.js.org/popper-documentation.html#Popper.placements
        },
      },
      {
        target: "#create-submit-button",
        params: {
          placement: "auto", // Any valid Popper.js placement. See https://popper.js.org/popper-documentation.html#Popper.placements
        },
      },
    ],
    departments: [],
    target_department: [],
    auto_push: false
  }),
  methods: {
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
    validateFields() {
      this.errors.name = this.name ? false : true;
      this.errors.services = this.services.length > 0 ? false : true;
      this.errors.members = this.members.length > 0 ? false : true;

      let { name, services, members } = this.errors;
      return !(name || services || members);
    },
    reset() {
      this.name = "";
      (this.services = []), (this.members = []);
    },
    hideLoading() {
      this.$vs.loading.close("#queue-box > .con-vs-loading");
    },
    submitForm() {
      let res = this.validateFields();
      // console.log (this.queues);
      let queues_priority = [];
      let customer_priority = [];
      
      
      if (!res) {
        return false;
      }
      this.showLoading();

      var queue = {
        title: this.name,
        services: this.services.join(),
        members: this.members.join(),
        counters: this.counters.map(function (obj) {
          return obj.name;
        }),
        choosable: this.choosable,
        ask_covid: this.ask_covid,
        auto_call: this.auto_call,
        require_booking: this.require_booking,
        ticket_start: this.ticket_start,
        ticket_prefix: this.ticket_prefix,
        ticket_number_type: this.ticket_number_type,
        target_department: this.target_department.join(),
        working_days: JSON.stringify(this.queueWorkingDays),
        auto_push: this.auto_push
      };
      if (this.synchronized){
        this.queues.forEach(obj => {
        queues_priority.push(obj.id);
        customer_priority.push(obj.number);    
      });
        let queue_config = {
          "queues":queues_priority,
          "customers":customer_priority,
        }
        queue.queue_config=JSON.stringify(queue_config);
      }
      queueService
        .create(queue)
        .then(
          function (data) {
            this.notify(
              this.$t("Toasts.Successful"),
              this.$t("Queue.Create.ToastSuccess"),
              "success"
            );
            // router.go(-1);
          }.bind(this)
        )
        .catch(
          function () {
            this.notify(
              this.$t("Toasts.Error"),
              this.$t("Queue.Create.ToastFail"),
              "danger"
            );
          }.bind(this)
        )
        .finally(
          function () {
            this.hideLoading();
            // this.reset();
          }.bind(this)
        );
    },
    addCounter() {
      this.counters.push({ value: "" });
    },
    addQueue() {
      console.log(this.queues);
      this.queues.push({ value: "" });
    },
    deleteCounter(index) {
      this.counters.splice(index, 1);
    },
    deleteQueue(index) {
      this.queues.splice(index, 1);
    },
    goToNextPage() {
      router.push({ path: "/bookings?istour=on" });
    },
  },
  computed: {
    ...mapState({
      workingDays: (state) => state.account.user.working_days,
    }),
  },
  mounted() {
    this.queueWorkingDays = { ...this.workingDays };
  queueService.getAll().then( function (data) {
    console.log(data.queues.data);
    this.queuesList = data.queues.data;
  }.bind(this))
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

    teamService.getAll().then(
      function (data) {
        this.teamMembersList = data.team.data.map(function (obj) {
          return { id: obj.id, name: obj.fname + " " + obj.lname };
        });
      }.bind(this)
    );
    this.$t("Queue.Create.Content").map(
      (content, index) => (this.steps[index].content = content)
    );
    this.$route.query.istour && localStorage.getItem("skipTour") != "true"
      ? this.$tours["QueuesCreate"].start()
      : "";

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
