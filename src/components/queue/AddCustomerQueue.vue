<template>
  <div >
      <div  class="con-exemple-prompt p-4">
        <vs-row>
          <vs-col vs-w="8">
            <CustomerSelectFilter v-if="!addNewCustomer" :customer_id="customer_id" ref="customerFilter" class="mb-4"></CustomerSelectFilter>
          </vs-col>
          <vs-col vs-w="4">
            <vs-button class="w-100" @click="addNewCustomerClick">{{$t('Booking.CreatePrompt.CreateNewCustomer')}}</vs-button>
          </vs-col>
        </vs-row>


        <vs-select
            :placeholder="$t('Booking.CreatePrompt.ServicePlaceholder')"
            class="w-100 mb-4"
            :label="$t('Booking.Services')"
            autocomplete
            multiple
            v-model="services"
            @change="validateAddFilds()"        >

            <vs-select-item
              :key="index"
              :value="item.id"
              :text="item.title"
              v-for="(item,index) in servicesList"
            />
          </vs-select>
       

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
          <vs-select-item :key="'member_'+index" :value="item.id" :text="item.fname+' '+item.lname" v-for="(item,index) in teamMembers" />
          </vs-select>
          <vs-row>
                        

        <vs-col vs-w="12" class="text-right mt-4">
          <vs-button @click="close()" type="border" color="primary" class="border-0 border-bottom mr-4"> {{$t('Components.Queue.AddCustomerPrompt.CancelButton')}} </vs-button>
          <vs-button @click="pushCustomer()" :disabled="!addCustomerIsValid" color="primary" class="pr-5 pl-5 float-right"> {{$t('Components.Queue.AddCustomerPrompt.PushButton')}} </vs-button>
        </vs-col>
          </vs-row>
      </div>

    <!-- </vs-prompt> -->
         
  </div>
  
</template>

<script>

import CustomerSelectFilter from '../../components/shared/CustomerSelectFilter'
import { queueService } from '../../_services'
import { customerService } from '../../_services'

export default {
  name: "AddCustomerQueue",
  data: () => ({
    themeColors: ['#4e31ef', '#36bea6', '#f62d51', '#ffbc34', '#212529'],
	topbarColor: '#2962ff',
	updatedThemeColor: '#2962ff',
    addCustomerIsValid : false,
    title: "AddCustomerQueue",
    isActive: false,
    customersList: [],
    counterList: [],
    services: [],
    queue_prop: "",
    counter: "",
    customer: {},
    addNewCustomer: false,
    selectMember: false,
    fname: "",
    lname: "",
    phone_number: "",
    address: "",
    email: "",
    internalId: "",
    member: -1,
    active: "",
    onlyCountries: ["GB", "FR", "TN", "US"],
    country: "",

  }),
  props: {
    servicesList: Array,
    teamMembers: Array,
    queue_id: Number,
    customer_id: Number,
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
    show(){

      this.active = true
    },
    hide(){
      this.active = false
    },
    pushCustomer(){

      this.show();
      this.showLoading();

      let customer = {
      queue_id: this.queue_id,
      services: this.services.join(),
      customer_id: this.addNewCustomer ? null : this.$refs.customerFilter.value.id,
      member_id: this.selectMember ? this.member : -1,
      create_customer: this.addNewCustomer ? 1 : 0,
      fname: this.fname,
      lname: this.lname,
      phone: this.phone,
      email: this.email,
      internal_id: this.internalId,
      phone_number: this.addNewCustomer ? ("+"+this.country+this.phone_number).replace(/\s/g, '') :this.phone_number
      }

      queueService.push(customer).then(function () {
        //console.log(customer);
        this.$emit('create');
        this.close();
        this.notify(this.$t('Toasts.Successful'), this.$t('Components.Queue.AddCustomerPrompt.ToastSuccessMessage'), 'success');
        this.reset();
      }.bind(this)).catch(function () {
        this.notify(this.$t('Toasts.Error'), this.$t('Components.Queue.AddCustomerPrompt.ToastErrorMessage'), 'danger');
      }.bind(this)).finally(function () {
        this.hideLoading();
      }.bind(this))

    },
    validateAddFilds(){
      this.addCustomerIsValid = (this.services.length>0 && this.$refs.customerFilter.value.id)    },
    countryChanged(data) {
      this.country = data.dialCode;
    },
    log(){
      // eslint-disable-next-line no-console
        console.log(this.servicesList);
        // console.log(this.teamMembers);
    },
    close(){
      this.$emit('updateSidebar', 'close');
    },
    addNewCustomerClick(){
      this.addNewCustomer = !this.addNewCustomer;
      this.$emit('newCustomer', ['customer','queue']);
    },
    reset(){
      this.$refs.customerFilter.value = null;
      this.addCustomerIsValid = false;
      this.services = [];
      this.customer = {};
      this.addNewCustomer = false;
      this.selectMember = false;
      this.fname = "";
      this.lname = "";
      this.phone_number = "";
      this.address = "";
      this.email = "";
      this.internalId = "";
      this.member = -1;
    }
  },
  computed: {
      topbarColorControl: {
            get() { return this.topbarColor; },
            set(val) { this.$emit('updateTopbarColor', val) }
        },

  },
  mounted() {
    customerService.getAll().then(function (data) {
      this.customersList = [];
      data.customers.data.forEach(obj => {
        this.customersList.push({id: obj.id, name: obj.fname+' '+obj.lname+' ( '+obj.phone_number+' )'});
      });
    }.bind(this));
  },
  components: {
    CustomerSelectFilter,
    //CustomizerAddCustomer,
    //AddNewCustomer
  }
};
</script>