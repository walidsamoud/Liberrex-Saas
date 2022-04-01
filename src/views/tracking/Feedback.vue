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

                <vs-row class="mt-4 mb-2 pt-2 pb-2 border-bottom">
                    <vs-col vs-lg="6" vs-xs="6" class="mr-0 border-right text-center">
                        <h3 class="">{{waitingTimeFormated}}</h3>
                        <small class="text-cyan">{{$t('Components.Queue.TicketItem.WaitingTime')}}</small>
                    </vs-col>
                    <vs-col vs-lg="6" vs-xs="6" class="mr-0 text-center">
                        <h3 class="">{{serviceTimeFormated}}</h3>
                        <small class="text-cyan">{{$t('Components.Queue.TicketItem.ServiceTime')}}</small>
                    </vs-col>
                </vs-row>
                <vs-row  class="mt-2 mb-2 pt-0 pb-2 border-bottom">
                    <vs-col vs-w="12" class="text-center">
                        <h5>{{$tc('Shared.Service', ticket.service_names.split(",").length)}}: </h5>
                        <small>{{ticket.service_names}}</small>
                    </vs-col>
                </vs-row>
                <vs-row  class="mt-1 mb-0">
                    <vs-col vs-w="12" class="text-center">
                        <span class="text-cyan"><small>  {{$t('Components.Queue.TicketItem.ThanksForVisiting', {date: checkinTimeDateFormated})}}</small></span>
                        <p class="text-cyan font-10 mb-0" style="color: #9e9e9e">{{$t('Components.Queue.TicketItem.PleaseShareFeedback')}}</p>
                        <span>
                          <i @click="updateRating(index)"
                             :class="rating >= index ? 'mdi mdi-star rating-star': 'mdi mdi-star-outline rating-star'"
                             :key="index+'-avg-full'" v-for="index in 5"></i>
                        </span>
                        <vs-textarea v-model="feedback_text" :placeholder="$t('Components.Queue.TicketItem.FeedbackTextPlaceholder')"/>
                        <vs-button class="w-100" color="primary" size="small" @click="submitFeedback"> {{$t('Components.Queue.TicketItem.FeedbackSubmitButton')}} </vs-button>
                    </vs-col>
                </vs-row>
            </vs-card>


            <vs-row view-feedback>
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
        rating: 0,
        feedback_text: "",
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
        updateRating(r){
            this.rating = r;
        },
        submitFeedback(){
            this.showLoading();
            let payload = {
                uid: this.ticket_uid,
                rating: this.rating,
                feedback: this.feedback_text,
                anonymous: 0,
            }
            queueService.submitFeedbackByUid(payload).then(function () {
                location.replace('https://liberrex.com');
            }.bind(this)).catch(function () {
                //location.replace('https://liberrex.com');
            }.bind(this)).finally(function () {
                this.hideLoading();
            }.bind(this))
        }
    },
    computed: {
        waitingTimeFormated: function () {
            return this.$moment().startOf('day').add(this.ticket.waiting_time, 'minutes').format('HH:mm');
        },
        serviceTimeFormated: function () {
            return this.$moment().startOf('day').add(this.ticket.service_time, 'minutes').format('HH:mm');
        },
        checkinTimeDateFormated: function () {
            return this.$moment(this.ticket.checkinDate+' '+this.ticket.checkinTime).format('DD MMM YYYY, HH:mm');
        }
    },
    mounted() {
        localStorage.setItem('Server','TN');
        this.ticket_uid = this.$route.params.uid;
        queueService.getArchivedTicketByUid(this.ticket_uid).then(function (data) {
            this.ticket = data.ticket;
            this.ticket.service_names = data.ticket.services.map(function (obj) {
                return obj.title;
            }).join();
        }.bind(this)).catch(function () {
            location.replace('https://my.liberrex.tn');
        }.bind(this)).finally(function () {
            if(this.ticket.rated == 1){
                location.replace('https://my.liberrex.tn');
            }
        }.bind(this));
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
    .rating-star{
        color: gold;
        font-size: 46px;
    }
    .rating-star-small{
        color: gold;
        font-size: 24px;
    }
    .rating-average{
        font-size: 46px;
        color:lightgray;
    }
</style>