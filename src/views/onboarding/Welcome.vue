<template>
  <div>
    <vs-card>
      <div class="text-center mt-4">
        <h3 class="font-weight-light text-primary">Page Under Construction</h3>
        <p class="text-black-50">Please visit this page later</p>
        <img :src="placeholder_image" class="w-100"/>
      </div>
    </vs-card>
  </div>
</template>
<script>
import image from "../../assets/images/placeholder/under-construction.jpg"
// //////////////////////////////////////////
// Import Components Here
// //////////////////////////////////////////
import QueuesSummary from "../../components/widgets/dashboard/QueuesSummary";
import BookingsSummary from "../../components/widgets/dashboard/BookingsSummary";
import FeedbackSummary from "../../components/widgets/feedback/FeedbackSummary";
import PieChart from "../../components/chartjs/PieChart";
import LineChart from "../../components/chartjs/LineChart";
import {feedbackService} from "../../_services";
import { mapState } from 'vuex'

// //////////////////////////////////////////
// Export Here
// //////////////////////////////////////////
export default {
  name: "ClassicDashboard",
  data: () => ({
    title: "ClassicDashboard",
    // Month Table
    under_construction: true,
    placeholder_image: image,
    month1: 0,
    monthoptions1: [
      { text: "Monthly", value: 0 },
      { text: "Daily", value: 1 },
      { text: "Weekly", value: 2 },
      { text: "Yearly", value: 3 }
    ],
    feedbackSummary: {},
    feedback: [],
  }),
  components: {
    QueuesSummary,
    BookingsSummary,
    FeedbackSummary,
    PieChart,
    LineChart
  },
  mounted() {
    feedbackService.getAll().then(function (data) {
      this.feedbackSummary = data.customers_satisfaction;
      this.feedback = data.feedback.data;
    }.bind(this))
  },
  computed: {
    ...mapState({
      account_info: state => state.account.user.user,
      business_info: state => state.account.user.business,
    }),
  }
};
</script>