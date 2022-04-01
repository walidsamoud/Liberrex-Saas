<template>
  <vs-row vs-justify="center">
    <vs-col type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-xs="12">
      <vs-card>

        <FullCalendar
            defaultView="dayGridMonth"
            ref="fullCalendar"
            :plugins="calendarPlugins"
            :weekends="true"
            :header="header"
            :custom-buttons="customButtons"
            :events="events"
            :config="calendarConfig"
             @dateClick="handleDateClick"
             @eventClick="eventSelected"
            class="w-100"
        />

        <!---Add Event --->
        <vs-prompt
          color="primary"
          @cancel="title=''"
          @accept="createEvent"
          @close="close"
          :is-valid="validName"
          :active.sync="activePrompt2"
          title="Add Booking"
          >
          <div class="con-exemple-prompt">
            <vs-select
                    placeholder="Customer"
                    class="w-100 mb-4"
                    label="Customer"
                    autocomplete
                    v-model="customer"
            >
              <vs-select-item :key="index" :value="item.id" :text="item.name" v-for="(item,index) in customersList" />
            </vs-select>
            <vs-input label="Start Date" type="date" class="w-100 mb-4" v-model="start" @change="getAvailableSlots"/>
            <vs-select
                    placeholder="Time Slot"
                    class="w-100 mb-4"
                    label="Start Time"
                    v-model="start_time"
            >
              <vs-select-item :key="index" :value="item.value" :disabled="item.status==0" :text="item.value" v-for="(item,index) in availableSlots" />
            </vs-select>
            <vs-select
                    placeholder="Duration"
                    class="w-100 mb-4"
                    label="Duration"
                    v-model="duration"
            >
              <vs-select-item :key="index" :value="item.value" :text="item.text" v-for="(item,index) in durationOptions" />
            </vs-select>
            <vs-select
                    placeholder="Services"
                    class="w-100 mb-4"
                    label="Services"
                    autocomplete
                    multiple
                    v-model="services"
            >
              <vs-select-item :key="index" :value="item.id" :text="item.name" v-for="(item,index) in servicesList" />
            </vs-select>
            <vs-alert
              :active="!validName"
              color="danger"
              icon="new_releases"
              class="mb-3"
            >Fields can not be empty please enter the data</vs-alert>
          </div>
        </vs-prompt>

        <!---Edit Event --->
        <vs-prompt
                color="warning"
                @cancel="title=''"
                @accept="updateEvent"
                @close="close"
                :is-valid="validName"
                :active.sync="activeEditPrompt"
                title="Edit Booking"
        >
          <div class="con-exemple-prompt">
            <vs-button color="danger" type="border" icon="delete" class="w-100 mb-2">Delete Booking</vs-button>
            <vs-select
                    placeholder="Customer"
                    class="w-100 mb-4"
                    label="Customer"
                    autocomplete
                    v-model="selectedEvent.customer"
                    :disabled="true"
            >
              <vs-select-item :key="index" :value="item.id" :text="item.name" v-for="(item,index) in customersList" />
            </vs-select>
            <vs-input label="Start Date" type="date" class="w-100 mb-4" v-model="selectedEvent.date" @change="getAvailableSlots"/>
            <vs-select
                    placeholder="Time Slot"
                    class="w-100 mb-4"
                    label="Start Time"
                    v-model="selectedEvent.time"
            >
              <vs-select-item :key="index" :value="item.value" :disabled="item.status==0" :text="item.value" v-for="(item,index) in availableSlots" />
            </vs-select>
            <vs-select
                    placeholder="Duration"
                    class="w-100 mb-4"
                    label="Duration"
                    v-model="selectedEvent.duration"
            >
              <vs-select-item :key="index" :value="item.value" :text="item.text" v-for="(item,index) in durationOptions" />
            </vs-select>
            <vs-select
                    placeholder="Services"
                    class="w-100 mb-4"
                    label="Services"
                    autocomplete
                    multiple
                    v-model="selectedEvent.services"
            >
              <vs-select-item :key="index" :value="item.id" :text="item.name" v-for="(item,index) in servicesList" />
            </vs-select>


            <vs-alert
                    :active="!validName"
                    color="danger"
                    icon="new_releases"
                    class="mb-3"
            >Fields can not be empty please enter the data</vs-alert>

          </div>
        </vs-prompt>
      </vs-card>
    </vs-col>
  </vs-row>
