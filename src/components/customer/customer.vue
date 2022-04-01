<template>
    <div>
        <vs-tabs :v-model="selectedTab"  alignment="fixed" v-on:click-tag="faza()">
            <vs-tab  :label="$t('Customer.Tabs.Customer')" >
            <CustomerDetails :selected="customer" :active="1">
            </CustomerDetails>
            <vs-button @click="close()" type="border" color="primary" class="border-0 border-bottom mr-4"> {{$t('Components.Queue.AddCustomerPrompt.CancelButton')}} </vs-button>

            </vs-tab>

            <vs-tab  :label="$t('Customer.Tabs.Modify')" >
                <UpdateCustomer :selected="customer" @close="close">
                </UpdateCustomer>
                            <!-- <vs-button @click="close()" type="border" color="primary" class="border-0 border-bottom mr-4"> {{$t('Components.Queue.AddCustomerPrompt.CancelButton')}} </vs-button> -->
            </vs-tab>

            <vs-tab  :label="$t('Customer.Tabs.ArchiveQueue')" @click="getQueueArchive()" >
                <QueueArchive :customer="customer">
                </QueueArchive>
                            <vs-button @click="close()" type="border" color="primary" class="border-0 border-bottom mr-4"> {{$t('Components.Queue.AddCustomerPrompt.CancelButton')}} </vs-button>
            </vs-tab>

            <!-- <vs-tab  :label="$t('Customer.Tabs.ArchiveBooking')" >
                <Bookings :customer="customer" bookings_type="archived_bookings">
                </Bookings>
                <vs-button @click="close()" type="border" color="primary" class="border-0 border-bottom mr-4"> {{$t('Components.Queue.AddCustomerPrompt.CancelButton')}} </vs-button>
            </vs-tab> -->

            <vs-tab  :label="$t('New.Bookings')" >
                <Bookings :customer="customer" bookings_type="next_bookings">
                </Bookings>
                <vs-button @click="close()" type="border" color="primary" class="border-0 border-bottom mr-4"> {{$t('Components.Queue.AddCustomerPrompt.CancelButton')}} </vs-button>
            </vs-tab>

            <vs-tab  :label="$t('New.Attachments')" >
                <Attachments :customer="customer" >
                </Attachments>
                <vs-button @click="close()" type="border" color="primary" class="border-0 border-bottom mr-4"> {{$t('Components.Queue.AddCustomerPrompt.CancelButton')}} </vs-button>
            </vs-tab>

            <vs-tab :label="$t('Customer.Tabs.Notify')">
                <NotifyCustomer :selected_customer="true" :customer="customer" >
                </NotifyCustomer>
                <vs-button @click="close()" type="border" color="primary" class="border-0 border-bottom mr-4"> {{$t('Components.Queue.AddCustomerPrompt.CancelButton')}} </vs-button>
            </vs-tab>
        </vs-tabs>
    </div>
</template>

<script>
import CustomerDetails from "../../components/shared/CustomerDetails"
import QueueArchive from "../../components/shared/CustomerQueueArchive"
import UpdateCustomer from "../../components/customer/UpdateCustomer"
import Bookings from "../../components/shared/CustomerBookings"
import NotifyCustomer from "../../components/customer/NotifyCustomer "
import Attachments from "./Attachments.vue"

import {customerService} from "../../_services";
export default {
    name: "AddCustomerCustomizer",
    data: () => ({
        customer_prop: {},
        archive: [],
        selectedTab: "",
    }),
    props:{
        customer: Object,
        selectedTab_prop: String,
    },
    components:{
        CustomerDetails,
        QueueArchive,
        UpdateCustomer,
        Bookings,
        NotifyCustomer,
        Attachments
    },
    methods:{
        getCustomer(){
            if (this.customer_prop.id != this.customer.id){
                customerService.getById(this.customer.id).then(function (data){
            this.customer_prop=data.customer;
            }.bind(this))
            }
        },
        getQueueArchive(){
            let customer = {
                customer_id:this.customer.id
            }
            customerService.getArchivedTickets(customer).then(function (data) {
            this.archive = data;
            //   this.$refs.Customizer.update_prop(this.archive,"sidebar_title");
            }.bind(this));
        },
        close(){
            this.$emit('hide', 'close');
        },

    },
    mounted(){
        this.selectedTab = "1";
        this.customer_prop = this.customer;
        if (this.customer_prop.id != this.customer.id){
                customerService.getById(this.customer.id).then(function (data){
            this.customer_prop=data.customer;
            }.bind(this))
        }
             let customer = {
        customer_id:this.customer.id
      }
     customerService.getArchivedTickets(customer).then(function (data) {
      this.archive = data;
    }.bind(this));
        
            
        
    }
    
}
</script>