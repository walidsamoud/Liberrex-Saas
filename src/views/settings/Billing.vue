<template>
  <div id="billing-content">

    <vs-row vs-justify="center" id="billing-box">
      <vs-col vs-w="6">
        <vs-card >
          <div slot="header" class="d-flex align-items-center">
            <h3>{{$t('Billing.BillingMethods')}}</h3>
          </div>
          <div>

            <div class="border p-4 mb-4">
              <h4 class="font-weight-light">{{$t('Billing.AddBillingMethod.Title')}}</h4>
              <span class="mb-4 font-weight-light text-black-50">{{$t('Billing.AddBillingMethod.Text')}}</span>
              <card v-if="publishableKey"
                    class='stripe-card mt-4 border-bottom pb-2'
                    :class='{ complete }'
                    :stripe='publishableKey'
                    :options='stripeOptions'
                    @change='complete = $event.complete'
                    id="add-payment"
              />
              <vs-button class='pay-with-stripe mt-4' @click='pay' :disabled='!complete'>{{$t('Billing.AddBillingMethod.AddCardButton')}}</vs-button>
            </div>

            <vs-alert v-if="methods.length == 0" active="true" color="warning" class="mb-2">
              {{$t('Billing.NoBillingMethodsAttached')}}
            </vs-alert>

          </div>

          <vs-row class="mt-5">
            <vs-col vs-w="12" :key="index" v-for="(item,index) in methods" class="">
              <vs-card class="shadow-none border">
                <div>
                  <h4 class="font-weight-light">{{item.card.brand}} {{$t('Billing.EndingWith')}} {{item.card.last4}}</h4>
                  <span class="text-black-50">{{$t('Billing.Expires')}} {{item.card.exp_month}} / {{item.card.exp_year}}</span>
                </div>
                <div slot="footer">
                  <vs-row vs-justify="flex-end">
                    <vs-button class="mr-2" type="gradient" color="danger" icon="delete" @click="deleteCard(item)"></vs-button>
                  </vs-row>
                </div>
              </vs-card>
            </vs-col>
          </vs-row>
        </vs-card>
      </vs-col>

      <vs-col vs-w="6">
        <vs-card id="billing-invoices">
          <div slot="header" class="d-flex align-items-center">
            <h3>{{$t('Billing.Invoices')}}</h3>
          </div>
          <div>

            <vs-row :key="'invoice_'+index" v-for="(item,index) in invoices" class="mb-4">
              <vs-col vs-w="8">
                <b>{{item.number}}</b> <br>
                <span class="text-cyan">
                    <i class="mdi mdi-calendar"></i> {{invoiceDate(item.date)}} |
                    <a :href="item.download" class="text-cyan" target="_blank" download>
                      <i class="mdi mdi-download"></i> {{$t('Billing.Download')}}
                    </a>
                </span>
              </vs-col>
              <vs-col vs-w="4" class="text-right font-weight-bold">
                ${{item.total}}
                <i v-if="item.paid" class="mdi mdi-check-circle text-success ml-2"></i>
                <i v-if="!item.paid" class="mdi mdi-close-circle text-danger ml-2"></i>
              </vs-col>
            </vs-row>

          </div>
        </vs-card>
      </vs-col>

      <!--V-Tour start-->
      <v-tour name="Billing" :steps="steps">
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
              <template v-if="tour.currentStep === 2">
                <div slot="actions" class="v-step__buttons">
                  <button @click="tour.previousStep" class="v-step__button">Previous</button>
                  <button @click="goToNextPage" class="v-step__button">Next</button>
                </div>
              </template>
            </v-step>
          </transition>
        </template>
      </v-tour>

    </vs-row>

  </div>
</template>

<script>

