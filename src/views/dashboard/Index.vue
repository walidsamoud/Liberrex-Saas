<template>
  <vs-row vs-justify="center">

    <!-- /////////////////////////////////////////////
    Email Campaigns
    /////////////////////////////////////////////-->
    <vs-col vs-lg="4" vs-xs="12" vs-sm="12" v-if="PermissionsConfig.queue_allowed">
      <vs-card  class="active-user-card">
        <QueuesSummary :data="reports.queues"></QueuesSummary>
      </vs-card>
    </vs-col>
    <!-- /////////////////////////////////////////////
    Active Visitors
    /////////////////////////////////////////////-->
    <vs-col vs-lg="4" vs-xs="12" vs-sm="12" v-if="PermissionsConfig.booking_allowed">
      <vs-card class="active-user-card">
        <BookingsSummary :data="reports.bookings"></BookingsSummary>
      </vs-card>
    </vs-col>
    <!-- /////////////////////////////////////////////
    Revenue Statistics
    /////////////////////////////////////////////-->
    <vs-col vs-lg="4" vs-xs="12" vs-sm="12">
      <FeedbackSummary :data="feedbackSummary" :total="feedback.length" :rating="rating"></FeedbackSummary>
    </vs-col>


    <!-- /////////////////////////////////////////////
    Revenue Statistics
    /////////////////////////////////////////////-->
    <vs-col vs-lg="6" vs-xs="12" vs-sm="12">
      <vs-card>
        <div slot="header">
          <h3>{{$t('Dashboard.ServiceConsumption.Title')}}</h3>
        </div>
        <div>
          <ServicePieChart :headerTitle="$t('Statistics.ServiceFrequency.ServicesPie')" />
          <!-- <PieChart v-if="reports.services.length" :data="reports.services"></PieChart> -->
          <!-- <img v-if="!reports.services.length" :src="require('@/assets/images/placeholder/no-data.jpg')" class="w-100"/> -->


          <!--V-Tour start-->
          <v-tour name="Dashboard" :steps="steps" >
            <template slot-scope="tour" >
              <transition name="fade" >
                <v-step
                        v-if="tour.currentStep === index"
                        v-for="(step, index) of tour.steps"
                        :key="index"
                        :step="step"
                        :previous-step="tour.previousStep"
                        :next-step="tour.nextStep"
                        :stop="tour.stop"
                        :is-first="tour.isFirst"
                        :is-last="tour.isLast"
                        :labels="tour.labels"
                >
                  <template v-if="tour.currentStep === 0" >
                    <div slot="actions" class="v-step__buttons">
                      <button @click="skipTour" class="v-step__button">Skip Tour</button>
                      <button @click="tour.nextStep" class="v-step__button">Next</button>
                    </div>
                  </template>
                  <template v-if="tour.currentStep === 2">
                    <div slot="actions" class="v-step__buttons">
                      <button @click="tour.previousStep" class="v-step__button">Previous</button>
                      <button @click="goToNextPage" class="v-step__button">Next</button>
                    </div>
                  </template>
                </v-step>
              </transition>
            </template>
          </v-tour>


        </div>
      </vs-card>
    </vs-col>


    <!-- /////////////////////////////////////////////
    Revenue Statistics
    /////////////////////////////////////////////-->
    <vs-col vs-lg="6" vs-xs="12" vs-sm="12">
      <vs-card>
        <div slot="header">
          <h3>{{$t('Dashboard.VisitFrequency.Title')}}</h3>
        </div>
        <div>
          <FrequencyCharts :headerTitle="$t('Statistics.Tabs.Frequency.Chart.Daily')" :visitFrequencyParams="{periodical : 'DAILY'}" />
          <!-- <LineChart v-if="reports.visits.length" :data="reports.visits"></LineChart> -->
          <!-- <img v-if="!reports.visits.length" :src="require('@/assets/images/placeholder/no-data.jpg')" class="w-100"/> -->
        </div>
      </vs-card>
    </vs-col>

    <vs-popup :active.sync="onBoardingActive"  title="Welcome to Liberrex" class="onboarding">
      <div>
        <vs-row>
          <vs-col vs-w="12" class="text-center">
            <h2 class="text-primary mb-2"> {{$t('Dashboard.OnBoarding.Title')}}</h2>
            <p class="p-0 text-cyan">
              {{$t('Dashboard.OnBoarding.Text')}}
            </p>
            <p class="p-2 text-cyan">
              <img :src="require('@/assets/images/placeholder/welcome.jpg')" class="welcome-img"/>
            </p>
            <vs-row>
              <vs-col class="mt-2">
                <vs-button class="w-50 text-uppercase" color="primary" size="large" @click="onBoardingActive=false; showQuickSetup()"> {{$t('Dashboard.OnBoarding.SetupButton')}} </vs-button>
              </vs-col>
              <vs-col class="mt-2">
                <vs-button class="w-50 text-uppercase" color="dark" type="border" size="large" @click="onBoardingActive=false"> {{$t('Dashboard.OnBoarding.LaterButton')}} </vs-button>
              </vs-col>
            </vs-row>
          </vs-col>
        </vs-row>
      </div>
    </vs-popup>


    <QuickSetupModal ref="QuickSetupModal"></QuickSetupModal>



  </vs-row>
