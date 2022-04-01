<template>
    <vs-col vs-lg="12" vs-sm="12" vs-xs="12" class="p-1" id="servicePieChart" style="margin-top: -20px;">
        <vs-card id="pieChartCard" class="vs-con-loading__container" style="width:100%; height:100%">
            <div class="col" id="chart-timeline">
                <vue-apex-charts v-if="servicePie.series.length" height="350" ref="servicePieChart" :options="servicePie.chartOptions" :series="servicePie.series"></vue-apex-charts>
            </div>
            <br>
        </vs-card>
    </vs-col>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
import { statisticsService } from "../../_services";

export default {
name: "Service-Pie-Chart",
data:() => ({
    servicePie : {
      series: [],
      chartOptions: {
        chart: {
          width: 380,
          type: 'pie',
        },
        title : {
          align: 'center',
          margin: 10,
          floating: true,
          style: {
            fontSize:  '18px',
            fontWeight:  'bold',
            color:  '#263238'
          },
        },
        legend :{
          show: true,
          position: 'bottom'
        },
        labels: [],
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom'
            }
          }
        }]
      },
    },
    servicePieParams : {
      periodical : ""
    }
}),
components:{
    VueApexCharts
},
props:{
    headerTitle : String
},
methods : {
  showLoading() {
    this.$vs.loading({
        container: "#pieChartCard",
        scale: 0.6,
    });
  },
  hideLoading() {
      this.$vs.loading.close("#pieChartCard > .con-vs-loading");
  }
},
mounted(){
    this.showLoading();
    statisticsService.serviceFrequency(this.servicePieParams).then(function (data) {
      this.servicePie.series = data.services.data;
      this.servicePie.chartOptions.labels = data.services.labels;
    }.bind(this)).finally(() => {
      this.hideLoading();
    })
}
}
</script>

<style>

</style>