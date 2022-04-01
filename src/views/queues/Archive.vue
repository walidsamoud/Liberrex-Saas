<template>
  <vs-row vs-justify="center" id="queue-box">

    <vs-col type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-md="12" vs-sm="12" vs-xs="12">

      <vs-row>
        <vs-col vs-w="12">
          <div>
            <vs-card>
              <vs-tabs>
                <vs-tab :label="$t('SMS.History')" icon="history">
                  <vs-input
                          :label="$t('Booking.CreatePrompt.StartDate')"
                          timezone="FR-fr"
                          :max="new Date().toISOString().split('T')[0]"
                          type="date"
                          class="w-100 mb-4"
                          v-model="selectedDate"
                          @change="loadWaitingList"
                  />
                  <vs-table :total="waiting_list.length" :data="waiting_list">
                    <div slot="header">
                      <h4 class="m-3">{{queue.title}}</h4>
                    </div>
                    <template slot="thead">
                      <!-- <vs-th sort-key="iid">{{$t('Queue.Archive.ID')}}</vs-th> -->
                      <vs-th sort-key="iid">{{$t('Components.Queue.TicketItem.TicketNumber')}}</vs-th>
                      <vs-th sort-key="contactname">{{$t('Queue.Archive.Customer')}}</vs-th>
                      <vs-th sort-key="joindate">{{$t('New.Phone')}}</vs-th>
                      <vs-th sort-key="joindate">{{$t('Queue.Archive.Services')}}</vs-th>
                      <vs-th sort-key="joindate">{{$t('New.Waited')}}</vs-th>
                      <vs-th sort-key="joindate">{{$t('New.Spent')}}</vs-th>
                      <vs-th sort-key="joindate">{{$t('Queue.Create.CounterName')}}</vs-th>
                      <vs-th sort-key="joindate">{{$t('Menu.Feedback')}}</vs-th>
                      <!-- <vs-th sort-key="phone">{{$t('Queue.Archive.Notes')}}</vs-th> -->
                      <vs-th sort-key="phone">{{$t('Queue.Archive.ServedAt')}}</vs-th>
                    </template>

                    <template slot-scope="{data}">
                      <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">

                        <!-- <vs-td :data="data[indextr].internal_id">
                          <div class="d-flex no-block text-center align-items-center">
                            <b>{{data[indextr].internal_id ? data[indextr].internal_id : '-'}}</b>
                          </div>
                        </vs-td> -->
                        <vs-td :data="data[indextr].public_identifier">
                          <div class="d-flex no-block text-center align-items-center">
                            <b>{{data[indextr].public_identifier}}</b>
                          </div>
                        </vs-td>

                        <vs-td :data="data[indextr].fname+' '+data[indextr].lname">
                          <div class="d-flex no-block align-items-center">
                            <span v-if="data[indextr].fname && data[indextr].fname!='null'">{{data[indextr].fname+' '+data[indextr].lname}}</span>
                            <span v-else>{{$t('Components.Queue.TicketItem.Anonymous')}}</span>
                          </div>
                        </vs-td>

                        <vs-td :data="data[indextr].phone_number">
                          <div class="d-flex no-block align-items-center">
                            {{ data[indextr].phone_number}}
                          </div>
                        </vs-td>

                        <vs-td :data="data[indextr].services">
                          <div class="d-flex align-items-center">
                            {{ data[indextr].service_names }}
                          </div>
                        </vs-td>

                        <vs-td :data="data[indextr].waited">
                          <div class="d-flex align-items-center">
                            <span class="text-muted">{{data[indextr].waited}}</span>
                          </div>
                        </vs-td>

                        <vs-td :data="data[indextr].spent">
                          <div class="d-flex align-items-center">
                            <span class="text-muted">{{data[indextr].spent}}</span>
                          </div>
                        </vs-td>

                        <vs-td :data="data[indextr].counter">
                          <div class="d-flex align-items-center">
                            <span class="text-muted" v-if="data[indextr].counter">{{data[indextr].counter.name}}</span>
                            <span v-else></span>
                          </div>
                        </vs-td>

                        <vs-td :data="data[indextr].spent">
                          <div class="d-flex align-items-center">
                            <p v-if="data[indextr].feedback" style="display: block">
                              <i
                                class="mdi mdi-star rating-star" style="font-size : 16px"
                                :key="index+'-avg-full'"
                                v-for="index in data[indextr].feedback.rating"
                              ></i>
                              <i
                                class="mdi mdi-star-outline rating-star" style="font-size : 16px"
                                :key="index+'-avg-empty'"
                                v-for="index in (5-data[indextr].feedback.rating)"
                              ></i><br>
                              {{data[indextr].feedback.feedback}}
                            </p>
                            <span v-else>--</span>
                            <hr>
                          </div>
                        </vs-td>

                        <!-- <vs-td :data="data[indextr].notes">
                          <div class="d-flex align-items-center">
                            <span class="text-muted">{{data[indextr].notes}}</span>
                          </div>
                        </vs-td> -->

                        <vs-td :data="data[indextr].statusUpdateTimestamp">
                          <div class="d-flex align-items-center">
                            <span class="text-muted">{{data[indextr].statusUpdateTimestamp}}</span>
                          </div>
                        </vs-td>

                      </vs-tr>
                    </template>
                  </vs-table>
                </vs-tab>
                <vs-tab :label="$t('New.TicketsErrone')" icon="history">
                  <div class="filterbox">
                    <vs-row class="date-ranges p-0 m-0">
                      <vs-col vs-lg="3" vs-sm="12" class="p-0 m-0" style="border: none;padding: 10px;">
                        <label for="From"><b>Filtrer la data: du</b></label>
                        <input type="date" id="From" class="from" v-model="date_range.from">
                      </vs-col>

                      <vs-col vs-lg="1" vs-sm="12" style="border: none;padding: 10px;">
                      </vs-col>

                      <vs-col vs-lg="3" vs-sm="12" class=" p-0 m-0" style="border: none;padding: 10px;">
                        <label for="To"><b>Jusque'a</b></label>
                        <input type="date" id="To" class="from" v-model="date_range.to" :min="date_range.from">
                      </vs-col>

                      <vs-col vs-lg="1" vs-sm="12" style="border: none;padding: 10px;">
                      </vs-col>

                      <vs-col vs-lg="1" vs-sm="12" class=" p-0 m-0" style="border: none;padding: 10px;">
                        <label for="">.</label>
                        <button class="btn btn-info filterBtn" @click="getDamagedtickets()">Filtrer</button>
                      </vs-col>
                      
                      <vs-col vs-lg="1" vs-sm="12" style="border: none;padding: 10px;">
                      </vs-col>

                      <vs-col vs-lg="2" vs-sm="12" class=" p-0 m-0" style="border: none;padding: 10px;">
                        <label for="">.</label>
                        <button class="btn btn-warning filterBtn" @click="updateAllPrompt = true">Fixer Tous</button>
                      </vs-col>
                    </vs-row>
                  </div>
                  <vs-table :total="tickets_errone.length" :data="tickets_errone">
                    <div slot="header">
                      <h4 class="m-3">{{queue.title}}</h4>
                    </div>
                    <template slot="thead">
                      <!-- <vs-th sort-key="iid">{{$t('Queue.Archive.ID')}}</vs-th> -->
                      <vs-th sort-key="iid">{{$t('Components.Queue.TicketItem.TicketNumber')}}</vs-th>
                      <vs-th sort-key="contactname">{{$t('Queue.Archive.Customer')}}</vs-th>
                      <vs-th sort-key="joindate">{{$t('New.Phone')}}</vs-th>
                      <vs-th sort-key="joindate">{{$t('Queue.Archive.Services')}}</vs-th>
                      <vs-th sort-key="joindate">{{$t('New.Waited')}}</vs-th>
                      <vs-th sort-key="joindate">{{$t('Components.Queue.TicketItem.EstimatedServiceTime')}}</vs-th>
                      <vs-th sort-key="joindate">{{$t('New.Spent')}}</vs-th>
                      <vs-th sort-key="joindate">{{$t('Queue.Create.CounterName')}}</vs-th>
                      <vs-th sort-key="joindate">{{$t('Menu.Feedback')}}</vs-th>
                      <!-- <vs-th sort-key="phone">{{$t('Queue.Archive.Notes')}}</vs-th> -->
                      <vs-th sort-key="phone">{{$t('Queue.Archive.ServedAt')}}</vs-th>
                      <vs-th sort-key="joindate">{{$t('Customer.Table.Options')}}</vs-th>
                    </template>

                    <template slot-scope="{data}">
                      <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in tickets_errone" :id="'TicketErrone'+tr.id">

                        <!-- <vs-td :data="data[indextr].internal_id">
                          <div class="d-flex no-block text-center align-items-center">
                            <b>{{data[indextr].internal_id ? data[indextr].internal_id : '-'}}</b>
                          </div>
                        </vs-td> -->
                        <vs-td :data="data[indextr].public_identifier">
                          <div class="d-flex no-block text-center align-items-center">
                            <b>{{data[indextr].public_identifier}}</b>
                          </div>
                        </vs-td>

                        <vs-td :data="data[indextr].fname+' '+data[indextr].lname">
                          <div class="d-flex no-block align-items-center">
                            <span v-if="data[indextr].fname && data[indextr].fname!='null'">{{data[indextr].fname+' '+data[indextr].lname}}</span>
                            <span v-else>{{$t('Components.Queue.TicketItem.Anonymous')}}</span>
                          </div>
                        </vs-td>

                        <vs-td :data="data[indextr].phone_number">
                          <div class="d-flex no-block align-items-center">
                            {{ data[indextr].phone_number}}
                          </div>
                        </vs-td>

                        <vs-td :data="data[indextr].services">
                          <div class="d-flex align-items-center">
                            {{ data[indextr].service_names }}
                          </div>
                        </vs-td>

                        <vs-td :data="data[indextr].waited">
                          <div class="d-flex align-items-center">
                            <span class="text-muted">{{data[indextr].waited}}</span>
                          </div>
                        </vs-td>

                        <vs-td :data="data[indextr].estimatedTimeToSpend">
                          <div class="d-flex align-items-center">
                            <span class="text-muted">{{data[indextr].estimatedTimeToSpend}}min</span>
                          </div>
                        </vs-td>

                        <vs-td :data="data[indextr].spent">
                          <div class="d-flex align-items-center">
                            <span class="text-danger">{{data[indextr].spent}}</span>
                          </div>
                        </vs-td>

                        <vs-td :data="data[indextr].counter">
                          <div class="d-flex align-items-center">
                            <span class="text-muted" v-if="data[indextr].counter">{{data[indextr].counter.name}}</span>
                            <span v-else></span>
                          </div>
                        </vs-td>

                        <vs-td :data="data[indextr].spent">
                          <div class="d-flex align-items-center">
                            <p v-if="data[indextr].feedback" style="display: block">
                              <i
                                class="mdi mdi-star rating-star" style="font-size : 16px"
                                :key="index+'-avg-full'"
                                v-for="index in data[indextr].feedback.rating"
                              ></i>
                              <i
                                class="mdi mdi-star-outline rating-star" style="font-size : 16px"
                                :key="index+'-avg-empty'"
                                v-for="index in (5-data[indextr].feedback.rating)"
                              ></i><br>
                              {{data[indextr].feedback.feedback}}
                            </p>
                            <span v-else>--</span>
                            <hr>
                          </div>
                        </vs-td>

                        <!-- <vs-td :data="data[indextr].notes">
                          <div class="d-flex align-items-center">
                            <span class="text-muted">{{data[indextr].notes}}</span>
                          </div>
                        </vs-td> -->

                        <vs-td :data="data[indextr].statusUpdateTimestamp">
                          <div class="d-flex align-items-center">
                            <span class="text-muted">{{data[indextr].statusUpdateTimestamp}}</span>
                          </div>
                        </vs-td>

                        <vs-td>
                          <div class="d-flex align-items-center">
                            <vs-button radius color="primary" type="border" icon="edit" id="edit-kiosk-button" @click="openEdit(data[indextr])"></vs-button>
                          </div>
                        </vs-td>

                      </vs-tr>
                    </template>
                  </vs-table>
                </vs-tab>
              </vs-tabs>
            </vs-card>
          </div>
        </vs-col>
      </vs-row>
      <!---Show Sectet --->
      <vs-prompt
              color="primary"
              :active.sync="updatePrompt.status"
              :title="$t('New.ChangeTicketServiceTime')"
              :cancel-text="$t('Kiosk.ShowSecretPrompt.CancelButton')"
              :accept-text="$t('Kiosk.EditKioskPrompt.SubmitButton')"
              buttonAccept="true"
              @accept="updateServiceTime"
      >
        <div class="ticketErroneInfo">
          <p class="info"><b>{{$t('Components.Queue.TicketItem.TicketNumber')}}: </b> {{updatePrompt.ticket}}</p>
          <p class="info"><b>{{$t('Queue.Archive.Services')}}: </b> {{updatePrompt.services}}</p>
          <p class="info"><b>{{$t('New.Waited')}}: </b> {{updatePrompt.waited}}</p>
          <p class="info"><b>{{$t('Components.Queue.TicketItem.EstimatedServiceTime')}}: </b> {{updatePrompt.estimatedTimeToSpend}} {{$t('New.Min')}}</p>
          <p class="info text-danger"><b>{{$t('New.Spent')}}: </b> {{updatePrompt.spent}}</p>
          .
          <hr>
          <vs-input
            :danger="updatePrompt.error"
            :danger-text="$t('Errors.InvalidPolite', {field: $t('New.NewServiceTimeError')})"
            :label="$t('New.NewServiceTimeLabel')"
            v-model="updatePrompt.newServiceTime" class="w-100 mb-2" />
        </div>
      </vs-prompt>

      <vs-prompt
              color="danger"
              :active.sync="updateAllPrompt"
              :title="$t('Kiosk.EditKioskPrompt.SubmitButton')"
              :cancel-text="$t('Kiosk.ShowSecretPrompt.CancelButton')"
              :accept-text="$t('Kiosk.EditKioskPrompt.SubmitButton')"
              buttonAccept="true"
              @accept="fixAll()"
      >
        <div class="ticketErroneInfo">
          <p style="font-size: 13px;color: #333;">
            Voulez vous vraiment fixer les <b>{{tickets_errone.length}}</b> tickets erroné?<br>
            Cette tache est <b>irréversible</b>
          </p>
        </div>
      </vs-prompt>

    </vs-col>
  </vs-row>