</template>

<script>
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { bookingService, customerService, privateServiceService } from '../../../_services'
import 'vue-select/dist/vue-select.css';



export default {
  name: "Calendar",
  data: () => ({
    title: "Calendar",
    customer: "",
    activePrompt2: false,
    activeEditPrompt: false,
    start: "",
    services: "",
    start_time: "",
    duration: 0,
    end: "",
    desc: "",
    selectedEvent: {
      id: "",
      customer: "",
      date: "",
      services: "",
      time: "",
      duration: 0
    },
    events: [ // initial event data
      { title: 'Event Now', start: new Date() }
    ],
    customersList: [],
    servicesList: [],
    availableSlots: [],
    durationOptions: [{text: "00:15 minutes", value: 15}, {text: "00:30 minutes", value: 30}, {text: "00:45 minutes", value: 45},
      {text: "1:00 Hour", value: 60}, {text: "1:30 Hour", value: 90}, {text: "2:00 Hours", value: 120}],
    config: {
      defaultView: "month",
    },
    props: {
      date: {
        type: Number
      }
    },
    header: {
      left: 'myCustomButton prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    customButtons: {
      myCustomButton: {
        text: 'Add Booking',
        click: () => window.globalThis.addEvent()
      }
    },
    calendarConfig: {
      defaultView: 'month',
      themeSystem: 'bootstrap4'
    },
    calendarPlugins: [ dayGridPlugin, timeGridPlugin, interactionPlugin ]
  }),
  methods: {
    eventSelected(event) {
      let dataEvent = event.event.extendedProps.data;
      this.availableSlots = [];
      bookingService.availableSlots(this.$moment(dataEvent.start_datetime).format("YYYY-MM-DD")).then(function (data) {
        data.slots.forEach(obj => {
          this.availableSlots.push({
            value: obj.slot,
            status: obj.active
          })
        });
        this.selectedEvent.id = dataEvent.id;
        this.selectedEvent.customer = dataEvent.customer_id;
        this.selectedEvent.date = this.$moment(dataEvent.start_datetime).format("YYYY-MM-DD");
        this.selectedEvent.time = this.$moment(dataEvent.start_datetime).format("HH:mm");
        this.selectedEvent.duration = this.$moment(dataEvent.end_datetime).diff(this.$moment(dataEvent.start_datetime), 'minutes');
        this.selectedEvent.services = dataEvent.services_array.map(obj => { return obj.id; });
        this.activeEditPrompt = true;
      }.bind(this));

    },
    getAvailableSlots(){
      let date = this.start;
      this.availableSlots = [];
      bookingService.availableSlots(date).then(function (data) {
        data.slots.forEach(obj => {
          this.availableSlots.push({
            value: obj.slot,
            status: obj.active
          })
        })
      }.bind(this));
    },
    clearData() {
      this.title = this.end = this.desc = "";
    },
    addEvent() {
      this.clearData();
      this.activePrompt2 = true;
    },
    createEvent() {
      let booking = {
        customer_id: this.customer,
        start_datetime: this.$moment(this.start+' '+this.start_time).format("YYYY-MM-DD HH:mm:ss"),
        end_datetime: this.$moment(this.start+' '+this.start_time).add(this.duration, "minutes").format("YYYY-MM-DD HH:mm:ss"),
        services: this.services.join()
      }

      bookingService.create(booking).then(function (data) {

        const eventobject = {
          title: data.booking.customer_id,
          start: data.booking.start_datetime,
          end: data.booking.end_datetime
        };
        this.events.push(eventobject);
        this.$vs.notify({
          color: "success",
          title: "Event Added",
          text: "Event Added Successfully"
        });
      }.bind(this));

    },
    updateEvent() {
      let booking = {
        id: this.selectedEvent.id,
        customer_id: this.selectedEvent.customer,
        start_datetime: this.$moment(this.selectedEvent.date+' '+this.selectedEvent.time).format("YYYY-MM-DD HH:mm:ss"),
        end_datetime: this.$moment(this.selectedEvent.date+' '+this.selectedEvent.time).add(this.selectedEvent.duration, "minutes").format("YYYY-MM-DD HH:mm:ss"),
        services: this.selectedEvent.services.join()
      }

      bookingService.update(booking).then(function (data) {

        let booking = data.booking;

        this.events.forEach(function (obj, i) {
          if(obj.data.id == booking.id){
            let updatedEvent = {
              title: booking.fname+' '+booking.lname,
              allDay: false,
              start: this.$moment(booking.start_datetime)._i,
              end: this.$moment(booking.end_datetime)._i,
              color: this.$moment(booking.start_datetime).diff(this.$moment()) > 0 ? 'green' : 'red',
              textColor: '#fff',
              data: booking
            };
            this.events.splice(i,1);
            this.events.push(updatedEvent);
          }
        }.bind(this));

        this.$vs.notify({
          color: "success",
          title: "Event Added",
          text: "Event Added Successfully"
        });
      }.bind(this));

    },
    close() {
      this.$vs.notify({
        color: "danger",
        title: "Closed",
        text: "You close a dialog!"
      });
    },
    handleDateClick(arg){
      //console.log('date clicked: '+arg.dateStr)
      console.log(arg)
    }
  },
  computed: {
    validName() {
      return true;
    },
  },
  components: {
    FullCalendar
  },
  mounted() {
    window.globalThis = this;
    bookingService.getAll().then(function (data) {
      this.events = [];
      data.bookings.forEach(obj => {
        this.events.push({
          title: obj.fname+' '+obj.lname,
          allDay: false,
          start: this.$moment(obj.start_datetime)._i,
          end: this.$moment(obj.end_datetime)._i,
          color: this.$moment(obj.start_datetime).diff(this.$moment()) > 0 ? 'green' : 'red',
          textColor: '#fff',
          data: obj
        })
      });

    }.bind(this));

    customerService.getAll().then(function (data) {
      this.customersList = [];
      data.customers.data.forEach(obj => {
        this.customersList.push({id: obj.id, name: obj.fname+' '+obj.lname});
      });
    }.bind(this));

    privateServiceService.getAll().then(function (data) {
      this.servicesList = [];
      data.services.data.forEach(obj => {
        this.servicesList.push({id: obj.id, name: obj.title});
      });
    }.bind(this));
  }
};
</script>
<style >
.comp-full-calendar {
  max-width: 100%;
}
.full-calendar-header .header-center .title {
  font-size: 18px;
  font-weight: 600;
}
.full-calendar-header .header-center .prev-month,
.full-calendar-header .header-center .next-month {
  padding: 9px 14px;
  border-radius: 100%;
  border: 1px solid #dadada;
}
.full-calendar-body
  .dates
  .dates-events
  .events-week
  .events-day
  .event-box
  .event-item {
  background-color: rgba(var(--vs-primary), 1);
  color: #fff;
}
.fc-button-primary {
  color: #fff;
  background-color: rgb(41, 98, 255);
  border-color: rgb(41, 98, 255);
}
.fc-button-primary:hover {
  color: #fff;
  background-color: #057eff;
  border-color: #057eff;
}
.fc-button-primary:not(:disabled):active, .fc-button-primary:not(:disabled).fc-button-active {
  color: #fff;
  background-color: #057eff;
  border-color: #057eff;
}
.fc-button-primary:disabled {
  color: #fff;
  background-color: #249aff;
  border-color: #249aff;
}
</style>