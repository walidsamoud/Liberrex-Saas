<template>
  <div @click="showPopup">
    <vs-card v-if="item.status == 'waiting'" :class="item.urgent ? 'urgent' : ''" :style="lateStyle">
      <vs-row>
        <vs-col vs-lg="2" vs-md="2" vs-sm="2" vs-xs="3" class="mr-0 border-right text-center">
          <h2 class="ticket-header">#{{rank}}</h2>
          <small class="text-cyan extra-details">{{$t('Components.Queue.TicketItem.Rank')}}</small>
        </vs-col>
        <vs-col vs-lg="2" vs-md="2" vs-sm="2" vs-xs="3" class="mr-0 border-right text-center">
          <h2 class="ticket-header">{{item.public_identifier}}</h2>
          <small class="text-cyan extra-details">{{$t('Components.Queue.TicketItem.TicketNumber')}}</small>
        </vs-col>
        <vs-col vs-lg="8" vs-md="8" vs-sm="8" vs-xs="6" class="pl-4">
          <h4 v-if="item.fname || item.lname">
            {{item.fname}} {{item.lname}}<span v-if="item.internal_id" class="border-left ml-2 pl-2 text-warning">{{item.internal_id}}</span>
          </h4>
          <h4 v-if="!(item.fname || item.lname)">{{$t('Components.Queue.TicketItem.Anonymous')}}</h4>
          <p class="small mb-0 extra-details">
            <b>{{$t('Components.Queue.TicketItem.CheckInTime')}}: </b> {{item.checkinTime}} |
            <b>{{$tc('Shared.Service', item.service_names.split(",").length)}}: </b> {{item.service_names}} <br>
            <b>{{$t('Components.Queue.TicketItem.EstimatedWaitingTime')}}: </b>
            {{item.estimated_waiting_time}} {{$tc('Shared.Minute', item.estimated_waiting_time)}}

            <br><b v-if="item.running_late"><i class="mdi mdi-run-fast"></i>  This customer is running late.</b>

            <b v-if="item.booking_time != null" > | </b>
           <b v-if="item.booking_time != null" style="color: red;"> {{$t('Components.Queue.TicketItem.BookedFor')}}: {{item.booking_time}}</b>
            <b v-if="item.queue_line_id != null" style="color: Black;"> {{$t('Booking.Queue')}}: {{item.queue_line_id}}</b>

          </p>
        </vs-col>
      </vs-row>
    </vs-card>

    <vs-card v-if="item.status == 'inservice'" class="inservice"  :style="lateStyle">
      <vs-row>
        <vs-col vs-lg="2" vs-md="2" vs-sm="2" vs-xs="3" class="mr-0 border-right text-center">
          <h2 class="ticket-header">#{{rank}}</h2>
          <small class="text-cyan extra-details">{{$t('Components.Queue.TicketItem.Rank')}}</small>
        </vs-col>
        <vs-col vs-lg="2" vs-md="2" vs-sm="2" vs-xs="3" class="mr-0 border-right text-center">
          <h2 class="ticket-header">{{item.public_identifier}}</h2>
          <small class="text-cyan extra-details">{{$t('Components.Queue.TicketItem.TicketNumber')}}</small>
        </vs-col>
        <vs-col vs-lg="8" vs-md="8" vs-sm="8" vs-xs="6" class="pl-4">
          <h4 v-if="item.fname || item.lname">
            {{item.fname}} {{item.lname}}<span v-if="item.internal_id" class="border-left ml-2 pl-2 text-light">{{item.internal_id}}</span>
          </h4>
          <h4 v-if="!(item.fname || item.lname)">{{$t('Components.Queue.TicketItem.Anonymous')}}</h4>
          <p class="small mb-0 extra-details">
            <b>{{$t('Components.Queue.TicketItem.CheckInTime')}}: </b> {{item.checkinTime}} |
            <b>{{$tc('Shared.Service', item.service_names.split(",").length)}}: </b> {{item.service_names}} <br>
            <b>{{$t('Components.Queue.TicketItem.EstimatedWaitingTime')}}: </b>
            {{item.estimated_waiting_time}} {{$tc('Shared.Minute', item.estimated_waiting_time)}}

            <br><b v-if="item.running_late"><i class="mdi mdi-run-fast"></i>  This customer is running late</b>

            <b v-if="item.queue_line_id != null" style="color: Black;"> {{$t('Booking.Queue')}}: {{item.queue_line_id}}</b>

          </p>
        </vs-col>
      </vs-row>
    </vs-card>

    <CustomizerAddCustomer
            ref="AddCustomerCustomizer"
            :ticket_prop= true
            :members="members" 
            :choosable="choosable == 1" 
            :rank="rank" 
            :ticket="item"
            :sideBarTitle= "title_sidebar"
            @refreshWaitingList="refreshWaitingList"
          ></CustomizerAddCustomer>
    <!-- <TicketDetailsPopup @delete="emitDelete" @change="emitUpdate" @update="emitUpdate" :members="members" :choosable="choosable == 1" :rank="rank" :ticket="item" ref="ticketPopup"></TicketDetailsPopup> -->
  </div>
</template>
<script>

import TicketDetailsPopup from './TicketDetailsPopup'
import TicketDetail from './TicketDetail'
import CustomizerAddCustomer from '../../layout/full/customizer/CustomizerAddCustomer.vue';
export default {
  name: "WaitingListItem",
  data: () => ({
    title: "WaitingListItem",
    title_sidebar: "",
    lateStyle: ""
  }),
  props: {
    item: Object,
    rank: Number,
    members: Array,
    choosable: Boolean,
    startCount: Boolean
  },
  methods: {
    notify(title, text, type) {
      this.$vs.notify({
        color: type,
        title: title,
        text: text
      });
    },
    showPopup(){
      this.title_sidebar = this.item.fname+" "+ this.item.lname;
      this.$refs.AddCustomerCustomizer.show();
      this.$refs.AddCustomerCustomizer.update_prop(this.title_sidebar,"sidebar_title");
    },
    emitDelete(){
      this.$emit('delete');
    },
    emitUpdate(){
      this.$emit('update');
    },
    refreshWaitingList(){
      this.$emit('update');
      this.$emit('delete');
      console.log("refreshWaitingList");
    },
    waitingTimeCountdown(){
      if(this.startCount == 1){
        let timeLeft = parseInt(this.item.estimated_waiting_time) - 1;
        this.item.estimated_waiting_time = timeLeft > -1 ? timeLeft : 0;
      }
    }
  },

  computed: {
    waitingTimeFormated: function () {
      return this.$moment().startOf('day').add(this.queue.waiting_time, 'minutes').format('HH:mm');
    }
  },
  created(){
    // console.log(this.startCount)
    var self = this;
    setInterval(function () {
      self.waitingTimeCountdown()
    }, 60 * 1000)
  },
  mounted() {
    if( this.item.running_late ){
      this.lateStyle= 'background-image: linear-gradient(to right, #ffef0f, #fff45c) !important;'
    }
  },
  components: {
    TicketDetailsPopup,
    CustomizerAddCustomer
  }
};

</script>
<style>
  @media screen and (max-width: 500px) {
    .extra-details{
      display: none;
    }
    .ticket-header{
      font-size: 1.125rem
    }
  }
</style>