<template>
  <vs-row vs-justify="center">
    <vs-col type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-xs="12" id="rules-boxs">
      <vs-card>

        <h4 class="mt-4">{{$t('Rule.AddRulePrompt.RuleSettings')}}</h4>
        <vs-row class="mt-4">
          <vs-col
                  vs-lg="2"
                  vs-xs="12"
                  vs-sm="4"
                  class="d-flex align-items-center justify-content-start justify-content-md-end"
          >
            <label class="vs-input--label mb-0">{{$t('Rule.AddRulePrompt.NameLabel')}}:</label>
          </vs-col>
          <vs-col vs-lg="10" vs-xs="12" vs-sm="8">
            <vs-input
                    :danger="errors.name"
                    :danger-text="$t('Errors.InvalidPolite', {field: $t('Rule.AddRulePrompt.NamePlaceholder')})"
                    class="inputx w-100" :placeholder="$t('Rule.AddRulePrompt.NamePlaceholder')" v-model="name" />
          </vs-col>
        </vs-row>
        <vs-row class="mt-4">
          <vs-col
                  vs-lg="2"
                  vs-xs="12"
                  vs-sm="4"
                  class="d-flex align-items-center justify-content-start justify-content-md-end"
          >
            <label class="vs-input--label mb-0">{{$t('Rule.AddRulePrompt.FlowTarget')}}:</label>
          </vs-col>
          <vs-col vs-lg="10" vs-xs="12" vs-sm="8" class="d-flex">
            <vs-radio v-model="type" vs-value="booking" class="justify-content-md-start mr-5"> {{$t('Rule.AddRulePrompt.FlowTargetBooking')}}</vs-radio>
            <vs-radio v-model="type" vs-value="queue" class="justify-content-md-start mr-5"> {{$t('Rule.AddRulePrompt.FlowTargetQueue')}}</vs-radio>
            <label v-if="errors.type"
                   class="text-danger">{{$t('Errors.Required', {field: $t('Rule.AddRulePrompt.FlowTarget')})}}:</label>
          </vs-col>
        </vs-row>
        <vs-row class="mt-4">
          <vs-col
                  vs-lg="2"
                  vs-xs="12"
                  vs-sm="4"
                  class="d-flex align-items-center justify-content-start justify-content-md-end"
          >
            <label class="vs-input--label mb-0">{{$t('Rule.AddRulePrompt.ApplyFor')}}:</label>
          </vs-col>
          <vs-col vs-lg="10" vs-xs="12" vs-sm="8"  class="d-flex">
            <vs-radio v-model="customer_book_id" vs-value="1" class="justify-content-md-start mr-5"> {{$t('Rule.AddRulePrompt.ApplyForAllCustomers')}}</vs-radio>
            <vs-radio v-model="customer_book_id" vs-value="2" class="justify-content-md-start mr-5"> {{$t('Rule.AddRulePrompt.ApplyForVipCustomers')}}</vs-radio>
            <vs-radio v-model="customer_book_id" vs-value="3" class="justify-content-md-start mr-5"> {{$t('Rule.AddRulePrompt.ApplyForNewCustomers')}}</vs-radio>
            <vs-radio v-model="customer_book_id" vs-value="4" class="justify-content-md-start mr-5"> {{$t('Rule.AddRulePrompt.ApplyForBlacklisted')}}</vs-radio>
            <label v-if="errors.customer_book_id"
                   class="text-danger">{{$t('Errors.Required', {field: $t('Rule.AddRulePrompt.ApplyFor')})}}:</label>
          </vs-col>
        </vs-row>

        <vs-row class="mt-4">
          <vs-col
                  vs-lg="2"
                  vs-xs="12"
                  vs-sm="4"
                  class="d-flex align-items-center justify-content-start justify-content-md-end"
          >
            <label class="vs-input--label mb-0">{{$t('Rule.AddRulePrompt.Action')}}:</label>
          </vs-col>
          <vs-col vs-lg="10" vs-xs="12" vs-sm="8" class="d-flex">
            <vs-radio v-model="action" color="success" vs-value="approve" class="justify-content-md-start mr-5"> {{$t('Rule.AddRulePrompt.ActionApprove')}} </vs-radio>
            <vs-radio v-model="action" color="danger" vs-value="decline" class="justify-content-md-start mr-5"> {{$t('Rule.AddRulePrompt.ActionDecline')}} </vs-radio>
            <label v-if="errors.action"
                   class="text-danger">{{$t('Errors.Required', {field: $t('Rule.AddRulePrompt.Action')})}}:</label>
          </vs-col>
        </vs-row>

        <vs-row class="mt-4">
          <vs-col
                  vs-lg="2"
                  vs-xs="12"
                  vs-sm="4"
                  class="d-flex align-items-center justify-content-start justify-content-md-end"
          >
            <label class="vs-input--label mb-0">{{$t('Rule.AddRulePrompt.TimeFrame')}}:</label>
          </vs-col>
          <vs-col vs-lg="10" vs-xs="12" vs-sm="8">
            <div  class="d-flex">
              <vs-radio v-model="time_frame" vs-value="forever" class="justify-content-md-start mr-5"> {{$t('Rule.AddRulePrompt.TimeFrameForever')}} </vs-radio>
              <vs-radio v-model="time_frame" vs-value="custom" class="justify-content-md-start mr-5"> {{$t('Rule.AddRulePrompt.TimeFrameCustom')}} </vs-radio>
              <label v-if="errors.time_frame"
                     class="text-danger">{{$t('Errors.Required', {field: $t('Rule.AddRulePrompt.TimeFrame')})}}:</label>
            </div>
            <div v-if="time_frame == 'custom'" class="mt-2">
              <vs-row>
                <vs-col vs-w="6">
                  <vs-input
                          :danger="errors.start_date"
                          :danger-text="$t('Errors.InvalidPolite', {field: $t('Rule.AddRulePrompt.TimeFrameCustomStartDate')})"
                          :label="$t('Rule.AddRulePrompt.TimeFrameCustomStartDate')" type="date" class="w-100 mb-4" v-model="start_date"/>
                </vs-col>
                <vs-col vs-w="6">
                  <vs-input
                          :danger="errors.end_date"
                          :danger-text="$t('Errors.InvalidPolite', {field: $t('Rule.AddRulePrompt.TimeFrameCustomEndDate')})"
                          :label="$t('Rule.AddRulePrompt.TimeFrameCustomEndDate')" type="date" class="w-100 mb-4" v-model="end_date"/>
                </vs-col>
              </vs-row>
            </div>
          </vs-col>
        </vs-row>

        <hr class="custom-hr mt-5" />
        <h4 class="mt-4 pt-2">{{$t('Rule.AddRulePrompt.WorkingDays')}}</h4>
        <vs-row class="mt-4">
          <vs-col vs-lg="12" vs-xs="12" vs-sm="12">
            <QueueWorkingDay :key="index" v-for="(day, index) in ruleWorkingDays" :day="day"></QueueWorkingDay>
          </vs-col>
        </vs-row>

        <hr class="custom-hr mt-5" />
        <div class="btn-alignment text-right">
          <vs-button id="create-rule-button" color="primary" type="filled" @click="submitForm">{{$t('Rule.AddRulePrompt.SubmitButton')}}</vs-button>
        </div>
      </vs-card>
      <!--V-Tour start-->
      <v-tour name="RulesCreate" :steps="steps">
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
              <template v-if="tour.currentStep === 1">
                <div slot="actions" class="v-step__buttons">
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
import QueueWorkingDay from '../../../components/queue/QueueWorkingDay'
import { rulesService } from '../../../_services'
import router from '../../../_helpers/router'
import { mapState } from 'vuex'
export default {
  name: "CreateRule",
  data: () => ({
    title: "New Rule",
    name: '',
    type: '',
    customer_book_id: '',
    action: '',
    time_frame: '',
    start_date: '',
    end_date: '',
    errors:{
      name: false,
      type: false,
      customer_book_id: false,
      action: false,
      time_frame: false,
      start_date: false,
      end_date: false
    },
    ruleWorkingDays: [ ],
    steps: [
      {
        target: '#rules-boxs',  // We're using document.querySelector() under the hood
        params: {
          placement: 'auto' // Any valid Popper.js placement. See https://popper.js.org/popper-documentation.html#Popper.placements
        }
      },
      {
        target: '#create-rule-button',
        params: {
          placement: 'bottom' // Any valid Popper.js placement. See https://popper.js.org/popper-documentation.html#Popper.placements
        }
      }
    ],
  }),
  methods: {
    notify(title, text, type) {
      this.$vs.notify({
        color: type,
        title: title,
        text: text
      });
    },
    validateFields() {
      this.errors.name = this.name ? this.name.length < 3 ? true : false : true;
      this.errors.type = this.type ? false : true;
      this.errors.customer_book_id = this.customer_book_id ? false : true;
      this.errors.action = this.action ? false : true;
      this.errors.time_frame = this.time_frame ? false : true;

      if (this.time_frame == "custom") {
        this.errors.start_date = this.start_date ? false : true;
        this.errors.end_date =  this.end_date ? false : true;
      }
      else{
        this.errors.start_date = false;
        this.errors.end_date = false;
      }

      let {name, type, customer_book_id, action, time_frame, start_date, end_date} = this.errors;
      return !(name || type || customer_book_id || action || time_frame || start_date || end_date);
    },
    showLoading(){
      this.$vs.loading({
        container: '#rules-box',
        scale: 0.6
      });
    },
    hideLoading(){
      this.$vs.loading.close('#rules-box > .con-vs-loading')
    },
    handleSelected(){
      /* eslint-disable */
      console.log(this.selected);
    },
    submitForm(){
      let res = this.validateFields();
      if (!res) {
        return false;
      }
      this.showLoading();
      let rule = {
        name: this.name,
        type: this.type,
        action: this.action,
        time_frame: this.time_frame,
        start_date: this.start_date,
        end_date: this.end_date,
        customer_book_id: this.customer_book_id,
        working_days: this.ruleWorkingDays
      };
      rulesService.create(rule).then(function () {
        this.notify(this.$t('Toasts.Successful'), this.$t('Rule.AddRulePrompt.ToastSuccess'), 'success');
        router.go(-1)
      }.bind(this)).catch(function () {
        this.notify(this.$t('Toasts.Error'), this.$t('Rule.AddRulePrompt.ToastFail'), 'danger');
      }.bind(this)).finally(function () {
        this.hideLoading();
      }.bind(this));
    },
    goToNextPage(){
      router.push({ path: "/settings/rules?istour=on&step=next" });
    },
  },
  computed: {
    ...mapState({
      workingDays: state => state.account.user.working_days,
    })
  },
  mounted(){
    this.ruleWorkingDays = {...this.workingDays}
    this.$t('Rule.Create.Content').map((content,index)=> (
            this.steps[index].content = content
    ));
    setTimeout(() => this.$route.query.istour && localStorage.getItem('skipTour') !='true' ? this.$tours['RulesCreate'].start() : '', 500);
  },
  components:{
    QueueWorkingDay
  }
};
</script>
