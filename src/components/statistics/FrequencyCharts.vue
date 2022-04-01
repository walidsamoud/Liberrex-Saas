<template>
    <vs-col vs-lg="6" vs-xs="12" class="p-1" id="frequency-chart">
        <vs-card :id="headerTitle" class="vs-con-loading__container">
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
                @click="visitFrequencyPrompt"
            ></vs-button>
            <vs-prompt
                color="primary"
                @accept="updateVisitChart"
                @cancel="reset"
                @close="reset"
                :active.sync="activeVisitPrompt"
                :title="$t('Statistics.VisitFrequency.ParamsPrompt.Title')"
                :accept-text="$t('Statistics.VisitFrequency.ParamsPrompt.SubmitButton')"
                :cancel-text="$t('Statistics.VisitFrequency.ParamsPrompt.CancelButton')"
            >
                <h5>{{$t('Statistics.VisitFrequency.ParamsPrompt.ChartData')}}</h5>
                <div class="justify-content-start w-100 m-2 row">
                    <vs-radio v-model="visitFrequency.chartData" vs-value="booking" class="p-1">{{$t('Statistics.VisitFrequency.ParamsPrompt.Booking')}}</vs-radio>
                    <vs-radio v-model="visitFrequency.chartData" vs-value="queue" class="p-1">{{$t('Statistics.VisitFrequency.ParamsPrompt.Queue')}}</vs-radio>
                </div>
                <h5>{{$t('Statistics.VisitFrequency.ParamsPrompt.ChartType')}}</h5>
                <div class="justify-content-start w-100 m-2 row">
                    <vs-radio v-model="visitFrequency.chartType" vs-value="area" class="p-1">{{$t('Statistics.VisitFrequency.ParamsPrompt.Area')}}</vs-radio>
                    <vs-radio v-model="visitFrequency.chartType" vs-value="bar" class="p-1">{{$t('Statistics.VisitFrequency.ParamsPrompt.Bar')}}</vs-radio>
                </div>
            </vs-prompt>
            <div class="col">
                <vue-apex-charts v-if="visitFrequency.chartOptions.series[0].data.length" height="350" ref="visitFrequencyChart" :options="visitFrequency.chartOptions" :series="visitFrequency.chartOptions.series"></vue-apex-charts>
            </div>
        </vs-card>
    </vs-col>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
import { statisticsService } from "../../_services";

