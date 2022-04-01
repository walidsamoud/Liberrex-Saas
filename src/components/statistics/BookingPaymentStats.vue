<template>
    <div id="Customer-tab">
      <div class="filterbox">
        <vs-row class="date-ranges p-0 m-0">
          <vs-col vs-lg="3" vs-sm="12" class="p-0 m-0" style="border: none;padding: 10px;">
            <label for="From"><b>Filtrer la data: du</b></label>
            <input type="date" id="From" class="from" v-model="date_range.from">
          </vs-col>

          <vs-col vs-lg="1" vs-sm="12" style="border: none;padding: 10px;">
          </vs-col>

          <vs-col vs-lg="3" vs-sm="12" class=" p-0 m-0" style="border: none;padding: 10px;">
            <label for="To"><b>Jusque'a</b></label>
            <input type="date" id="To" class="from" v-model="date_range.to" :min="date_range.from">
          </vs-col>

          <vs-col vs-lg="1" vs-sm="12" style="border: none;padding: 10px;">
          </vs-col>

          <vs-col vs-lg="1" vs-sm="12" class=" p-0 m-0" style="border: none;padding: 10px;">
            <label for="To">.</label>
            <button class="btn btn-info filterBtn" @click="initPage()">Filtrer</button>
          </vs-col>
        </vs-row>
      </div>
            <vs-row style="margin-top: 30px;"> 
              <vs-col vs-lg="12" vs-sm="12" style="padding: 20px;">
                <div class="title">Paiement total avec chaque méthode: </div>
                <vs-table
                  :sst="true"
                  max-items="10"
                  :data="transactions_by_method"
                >
                  <template slot="thead">
                    <vs-th sort-key="contactname">Méthode du paiement</vs-th>
                    <vs-th sort-key="joindate" style="float: right;">Total payé</vs-th>
                  </template>

                  <template>
                    <vs-tr :key="'a'+index" v-for="(item, index) in transactions_by_method">
                      <vs-td sort-key="contactname"  style="text-align: left;"><b>{{item.method}}</b></vs-td>
                      <vs-td sort-key="contactname" style="text-align: right;">{{item.total}}<sup>DT</sup></vs-td>
                    </vs-tr>
                    <vs-tr>
                      <vs-td sort-key="contactname"><b class="text-info" style="font-size: 15px;">Total</b></vs-td>
                      <vs-td sort-key="contactname" class="text-info" style="text-align: right;font-weight: bold;">{{total_revenue_for_methods}}<sup>DT</sup></vs-td>
                    </vs-tr>
                  </template>
                </vs-table>
              </vs-col>

              <!-- <vs-col vs-lg="6" vs-sm="12" style="padding: 20px;">
                <div class="title">Paiement total avec chaque méthode: </div>
                <vs-table
                  :sst="true"
                  max-items="10"
                  :data="transactions_by_method"
                >
                  <template slot="thead"  style="text-align: right;">
                    <vs-th sort-key="contactname">Méthode du paiement</vs-th>
                    <vs-th sort-key="joindate" style="text-align: right;">Total payé</vs-th>
                  </template>

                  <template>
                    <vs-tr :key="'b'+index" v-for="(item, index) in transactions_by_method">
                      <vs-td sort-key="contactname"><b>{{item.method}}</b></vs-td>
                      <vs-td sort-key="contactname" style="text-align: right;">{{item.total}}<sup>DT</sup></vs-td>
                    </vs-tr>
                  </template>
                </vs-table>
              </vs-col> -->
            </vs-row>

            <vs-row>
              <vs-col vs-lg="12" vs-sm="12" style="padding: 20px;">
                <div class="title">
                  Tous les transactions: 
                  <span style="float: right;">Total: {{total_revenue}}<sup>DT</sup></span>
                </div>
                <vs-table
                  :sst="true"
                  max-items="10"
                  :data="all_transactions"
                >
                  <template slot="thead">
                    <vs-th sort-key="contactname">Payé par</vs-th>
                    <vs-th sort-key="contactname">Méthode du paiement</vs-th>
                    <vs-th sort-key="joindate">Montant</vs-th>
                    <vs-th sort-key="joindate">Services</vs-th>
                    <vs-th sort-key="joindate">Date du transaction</vs-th>
                  </template>

                  <template>
                    <vs-tr :key="'c'+index" v-for="(item, index) in all_transactions">
                      <vs-td sort-key="contactname">
                        <b>{{item.fname}} {{item.lname}}</b><br>
                        <span>{{item.phone_number}}</span>
                      </vs-td>
                      <vs-td sort-key="contactname">{{item.method}}</vs-td>
                      <vs-td sort-key="contactname"><b>{{item.amount}}<sup>DT</sup></b></vs-td>
                      <vs-td sort-key="contactname">
                        <span class="badge badge-info" v-for="service in item.services" :key="'d'+item.id+service.id">
                          {{service.translations?JSON.parse(service.translations).fr:service.title}}
                        </span>
                      </vs-td>
                      <vs-td sort-key="contactname">{{item.created_at}}</vs-td>
                    </vs-tr>
                  </template>
                </vs-table>
              </vs-col>
            </vs-row>
    </div>
</template>

<script>
import { statisticsService } from "../../_services";
import moment from 'moment'

export default {
name:"Customers-Stats",
data:() => ({
    date_range: {
      from: null,
      to: null
    },
    transactions_by_method: [],
    total_revenue_for_methods: '--',
    all_transactions: [],
    total_revenue: '--',
}),
methods:{
    showLoading() {
      this.$vs.loading({
        container: "#Customer-tab",
        scale: 0.6,
      });
    },
    hideLoading() {
      this.$vs.loading.close("#Customer-tab > .con-vs-loading");
    },
    initPage(){
      this.showLoading();
      statisticsService.bookingPaymentStat(this.date_range).then(function (data) {
        this.total_revenue_for_methods = 0
        this.transactions_by_method = data.map((obj)=>{
          this.total_revenue_for_methods += Number(obj.total)
          return obj
        });
      }.bind(this))

      statisticsService.bookingPaymentAllTransactions(this.date_range).then(function (data) {
        this.total_revenue = 0
        this.all_transactions = data.map((obj)=>{
          this.total_revenue += Number(obj.amount)
          return obj
        });
      }.bind(this)).finally(function(){
        this.hideLoading();
      }.bind(this))
    }
},
mounted() {
    this.initPage()
},
}
</script>

<style scoped>
table{
  width: 100%;
  border: 1px solid #ddd;
}
.title{
  font-size: 15px;
  font-weight: bold;
  background: #008fc9;
  padding: 5px 10px;
  border-radius: 5px;
  color: #fff;
  margin-bottom: 10px;
}
td, th, .vs-table-text{
  /* text-align: center; */
}
.vs-col{
  border: 1px solid #ddd;
}
.badge{
  padding: 5px 10px;
  border-radius: 5px;
  margin-right: 5px;
  margin-bottom: 5px;
}

.date-ranges{
  margin-top: 20px !important;
}
.date-ranges input{
  width: 100%;
  height: 35px;
  border: 1px solid #ddd;
  padding: 10px;
  cursor: pointer;
}
.filterBtn{
  display: block;
  border-radius: 5px;
  width: 100%;
}
</style>