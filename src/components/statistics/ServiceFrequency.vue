<template>
    <vs-col vs-lg="6" vs-sm="12" vs-xs="12" class="p-1" id="Service-Frequency-tab">
        <vs-card id="serviceFrequencyCard" class="vs-con-loading__container" style="width:100%; height:100%">
            <div slot="header">
                <h3>
                 {{headerTitle}}
                </h3>
            </div>
            <vs-button
                class="btn-drop w-10"
                color="dark"
                type="filled"
                icon="settings"
                @click="serviceFrequencyPrompt"
            ></vs-button>
            <vs-prompt
                color="primary"
                @accept="updateServiceFrequencyChart"
                @cancel="resetService"
                @close="resetService"
                :active.sync="activeServicePrompt"
                :title="$t('Statistics.ServiceFrequency.ParamsPrompt.Title')"
                :accept-text="$t('Statistics.ServiceFrequency.ParamsPrompt.SubmitButton')"
                :cancel-text="$t('Statistics.ServiceFrequency.ParamsPrompt.CancelButton')"
            >
            <h5>{{$t('Statistics.ServiceFrequency.ParamsPrompt.DateType')}}</h5>
                <div class="justify-content-start w-100 m-2 row">
                <vs-radio v-model="serviceFrequency.dateType" vs-value="DAY" class="p-1">{{$t('Statistics.ServiceFrequency.Chart.Day')}}</vs-radio>
                <vs-radio v-model="serviceFrequency.dateType" vs-value="DAILY" class="p-1">{{$t('Statistics.ServiceFrequency.Chart.Daily')}}</vs-radio>
                <vs-radio v-model="serviceFrequency.dateType" vs-value="WEEKLY" class="p-1">{{$t('Statistics.ServiceFrequency.Chart.Weekly')}}</vs-radio>
                <vs-radio v-model="serviceFrequency.dateType" vs-value="MONTHLY" class="p-1">{{$t('Statistics.ServiceFrequency.Chart.Monthly')}}</vs-radio>
                <vs-radio v-model="serviceFrequency.dateType" vs-value="YEARLY" class="p-1">{{$t('Statistics.ServiceFrequency.Chart.Yearly')}}</vs-radio>
                </div>
            </vs-prompt>
            <br>
            <div id="service-timeline" >
                <vue-apex-charts id="FrequencyChart" ref="serviceFrequencyChart" :options="serviceFrequency.chartOptions" :series="serviceFrequency.chartOptions.series" v-if="serviceFrequency.chartOptions.show"></vue-apex-charts>
            </div>
            <br>
        </vs-card>
    </vs-col>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
import { statisticsService } from "../../_services";
export default {
name:"service-frequency",
data:() => ({
    activeServicePrompt : false,
    
    serviceFrequency : {
      chartOptions: {
        show: false,
        chart: {
          id: 'services',
          type: 'bar',
          height: 350,
          stacked: true,
          
        },
        dataLabels: {
          enabled: false
        },
        markers: {
          size: 0,
          style: 'hollow',
        },
        series: [

        ],
        xaxis: {
          categories: ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"]
          // categories: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]
        },
        tooltip: {
          x: {
            format: 'dd MMM yyyy'
          }
        },
        title: {
          align: 'center',
          margin: 10,
          floating: true,
          style: {
            fontSize:  '18px',
            fontWeight:  'bold',
            color:  '#263238'
          },
        },
      },
    },
    serviceFrequencyParams : {
      periodical : "DAY"
    },
}),
props:{
    headerTitle: String
},
components:{
    VueApexCharts
},
methods:{
    showLoading() {
      this.$vs.loading({
        container: "#serviceFrequencyCard",
        scale: 0.6,
      });
    },
    hideLoading() {
      this.$vs.loading.close("#serviceFrequencyCard > .con-vs-loading");
    },
    serviceFrequencyPrompt() {
      this.activeServicePrompt = true;
      this.resetService();
    },
    resetService() {

    },
    updateServiceFrequencyChart(){

    }
},
mounted(){
    this.showLoading();

    if(localStorage.getItem('Language')=='en'){
      this.serviceFrequency.chartOptions.xaxis.categories = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]
    }else if(localStorage.getItem('Language')=='ar'){
      this.serviceFrequency.chartOptions.xaxis.categories = ["الإثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت","الأحد"]
    }
    this.serviceFrequency.chartOptions.show = true
    
    statisticsService.serviceFrequency(this.serviceFrequencyParams).then(function (data) {
      let index = 0;
      let servicesData = [];
      data.services.date.map((day)=>{
        return day-2;
      })
      data.services.labels.forEach(element => {
        if(servicesData[element])
        {
          servicesData[element][data.services.date[index]]=data.services.data[index];
        }
        else{
          servicesData[element]= [];
          servicesData[element]= new Array(7);
          let i=0;
          for(i=0 ; i<7; i++ ){
            servicesData[element][i]=0;
          }
          servicesData[element][data.services.date[index]]=data.services.data[index];
        }
        
        index++;
      });
        // console.log(this.$refs);   

      for (let i=0 ; i < Object.keys(servicesData).length ; i++) {    
        this.$refs.serviceFrequencyChart.appendSeries({
          name: Object.keys(servicesData)[i],
          data: Object.values(servicesData)[i]
        }) 
          // this.serviceFrequency.chartOptions.series[i].data = Object.values(servicesData)[i];
          // this.serviceFrequency.chartOptions.series[i].name = Object.keys(servicesData)[i];
      }
      
    }.bind(this)).finally(() => {
        this.hideLoading();
    }) 
}
}
</script>

<style>

</style>