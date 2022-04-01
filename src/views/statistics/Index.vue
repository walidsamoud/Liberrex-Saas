<template>
  <vs-row vs-justify="center" id="statistics-box">
    <vs-col type="flex">
      <vs-card id="form">
        <vs-tabs :value="activeTab">
          <vs-tab :label="$t('Statistics.Tabs.Time.Title')" icon="schedule" id="time-tab">
            <WaitingServiceTime :headerTitle="$t('Statistics.Tabs.Time.Chart.Daily')" :waitingServiceTimeParams="{periodical : 'DAILY'}" />
            <WaitingServiceTime :headerTitle="$t('Statistics.Tabs.Time.Chart.Weekly')" :waitingServiceTimeParams="{periodical : 'WEEKLY'}" />
            <WaitingServiceTime :headerTitle="$t('Statistics.Tabs.Time.Chart.Monthly')" :waitingServiceTimeParams="{periodical : 'MONTHLY'}" />
            <WaitingServiceTime :headerTitle="$t('Statistics.Tabs.Time.Chart.Yearly')" :waitingServiceTimeParams="{periodical : 'YEARLY'}" />
          </vs-tab>
          <vs-tab :label="$t('Statistics.Tabs.Frequency.Title')" icon="show_chart" id="frequency-tab">
            <FrequencyCharts :headerTitle="$t('Statistics.Tabs.Frequency.Chart.Daily')" :visitFrequencyParams="{periodical : 'DAILY'}" />
            <FrequencyCharts :headerTitle="$t('Statistics.Tabs.Frequency.Chart.Weekly')" :visitFrequencyParams="{periodical : 'WEEKLY'}" />
            <FrequencyCharts :headerTitle="$t('Statistics.Tabs.Frequency.Chart.Monthly')" :visitFrequencyParams="{periodical : 'MONTHLY'}" />
            <FrequencyCharts :headerTitle="$t('Statistics.Tabs.Frequency.Chart.Yearly')" :visitFrequencyParams="{periodical : 'YEARLY'}" />
          </vs-tab>

          <vs-tab :label="$t('Statistics.Tabs.Services')" icon="pie_chart" id="frequency-tab">
            <vs-row> 
              <ServicePieChart :headerTitle="$t('Statistics.ServiceFrequency.ServicesPie')" />
              <ServiceFrequency :headerTitle="$t('Statistics.ServiceFrequency.Title')"/>
            </vs-row> 
            <vs-row style="margin-top: 30px;"> 
              <vs-col vs-w="12" style="box-shadow: 0 0 8px 2px #eee;padding: 20px;">
                <div class="title">Durée des services: </div>
                <vs-table
                  :sst="true"
                  max-items="10"
                  search
                  :data="service_durations"
                >
                  <template slot="thead">
                    <vs-th sort-key="contactname">Service</vs-th>
                    <vs-th sort-key="joindate">Durée estimé</vs-th>
                    <vs-th sort-key="phone">durée moyenne effectuée</vs-th>
                    <vs-th sort-key="lbrx_id">Différence</vs-th>
                    <vs-th sort-key="book_id">Nb de fois effectué</vs-th>
                  </template>

                  <template>
                    <vs-tr :key="index" v-for="(service, index) in service_durations">
                      <vs-td sort-key="contactname"><b>{{service.Operation}}</b></vs-td>
                      <vs-td sort-key="contactname">{{service.Duree}}min</vs-td>
                      <td>
                        {{service.Moyenne.split('.')[0]}}min 
                        {{service.Moyenne.split('.')[1]>0?( Math.floor( (service.Moyenne.split('.')[1]/100)*0.6 ) )+'s':''}}</td>
                      <vs-td sort-key="contactname" v-if="service.Difference>0" class="text-danger"><b>+{{service.Difference}}%</b></vs-td>
                      <vs-td sort-key="contactname" v-else class="text-success"><b>{{service.Difference}}%</b></vs-td>
                      <vs-td sort-key="contactname">{{service.count}}</vs-td>
                    </vs-tr>
                  </template>
                </vs-table>
              </vs-col>
            </vs-row>


            <vs-row style="margin-top: 30px;"> 
              <vs-col vs-w="12" style="box-shadow: 0 0 8px 2px #eee;padding: 20px;">
                <div class="title">Durée des services effectué pour chaque guichet: </div>
                <vs-table
                  :sst="true"
                  max-items="10"
                  search
                  :data="service_durations_counter"
                >
                  <template slot="thead">
                    <vs-th sort-key="contactname">Service</vs-th>
                    <vs-th sort-key="contactname">Guichet</vs-th>
                    <vs-th sort-key="joindate">Durée estimé</vs-th>
                    <vs-th sort-key="phone">durée moyenne effectuée</vs-th>
                    <vs-th sort-key="lbrx_id">Différence</vs-th>
                    <vs-th sort-key="book_id">Nb de fois effectué</vs-th>
                  </template>

                  <template>
                    <vs-tr :key="index" v-for="(service, index) in service_durations_counter">
                      <vs-td sort-key="contactname"><b>{{service.Operation}}</b></vs-td>
                      <vs-td sort-key="contactname"><b>{{service.guichet}}</b></vs-td>
                      <vs-td sort-key="contactname">{{service.Duree}}min</vs-td>
                      <td>
                        {{service.Moyenne.split('.')[0]}}min 
                        {{service.Moyenne.split('.')[1]>0?( Math.floor( (service.Moyenne.split('.')[1]/100)*0.6 ) )+'s':''}}</td>
                      <vs-td sort-key="contactname" v-if="service.Difference>0" class="text-danger"><b>+{{service.Difference}}%</b></vs-td>
                      <vs-td sort-key="contactname" v-else class="text-success"><b>{{service.Difference}}%</b></vs-td>
                      <vs-td sort-key="contactname">{{service.count}}</vs-td>
                    </vs-tr>
                  </template>
                </vs-table>
              </vs-col>
            </vs-row>
          </vs-tab>

          <vs-tab :label="$t('Statistics.Tabs.Customers.Title')" icon="person" id="customers-tab">
              <CustomersStats />
          </vs-tab> 
          <vs-tab :label="$t('Statistics.Tabs.Logs')" icon="sync_alt" id="logs-tab">
          </vs-tab> 

          <vs-tab :label="$t('New.BookingPayment')" icon="sync_alt" id="payment-tab">
              <BookingPaymentStats />
          </vs-tab> 
        </vs-tabs>
      </vs-card>
    </vs-col>
  </vs-row>
