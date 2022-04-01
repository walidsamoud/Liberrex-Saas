<template>
    <vs-row vs-justify="center" vs-align="center" class="full-height m-0" id="ticket-box" v-if="ticket.id != 0">
        <vs-col vs-lg="4" vs-sm="6" vs-xs="12" class="text-center">
            <vs-row>
                <vs-col vs-w="6" class="p-2 pl-3 text-left">
                    <img src="https://www.liberrex.com/images/logo.png" width="100">
                </vs-col>
                <vs-col vs-w="6" class="p-2 pr-3 text-right">
                    <LanguageSelector></LanguageSelector>
                    <CountrySelector :selectable="false"></CountrySelector>
                </vs-col>
            </vs-row>
            <vs-card class=" mb-0 ticket">
                <vs-row>
                    <vs-col vs-lg="12" class=" text-center mb-2 pb-2">
                        <div class="d-flex align-items-center text-center text-light business-info">
                            <vs-avatar class="" :src="ticket.business_summary.photo ? ticket.business_summary.photo : require('@/assets/images/logo/logo-circle.png')" size="64px"></vs-avatar>
                            <div>
                                <h3 class="pl-4">{{ticket.business_summary.name}}</h3>
                                <span class="pl-4">{{ticket.business_summary.address}}, {{ticket.business_summary.city}}</span>
                            </div>
                        </div>
                    </vs-col>
                </vs-row>
                <vs-row>
                    <vs-col vs-lg="12" class="border-bottom text-center pt-4 mb-2 pb-2">
                        <h2 class="font-weight-light" v-if="ticket.fname || ticket.lname">{{ticket.fname}} {{ticket.lname}}</h2>
                        <h2 class="font-weight-light" v-if="!(ticket.fname || ticket.lname)">{{ticket.phone_number}}</h2>
                        <!-- <h2 class="font-weight-light" v-if="!(ticket.phone_number)">{{$t('Components.Queue.TicketItem.Anonymous')}}</h2> -->
                        <span class="text-cyan"> {{$t('Components.Queue.TicketItem.CheckInTime')}} {{checkinTimeDateFormated}}</span>
                    </vs-col>
                </vs-row>
                <vs-row class="border-bottom">
                    <vs-col vs-lg="6" vs-xs="6" class="mb-2 pb-0 border-right text-center">
                        <h3 class="">#{{ticket.total_waiting}}</h3>
                        <small class="text-cyan">{{$t('Components.Queue.TicketItem.Rank')}}</small>
                    </vs-col>
                    <vs-col vs-lg="6" vs-xs="6" class="mb-2 pb-0 text-center">
                        <h3 class="">{{ticket.public_identifier}}</h3>
                        <small class="text-cyan">{{$t('Components.Queue.TicketItem.TicketNumber')}}</small>
                    </vs-col>
                </vs-row>
                <vs-row class="mt-2 mb-2 pt-0 pb-2 border-bottom">
                    <vs-col vs-lg="6" vs-xs="6" class="mr-0 border-right text-center">
                        <h3 class="">{{waitingTimeFormated}}</h3>
                        <small class="text-cyan">{{$t('Components.Queue.TicketItem.EstimatedWaitingTime')}}</small>
                    </vs-col>
                    <vs-col vs-lg="6" vs-xs="6" class="mr-0 text-center">
                        <h3 class="">{{serviceTimeFormated}}</h3>
                        <small class="text-cyan">{{$t('Components.Queue.TicketItem.EstimatedServiceTime')}}</small>
                    </vs-col>
                </vs-row>
                <vs-row  class="mt-2 mb-2 pt-2 pb-2">
                    <vs-col vs-w="12" class="text-center">
                        <h4>{{$tc('Shared.Service', ticket.service_names.split(",").length)}}: </h4>
                        <span>{{ticket.service_names}}</span>
                    </vs-col>
                </vs-row>
                <vs-row class="border-cyan border-top pt-2">
                    <vs-col vs-w="6" class="border-right border-cyan">
                        <span class="text-warning" @click="runningLate"><i class="mdi mdi-run-fast"></i> {{$t('Components.Queue.TicketItem.RunningLate')}} </span>
                    </vs-col>
                    <vs-col vs-w="6" class="text-cyan">
                        <span class="text-danger" @click="deleteTicket"><i class="mdi mdi-close-circle"></i> {{$t('Components.Queue.TicketItem.CancelTicket')}}</span>
                    </vs-col>
                </vs-row>
            </vs-card>


            <vs-row>
                <vs-col vs-w="6">
                    <a href="https://apps.apple.com/gb/app/liberrex/id1483315130" target="_blank">
                        <img :src="require('@/assets/images/buttons/appstore.png')" class="download-app">
                    </a>
                </vs-col>
                <vs-col vs-w="6">
                    <a href="https://play.google.com/store/apps/details?id=com.liberrex" target="_blank">
                        <img :src="require('@/assets/images/buttons/playstore.png')" class="download-app">
                    </a>
                </vs-col>
                <vs-col vs-w="12" class="mt-2 text-center font-12" style="color: #a2a2a2;">
                    Copyright © Liberrex 2020. <br>
                    <small>
                        Liberrex Ltd, incorporated in England and Wales (11797740) <br>
                        Unit 6 Queens Yard, White Post Lane, <br>
                        London, United Kingdom, E9 5EN</small>
                    <br> <a href="https://www.liberrex.com" target="_blank">www.liberrex.com</a>
                </vs-col>
            </vs-row>

            <vs-popup :active.sync="inServiceActive" :title="$t('Components.Queue.TicketItem.Alerts.Call.Title')">
                <div>
                    <vs-row>
                        <vs-col vs-w="12" class="text-center">
                            <h4 class="text-primary font-weight-light mb-2"> {{$t('Components.Queue.TicketItem.Alerts.Call.Header')}}</h4>
                            <img class="mb-2" :src="require('../../assets/images/placeholder/inservice.png')" style="max-width: 200px"/>
                            <p class="p-2 text-cyan">
                                <b>{{$t('Components.Queue.TicketItem.Alerts.Call.TextBold')}}</b>
                                {{$t('Components.Queue.TicketItem.Alerts.Call.Text')}}
                            </p>
                        </vs-col>
                    </vs-row>
                </div>
            </vs-popup>

            <vs-popup :active.sync="inDelayedActive" :title="$t('Components.Queue.TicketItem.Alerts.Delay.Title')">
                <div>
                    <vs-row>
                        <vs-col vs-w="12" class="text-center">
                            <h4 class="text-danger font-weight-light mb-2"> {{$t('Components.Queue.TicketItem.Alerts.Delay.Header')}}</h4>
                            <img class="mb-2" :src="require('../../assets/images/placeholder/alert.png')" style="max-width: 200px"/>
                            <p class="p-2 text-cyan">
                                <b>{{$t('Components.Queue.TicketItem.Alerts.Delay.TextBold')}}</b>
                                {{$t('Components.Queue.TicketItem.Alerts.Delay.Text')}}
                            </p>
                        </vs-col>
                    </vs-row>
                </div>
            </vs-popup>


            <vs-popup :active.sync="inRunningLateActive" :title="$t('Components.Queue.TicketItem.Alerts.Late.Title')">
                <div>
                    <vs-row>
                        <vs-col vs-w="12" class="text-center">
                            <h4 class="text-warning font-weight-light mb-2"> {{$t('Components.Queue.TicketItem.Alerts.Late.Header')}}</h4>
                            <p class="p-2 text-cyan">
                                <b>{{$t('Components.Queue.TicketItem.Alerts.Late.TextBold')}}</b>
                                {{$t('Components.Queue.TicketItem.Alerts.Late.Text')}}
                            </p>
                            <vs-button color="warning" @click="inRunningLateActive=false"> Inform my service provider </vs-button>
                        </vs-col>
                    </vs-row>
                </div>
            </vs-popup>

        </vs-col>
    </vs-row>