export default {
    name:"Frequency",
    data:() => ({
        activeVisitPrompt : false,
        visitFrequency : {
            chartOptions: {
                chart: {
                    id: 'visit-frequency',
                    type: '',
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
                        name: "",
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
            chartData : "",
            chartType : "",
            dateType : "",
            typeData : "",
        } 
    }),
    props : {
        visitFrequencyParams: Object,
        headerTitle: String
    },
    methods: {
        showLoading() {
            this.$vs.loading({
                container: "#"+this.headerTitle,
                scale: 0.6,
            });
        },
        hideLoading() {
            this.$vs.loading.close("#"+this.headerTitle+" > .con-vs-loading");
        },
        visitFrequencyPrompt() {
            this.activeVisitPrompt = true;
            this.reset();
        },
        reset(){
            this.visitFrequency.chartType = this.visitFrequency.chartOptions.chart.type;
            this.visitFrequency.dateType = this.visitFrequencyParams.periodical;
            this.visitFrequency.chartData = this.visitFrequency.typeData;
        },
        updateVisitChart() {
            this.visitFrequencyParams = {
                periodical : this.visitFrequency.dateType
            };
            switch(this.visitFrequencyParams.periodical){
                case 'DAILY':
                this.showLoading();
                
                statisticsService.visitFrequency(this.visitFrequencyParams).then(function (data) {
                    let bookingDays = data.visitBooking.periodical.map((e) => e.substring(0,10));
                    switch(this.visitFrequency.chartData) {
                    case "queue":
                        this.visitFrequency = {
                        chartOptions: {
                            series : [
                            {
                                name: this.$t('Statistics.VisitFrequency.Queue'),
                                data: data.visitQueue.total
                            }
                            ],
                            xaxis : {
                                categories: data.visitQueue.periodical
                            },
                            chart : {
                                type : this.visitFrequency.chartType
                            },
                            title : {
                                text: this.$t('Statistics.VisitFrequency.Queue')
                            },
                        },
                        typeData : "queue"
                        }
                    break

                    case "booking":
                        this.visitFrequency = {
                        chartOptions: {
                            series : [
                            {
                                name: this.$t('Statistics.VisitFrequency.Booking'),
                                data: data.visitBooking.total
                            }
                            ],
                            xaxis : {
                                categories: bookingDays
                            },
                            chart : {
                                type : this.visitFrequency.chartType
                            },
                            title : {
                                text: this.$t('Statistics.VisitFrequency.Booking')
                            }
                        },
                        typeData : "booking"
                        }
                    break
                    }
                    
                }.bind(this)).finally(() => {
                    this.reset();
                    this.hideLoading();
                })
                break

                case 'WEEKLY':
                this.showLoading();
                statisticsService.visitFrequency(this.visitFrequencyParams).then(function (data) {
                    let weeksQueue = data.visitQueue.periodical.map((e, i) => this.$moment(data.visitQueue.year[i].toString()).add(e, 'weeks').startOf('isoweek').format('DD/MM/YYYY'));
                    let weeksBooking = data.visitBooking.periodical.map((e, i) => this.$moment(data.visitBooking.year[i].toString()).add(e, 'weeks').startOf('isoweek').format('DD/MM/YYYY'));
                    
                    switch(this.visitFrequency.chartData) {
                    case "queue":
                        this.visitFrequency = {
                        chartOptions: {
                            series : [
                            {
                                name: this.$t('Statistics.VisitFrequency.Queue'),
                                data: data.visitQueue.total
                            }
                            ],
                            xaxis : {
                                categories: weeksQueue
                            },
                            chart : {
                                type : this.visitFrequency.chartType
                            },
                            title : {
                                text: this.$t('Statistics.VisitFrequency.Queue')
                            },
                        },
                        typeData : "queue"
                        }
                    break

                    case "booking":
                        this.visitFrequency = {
                        chartOptions: {
                            
                            series : [
                            {
                                name: this.$t('Statistics.VisitFrequency.Booking'),
                                data: data.visitBooking.total
                            }
                            ],
                            xaxis : {
                                categories: weeksBooking
                            },
                            chart : {
                                type : this.visitFrequency.chartType
                            },
                            title : {
                                text: this.$t('Statistics.VisitFrequency.Booking')
                            }
                        },
                        typeData : "booking"
                        }
                    break
                    }
                    
                }.bind(this)).finally(() => {
                    this.reset();
                    this.hideLoading();
                })
                break

                case 'MONTHLY':
                this.showLoading();
                statisticsService.visitFrequency(this.visitFrequencyParams).then(function (data) {
                    let monthesQueue = data.visitQueue.periodical.map((e,i) => this.$moment(e,'M').format('MMMM') +' '+ data.visitQueue.year[i]);
                    let monthesBooking = data.visitBooking.periodical.map((e,i) => this.$moment(e,'M').format('MMMM') +' '+ data.visitBooking.year[i]);
                    
                    switch(this.visitFrequency.chartData) {
                    case "queue":
                        this.visitFrequency = {
                        
                        chartOptions: {
                            series : [
                            {
                                name: this.$t('Statistics.VisitFrequency.Queue'),
                                data: data.visitQueue.total
                            }
                            ],
                            xaxis : {
                                categories: monthesQueue
                            },
                            chart : {
                                type : this.visitFrequency.chartType
                            },
                            title : {
                                text: this.$t('Statistics.VisitFrequency.Queue')
                            }
                        },
                        typeData : "queue"
                        }
                    break

                    case "booking":
                        this.visitFrequency = {
                        chartOptions: {
                            
                            series : [
                            {
                                name: this.$t('Statistics.VisitFrequency.Booking'),
                                data: data.visitBooking.total
                            }
                            ],
                            xaxis : {
                                categories: monthesBooking
                            },
                            chart : {
                                type : this.visitFrequency.chartType
                            },
                            title : {
                                text: this.$t('Statistics.VisitFrequency.Booking')
                            }
                        },
                        typeData : "booking"
                        }
                    break
                    }
                    
                }.bind(this)).finally(() => {
                    this.reset();
                    this.hideLoading();
                })
                break

                case 'YEARLY':
                this.showLoading();
                statisticsService.visitFrequency(this.visitFrequencyParams).then(function (data) {
                    switch(this.visitFrequency.chartData) {
                    case "queue":
                        this.visitFrequency = {
                        
                        chartOptions: {
                            series : [
                            {
                                name: this.$t('Statistics.VisitFrequency.Queue'),
                                data: data.visitQueue.total
                            }
                            ],
                            xaxis : {
                                categories: data.visitQueue.periodical
                            },
                            chart : {
                                type : this.visitFrequency.chartType
                            },
                            title : {
                                text: this.$t('Statistics.VisitFrequency.Queue')
                            }
                        },
                        typeData : "queue"
                        }
                    break

                    case "booking":
                        this.visitFrequency = {
                        chartOptions: {
                            
                            series : [
                            {
                                name: this.$t('Statistics.VisitFrequency.Booking'),
                                data: data.visitBooking.total
                            }
                            ],
                            xaxis : {
                                categories: data.visitBooking.periodical
                            },
                            chart : {
                                type : this.visitFrequency.chartType
                            },
                            title : {
                                text: this.$t('Statistics.VisitFrequency.Booking')
                            }
                        },
                        typeData : "booking"
                        }
                    break
                    }
                }.bind(this)).finally(() => {
                    this.reset();
                    this.hideLoading();
                })
                break
            }
        }
    },
    components: {
        VueApexCharts
    },
    mounted() {
        this.showLoading();
        switch(this.visitFrequencyParams.periodical) {
            case 'DAILY':
                statisticsService.visitFrequency(this.visitFrequencyParams).then(function (data) {
                    this.visitFrequency.chartOptions.series[0].data = data.visitQueue.total;
                    this.visitFrequency.chartOptions.series[0].name = this.$t('Statistics.VisitFrequency.Queue');
                    this.visitFrequency.chartOptions.title.text = this.$t('Statistics.VisitFrequency.Queue');
                    this.visitFrequency.chartOptions.xaxis.categories = data.visitQueue.periodical;
                    this.visitFrequency.chartOptions.chart.type = "area";
                    this.visitFrequency.chartData = "queue";
                    this.visitFrequency.typeData = "queue";
                }.bind(this)).finally(() => {
                    this.hideLoading();
                })
                break
            case 'WEEKLY':
                statisticsService.visitFrequency(this.visitFrequencyParams).then(function (data) {
                    let weeksQueue = data.visitQueue.periodical.map((e, i) => this.$moment(data.visitQueue.year[i].toString()).add(e, 'weeks').startOf('isoweek').format('DD/MM/YYYY'));
                    this.visitFrequency.chartOptions.series[0].data = data.visitQueue.total;
                    this.visitFrequency.chartOptions.series[0].name = this.$t('Statistics.VisitFrequency.Queue');
                    this.visitFrequency.chartOptions.title.text = this.$t('Statistics.VisitFrequency.Queue');
                    this.visitFrequency.chartOptions.xaxis.categories = weeksQueue;
                    this.visitFrequency.chartOptions.chart.type = "area";
                    this.visitFrequency.chartData = "queue";
                    this.visitFrequency.typeData = "queue";
                }.bind(this)).finally(() => {
                    this.hideLoading();
                })
                break
            case 'MONTHLY':
                statisticsService.visitFrequency(this.visitFrequencyParams).then(function (data) {
                    let monthesQueue = data.visitQueue.periodical.map((e,i) => this.$moment(e,'M').format('MMMM') +' '+ data.visitQueue.year[i]);
                    this.visitFrequency.chartOptions.series[0].data = data.visitQueue.total;
                    this.visitFrequency.chartOptions.series[0].name = this.$t('Statistics.VisitFrequency.Queue');
                    this.visitFrequency.chartOptions.title.text = this.$t('Statistics.VisitFrequency.Queue');
                    this.visitFrequency.chartOptions.xaxis.categories = monthesQueue;
                    this.visitFrequency.chartOptions.chart.type = "area";
                    this.visitFrequency.chartData = "queue";
                    this.visitFrequency.typeData = "queue";
                }.bind(this)).finally(() => {
                    this.hideLoading();
                })
                break
            case 'YEARLY':
                statisticsService.visitFrequency(this.visitFrequencyParams).then(function (data) {
                    this.visitFrequency.chartOptions.series[0].data = data.visitQueue.total;
                    this.visitFrequency.chartOptions.series[0].name = this.$t('Statistics.VisitFrequency.Queue');
                    this.visitFrequency.chartOptions.title.text = this.$t('Statistics.VisitFrequency.Queue');
                    this.visitFrequency.chartOptions.xaxis.categories = data.visitQueue.periodical;
                    this.visitFrequency.chartOptions.chart.type = "area";
                    this.visitFrequency.chartData = "queue";
                    this.visitFrequency.typeData = "queue";
                }.bind(this)).finally(() => {
                    this.hideLoading();
                })
                break
        }   
    }
}
</script>

<style>

</style>