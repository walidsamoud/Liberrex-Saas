<template>
  <div>
    <vs-row vs-justify="center" id="membership-box">
      <vs-col vs-w="12">
        <vs-card>
          <div>
            <vs-alert :title="$t('Membership.TrialTitle')" color="success" :active="onTrial" class="mb-4">
               {{$t('Membership.TrialDaysText')}}
              <b>{{$t('Membership.TrialDaysLeft', {hours: trialDaysLeft.h, days: trialDaysLeft.d})}}</b>.
              <br>
              {{ $t('Membership.TrialFeatures') }}.
            </vs-alert>

            <vs-popup color="#28a745" class="holamundo"  :title="$t('Membership.PaymentPopup.Success.Title')" :active.sync="popupSuccessActive">
              <img :src="require('@/assets/images/paymentMethods/Success-icon.png')" class="img-popup-icon"/>
              <h5 style="text-align: center;">
               {{$t('Membership.PaymentPopup.Success.Message')}}
              </h5>
              <p style="text-align: center;">
                {{$t('Membership.PaymentPopup.Success.Text')}}
              </p>
            </vs-popup>
            
            <vs-popup color="#dc3545" class="holamundo"  :title="$t('Membership.PaymentPopup.Fail.Title')" :active.sync="popupFailActive">
              <img :src="require('@/assets/images/paymentMethods/Fail-Icon.png')" class="img-popup-icon"/>
              <h5 style="text-align: center;">
                {{$t('Membership.PaymentPopup.Fail.Message')}}
              </h5>
              <p style="text-align: center;">
                {{$t('Membership.PaymentPopup.Fail.Text')}}
              </p>
            </vs-popup>

            <vs-row class="text-center" id="subscribe-button">
              <vs-col vs-lg="3" vs-md="3" vs-sm="6" vs-xs="12" class="mt-3">
                <div class="border p-4">
                  <h4>{{packages.liberfree.name}}</h4>
                  <p>{{ $t('Membership.Free') }} <br> {{ $t('Membership.Forever') }} </p>
                  <p class="text-center p-0 m-0">
                  </p>
                  <ul class="pack-feature-list" style="list-style-type:none">
                    <li>{{$t('Membership.CustomerFlowManagement')}}</li>
                    <li>{{$t('Membership.CustomerDatabase')}}</li>
                    <li>{{$t('Membership.RealTimeStatistics')}}</li>
                    <li style="text-decoration: line-through;">{{$t('Membership.OnlineCustomerRequests')}}</li>
                    <li style="text-decoration: line-through;">{{$t('Membership.DigitalSignage')}} </li>
                    <li style="text-decoration: line-through;">{{$t('Membership.SelfCheckinTerminal')}}</li>
                    <br>
                  </ul>
                  <p class="text-center p-0 mt-4">
                    <vs-button color="primary" type="border" class="w-100" @click="activatePrompt('LIBERFREE')"
                               v-if="subscription.package != 'LIBERFREE'">
                      {{$t('Membership.SubscribeButton')}}
                    </vs-button>
                    <span class="mt-2 text-danger" v-if="subscription.package == 'LIBERFREE'">
                      {{$t('Membership.YouAreSubscribedToFree', {package: subscription.package})}}.
                    </span>
                  </p>
                </div>
              </vs-col>

              <vs-col vs-lg="3" vs-md="3" vs-sm="6" vs-xs="12" class="mt-3">
                <div class="border p-4">
                  <h4>{{packages.liberuno.name}}</h4>
                  <p>{{packages.currency}} {{packages.liberuno.monthlyPrice}} / {{$t('Membership.Month')}} <br> {{packages.currency}} {{packages.liberuno.yearlyPrice}} / {{$t('Membership.Year')}}</p>
                  <p class="text-center p-0 m-0">
                  </p>
                  <ul class="pack-feature-list" style="list-style-type:none">
                    <li>{{$t('Membership.CustomerFlowManagement')}}</li>
                    <li>{{$t('Membership.CustomerDatabase')}}</li>
                    <li>{{$t('Membership.RealTimeStatistics')}}</li>
                    <li>{{$t('Membership.OnlineCustomerRequests')}}</li>
                    <li style="text-decoration: line-through;">{{$t('Membership.DigitalSignage')}} </li>
                    <li style="text-decoration: line-through;">{{$t('Membership.SelfCheckinTerminal')}}</li>
                    <br>
                  </ul>
                  <p class="text-center p-0 mt-4">
                    <vs-button color="primary" type="border" class="w-100" @click="activatePrompt('LIBERUNO')"
                               v-if="subscription.package != 'LIBERUNO'">
                      {{$t('Membership.SubscribeButton')}}
                    </vs-button>
                    <span class="mt-2 text-danger" v-if="subscription.package == 'LIBERUNO'">
                      {{$t('Membership.YouAreSubscribedToPackage', {package: subscription.package, plan: $t('Membership.'+jsUcfirst(subscription.plan))})}}.
                    </span>
                  </p>
                </div>
              </vs-col>

              <vs-col vs-lg="3" vs-md="3" vs-sm="6" vs-xs="12" class="mt-3">
                <div class="border bg-info text-white p-4">
                  <h4>{{packages.liberup.name}}</h4>
                  <p>{{packages.currency}} {{packages.liberup.monthlyPrice}} / {{$t('Membership.Month')}} <br> {{packages.currency}} {{packages.liberup.yearlyPrice}} / {{$t('Membership.Year')}}</p>
                  <p class="text-center p-0 m-0">
                  </p>
                  <ul class="pack-feature-list" style="list-style-type:none">
                    <li>{{$t('Membership.CustomerFlowManagement')}}</li>
                    <li>{{$t('Membership.CustomerDatabase')}}</li>
                    <li>{{$t('Membership.RealTimeStatistics')}}</li>
                    <li>{{$t('Membership.OnlineCustomerRequests')}}</li>
                    <li>{{$t('Membership.DigitalSignage')}} </li>
                    <li style="text-decoration: line-through;">{{$t('Membership.SelfCheckinTerminal')}}</li>
                    <br>
                  </ul>
                  <p class="text-center p-0 mt-4">
                    <vs-button color="light" type="border" class="w-100" @click="activatePrompt('LIBERUP')"
                               v-if="subscription.package != 'LIBERUP'">
                      {{$t('Membership.SubscribeButton')}}
                    </vs-button>
                    <span class="mt-4 text-white" v-if="subscription.package == 'LIBERUP'">
                      {{$t('Membership.YouAreSubscribedToPackage', {package: subscription.package, plan: $t('Membership.'+jsUcfirst(subscription.plan))})}}.
                    </span>
                  </p>
                </div>
              </vs-col>

              <vs-col vs-lg="3" vs-md="3" vs-sm="6" vs-xs="12" class="mt-3">
                <div class="border p-4">
                  <h4>{{packages.liberpro.name}}</h4>
                  <p><small>{{packages.currency}} {{packages.liberpro.monthlyPrice}} / {{$t('Membership.Month')}} + {{packages.currency}} {{packages.liberpro.unitPrice}} / {{$t('Membership.Transaction')}} <br> {{packages.currency}}{{packages.liberpro.yearlyPrice}} / {{$t('Membership.Year')}} + {{packages.currency}}{{packages.liberpro.unitPrice}} / {{$t('Membership.Transaction')}}</small></p>
                  <p class="text-center p-0 m-0">
                  </p>
                  <ul class="pack-feature-list" style="list-style-type:none">
                    <li>{{$t('Membership.CustomerFlowManagement')}}</li>
                    <li>{{$t('Membership.CustomerDatabase')}}</li>
                    <li>{{$t('Membership.RealTimeStatistics')}}</li>
                    <li>{{$t('Membership.OnlineCustomerRequests')}}</li>
                    <li>{{$t('Membership.DigitalSignage')}}</li>
                    <li>{{$t('Membership.SelfCheckinTerminal')}} </li>
                    <br>
                  </ul>
                  <p class="text-center p-0 mt-4">
                    <vs-button color="primary" type="border" class="w-100" @click="activatePrompt('LIBERPRO')"
                               v-if="subscription.package != 'LIBERPRO'">
                      {{$t('Membership.SubscribeButton')}}
                    </vs-button>
                    <span class="mt-2 text-danger" v-if="subscription.package == 'LIBERPRO'">
                      {{$t('Membership.YouAreSubscribedToPackage', {package: subscription.package, plan: $t('Membership.'+jsUcfirst(subscription.plan))})}}.
                    </span>
                  </p>
                </div>
              </vs-col>
            </vs-row>
          </div>
        </vs-card>
        <!--V-Tour start-->
        <v-tour name="Membership" :steps="steps">
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
                    <button @click="tour.previousStep" class="v-step__button">Previous</button>
                    <button @click="promptShow" class="v-step__button">Next</button>
                  </div>
                </template>
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
      </vs-col>
    </vs-row>

    <!--- Subscribe --->
    <vs-prompt
            color="primary"
            @accept="submitSubscribe"
            @close="close"
            :active.sync="activePrompt"
            :title="$t('Membership.SubscribePrompt.Title')"
            :accept-text="$t('Membership.SubscribePrompt.SubmitButton')"
            :cancel-text="$t('Membership.SubscribePrompt.CancelButton')"
            id="prompt-subscribe"
    >
      <div v-bar class="vs-scrollable">
        <div>
          <div class="con-exemple-prompt px-4 py-3">

            <h3 class="font-weight-light text-center">{{selectedPackage.name}}</h3>
            <h4 v-if="selectedPackage.selectedPlan == 'monthly'" class="text-center">{{packages.currency+" "+selectedPackage.monthlyPrice}} / {{$t('Membership.Month')}}</h4>
            <h4 v-if="selectedPackage.selectedPlan == 'yearly'" class="text-center">{{packages.currency+" "+selectedPackage.yearlyPrice}} / {{$t('Membership.Year')}}</h4>
            <p class="font-weight-light text-center">{{$t('Membership.ExcludeVat')}}</p>

            <vs-select
              class="w-100 mb-2 mt-2"
              size="large"
              placeholder="Plan"
              label="Plan"
              v-model="selectedPackage.selectedPlan"
            >
              <vs-select-item value="monthly" :text="$t('Membership.Monthly')" />
              <vs-select-item value="yearly" :text="$t('Membership.Yearly')" />
            </vs-select>


            <vs-select
                    class="w-100 mb-2 mt-2"
                    size="large"
                    :placeholder="$t('Billing.BillingMethodPlaceholder')"
                    :label="$t('Billing.BillingMethodLabel')"
                    v-model="selectedBillingMethod"
                    v-if="billingMethods.length > 0 && addNewBillingMethod == false"
            >
              <vs-select-item :key="index" :value="item.id" :text="item.card.brand+' **** **** **** '+item.card.last4 + ' | '+$t('Billing.Expires')+' '+ item.card.exp_month +'/'+ item.card.exp_year" v-for="(item,index) in billingMethods" />
            </vs-select>

            <vs-checkbox class="justify-content-start w-100 mb-2 mt-2" v-if="billingMethods.length > 0" v-model="addNewBillingMethod">{{$t('Billing.UseNewBillingMethod')}}</vs-checkbox>

            <div class="border p-4 mb-4" v-if="billingMethods.length == 0 || addNewBillingMethod == true">
              <h4 class="font-weight-light mb-2">{{$t('Billing.AddBillingMethod.Title')}}</h4>
              <span v-if="packages.paymentMethods.stripe == 'true' && packages.paymentMethods.runpay == 'false'" class="mb-4 font-weight-light text-black-50">{{$t('Billing.AddBillingMethod.Text')}}</span>
              <vs-row v-if="packages.paymentMethods.stripe == 'true' && packages.paymentMethods.runpay == 'true'">
                <vs-col vs-lg="6" class="border">
                  <img :src="require('@/assets/images/paymentMethods/runpay.png')" class="payment-logo"/>
                  <vs-radio v-model="payMethod" vs-value="runpay" style="margin-top:0px"></vs-radio>
                </vs-col>
                <vs-col vs-lg="6" class="border">
                  <img :src="require('@/assets/images/paymentMethods/visa-mastercard.png')" class="payment-logo"/>
                  <vs-radio v-model="payMethod" vs-value="stripe" style="margin-top:0px"></vs-radio>
                </vs-col>
              </vs-row>
              <vs-row v-if="packages.paymentMethods.runpay == 'true' && packages.paymentMethods.stripe == 'false'">
                <vs-col vs-lg="6" class="border p-1" vs-offset="3">
                  <img :src="require('@/assets/images/paymentMethods/runpay.png')" class="payment-logo"/>
                </vs-col>
              </vs-row>
              <vs-row v-if="packages.paymentMethods.stripe == 'true' && packages.paymentMethods.runpay == 'false'">
                <vs-col vs-lg="6" class="border p-1" vs-offset="3">
                  <img :src="require('@/assets/images/paymentMethods/visa-mastercard.png')" class="payment-logo"/>
                </vs-col>
              </vs-row>
              
              <card v-if="(payMethod=='stripe' || (packages.paymentMethods.stripe == 'true' && packages.paymentMethods.runpay == 'false')) && publishableKey "
                    class='stripe-card mt-4 border-bottom pb-2'
                    :class='{ complete }'
                    :stripe='publishableKey'
                    :options='stripeOptions'
                    @change='complete = $event.complete'
              />
              <vs-button v-if="payMethod=='stripe' || (packages.paymentMethods.stripe == 'true' && packages.paymentMethods.runpay == 'false' )" class='pay-with-stripe mt-4' @click='addCard' :disabled='!complete'>{{$t('Billing.AddBillingMethod.AddCardButton')}}</vs-button>

              <form id="runPayForm" action="https://psp.paymaster.tn/payment/init" method="POST" v-if="payMethod=='runpay' || (packages.paymentMethods.runpay == 'true' && packages.paymentMethods.stripe == 'false')">
                <input name="LMI_MERCHANT_ID" type="hidden" value="51bc7267-6a78-4e2d-bf89-f0ad3adbc93b" />
                <input name="LMI_PAYMENT_AMOUNT" type="hidden" :value="Total" />
                <input name="LMI_CURRENCY" type="hidden" :value="isoCurrency" />
                <input name="LMI_PAYMENT_NO" type="hidden" :value="paymentNumber" />
                <input name="LMI_PAYMENT_DESC" type="hidden" :value="selectedPackage.name+' - '+selectedPackage.selectedPlan" />
                <input name="LMI_SUCCESS_URL" type="hidden" value="http://localhost:8080/settings/membership?payment=1" />
                <input name="LMI_SUCCESS_METHOD" type="hidden" value="POST" />
                <input name="LMI_FAIL_URL" type="hidden" value="http://localhost:8080/settings/membership?payment=0" />
                <input name="LMI_FAIL_METHOD" type="hidden" value="POST" />

              </form>
            </div>

            <vs-row class="border-top pt-4 mt-4">

              <vs-col vs-w="9" class="text-left mb-2">
                <vs-input :placeholder="$t('Membership.Coupon')" class="w-100" v-model="coupon"/>
              </vs-col>
              <vs-col vs-w="3" class="text-right mb-2">
                <vs-button color="success" class="w-100" @click="applyCoupon">{{$t('Membership.ApplyCouponButton')}}</vs-button>
              </vs-col>

              <vs-col vs-w="6" class="text-left mt-2"><h6 class="font-weight-light">{{$t('Membership.SubTotal')}}:</h6></vs-col>
              <vs-col vs-w="6" class="text-right mt-2"><h5>{{packages.currency+" "+subTotal}}</h5></vs-col>

              <vs-col v-if="couponValue.percent_off" vs-w="6" class="text-left mt-2"><h6 class="font-weight-light">{{$t('Membership.Coupon')}} (-{{couponValue.percent_off}})%:</h6></vs-col>
              <vs-col v-if="couponValue.percent_off" vs-w="6" class="text-right mt-2"><h5>-{{packages.currency+" "+couponTotal}}</h5></vs-col>

              <vs-col vs-w="6" class="text-left mt-2"><h6 class="font-weight-light">{{$t('Membership.VAT')}} ({{vatPercentage}}%):</h6></vs-col>
              <vs-col vs-w="6" class="text-right mt-2"><h5>{{packages.currency+" "+vatTotal}}</h5></vs-col>

              <vs-col vs-w="6" class="text-left mt-2"><h6 class="font-weight-light">{{$t('Membership.Total')}}:</h6></vs-col>
              <vs-col vs-w="6" class="text-right mt-2"><h5>{{packages.currency+" "+Total}}</h5></vs-col>

            </vs-row>
          </div>
        </div>
      </div>
      <v-tour name="MembershipSubscribe" :steps="steps">
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
                  <button @click="goToNextPage" class="v-step__button">Next</button>
                </div>
              </template>
              <!--<template v-if="tour.currentStep === 1">
                  <div slot="actions" @click="promptShow">
                      <button @click="tour.nextStep" class="btn btn-primary btn-lg outline">Next step</button>
                  </div>
              </template>-->
            </v-step>
          </transition>
        </template>
      </v-tour>
    </vs-prompt>
  </div>