</template>
<script>
import {queueService} from "../../_services";
import LanguageSelector from "../../components/language/LanguageSelector";
import CountrySelector from '../../components/country/CountrySelector';
export default {
    name: "TrackTicket",
    data: () => ({
        title: "TrackTicket",
        inServiceActive: false,
        inDelayedActive: false,
        inRunningLateActive: false,
        ticket: {
            id: 0,
            public_identifier: "",
            unique_id: "",
            checkinTime: "00:00:00",
            checkinDate: "0000-00-00",
            status: "",
            statusUpdateTimestamp: "",
            estimatedTimeToSpend: 0,
            counter_id: -1,
            customer_id: 0,
            services: [],
            service_names: "",
            business: 0,
            queue_line_id: 0,
            urgent: 0,
            tracked: 0,
            anonymous: 0,
            member_id: -1,
            waiting_time: 0,
            total_waiting: 0,
            business_summary: {id: 0, name: "", address: "", postal_code: "", phone: ""}
        }
    }),
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
                container: '#ticket-box',
                scale: 0.6
            });
        },
        hideLoading(){
            this.$vs.loading.close('#ticket-box > .con-vs-loading')
        },
        deleteTicket() {
            this.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: this.$t('Components.Queue.TicketItem.Delete.Title'),
                text: this.$t('Components.Queue.TicketItem.Delete.Text'),
                acceptText: this.$t('Toasts.AcceptButton'),
                cancelText: this.$t('Toasts.CancelButton'),
                accept: function () {
                    this.showLoading();
                    queueService.revokeTicketByUid(this.ticket_uid).then(function () {
                        location.replace('https://my.liberrex.tn');
                        this.notify(this.$t('Toasts.Successful'), this.$t('Components.Queue.TicketItem.Delete.ToastSuccess'), 'success');
                    }.bind(this)).catch(function () {
                        this.notify(this.$t('Toasts.Error'), this.$t('Components.Queue.TicketItem.Delete.ToastFail'), 'danger');
                    }.bind(this)).finally(function () {
                        this.hideLoading();
                    }.bind(this));
                }.bind(this)
            });
        },
        runningLate() {
            this.$vs.dialog({
                type: 'confirm',
                color: 'warning',
                title: this.$t('Components.Queue.TicketItem.Late.Title'),
                text: this.$t('Components.Queue.TicketItem.Late.Text'),
                acceptText: this.$t('Toasts.AcceptButton'),
                cancelText: this.$t('Toasts.CancelButton'),
                accept: function () {


                }.bind(this)
            });
        },
    },
    computed: {
        waitingTimeFormated: function () {
            return this.$moment().startOf('day').add(this.ticket.waiting_time, 'seconds').format('HH:mm');
        },
        serviceTimeFormated: function () {
            return this.$moment().startOf('day').add(this.ticket.estimatedTimeToSpend, 'minutes').format('HH:mm');
        },
        checkinTimeDateFormated: function () {
            return this.$moment(this.ticket.checkinDate+' '+this.ticket.checkinTime).format('HH:mm');
        }
    },
    mounted() {
        localStorage.setItem('Server','tn');
        this.ticket_uid = this.$route.params.uid;
        queueService.getTicketByUid(this.ticket_uid).then(function (data) {
            this.ticket = data.ticket;
            this.ticket.service_names = data.ticket.services.map(function (obj) {
                return obj.title;
            }).join(', ');
        }.bind(this)).catch(function () {
            location.replace('https://my.liberrex.com');
        }.bind(this)).finally(function () {
            this.inServiceActive = (this.ticket.status == 'inservice');
            this.inDelayedActive = (parseInt(this.ticket.delay) > 5);
        }.bind(this))
    },
    components: {
        LanguageSelector,
        CountrySelector
    },
};
</script>
<style>
    .ticket {
        background: transparent;
        box-shadow: none;
        border: none;
        background-image: url('../../assets/images/background/ticket.png');
        background-size: 100% 100%;
    }
    .download-app{
        max-width: 100%;
        padding: 10px;
        filter: grayscale(100%);
    }
    .download-app:hover{
        filter: grayscale(0%);
    }
    .business-info{
        align-items: center;
        justify-content: center;
    }
</style>