</template>

<script>
import {queueService} from '../../_services'
import { mapState } from 'vuex'
import moment from 'moment'
import $ from 'jquery'

export default {
  name: "WaitingList",
  data: () => ({
    title: "Waiting List",
    queue: {
      title: '',
      working_days: [ ],
      services: [],
      counters: [],
      members: [],
    },
    waiting_list: [],
    tickets_errone: [],
    selectedDate: '',
    updatePrompt: {
      status: false,
      id: null,
      ticket: null,
      services: null,
      waited: null,
      estimatedTimeToSpend: null,
      spent: null,
      newServiceTime: null
    },
    updateAllPrompt: false,
    date_range: {
      from: null,
      to: null,
      queue_id: null
    },
  }),
  methods: {
    fixAll(){
      this.showLoading()
      queueService.fixAllDamagedTickets(this.date_range).then(function(){
        this.notify(this.$t('Toasts.Successful'), this.$t('Kiosk.EditKioskPrompt.ToastSuccess'), 'success');
        this.getDamagedtickets()
      }.bind(this)).catch(function(){
        this.notify(this.$t('Toasts.Error'), this.$t('Kiosk.EditKioskPrompt.ToastFail'), 'danger');
      }.bind(this)).finally(function(){
        this.hideLoading();
      }.bind(this)) 
    },
    getDamagedtickets(){
      this.showLoading()
      queueService.getDamagedtickets(this.date_range).then(function(data){
        this.tickets_errone = data.waiting_list.map((obj)=>{
          let duration = moment.duration(
            moment(String(obj.statusUpdateTimestamp)).diff(
              moment(String(obj.checkinDate+' '+obj.checkinTime))
            )
          );
          let h = Math.floor( duration.asHours() );
          let min = Math.floor( duration.asMinutes()%60 );
          let sec = Math.floor( duration.asSeconds()%60 );

          obj.waited= (h!=0?h+'h ':' ')+min+'min '+(sec!=0?sec+'s':'');
          
          //SPENT
          h = Math.floor( obj.service_time/60 );
          min = Math.floor( obj.service_time%60 );

          obj.spent= (h!=0?h+'h ':' ')+min+'min ';

          return obj
        });
      }.bind(this)).finally(function(){
        this.hideLoading();
      }.bind(this)) 
    },
    notify(title, text, type) {
      this.$vs.notify({
        color: type,
        title: title,
        text: text
      });
    },
    updateServiceTime(){
      this.showLoading()
      queueService.fixDamagedTickets(this.updatePrompt).then(function(){
        $('#TicketErrone'+this.updatePrompt.id).hide()
        this.notify(this.$t('Toasts.Successful'), this.$t('Kiosk.EditKioskPrompt.ToastSuccess'), 'success');
      }.bind(this)).catch(function(){
        this.notify(this.$t('Toasts.Error'), this.$t('Kiosk.EditKioskPrompt.ToastFail'), 'danger');
      }.bind(this)).finally(function(){
        this.hideLoading();
      }.bind(this)) 
    },
    openEdit(ticket){
      console.log(ticket)
      this.updatePrompt.status = true
      this.updatePrompt.id = ticket.ticket_id
      this.updatePrompt.ticket = ticket.public_identifier
      this.updatePrompt.services = ticket.service_names
      this.updatePrompt.waited = ticket.waited
      this.updatePrompt.estimatedTimeToSpend = ticket.estimatedTimeToSpend
      this.updatePrompt.spent = ticket.spent
      this.updatePrompt.newServiceTime = ticket.service_time
    },
    notify(title, text, type) {
      this.$vs.notify({
        color: type,
        title: title,
        text: text
      });
    },
    showLoading(){
      this.$vs.loading({
        container: '#queue-box',
        scale: 0.6
      });
    },
    hideLoading(){
      this.$vs.loading.close('#queue-box > .con-vs-loading')
    },
    openAddCustomerPrompt(){
      this.$refs.addCustomerPrompt.show()
    },
    loadWaitingList(){
      this.showLoading();
      let payload = {date: this.selectedDate};
      queueService.getArchivedWaitingList(this.$route.params.id, payload).then(function (data) {
        //WAITED
        this.waiting_list = data.waiting_list.map((obj)=>{
          let duration = moment.duration(
            moment(String(obj.statusUpdateTimestamp)).diff(
              moment(String(obj.checkinDate+' '+obj.checkinTime))
            )
          );
          let h = Math.floor( duration.asHours() );
          let min = Math.floor( duration.asMinutes()%60 );
          let sec = Math.floor( duration.asSeconds()%60 );

          obj.waited= (h!=0?h+'h ':' ')+min+'min '+(sec!=0?sec+'s':'');
          
          //SPENT
          h = Math.floor( obj.service_time/60 );
          min = Math.floor( obj.service_time%60 );

          obj.spent= (h!=0?h+'h ':' ')+min+'min ';

          //Check if ticket is overTimed
          if(obj.service_time > obj.estimatedTimeToSpend*3){
            this.tickets_errone.push(obj)
          }

          return obj
        });
      }.bind(this)).finally(function () {
        this.hideLoading();
      }.bind(this))
    },


  },
  computed: {
    ...mapState({
      workingDays: state => state.account.user.working_days,
    }),
    waitingTimeFormated: function () {
      return this.$moment().startOf('day').add(this.waiting_time, 'seconds').format('HH:mm:ss');
    }
  },

  mounted(){
    this.date_range.queue_id = this.$route.params.id
    this.selectedDate = this.$moment().format('YYYY-MM-DD');
    queueService.getById(this.$route.params.id).then(function (data) {
      this.queue = data.queue;
      this.pending = data.pending;
      this.servicesList = data.services;
      this.total_waiting = data.totalWaiting;
      this.waiting_time = data.waiting_time;
      this.queue.services = data.services.map(obj => {
        return obj.id
      });
    }.bind(this)).finally(function () {}.bind(this));
    this.loadWaitingList();

  },
  components:{

  }
};
</script>
<style lang="scss">
  .animation {
    transition: all 0.5s;
  }
  .ticketErroneInfo .info{
    width: 100%;
    float: right;
    text-align: right;
  }
  .ticketErroneInfo .info b{
    float: left;
  }
  .vs-button-primary{
    background: var(--primary);
  }
  .vs-button-danger{
    background: #f62d51;
  }
</style>

<style scoped>
table{
  width: 100%;
  border: 1px solid #ddd;
}
.title{
  font-size: 15px;
  font-weight: bold;
  background: #008fc9;
  padding: 5px 10px;
  border-radius: 5px;
  color: #fff;
  margin-bottom: 10px;
}
td, th, .vs-table-text{
  /* text-align: center; */
}
.vs-col{
  border: 1px solid #ddd;
}
.badge{
  padding: 5px 10px;
  border-radius: 5px;
  margin-right: 5px;
  margin-bottom: 5px;
}

.date-ranges{
  margin-top: 20px !important;
}
.date-ranges input{
  width: 100%;
  height: 35px;
  border: 1px solid #ddd;
  padding: 10px;
  cursor: pointer;
}
.filterBtn{
  display: block;
  border-radius: 5px;
  width: 100%;
  height: 35px;
}
</style>