</template>
<script>

import WaitingServiceTime from '../../components/statistics/WaitingServiceTime';
import FrequencyCharts from '../../components/statistics/FrequencyCharts';
import ServicePieChart from '../../components/statistics/ServicePieChart';
import ServiceFrequency from '../../components/statistics/ServiceFrequency';
import CustomersStats from '../../components/statistics/CustomersStats';
import { statisticsService } from "../../_services";
import BookingPaymentStats from '../../components/statistics/BookingPaymentStats';

export default {
  name: 'Statistics',
  data:() => ({
    activeTab: 0,
    service_durations: [],
    service_durations_counter: []
  }),
  methods: {
  },
  components:{
    WaitingServiceTime,
    FrequencyCharts,
    ServicePieChart,
    ServiceFrequency,
    CustomersStats,
    BookingPaymentStats
  },
  mounted(){
    statisticsService.serviceDurations({periodical : ""}).then(function(data){
      this.service_durations= data.map((obj)=>{
        if(obj.translations && obj.translations!='{}'){
          obj.Operation = JSON.parse(obj.translations)[localStorage.getItem('Language')];
        }else{
          obj.Operation = obj.title 
        }
        return obj
      })
    }.bind(this))

    statisticsService.serviceDurationsPerCounter({periodical : ""}).then(function(data){
      this.service_durations_counter= data.map((obj)=>{
        if(obj.translations && obj.translations!='{}'){
          obj.Operation = JSON.parse(obj.translations)[localStorage.getItem('Language')];
        }else{
          obj.Operation = obj.title 
        }
        return obj
      })
    }.bind(this))
  }
}
</script>

<style scoped>
table{
  width: 100%;
  border: 1px solid #ddd;
}
.title{
  font-size: 20px;
  font-weight: bold;
  background: #008fc9;
  padding: 5px 10px;
  border-radius: 5px;
  color: #fff;
  margin-bottom: 10px;
}
td, th, .vs-table-text{
  /* text-align: center !important; */
}
</style>