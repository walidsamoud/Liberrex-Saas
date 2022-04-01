<template>
  <vs-row vs-justify="center" id="queue-box">
    <vs-col type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-xs="12">
      <vs-card>
          <vs-row>
              <vs-col vs-lg="9" vs-md="8" vs-sm="6" vs-xs="12">
                 <!-- <vs-input :placeholder="$t('Queue.SearchQueuePlaceholder')" v-model="search" class="inputx" /> -->
              </vs-col>
              <vs-col vs-lg="3" vs-md="4" vs-sm="6" vs-xs="12" class="d-flex align-items-center">
                  <vs-button
                          :disabled="isEmployee"
                          icon="add"
                          color="primary"
                          to="/queues/create"
                          class="flex-shrink-0 ml-auto w-100"
                          id="create-queues"
                  >{{$t('Queue.CreateQueueButton')}}</vs-button>
              </vs-col>
          </vs-row>
      </vs-card>

      <vs-row class="mt-4">
        <QueueItem id="queues-listing" :key="index" v-for="(queue, index) in queues" :queue="queue" @delete="refreshQueues" :isEmployee="isEmployee"></QueueItem>
      </vs-row>

    </vs-col>

      <!--V-Tour start-->
      <v-tour name="Queues" :steps="steps">
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
                      <template v-if="tour.currentStep === 1">
                          <div slot="actions" class="v-step__buttons">
                              <button @click="tour.previousStep" class="v-step__button">Previous</button>
                              <button @click="goToNextPage" class="v-step__button">Next</button>
                          </div>
                      </template>
                  </v-step>
              </transition>
          </template>
      </v-tour>

      <vs-col vs-lg="12" vs-xs="12" vs-sm="12" v-if="!queues.length">
          <vs-card>
              <div>
                  <img :src="require('@/assets/images/placeholder/no-data.jpg')" class="w-100"/>
              </div>
          </vs-card>
      </vs-col>
  </vs-row>
</template>

<script>
import { mapState } from 'vuex'
import QueueItem from '../../components/queue/QueueItem'
import { queueService } from '../../_services'
import router from "../../_helpers/router";

export default {
  name: "ContactGrid",
  data: () => ({
    isEmployee : false,
    title: "ContactGrid",
    activePrompt: false,
    queues: [ ],
    search: '',
    working_days: [],
      steps: [
          {
              target: '#queues-listing',  // We're using document.querySelector() under the hood
              header: {
                  title: 'Listing of Queues',
              },
              params: {
                  placement: 'auto' // Any valid Popper.js placement. See https://popper.js.org/popper-documentation.html#Popper.placements
              }
          },
          {
              target: '#create-queues',
              params: {
                  placement: 'auto-start' // Any valid Popper.js placement. See https://popper.js.org/popper-documentation.html#Popper.placements
              }
          }
      ],
  }),
  methods: {
    refreshQueues(){
      queueService.getAllWithSummary().then(function (data) {
        this.queues = data.queues;
        console.log('aaaaa')
        console.log(this.queues)
      }.bind(this));
    },
      goToNextPage(){
          router.push({ path: "/queues/create?istour=on" });
      },
  },
  computed: {
    ...mapState({
      account_info: state => state.account.user ? state.account.user.user : {user: {photo: ""}},
      workingDays: state => state.account.user.working_days,
    }),
    events() {
      return this.$store.state.contactEvents;
    },
    validName() {
      return this.queues.length > 0;
    },
    queueGrids() {
      return this.queues.filter(
        item =>
                item.queue.title
            .toLowerCase()
            .includes(this.search.toLowerCase())
      );
    }
  },
  mounted(){
    this.isEmployee=this.account_info.role!='ADMIN';
    queueService.getAllWithSummary().then(function (data) {
      this.queues = data.queues.filter(obj =>{
        let membresQueue = obj.queue.members;
        if (this.isEmployee){
        for(let i = 0 ; i<membresQueue.length;i++)
                {
                  if(membresQueue[i].id==this.account_info.id)
                    return obj
                }
        }
        else{
        return obj;
        }
        
      });
        this.$t('Queue.Content').map((content,index)=> (
            this.steps[index].content = content
        ));
      this.$route.query.istour && localStorage.getItem('skipTour')!='true' ? this.$tours['Queues'].start() : '';
    }.bind(this));
    this.working_days = {...this.workingDays}
  },
  components: {
    QueueItem
  }
};
</script>