</template>
<script>
// //////////////////////////////////////////
// Import Components Here
// //////////////////////////////////////////
import QueuesSummary from "../../components/widgets/dashboard/QueuesSummary";
import BookingsSummary from "../../components/widgets/dashboard/BookingsSummary";
import FeedbackSummary from "../../components/widgets/feedback/FeedbackSummary";
import PieChart from "../../components/chartjs/PieChart";
import LineChart from "../../components/chartjs/LineChart";
import {feedbackService, statisticsService} from "../../_services";
import { mapState } from 'vuex';
import router from "../../_helpers/router";
import QuickSetupModal from '../../components/onboarding/QuickSetupModal'
import FrequencyCharts from '../../components/statistics/FrequencyChartsHome';
import ServicePieChart from '../../components/statistics/ServicePieChartHome';

// //////////////////////////////////////////
// Export Here
// //////////////////////////////////////////
export default {
  name: "ClassicDashboard",
  data: () => ({
    title: "ClassicDashboard",
    titleEn : 'Click here to open user profile menu.',
    // Month Table
    onBoardingActive: false,
    rating: 0,
    month1: 0,
    monthoptions1: [
      { text: "Monthly", value: 0 },
      { text: "Daily", value: 1 },
      { text: "Weekly", value: 2 },
      { text: "Yearly", value: 3 }
    ],
    feedbackSummary: {},
    feedback: [],
    reports: {
      bookings: {},
      queues: {},
      services: [],
      visits: {}
    },
    steps: [
      {
        target: '#profile-menu',  // We're using document.querySelector() under the hood
        header: {
          title: 'Profile Menu',
        },
        modifiers:{
          arrow: {
            element: '.v-step__arrow'
          }
        },
        params: {
          placement: 'left'
        }
      },
      {
        target: '#lang-box',
        params: {
          placement: 'bottom-start'
        }
      },
      {
        target: '#notifications-popup',
        params: {
          placement: 'bottom-end'
        }
      }

    ],
  }),
  methods :{
    goToNextPage(){
      router.push({ path: "/queues?istour=on" });
    },
    skipTour(){
      localStorage.setItem('skipTour', 'true')
      this.$tours['Dashboard'].stop();
    },
    showQuickSetup(){
      this.$refs.QuickSetupModal.show();
    }
  },
  components: {
    QueuesSummary,
    BookingsSummary,
    FeedbackSummary,
    PieChart,
    LineChart,
    QuickSetupModal,
    FrequencyCharts,
    ServicePieChart
  },
  mounted() {
    feedbackService.getAll().then(function (data) {
      this.feedbackSummary = data.customers_satisfaction;
      this.feedback = data.feedback.data;
      this.rating = data.rating;
    }.bind(this))
    statisticsService.home().then(function (data) {
      this.reports = data.reports.web;
    }.bind(this))
    this.onBoardingActive = this.$route.query.onboarding ? true : false;
    this.$t('Dashboard.Content').map((content,index)=> (
            this.steps[index].content = content
    ));
    localStorage.getItem('skipTour')!='true' ? this.$tours['Dashboard'].start() : '';
    window.scrollTo(20, 0);

    console.log('_______________________________________')
    console.log(this.PermissionsConfig)
  },
  computed: {
    ...mapState({
      account_info: state => state.account.user.user,
      business_info: state => state.account.user.business
    }),

  }
};
</script>
<style>
  .onboarding .vs-popup--header {
    display: none !important;
  }
  .onboarding .welcome-img {
    max-height: 50%;
    max-width: 300px;
    width: 100%;
  }
</style>