</template>

<script>
import { Card, createToken } from 'vue-stripe-elements-plus'
import { mapState, mapActions } from 'vuex'
import { membershipService, billingService , paymentService } from '../../_services'
import router from "../../_helpers/router";
export default {
  name: "Membership",
  data: () => ({
    title: "Membership",
    activePrompt: false,
    paymentRequired: false,
    addNewBillingMethod: false,
    payMethod:'',
    paymentNumber: '',
    selectedPackage: {
      name: "",
      monthlyPrice: "0",
      yearlyPrice: "0",
      unitPrice: "0",
      selectedPlan: "monthly"
    },
    popupSuccessActive : false,
    popupFailActive : false,
    business: { },
    subscription: { },
    onTrial: false,
    onGenericTrial: false,
    trialDaysLeft: {},
    billingMethods: [],
    selectedBillingMethod: {},
    publishableKey: '',
    token: null,
    charge: null,
    coupon: '',
    couponValue: {
      percent_off: 0
    },
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
        target: '#membership-box',  // We're using document.querySelector() under the hood
        params: {
          placement: 'bottom' // Any valid Popper.js placement. See https://popper.js.org/popper-documentation.html#Popper.placements
        }
      },
      {
        target: '#subscribe-button',
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
        container: '#membership-box',
        scale: 0.6
      });
    },
    hideLoading(){
      this.$vs.loading.close('#membership-box > .con-vs-loading')
    },
    submitSubscribe(){

      this.activePrompt = true;
      this.showLoading();

      if(this.payMethod == 'runpay'){
        this.generatePaymentNumber();
        return;
      }

      let payload = {
        product: this.selectedPackage.name,
        plan: this.selectedPackage.selectedPlan,
        billing_method: this.selectedBillingMethod.id,
        coupon: this.couponValue.id
      };

      membershipService.update(payload)
              .then(function () {
                this.notify(this.$t('Toasts.Successful'), this.$t('Membership.SubscribePrompt.ToastSuccess'), 'success');
                this.getMemberships();
                this.activePrompt = false;
              }.bind(this))
              .catch(function () {
                this.notify(this.$t('Toasts.Error'), this.$t('Membership.SubscribePrompt.ToastFail'), 'danger');
              }.bind(this))
              .finally(function () {
                this.hideLoading();
              }.bind(this));

    },
    close(){},
    activatePrompt(item){
      switch (item) {
        case 'LIBERFREE':
          this.paymentRequired = false;
          this.selectedPackage = {
            name: this.packages.liberfree.name,
            monthlyPrice: this.packages.liberfree.monthlyPrice,
            yearlyPrice: this.packages.liberfree.yearlyPrice,
            unitPrice: this.packages.liberfree.unitPrice,
            selectedPlan: "monthly"
          }
          break;
        case 'LIBERUNO':
          this.paymentRequired = true;
          this.selectedPackage = {
            name: this.packages.liberuno.name,
            monthlyPrice: this.packages.liberuno.monthlyPrice,
            yearlyPrice: this.packages.liberuno.yearlyPrice,
            unitPrice: this.packages.liberuno.unitPrice,
            selectedPlan: "monthly"
          }
          break;
        case 'LIBERUP':
          this.paymentRequired = true;
          this.selectedPackage = {
            name: this.packages.liberup.name,
            monthlyPrice: this.packages.liberup.monthlyPrice,
            yearlyPrice: this.packages.liberup.yearlyPrice,
            unitPrice: this.packages.liberup.unitPrice,
            selectedPlan: "monthly"
          }
          break;
        case 'LIBERPRO':
          this.paymentRequired = false;
          this.selectedPackage = {
            name: this.packages.liberpro.name,
            monthlyPrice: this.packages.liberpro.monthlyPrice,
            yearlyPrice: this.packages.liberpro.yearlyPrice,
            unitPrice: this.packages.liberpro.unitPrice,
            selectedPlan: "monthly"
          }
          break;
      }
      this.activePrompt = true;
    },
    getBillingMethods(){

      billingService.getAll().then(function (data) {
        this.billingMethods = data.billing_methods.data;
        this.addNewBillingMethod = this.billingMethods.length == 0;
      }.bind(this)).catch(function () {

      }.bind(this));
    },
    addCard () {

      this.showLoading();

      createToken().then(function (data){
        billingService.create({payment_method_id: data.token.id}).then(function (data) {
          this.notify(this.$t('Toasts.Successful'), this.$t('Billing.AddBillingMethod.ToastSuccess'), 'success');
          this.getBillingMethods();
          this.selectedBillingMethod = data.id;
          this.addNewBillingMethod = false;
        }.bind(this)).catch(function () {
          this.notify(this.$t('Toasts.Error'), this.$t('Billing.AddBillingMethod.ToastFail'), 'danger');
        }.bind(this)).finally(function () {
          this.hideLoading();
        }.bind(this))
      }.bind(this))
    },
    getMemberships(){
      membershipService.getAll().then(function (data) {
        this.onTrial = data.onTrial;
        this.onGenericTrial = data.onGenericTrial;
        this.trialDaysLeft = data.trialDaysLeft;
        this.subscription = data.subscription;
      }.bind(this));
    },
    applyCoupon(){
      this.showLoading();
      billingService.getCoupon(this.coupon).then(function (data) {
        this.couponValue = data.coupon;
      }.bind(this)).catch(function () {

      }.bind(this)).finally(function () {
        this.hideLoading();
      }.bind(this));
    },
    jsUcfirst(string)
    {
      let plan = string.split('-')[1];
      return plan.charAt(0).toUpperCase() + plan.slice(1);
    },
    promptShow(){
      this.$tours['Membership'].stop();
      this.activatePrompt('LIBERFREE');
      this.steps[0].content=this.$t('Customer.Prompt.Content');
      this.steps[0].target='footer .vs-button-filled';
      this.steps[0].params.placement="auto";
      setTimeout(() => this.$tours['MembershipSubscribe'].start(), 500);
    },
    goToNextPage(){
      this.activePrompt = false;
      router.push({ path: "/settings/billing?istour=on" });
    },
    generatePaymentNumber(){
      let transaction = {
        purchases : this.selectedPackage.name,
        business_id : this.business_info.id,
        user_id : this.account_info.id,
        currency : this.isoCurrency,
        method : "RunPay",
        amount : this.Total,
        plan : this.selectedPackage.selectedPlan
      }
      paymentService.createTransaction(transaction).then((data) => {
        //console.log(data);
        this.paymentNumber = data.transaction.key;
        //console.log(this.paymentNumber);
      }).finally(() => {
          document.getElementById("runPayForm").submit();
        })
      //console.log(this.Total,this.business_info,this.account_info,this.isoCurrency,"RunPay",this.selectedPackage.name);
    }
      
  },
  computed: {
    ...mapState({
      business_info: state => state.account.user.business,
      account_info: state => state.account.user.user
    }),
    isoCurrency: function () {
      switch (localStorage.getItem('Server')) {
        case 'tn': return process.env.VUE_APP_CURRENCY_TND;
        default: return process.env.VUE_APP_CURRENCY;
      }
    },
    subTotal: function () {
      return this.selectedPackage.selectedPlan == 'monthly' ?
              this.selectedPackage.monthlyPrice :
              this.selectedPackage.yearlyPrice;
    },
    couponTotal: function () {
      let discount = this.couponValue.percent_off / 100;
      return this.selectedPackage.selectedPlan == 'monthly' ?
              (parseFloat(this.selectedPackage.monthlyPrice)*discount).toFixed(2) :
              (parseFloat(this.selectedPackage.yearlyPrice)*discount).toFixed(2);
    },
    discountedTotal: function () {
      return parseFloat(this.subTotal)-parseFloat(this.couponTotal);
    },
    vatTotal: function () {
      let vat = (this.vatPercentage/100);
      return (parseFloat(this.discountedTotal)*vat).toFixed(2);
    },
    Total: function () {
      return (parseFloat(this.discountedTotal)+parseFloat(this.vatTotal)).toFixed(2);
    },
    vatPercentage: function(){
      switch (localStorage.getItem('Server')) {
        case 'tn': return process.env.VUE_APP_VAT_TN;
        default: return process.env.VUE_APP_VAT;
      }
    },
    countryCurrency: function(){
      switch (localStorage.getItem('Server')) {
        case 'tn': return process.env.VUE_APP_CURRENCY_TND;
        default: return process.env.VUE_APP_VAT;
      }
    },
    packages: function () {

      switch(localStorage.getItem('Server')) {
        case 'tn': return {
          liberfree : {
            name: process.env.VUE_APP_LIBERFREE_NAME,
            monthlyPrice: process.env.VUE_APP_LIBERFREE_MONTHLY_PRICE_TN,
            yearlyPrice: process.env.VUE_APP_LIBERFREE_YEARLY_PRICE_TN,
            unitPrice: process.env.VUE_APP_LIBERFREE_UNIT_PRICE
          },
          liberuno : {
            name: process.env.VUE_APP_LIBERUNO_NAME,
            monthlyPrice: process.env.VUE_APP_LIBERUNO_MONTHLY_PRICE_TN,
            yearlyPrice: process.env.VUE_APP_LIBERUNO_YEARLY_PRICE_TN,
            unitPrice: process.env.VUE_APP_LIBERUNO_UNIT_PRICE
          },
          liberup : {
            name: process.env.VUE_APP_LIBERUP_NAME,
            monthlyPrice: process.env.VUE_APP_LIBERUP_MONTHLY_PRICE_TN,
            yearlyPrice: process.env.VUE_APP_LIBERUP_YEARLY_PRICE_TN,
            unitPrice: process.env.VUE_APP_LIBERUP_UNIT_PRICE
          },
          liberpro : {
            name: process.env.VUE_APP_LIBERPRO_NAME,
            monthlyPrice: process.env.VUE_APP_LIBERPRO_MONTHLY_PRICE_TN,
            yearlyPrice: process.env.VUE_APP_LIBERPRO_YEARLY_PRICE_TN,
            unitPrice: process.env.VUE_APP_LIBERPRO_UNIT_PRICE_TN
          },
          currency : '',
          paymentMethods : {
            stripe : '',
            runpay : ''
          }

        };
        default: return {
          liberfree : {
            name: process.env.VUE_APP_LIBERFREE_NAME,
            monthlyPrice: process.env.VUE_APP_LIBERFREE_MONTHLY_PRICE,
            yearlyPrice: process.env.VUE_APP_LIBERFREE_YEARLY_PRICE,
            unitPrice: process.env.VUE_APP_LIBERFREE_UNIT_PRICE
          },
          liberuno : {
            name: process.env.VUE_APP_LIBERUNO_NAME,
            monthlyPrice: process.env.VUE_APP_LIBERUNO_MONTHLY_PRICE,
            yearlyPrice: process.env.VUE_APP_LIBERUNO_YEARLY_PRICE,
            unitPrice: process.env.VUE_APP_LIBERUNO_UNIT_PRICE
          },
          liberup : {
            name: process.env.VUE_APP_LIBERUP_NAME,
            monthlyPrice: process.env.VUE_APP_LIBERUP_MONTHLY_PRICE,
            yearlyPrice: process.env.VUE_APP_LIBERUP_YEARLY_PRICE,
            unitPrice: process.env.VUE_APP_LIBERUP_UNIT_PRICE
          },
          liberpro : {
            name: process.env.VUE_APP_LIBERPRO_NAME,
            monthlyPrice: process.env.VUE_APP_LIBERPRO_MONTHLY_PRICE,
            yearlyPrice: process.env.VUE_APP_LIBERPRO_YEARLY_PRICE,
            unitPrice: process.env.VUE_APP_LIBERPRO_UNIT_PRICE
          },
          currency : '',
          paymentMethods : {
            stripe : '',
            runpay : ''
          }

        }
      }

    }
  },
  created(){
    this.business = {...this.business_info};
    this.getMemberships();
    this.getBillingMethods();
    this.publishableKey =process.env.VUE_APP_STRIPE_KEY;
  },
  components: {
    Card
  },
  mounted() {
    this.$t('Membership.Content').map((content,index)=> (
            this.steps[index].content = content
    ));
    this.$route.query.istour && localStorage.getItem('skipTour') !='true' ? this.$tours['Membership'].start() : '';
    if(this.$route.query.force){
      this.activatePrompt(this.$route.query.force)
    }
    switch(this.countryCurrency) {
      case 'USD':
        this.packages.currency = "$"
        break;
      case 'EUR':
        this.packages.currency = "€"
        break;
      case 'GBP':
        this.packages.currency = "£"
        break;
      case 'TND': 
        this.packages.currency = "DT"
        break;
    }
    this.packages.paymentMethods.runpay = process.env.VUE_APP_PAYMENT_METHOD_RUNPAY;
    this.packages.paymentMethods.stripe = process.env.VUE_APP_PAYMENT_METHOD_STRIPE;
    if(this.$route.query.payment == 1) {
      this.popupSuccessActive = true;
    }
    else if (this.$route.query.payment == 0) {
      this.popupFailActive = true;
    }
  }
};
</script>
<style>
  .payment-logo {
    margin-top: 15px;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 15px;
    width: auto;
    height: auto;
    max-width: 80px;
    max-height: 30px;
    top:50%;
    left:50%;
    display:table;
  }
  .img-popup-icon {
    width: 100%;
    height: auto;
    max-width: 150px;
    max-height: 150px;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 15px;
    top:50%;
    left:50%;
    display:table;
    }
</style>