import { Card, createToken } from 'vue-stripe-elements-plus'
import { mapState, mapActions } from 'vuex'
import { billingService } from '../../_services'
import router from "../../_helpers/router";
export default {
  name: "Billing",
  data: () => ({
    title: "Billing",
    activePrompt: false,
    business: { },
    methods: [],
    payMethod :'',
    invoices: [],
    loading: false,
    amount: 1000,
    publishableKey: '',
    token: null,
    charge: null,
    complete: false,
    stripeOptions: {
      hidePostalCode:true,
      style: {
        base: {
          iconColor: '#c4f0ff',
          color: '#000',
          fontWeight: 500,
          fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
          fontSize: '16px',
          fontSmoothing: 'antialiased',
          ':-webkit-autofill': {
            color: '#fce883',
          },
          '::placeholder': {
            color: '#87BBFD',
          },
        }
      }
      // see https://stripe.com/docs/stripe.js#element-options for details
    },
    steps: [
      {
        target: '#billing-box',  // We're using document.querySelector() under the hood
        params: {
          placement: 'bottom-start' // Any valid Popper.js placement. See https://popper.js.org/popper-documentation.html#Popper.placements
        }
      },
      {
        target: '#billing-invoices',
      },
      {
        target: '#add-payment',
        params: {
          placement: 'bottom' // Any valid Popper.js placement. See https://popper.js.org/popper-documentation.html#Popper.placements
        }
      }
    ],
  }),
  methods: {
    ...mapActions('account', ['updateUserObject']),
    notify(title, text, type) {
      this.$vs.notify({
        color: type,
        title: title,
        text: text
      });
    },
    showLoading(){
      this.$vs.loading({
        container: '#billing-box',
        scale: 0.6
      });
    },
    hideLoading(){
      this.$vs.loading.close('#billing-box > .con-vs-loading')
    },
    pay () {
      this.showLoading();
      // createToken returns a Promise which resolves in a result object with
      // either a token or an error key.
      // See https://stripe.com/docs/api#tokens for the token object.
      // See https://stripe.com/docs/api#errors for the error object.
      // More general https://stripe.com/docs/stripe.js#stripe-create-token.
      createToken().then(function (data){
        billingService.create({payment_method_id: data.token.id}).then(function () {
          this.notify(this.$t('Toasts.Successful'), this.$t('Billing.AddBillingMethod.ToastSuccess'), 'success');
          this.getMethods();
        }.bind(this)).catch(function () {
          this.notify(this.$t('Toasts.Error'), this.$t('Billing.AddBillingMethod.ToastFail'), 'danger');
        }.bind(this)).finally(function () {
          this.hideLoading();
        }.bind(this))
      }.bind(this))
    },
    getMethods(){
      billingService.getAll().then(function (data) {
        this.methods = data.billing_methods.data;
        this.invoices = data.invoices;
      }.bind(this)).catch(function () {

      }.bind(this))
    },
    deleteCard(item){
      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: this.$t('Billing.DeleteBillingMethod.Title'),
        text: this.$t('Billing.DeleteBillingMethod.Text', {last4: item.card.last4}),
        acceptText: this.$t('Toasts.AcceptButton'),
        cancelText: this.$t('Toasts.CancelButton'),
        accept: function () {
          this.showLoading();
          billingService.delete(item.id).then(function () {
            this.getMethods();
            this.notify(this.$t('Toasts.Successful'), this.$t('Billing.DeleteBillingMethod.ToastSuccess'), 'success');
          }.bind(this)).catch(function () {
            this.notify(this.$t('Toasts.Error'), this.$t('Billing.DeleteBillingMethod.ToastFail'), 'danger');
          }.bind(this)).finally(function () {
            this.hideLoading();
          }.bind(this));
        }.bind(this)
      });
    },
    invoiceDate (date) {
      return this.$moment(date).format('DD MMM YYYY')
    },
    goToNextPage (){
      router.push({ path: "/settings/general?istour=on" });
    }
  },
  computed: {
    ...mapState({
      business_info: state => state.account.user.business,
    })
  },
  mounted(){
    this.publishableKey = process.env.VUE_APP_STRIPE_KEY;
    this.business = {...this.business_info};
    this.getMethods();
    this.$t('Billing.Content').map((content,index)=> (
            this.steps[index].content = content
    ));
    setTimeout(() => localStorage.getItem('skipTour') !='true' ? this.$tours['Billing'].start():'', 500);
  },
  components: {
    Card
  }
};
</script>
<style>
  label {
    height: 35px;
    position: relative;
    color: #8798AB;
    display: block;
    margin-top: 30px;
    margin-bottom: 20px;
  }

  label > span {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    font-weight: 300;
    line-height: 32px;
    color: #8798AB;
    border-bottom: 1px solid #586A82;
    transition: border-bottom-color 200ms ease-in-out;
    cursor: text;
    pointer-events: none;
  }

  label > span span {
    position: absolute;
    top: 0;
    left: 0;
    transform-origin: 0% 50%;
    transition: transform 200ms ease-in-out;
    cursor: text;
  }

  label .field.is-focused + span span,
  label .field:not(.is-empty) + span span {
    transform: scale(0.68) translateY(-36px);
    cursor: default;
  }

  label .field.is-focused + span {
    border-bottom-color: #34D08C;
  }

  .field {
    background: transparent;
    font-weight: 300;
    border: 0;
    color: white;
    outline: none;
    cursor: text;
    display: block;
    width: 100%;
    line-height: 32px;
    padding-bottom: 3px;
    transition: opacity 200ms ease-in-out;
  }

  .field::-webkit-input-placeholder { color: #8898AA; }
  .field::-moz-placeholder { color: #8898AA; }

  /* IE doesn't show placeholders when empty+focused */
  .field:-ms-input-placeholder { color: #424770; }

  .field.is-empty:not(.is-focused) {
    opacity: 0;
  }

  .stripe-card {
    width: 100%;
  }
  .stripe-card.complete {
    border-color: green;
  }
  

</style>