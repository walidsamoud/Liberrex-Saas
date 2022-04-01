<template>
  <vs-row vs-justify="center" id="rules-box">
    <vs-col type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-xs="12">
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
            <vs-input :danger="errors.name"
                      :danger-text="$t('Errors.InvalidPolite', {field: $t('Rule.AddRulePrompt.NamePlaceholder')})"
                      class="inputx w-100" :placeholder="$t('Rule.AddRulePrompt.NamePlaceholder')" v-model="rule.name" />
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
            <vs-radio v-model="rule.type" vs-value="booking" class="justify-content-md-start mr-5"> {{$t('Rule.AddRulePrompt.FlowTargetBooking')}}</vs-radio>
            <vs-radio v-model="rule.type" vs-value="queue" class="justify-content-md-start mr-5"> {{$t('Rule.AddRulePrompt.FlowTargetQueue')}}</vs-radio>
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
            <vs-radio v-model="rule.customer_book_id" vs-value="1" class="justify-content-md-start mr-5"> {{$t('Rule.AddRulePrompt.ApplyForAllCustomers')}}</vs-radio>
            <vs-radio v-model="rule.customer_book_id" vs-value="2" class="justify-content-md-start mr-5"> {{$t('Rule.AddRulePrompt.ApplyForVipCustomers')}}</vs-radio>
            <vs-radio v-model="rule.customer_book_id" vs-value="3" class="justify-content-md-start mr-5"> {{$t('Rule.AddRulePrompt.ApplyForNewCustomers')}}</vs-radio>
            <vs-radio v-model="rule.customer_book_id" vs-value="4" class="justify-content-md-start mr-5"> {{$t('Rule.AddRulePrompt.ApplyForBlacklisted')}}</vs-radio>
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
            <vs-radio v-model="rule.action" color="success" vs-value="approve" class="justify-content-md-start mr-5"> {{$t('Rule.AddRulePrompt.ActionApprove')}} </vs-radio>
            <vs-radio v-model="rule.action" color="danger" vs-value="decline" class="justify-content-md-start mr-5"> {{$t('Rule.AddRulePrompt.ActionDecline')}} </vs-radio>
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
              <vs-radio v-model="rule.time_frame" vs-value="forever" class="justify-content-md-start mr-5"> {{$t('Rule.AddRulePrompt.TimeFrameForever')}} </vs-radio>
              <vs-radio v-model="rule.time_frame" vs-value="custom" class="justify-content-md-start mr-5"> {{$t('Rule.AddRulePrompt.TimeFrameCustom')}} </vs-radio>
              <label v-if="errors.time_frame"
                     class="text-danger">{{$t('Errors.Required', {field: $t('Rule.AddRulePrompt.TimeFrame')})}}:</label>
            </div>
            <div v-if="rule.time_frame == 'custom'" class="mt-2">
              <vs-row>
                <vs-col vs-w="6">
                  <vs-input :danger="errors.start_date"
                            :danger-text="$t('Errors.InvalidPolite', {field: $t('Rule.AddRulePrompt.TimeFrameCustomStartDate')})"
                            :label="$t('Rule.AddRulePrompt.TimeFrameCustomStartDate')" type="date" class="w-100 mb-4" v-model="rule.start_date"/>
                </vs-col>
                <vs-col vs-w="6">
                  <vs-input
                          :danger="errors.end_date"
                          :danger-text="$t('Errors.InvalidPolite', {field: $t('Rule.AddRulePrompt.TimeFrameCustomEndDate')})"
                          :label="$t('Rule.AddRulePrompt.TimeFrameCustomEndDate')" type="date" class="w-100 mb-4" v-model="rule.end_date"/>
                </vs-col>
              </vs-row>
            </div>
          </vs-col>
        </vs-row>

        <hr class="custom-hr mt-5" />
        <h4 class="mt-4 pt-2">{{$t('Rule.AddRulePrompt.WorkingDays')}}</h4>
        <vs-row class="mt-4">
          <vs-col vs-lg="12" vs-xs="12" vs-sm="12">
            <QueueWorkingDay :key="index" v-for="(day, index) in rule.working_days" :day="day"></QueueWorkingDay>
          </vs-col>
        </vs-row>

        <hr class="custom-hr mt-5" />
        <div class="btn-alignment text-right">
          <vs-button color="primary" type="filled" @click="submitForm">Save</vs-button>
          <vs-button color="dark" type="filled">Cancel</vs-button>
        </div>
      </vs-card>
    </vs-col>
  </vs-row>
</template>

<script>
import { rulesService } from '../../../_services'
import QueueWorkingDay from '../../../components/queue/QueueWorkingDay'
import router from '../../../_helpers/router'
export default {
  name: "EditRule",
  data: () => ({
    title: "Edit Rule",
    rule: {
      name: '',
      type: '',
      customer_book_id: '',
      action: '',
      time_frame: '',
      start_date: '',
      end_date: '',
      working_days: [ ]
    },
    errors:{
      name: false,
      type: false,
      customer_book_id: false,
      action: false,
      time_frame: false,
      start_date: false,
      end_date: false
    },
  }),
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
        container: '#rules-box',
        scale: 0.6
      });
    },
    hideLoading(){
      this.$vs.loading.close('#rules-box > .con-vs-loading')
    },
    validateUpdatedFields() {
      this.errors.name = this.rule.name ? this.rule.name.length < 3 ? true : false : true;
      this.errors.type = this.rule.type ? false : true;
      this.errors.customer_book_id = this.rule.customer_book_id ? false : true;
      this.errors.action = this.rule.action ? false : true;
      this.errors.time_frame = this.rule.time_frame ? false : true;

      if (this.rule.time_frame == "custom") {
        this.errors.start_date = this.rule.start_date ? false : true;
        this.errors.end_date =  this.rule.end_date ? false : true;
      }
      else{
        this.errors.start_date = false;
        this.errors.end_date = false;
      }

      let {name, type, customer_book_id, action, time_frame, start_date, end_date} = this.errors;
      return !(name || type || customer_book_id || action || time_frame || start_date || end_date);
    },
    submitForm(){
      let res = this.validateUpdatedFields();
      if (!res) {
        return false;
      }
      this.showLoading();
      rulesService.update(this.rule).then(function () {
        this.notify(this.$t('Toasts.Successful'), this.$t('Rule.EditRulePrompt.ToastSuccess'), 'success');
        router.go(-1)
      }.bind(this)).catch(function () {
        this.notify(this.$t('Toasts.Error'), this.$t('Rule.EditRulePrompt.ToastFail'), 'danger');
      }.bind(this)).catch(function () {
        this.hideLoading();
      }.bind(this));
    }

  },
  computed: {

  },
  mounted() {
    rulesService.getById(this.$route.params.id).then(function (data) {
      this.rule = data.rule;
    }.bind(this));

  },
  components: {
    QueueWorkingDay
  }
};
</script>
