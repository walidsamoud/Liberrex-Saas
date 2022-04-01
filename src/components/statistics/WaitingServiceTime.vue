<template>
    <vs-col vs-lg="6" vs-xs="12" class="p-1" id="WaitingServiceChart">
        <vs-card :id="headerTitle" class="vs-con-loading__container">
            <div slot="header">
                <h3>
                 {{headerTitle}}
                </h3>
            </div>
            <div class="col">
                <vue-apex-charts v-if="waitingServiceTime.chartOptions.series[0].data.length" type="area" height="350" ref="waitingServiceChart" :options="waitingServiceTime.chartOptions" :series="waitingServiceTime.chartOptions.series"></vue-apex-charts>
            </div>
        </vs-card>
    </vs-col>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
import { statisticsService } from "../../_services";

export default {
    name:"WaitingServiceTime",
    data:() => ({
        waitingServiceTime :{
        chartOptions: {
            chart: {
                id: 'waiting-service-time',
                type: 'area',
                height: 350,
            },
            dataLabels: {
                enabled: false
            },
            markers: {
                size: 0,
                style: 'hollow',
            },
            series: [
                {
                    name: '',
                    data: []
                },
                {
                    name: '',
                    data: []
                }
            ],
            xaxis: {
                categories: []
            },
            tooltip: {
                x: {
                    format: 'dd MMM yyyy'
                }
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    opacityFrom: 0.7,
                    opacityTo: 0.9,
                    stops: [0, 100]
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
    }),
    props : {
        waitingServiceTimeParams : Object,
        headerTitle : String
    },
    components:{
        VueApexCharts
    },
    methods:{
        showLoading() {
            this.$vs.loading({
                container: "#"+this.headerTitle,
                scale: 0.6,
            });
        },
        hideLoading() {
            this.$vs.loading.close("#"+this.headerTitle+" > .con-vs-loading");
        }
    },
    mounted() {
         this.showLoading();
        switch(this.waitingServiceTimeParams.periodical){
            case 'DAILY':
                statisticsService.avgWatingService(this.waitingServiceTimeParams).then(function (data) {
                    this.waitingServiceTime.chartOptions.series[0].data = data.waiting_time.data;
                    this.waitingServiceTime.chartOptions.series[0].name = this.$t('Statistics.Tabs.Time.Chart.Waiting');
                    this.waitingServiceTime.chartOptions.series[1].data = data.service_time.data;
                    this.waitingServiceTime.chartOptions.series[1].name = this.$t('Statistics.Tabs.Time.Chart.Service');
                    this.waitingServiceTime.chartOptions.xaxis.categories = data.waiting_time.labels;
                    }.bind(this)).finally(() => {
                         this.hideLoading()
                    })
                break;
            case 'WEEKLY':
                statisticsService.avgWatingService(this.waitingServiceTimeParams).then(function (data) {
                    let weeks = data.waiting_time.labels.map((e, i) => this.$moment(data.waiting_time.year[i].toString()).add(e, 'weeks').startOf('isoweek').format('DD/MM/YYYY'));
                    this.waitingServiceTime.chartOptions.series[0].data = data.waiting_time.data;
                    this.waitingServiceTime.chartOptions.series[0].name = this.$t('Statistics.Tabs.Time.Chart.Waiting');
                    this.waitingServiceTime.chartOptions.series[1].data = data.service_time.data;
                    this.waitingServiceTime.chartOptions.series[1].name = this.$t('Statistics.Tabs.Time.Chart.Service');
                    this.waitingServiceTime.chartOptions.xaxis.categories = weeks;
                    }.bind(this)).finally(() => {
                        this.hideLoading()
                    })
                break;
            case 'MONTHLY':
                statisticsService.avgWatingService(this.waitingServiceTimeParams).then(function (data) {
                    var monthes = data.waiting_time.labels.map((e,i) => this.$moment(e,'M').format('MMMM') + ' ' + data.waiting_time.year[i]);
                    this.waitingServiceTime.chartOptions.series[0].data = data.waiting_time.data;
                    this.waitingServiceTime.chartOptions.series[0].name = this.$t('Statistics.Tabs.Time.Chart.Waiting');
                    this.waitingServiceTime.chartOptions.series[1].data = data.service_time.data;
                    this.waitingServiceTime.chartOptions.series[1].name = this.$t('Statistics.Tabs.Time.Chart.Service');
                    this.waitingServiceTime.chartOptions.xaxis.categories = monthes;
                    }.bind(this)).finally(() => {
                        this.hideLoading()
                    })
                break;
            case 'YEARLY':
                statisticsService.avgWatingService(this.waitingServiceTimeParams).then(function (data) {
                    this.waitingServiceTime.chartOptions.series[0].data = data.waiting_time.data;
                    this.waitingServiceTime.chartOptions.series[0].name = this.$t('Statistics.Tabs.Time.Chart.Waiting');
                    this.waitingServiceTime.chartOptions.series[1].data = data.service_time.data;
                    this.waitingServiceTime.chartOptions.series[1].name = this.$t('Statistics.Tabs.Time.Chart.Service');
                    this.waitingServiceTime.chartOptions.xaxis.categories = data.waiting_time.labels;
                    }.bind(this)).finally(() => {
                        this.hideLoading()
                    })
                break;
        }
    }
}
</script>

<style>

  
</style>