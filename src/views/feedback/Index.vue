<template>
  <div>
    <vs-row>
      <vs-col vs-lg="12" vs-md="12" vs-sm="12" vs-xs="12">
        <FeedbackSummary
          id="feedback-listing"
          :data="feedbackSummary"
          :total="totalFeedback"
          :rating="rating"
        ></FeedbackSummary>
      </vs-col>
    </vs-row>
    <vs-row vs-justify="center">
      <vs-col vs-lg="12" vs-md="12" vs-sm="12" vs-xs="12">
        <div id="feedback-box">
          <vs-card>
            <vs-table :data="feedback">
              <template slot="thead">
                <vs-th>{{$t('Display.Table.Name')}}</vs-th>
                <vs-th>{{$t('Queue.Create.CounterName')}}</vs-th>
                <vs-th>{{$t('Components.Queue.TicketItem.TicketNumber')}}</vs-th>
                <vs-th>{{$t('Queue.Archive.Services')}}</vs-th>
                <vs-th>{{$t('Menu.Feedback')}}</vs-th>
                <vs-th>{{$t('Components.Feedback.Rating')}}</vs-th>
              </template>
              <template>
                <vs-tr :key="index" v-for="(item,index) in feedback">
                  <vs-td>
                    <span v-if="item.fname && item.fname!='null'">
                      <b>{{item.fname+' '+item.lname}}</b><br>
                      <span v-if="item.phone_number" style="color: #888;">{{item.phone_number}}</span>
                    </span>
                    <span v-else>
                      <b>{{$t('Components.Queue.TicketItem.Anonymous')}}</b><br>
                      <span v-if="item.phone_number" style="color: #888;">{{item.phone_number}}</span>
                    </span>
                  </vs-td>
                  <vs-td>
                    <span v-if="item.ticket && item.ticket.counter && item.ticket.counter_id>0">{{item.ticket.counter.name}}</span>
                    <span v-else>--</span>
                  </vs-td>
                  <vs-td>
                    <span v-if="item.ticket && item.ticket.public_identifier"><b>{{item.ticket.public_identifier}}</b></span>
                    <span v-else>--</span>
                  </vs-td>
                  <vs-td>
                    <span v-if="item.services_data && item.services_data.length">
                      <b>{{item.services_data.join(', ')}}</b>
                    </span>
                    <span v-else>--</span>
                  </vs-td>
                  <vs-td>{{item.feedback}}</vs-td>
                  <vs-td>
                    <span>
                      <i
                        class="mdi mdi-star rating-star" style="font-size : 16px"
                        :key="index+'-avg-full'"
                        v-for="index in item.rating"
                      ></i>
                      <i
                        class="mdi mdi-star-outline rating-star" style="font-size : 16px"
                        :key="index+'-avg-empty'"
                        v-for="index in (5-item.rating)"
                      ></i>
                    </span>
                  </vs-td>
                </vs-tr>
              </template>
            </vs-table>
            <vs-pagination :total="totalPages" @change="handleChangePage" v-model="currentPage"></vs-pagination>
          </vs-card>
        </div>
      </vs-col>

      <!--V-Tour start-->
      <v-tour name="Feedback" :steps="steps">
        <template slot-scope="tour">
          <transition name="fade">
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
              <template v-if="tour.currentStep === 0">
                <div slot="actions" class="v-step__buttons">
                  <button @click="goToNextPage" class="v-step__button">Next</button>
                </div>
              </template>
            </v-step>
          </transition>
        </template>
      </v-tour>
    </vs-row>
  </div>
</template>

<script>
import FeedbackSummary from "../../components/widgets/feedback/FeedbackSummary";
import { mapState, mapActions } from "vuex";
import { feedbackService } from "../../_services";
import router from "../../_helpers/router";

export default {
  name: "Feedback",
  data: () => ({
    totalFeedback:0,
    totalPages: 0,
    currentPage: 1,
    title: "Feedback",
    feedbackSummary: {},
    feedback: [],
    rating: 0,
    steps: [
      {
        target: "#feedback-listing", // We're using document.querySelector() under the hood
        params: {
          placement: "auto", // Any valid Popper.js placement. See https://popper.js.org/popper-documentation.html#Popper.placements
        },
      },
    ],
  }),
  methods: {
    showLoading() {
      this.$vs.loading({
        container: "#feedback-box",
        scale: 0.6,
      });
    },
    hideLoading() {
      this.$vs.loading.close("#feedback-box > div.con-vs-loading");
    },
    handleChangePage(page) {
      this.showLoading();
      feedbackService
        .getPage(page)
        .then((data) => {
          this.feedback = data.feedback.data.map((obj)=>{ 
            let services = obj.services_data.map((service)=>{
              if(service.translations && service.translations!='{}'){
                service = JSON.parse(service.translations)[localStorage.getItem('Language')];
              }else{
                service = service.title 
              }
              return service
            })
            obj.services_data = services
            return obj;
          });
          console.log(this.feedback);
          this.currentPage = data.feedback.current_page;
        })
        .finally(() => {
          this.hideLoading();
        });
    },
    ...mapActions("account", ["updateUserObject"]),
    notify(title, text, type) {
      this.$vs.notify({
        color: type,
        title: title,
        text: text,
      });
    },
    createdAt(date) {
      return this.$moment(date).fromNow();
    },
    goToNextPage() {
      router.push({ path: "/statistics?istour=on" });
    },
  },
  computed: {
    ...mapState({
      account_info: (state) => state.account.user.user,
      business_info: (state) => state.account.user.business,
    }),
  },
  mounted() {
    this.showLoading();

    feedbackService
      .getAll()
      .then(
        function (data) {
          console.log(data);
          this.feedbackSummary = data.customers_satisfaction;
          this.feedback = data.feedback.data.map((obj)=>{ 
            let services = obj.services_data.map((service)=>{
              if(service.translations && service.translations!='{}'){
                service = JSON.parse(service.translations)[localStorage.getItem('Language')];
              }else{
                service = service.title 
              }
              return service
            })
            obj.services_data = services
            return obj;
          });
          console.log(this.feedback)
          this.rating = data.rating;
          this.totalPages = data.feedback.last_page;
          this.currentPage = data.feedback.current_page;
          this.totalFeedback = data.feedback.total;
          this.$t("Components.Feedback.Content").map(
            (content, index) => (this.steps[index].content = content)
          );
          this.$route.query.istour && localStorage.getItem("skipTour") != "true"
            ? this.$tours["Feedback"].start()
            : "";
        }.bind(this)
      )
      .finally(() => {
        this.hideLoading();
      });
  },
  components: {
    FeedbackSummary,
  },
};
</script>