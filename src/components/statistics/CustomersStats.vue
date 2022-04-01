<template>
<div id="Customer-tab">
    <div>
        <div class="pt-3 text-center">
            <i class="mdi mdi-account-convert display-4 text-warning d-block"></i>
            <span class="display-4 d-block font-medium">{{customersTab.avgCustomerReturn}}</span>
            <span>{{$t('Statistics.Tabs.Customers.AvgCustomerReturn')}}</span>
            <div class="vs-row mt-4 mb-3" style="display: flex; width: 100%;">
                <div class="vs-col border-right vs-xs-12 vs-sm-6 vs-lg-6" style="margin-left: 0%; width: 100%;">
                    <h3 class="mb-0 font-medium">{{customersTab.customerNewEntry}}</h3>{{$t('Statistics.Tabs.Customers.CustomerNewEntry')}}
                </div>
                <div class="vs-col vs-xs-12 vs-sm-6 vs-lg-6" style="margin-left: 0%; width: 100%;">
                    <h3 class="mb-0 font-medium">{{customersTab.totalCustomers}}</h3>{{$t('Statistics.Tabs.Customers.TotalCustomers')}}
                </div>
                <!-- <div class="vs-col vs-xs-12 vs-sm-4 vs-lg-4" style="margin-left: 0%; width: 100%;">
                    <h3 class="mb-0 font-medium">12%</h3>Tablet
                </div> -->
            </div>
            <vs-button @click="showTopCustomers" v-if="!customersTab.topCustomersTable" type="button" name="button" class="vs-component vs-button mt-3 vs-button-primary vs-button-filled large">
                <span class="vs-button-backgroundx vs-button--background" style="opacity: 1; left: 119px; top: 21px; width: 0px; height: 0px; transition: width 0s ease 0s, height 0s ease 0s, opacity 0s ease 0s;"></span>
                <!----><span class="vs-button-text vs-button--text">{{$t('Statistics.Tabs.Customers.CustomerFrequencyShowButton')}}</span>
                <span class="vs-button-linex" style="top: auto; bottom: -2px; left: 50%; transform: translate(-50%);"></span>
            </vs-button>
            <vs-button @click="HideTopCustomers" v-if="customersTab.topCustomersTable" type="button" name="button" class="vs-component vs-button mt-3 vs-button-primary vs-button-filled large">
                <span class="vs-button-backgroundx vs-button--background" style="opacity: 1; left: 119px; top: 21px; width: 0px; height: 0px; transition: width 0s ease 0s, height 0s ease 0s, opacity 0s ease 0s;"></span>
                <!----><span class="vs-button-text vs-button--text">{{$t('Statistics.Tabs.Customers.CustomerFrequencyHideButton')}}</span>
                <span class="vs-button-linex" style="top: auto; bottom: -2px; left: 50%; transform: translate(-50%);"></span>
            </vs-button>
        </div>
    </div>
    <br>
    <div>
        <vs-table
            :sst="true"
            max-items="10"
            :data="customersTab.customersFrequency"
            v-if="customersTab.topCustomersTable"
        >
            <br>
            <div slot="header">
                <div class="con-select-example m-2">
                    <vs-select
                    class="selectExample"
                    v-model="customersTab.topCustomersSelect"
                    @change="updateTopTable(customersTab.topCustomersSelect)"
                    >
                    <vs-select-item :key="index" :value="item.value" :text="item.text" v-for="(item,index) in customersTab.topCutomerOptions" />
                    </vs-select>
                </div>
            </div>

            <template slot="thead">
                <vs-th sort-key="firstname">{{$t('Statistics.Tabs.Customers.Table.FirstName')}}</vs-th>
                <vs-th sort-key="lastname">{{$t('Statistics.Tabs.Customers.Table.LastName')}}</vs-th>
                <vs-th sort-key="phone">{{$t('Statistics.Tabs.Customers.Table.Phone')}}</vs-th>
                <vs-th sort-key="totalreturn">{{$t('Statistics.Tabs.Customers.Table.TotalReturn')}}</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td :data="data[indextr].fname">
                    <div class="d-flex no-block align-items-center">
                        <div class>
                        <h6 class="mb-0 font-16">{{ data[indextr].fname }}</h6>
                        </div>
                    </div>
                    </vs-td>
                    <vs-td :data="data[indextr].lname">
                    <div class="d-flex align-items-center">
                        <h6 class="mb-0 font-16">{{data[indextr].lname}}</h6>
                    </div>
                    </vs-td>
                    <vs-td :data="data[indextr].phone_number">
                    <div class="d-flex align-items-center">
                        <i class="mdi mdi-phone-classic mr-2 display-8"></i>
                        <span class="text-muted">{{data[indextr].phone_number}}</span>
                    </div>
                    </vs-td>
                    <vs-td :data="data[indextr].total">
                    <div class="d-flex align-items-center">
                        <span>{{data[indextr].total}}</span>
                    </div>
                    </vs-td>
                </vs-tr>  
            </template>
        </vs-table>
    </div>
</div>
</template>

<script>
import { statisticsService, customerService } from "../../_services";

export default {
name:"Customers-Stats",
data:() => ({
    customersTab : {
        totalCustomers : 0,
        avgCustomerReturn : 0,
        customerNewEntry : 0,
        topCustomersSelect : 0,
        topCutomerOptions:[
            {text:'All',value:0},
            {text:'5',value:5},
            {text:'10',value:10},
            {text:'20',value:20}
        ],
        customersFrequency : [],
        fname: "",
        lname: "",
        phone: "",
        totalReturn : "",
        topCustomersTable : 0,
        topMax: 0
    },
}),
methods:{
    showTopCustomers(){
    this.customersTab.topCustomersTable = 1;  
    },
    HideTopCustomers(){
      this.customersTab.topCustomersTable = 0;
    },
    updateTopTable(maxtop){
       //console.log(top);
       this.showLoading();
        statisticsService.customerStat({top : maxtop}).then(function (data) {
            this.customersTab.customersFrequency = data.customerFrequency;
        }.bind(this)).finally(() => {
            this.hideLoading();
        })
    },
    showLoading() {
      this.$vs.loading({
        container: "#Customer-tab",
        scale: 0.6,
      });
    },
    hideLoading() {
      this.$vs.loading.close("#Customer-tab > .con-vs-loading");
    }
},
mounted() {
    this.showLoading();
    statisticsService.customerStat().then(function (data) {
      this.customersTab.avgCustomerReturn = Math.round(data.avgCustomerReturn[0].avgCustomerReturn);
      this.customersTab.customerNewEntry = data.customerNewEntry;
      this.customersTab.customersFrequency = data.customerFrequency;
      //console.log(this.customersTab.avgCustomerReturn);
    }.bind(this))

    customerService.getAll().then(function (data) {
      this.customersTab.totalCustomers = data.customers.total;
      }.bind(this)
    ).finally(() => {
        this.hideLoading(); 
    })
},
}
</script>

<style>

</style>