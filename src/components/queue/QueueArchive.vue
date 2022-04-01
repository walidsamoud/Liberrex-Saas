<template>
  <div>
    <vs-row>

      <div class="history">
                        <div slot="header">
                  <h4 class="m-3">Archive {{archive_data[0].fname}} {{archive_data[0].lname}} {{archive_data[0].checkinDate}} {{archive_data[0].checkinTime}}</h4>
                </div>
                {{archive_data}}
                <!-- <div class='Ticket_Archive' >
                        <vs-table :total="archive_data.length" :data="archive_data" 
                                  @selected="handleSelected"
                                  v-model="selected"
                      >
                
                <template slot="thead">
                  <vs-th sort-key="phone">{{$t('Queue.Archive.ServedAt')}}</vs-th>
                  <vs-th sort-key="joindate">{{$t('Queue.Archive.Services')}}</vs-th>


                </template>

                <template slot-scope="{data}" >
                  <vs-tr  :data="tr" :key="indextr" v-for="(tr, indextr) in data" @v-model="selected">
                    <template @click="log">
                    <vs-td :data="data[indextr].statusUpdateTimestamp">
                      <div class="d-flex align-items-center">
                        <span class="text-muted">{{data[indextr].statusUpdateTimestamp}}</span>
                      </div>
                    </vs-td>
  

                    <vs-td :data="data[indextr].services">
                      <div class="d-flex align-items-center">
                        {{ data[indextr].service_names }}
                      </div>
                    </vs-td>
                    </template>
                  </vs-tr >
                </template>
              </vs-table>
        </div> -->
      </div>
    </vs-row>
    
             
  </div>
  
</template>
<script>

import {queueService,customerService} from "../../_services";
export default {
  name: "QueueCustomerArchive",
  data: () => ({
    title: "QueueCustomerArchive",
    isActive: false,
    redirectPopupActive: false,
    swapActive: false,
    keepTicket: false,
    updateMemberActive: false,
    addNoteActive: false,
    showHistory: false,
    queue_id: 0,
    member: -1,
    selected: {},
    archive_data: [],
    queues: [],
    waiting_list: [],
    queue: {},
    action: null,
    selectMember: 0,
    swapTicket: 0
  }),
  props: {
    ticket: Object,
    rank: Number,
    members: Array,
    choosable: Boolean
  },
  methods: {

    showLoading(){
      this.$vs.loading({
        container: '#queue-box',
        scale: 0.6
      });
    },
    hideLoading(){
      this.$vs.loading.close('#queue-box > .con-vs-loading')
    },
    show(){
      this.isActive = true
    },
    hide(){
      this.isActive = false
    },
    reset(){
      this.action = null;
      this.redirectPopupActive = false;
      this.swapActive = false;
      this.updateMemberActive = false;
      this.member = -1;
      this.queue = {};
      this.selectMember = 0;
      this.swapTicket = 0;
    },

  },
  props:{
      archive:Object
  },
  computed: {
    waitingTimeFormated: function () {
      return this.$moment().startOf('day').add(this.ticket.cumulative_waiting_time, 'minutes').format('HH:mm');
    }
  },
  mounted() {
      this.archive_data = [this.archive];
      console.log('ahoeiaez');
      console.log(this.archive);
  }
};
</script>
<style>
  .ticketPopup > .vs-popup{
    width: 400px;
  }
    .animation {
    transition: all 0.5s;
  }
</style>