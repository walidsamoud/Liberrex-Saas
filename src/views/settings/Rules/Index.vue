<template>
  <vs-row vs-justify="center" id="rules-box">
    <vs-col type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-xs="12">
      <vs-card>
        <vs-table
                @search="handleSearch"
                @sort="handleSort"
                v-model="selected"
                :total="totalItems"
                max-items="10"
                search
                :data="rules">
          <div slot="header">
            <vs-button id="add-rule-form" icon="add" color="primary" @click="goToCreate">{{$t('Rule.AddRuleButton')}}</vs-button>

          </div>
          <template slot="thead">
            <vs-th sort-key="name">{{$t('Rule.Table.Name')}}</vs-th>
            <vs-th sort-key="flow">{{$t('Rule.Table.Flow')}}</vs-th>
            <vs-th sort-key="customer_book">{{$t('Rule.Table.CustomerTarget')}}</vs-th>
            <vs-th sort-key="action">{{$t('Rule.Table.Action')}}</vs-th>
            <vs-th sort-key="created_at">{{$t('Rule.Table.CreatedAt')}}</vs-th>
            <vs-th >{{$t('Rule.Table.Options')}}</vs-th>
          </template>

          <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">

              <vs-td :data="data[indextr].name">
                <div class="d-flex align-items-center">
                  <h5 class="mb-0 font-12">{{data[indextr].name}}</h5>
                </div>
              </vs-td>

              <vs-td :data="data[indextr].type">
                <div class="d-flex align-items-center">
                  <span v-if="data[indextr].type == 'booking'">
                    <i class="mdi mdi-calendar mr-2 display-8"></i> {{$t('Rule.Table.FlowBooking')}}
                  </span>

                  <span v-if="data[indextr].type == 'queue'">
                    <i class="mdi mdi-view-list mr-2 display-8"></i> {{$t('Rule.Table.FlowQueue')}}
                  </span>
                </div>
              </vs-td>


              <vs-td :data="data[indextr].customer_book_id">
                <div class="d-flex align-items-center">
                  <span v-if="data[indextr].customer_book_id == 1">
                    <vs-chip>
                      <vs-avatar icon="supervised_user_circle" color="success"/>
                      {{$t('Rule.Table.CustomerTargetAll')}}
                      </vs-chip>
                  </span>

                  <span v-if="data[indextr].customer_book_id == 2">
                    <vs-chip>
                      <vs-avatar icon="star" color="warning"/>
                      {{$t('Rule.Table.CustomerTargetVIP')}}
                      </vs-chip>
                  </span>

                  <span v-if="data[indextr].customer_book_id == 3">
                    <vs-chip >
                      <vs-avatar icon="new_releases" color="primary"/>
                      {{$t('Rule.Table.CustomerTargetNew')}}
                    </vs-chip>
                  </span>

                  <span v-if="data[indextr].customer_book_id == 4">
                    <vs-chip>
                      <vs-avatar icon="block" color="danger"/>
                      {{$t('Rule.Table.CustomerTargetBlacklisted')}}
                      </vs-chip>
                  </span>
                </div>
              </vs-td>


              <vs-td :data="data[indextr].action">
                <div class="d-flex align-items-center">
                  <span v-if="data[indextr].action == 'approve'">
                    <vs-chip color="success">
                      <vs-avatar icon="check" color="success"/>
                      {{$t('Rule.Table.ActionApprove')}}
                      </vs-chip>
                  </span>

                  <span v-if="data[indextr].action == 'decline'">
                    <vs-chip color="danger">
                      <vs-avatar icon="close" color="danger"/>
                      {{$t('Rule.Table.ActionDecline')}}
                      </vs-chip>
                  </span>
                </div>
              </vs-td>


              <vs-td :data="data[indextr].created_at">
                <div class="d-flex align-items-center">
                  <i class="mdi mdi-calendar-text mr-2 display-8"></i>
                  {{formatDate(data[indextr].created_at)}}
                </div>
              </vs-td>

              <vs-td>
                <div class="btn-alignment">
                  <vs-button id="edit-rule-button" radius color="warning" type="border" icon="edit" @click="goToEdit(data[indextr].id)"></vs-button>
                  <vs-button radius color="danger" type="border" icon="delete" @click="deleteRule(data[indextr])"></vs-button>
                </div>
              </vs-td>

            </vs-tr>
          </template>
        </vs-table>
        <vs-pagination :total="totalPages" @change="handleChangePage" v-model="currentPage"></vs-pagination>
      </vs-card>
      <!--V-Tour start-->
      <v-tour name="Rules" :steps="steps">
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
                  <button @click="goToNextPage('rules/create')" class="v-step__button">Next</button>
                </div>
              </template>
              <template v-if="tour.currentStep === 1">
                <div slot="actions" class="v-step__buttons">
                  <button @click="goToNextPage('membership')" class="v-step__button">Next</button>
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
import { rulesService } from '../../../_services'
import router from '../../../_helpers/router'
// moment

export default {
  name: "Rules",
  data: () => ({
    title: "Rules",
    activePrompt: false,
    activeUpdatePrompt: false,
    rules: [],
    promptData: {service_id: 0, duration: ''},
    selected: {},
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    maxItems:0,
    steps: [
      {
        target: '#add-rule-form',  // We're using document.querySelector() under the hood
        params: {
          placement: 'right-start' // Any valid Popper.js placement. See https://popper.js.org/popper-documentation.html#Popper.placements
        }
      },
      {
        target: '#edit-rule-button',
        params: {
          placement: 'auto' // Any valid Popper.js placement. See https://popper.js.org/popper-documentation.html#Popper.placements
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
    handleSearch(keyword) {
      if(keyword == ''){
        rulesService.getAll().then(function (data) {
          this.rules = data.rules.data;
          this.totalItems = data.rules.total;
          this.totalPages = data.rules.last_page;
          this.maxItems = data.rules.per_page;
        }.bind(this));
      }
      rulesService.filter(keyword).then(function (data) {
        this.rules = data.rules.data;
        this.totalItems = data.rules.total;
      }.bind(this));
    },
    handleChangePage(page) {
      rulesService.getPage(page).then(function (data) {
        this.rules = data.rules.data;
      }.bind(this));
    },
    updateService(){

    },
    handleSort(key, active) {
      /* eslint-disable */
      console.log({key, active});
    },
    formatDate: function (value) {
      let date = this.$moment(value).format('DD MMMM YYYY [at] HH:mm');
      return date;
    },
    deleteRule(rule) {
      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: this.$t('Rule.DeleteRulePrompt.Title'),
        text: this.$t('Rule.DeleteRulePrompt.Text', {rule: rule.name}),
        acceptText: this.$t('Toasts.AcceptButton'),
        cancelText: this.$t('Toasts.CancelButton'),
        accept: function () {
          this.showLoading();
          rulesService.delete(rule.id).then(function (data) {
            this.handleChangePage(this.currentPage);
            this.notify(this.$t('Toasts.Successful'), this.$t('Rule.DeleteRulePrompt.ToastSuccess'), 'success');
          }.bind(this)).catch(function () {
            this.notify(this.$t('Toasts.Error'), this.$t('Rule.DeleteRulePrompt.ToastFail'), 'danger');
          }.bind(this)).finally(function () {
            this.hideLoading();
          }.bind(this));
        }.bind(this)
      });
    },
    goToCreate(){
      router.push({ path: "/settings/rules/create" });
    },
    goToEdit(id){
      router.push({ path: "/settings/rules/"+id });
    },
    goToNextPage(page){
      router.push({ path: "/settings/"+page+"?istour=on" });
    },
  },
  computed: {

  },
  mounted(){

    rulesService.getPage(this.currentPage).then(function (data) {
      this.rules = data.rules.data;
      this.totalItems = data.rules.total;
      this.maxItems = data.rules.per_page;
      this.totalPages = data.rules.last_page;
      this.$t('Rule.Content').map((content,index)=> (
              this.steps[index].content = content
      ));
      this.$route.query.istour && localStorage.getItem('skipTour') !='true' && !this.$route.query.step ? this.$tours['Rules'].start() : '';
      this.$route.query.istour && localStorage.getItem('skipTour') !='true' && this.$route.query.step ? this.$tours['Rules'].start(1) : '';
    }.bind(this));

  }
};
</script>
