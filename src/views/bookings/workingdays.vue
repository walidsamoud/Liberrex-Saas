<template>
  <vs-row vs-justify="center" id="business-box">
    <vs-col type="flex" vs-lg="12" vs-xs="12">
      <vs-card id="form">
        <vs-tabs :value="activeTab">

          <vs-tab :label="$t('Company.Tabs.MemberBookingDays')+' ('+account_info.fname+' '+account_info.lname+')'" icon="calendar_today" id="working-days-tab">
            <MemberWorkingDay :key="index" v-for="(day, index) in bookingDays" :index="index" :day="day" :bookingDays="memberBookingDays"></MemberWorkingDay>
            <div class="btn-alignment mt-4">
              <vs-button color="primary" @click="updateMemberBookingDays">{{$t('Company.UpdateButton')}}</vs-button>
            </div>
          </vs-tab>

          <vs-tab :label="$t('Company.Tabs.BookingDays')" icon="calendar_today" id="working-days-tab">
            <WorkingDay :key="index" v-for="(day, index) in workingDays" :index="index" :day="day" :bookingDays="bookingDays"></WorkingDay>
            <div class="btn-alignment mt-4">
              <vs-button color="primary" @click="updateBookingDays">{{$t('Company.UpdateButton')}}</vs-button>
            </div>
          </vs-tab>
        
        </vs-tabs>
      </vs-card>
    </vs-col>
  </vs-row>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { helpersService, businessService, bookingService } from '../../_services'
import {gmapApi} from 'vue2-google-maps'
import router from "../../_helpers/router";
import WorkingDay from '../../components/booking/BookingDays.vue'
import MemberWorkingDay from '../../components/booking/MemberBookingDays.vue'
import moment from 'moment'

export default {
  name: "Business",
  data: () => ({
    title: "Business",
    activeTab: 0,
    business: {},
    photo: '',
    currentLocation: {lat: 0, lng: 0},
    markers: [],
    errors: {
      name: false,
      address: false,
      postal_code: false,
      city: false,
      phone: false,
      nb_booking_slot_min: false,
      industry: false
    },
    countries: [],
    cities: [],
    industries: [],
    steps: [
      {
        target: '.vs-card--content',  // We're using document.querySelector() under the hood
        params: {
          placement: 'auto' // Any valid Popper.js placement. See https://popper.js.org/popper-documentation.html#Popper.placements
        }
      },
      {
        target: '#information-tab',  // We're using document.querySelector() under the hood
        params: {
          placement: 'top-start' // Any valid Popper.js placement. See https://popper.js.org/popper-documentation.html#Popper.placements
        }
      },
      {
        target: '#working-days-tab',  // We're using document.querySelector() under the hood
        params: {
          placement: 'top-start' // Any valid Popper.js placement. See https://popper.js.org/popper-documentation.html#Popper.placements
        }
      },
      {
        target: '#location-tab',  // We're using document.querySelector() under the hood
        params: {
          placement: 'top-start' // Any valid Popper.js placement. See https://popper.js.org/popper-documentation.html#Popper.placements
        }
      },
    ],
    languages: [],
    business_translations: {ar: '', fr: '', en: '', de: '', es: '', ru: '', pt: ''},
    bookingDays: [],
    memberBookingDays: []
  }),
  methods: {
    ...mapActions('account', ['updateUserObject']),
    notify(title, text, type) {
      this.$vs.notify({
        color: type,
        title: title,
        text: text
      });
    },
    validateFields() {
      this.errors.name = this.business.name ? false : true,
      this.errors.address = this.business.address ? false : true,
      this.errors.postal_code = this.business.postal_code ? false : true,
      this.errors.city = this.business.city ? false : true,
      this.errors.phone = this.business.phone ? false : true,
      this.errors.nb_booking_slot_min = this.business.nb_booking_slot_min ? false : true,
      this.errors.industry = this.business.industry ? false : true

      let {name, email, address, postal_code, city, phone, nb_booking_slot_min, industry} = this.errors;
      return !(name || email || address || postal_code || city || phone || nb_booking_slot_min || industry);
    },
    showLoading(){
      this.$vs.loading({
        container: '#business-box',
        scale: 0.6
      });
    },
    hideLoading(){
      this.$vs.loading.close('#business-box > .con-vs-loading')
    },
    updateCities(){
      this.business.city = '';
      this.cities = this.countries[this.business.country];
    },
    updateMemberBookingDays(){
      this.showLoading();
      let days2 = [];
      let i=0;
      this.memberBookingDays.forEach(obj => {
        i++
        if(i<=7){
          days2.push({
            day: obj.day,
            start_time: obj.start_time,
            end_time: obj.end_time,
            active: obj.active
          })
        }
      });
      console.log(days2)
      bookingService.updateMemberBookingDays({working_days: JSON.stringify(days2)})
              .then(function (data) {
                this.notify(this.$t('Toasts.Successful'), this.$t('Company.EditWorkingDays.ToastSuccess'), 'success');
                let userOld = JSON.parse(localStorage.getItem('user'));
                userOld.user.booking_days = data.booking_days;

                localStorage.setItem('user', JSON.stringify(userOld));
                this.updateUserObject();
              }.bind(this))
              .catch(function () {
                this.notify(this.$t('Toasts.Error'), this.$t('Company.EditWorkingDays.ToastFail'), 'danger');
              }.bind(this))
              .finally(function () {
                this.hideLoading()
              }.bind(this));
    },
    updateBookingDays(){
      this.showLoading();
      let days = [];
      this.bookingDays.forEach(obj => {
        days.push({
          day: obj.day,
          start_time: obj.start_time,
          end_time: obj.end_time,
          active: obj.active
        })
      });
      bookingService.updateBookingDays({working_days: JSON.stringify(days)})
              .then(function (data) {
                this.notify(this.$t('Toasts.Successful'), this.$t('Company.EditWorkingDays.ToastSuccess'), 'success');
                let userOld = JSON.parse(localStorage.getItem('user'));
                userOld.business.booking_days = data.booking_days;

                localStorage.setItem('user', JSON.stringify(userOld));
                this.updateUserObject();
              }.bind(this))
              .catch(function () {
                this.notify(this.$t('Toasts.Error'), this.$t('Company.EditWorkingDays.ToastFail'), 'danger');
              }.bind(this))
              .finally(function () {
                this.hideLoading()
              }.bind(this));
    },
    updateLocation(){
      this.showLoading();
      let marker = this.markers[0].position;
      businessService.updateLocation(marker)
              .then(function (data) {
                this.notify(this.$t('Toasts.Successful'), this.$t('Company.EditLocation.ToastSuccess'), 'success');
                let userOld = JSON.parse(localStorage.getItem('user'));
                userOld.business = data.business;
                this.business = data.business;
                localStorage.setItem('user', JSON.stringify(userOld));
                this.updateUserObject();
              }.bind(this))
              .catch(function () {
                this.notify(this.$t('Toasts.Error'), this.$t('Company.EditLocation.ToastFail'), 'danger');
              }.bind(this))
              .finally(function () {
                this.hideLoading();
              }.bind(this));
    },
    updateTranslations(){
      this.showLoading();
      businessService.updateTranslations({translations: this.business_translations})
              .then(function () {
                this.notify(this.$t('Toasts.Successful'), this.$t('Company.EditTranslations.ToastSuccess'), 'success');
                this.updateUserObject();
              }.bind(this))
              .catch(function () {
                this.notify(this.$t('Toasts.Error'), this.$t('Company.EditTranslations.ToastFail'), 'danger');
              }.bind(this))
              .finally(function () {
                this.hideLoading();
              }.bind(this));
    },
    updateInformation(){
      let res = this.validateFields();
      if (!res) {
        return false;
      }
      this.showLoading();

      let business = new FormData();
      business.append('name',this.business.name);
      business.append('industry_id',this.business.industry.toString());
      business.append('address', this.business.address);
      business.append('postal_code', this.business.postal_code);
      business.append('country', this.business.country);
      business.append('city', this.business.city);
      business.append('phone', this.business.phone);
      business.append('nb_booking_slot_min', this.business.nb_booking_slot_min);
      
      if(document.getElementById("fileInput").files[0]){
        business.append('photo', document.getElementById("fileInput").files[0]);
      }
      businessService.update(business)
              .then(function (data) {
                this.notify(this.$t('Toasts.Successful'), this.$t('Company.EditBasic.ToastSuccess'), 'success');
                let userOld = JSON.parse(localStorage.getItem('user'));
                userOld.business = data.business;
                localStorage.setItem('user', JSON.stringify(userOld));
                this.updateUserObject();
              }.bind(this))
              .catch(function () {
                this.notify(this.$t('Toasts.Error'), this.$t('Company.EditBasic.ToastFail'), 'danger');
              }.bind(this))
              .finally(function () {
                this.hideLoading();
              }.bind(this));
    },
    updateCoordinates(location) {
      this.markers[0].position = {
        lat: location.latLng.lat(),
        lng: location.latLng.lng(),
      };
    },
    goToNextTab(currentStep){
      this.$tours['SettingsBusiness'].nextStep();
      if(currentStep == 1){
        this.activeTab = 1;
      }
      else if(currentStep == 2){
        this.activeTab = 2;
      }

    },
    goToNextPage(){
      router.push({ path: "/settings/team?istour=on" });
    }
  },
  computed: {
    ...mapState({
      account_info: state => state.account.user.user,
      business_info: state => state.account.user.business,
      workingDays: state => state.account.user.working_days,
    }),
    google: gmapApi
  },
  beforeMount(){
    this.languages = this.$i18n.availableLocales;


    this.business = {...this.business_info};
    let location = {lat: parseFloat(this.business_info.lat), lng: parseFloat(this.business_info.lng)};
    this.markers.push({position: location});
    this.currentLocation = location;


    helpersService.getIndustries().then(function (data) {
      this.industries = [];
      data.industries.forEach(obj => {
        this.industries.push({
          value: obj.id,
          text: obj.name
        });
        if(obj.id == this.business.industry_id){
          this.business.industry = obj.id;
        }
      })
    }.bind(this));

    helpersService.getCountries().then(function (data) {
      this.countries = data.countries;
      this.cities = this.countries[this.business.country];
    }.bind(this));

    businessService.getTranslations().then(function (data) {
      if(data.translations.translations != null){
        this.business_translations = data.translations.translations;
      }
    }.bind(this));

    this.$t('Company.Content').map((content,index)=> (
            this.steps[index].content = content
    ));
    this.$route.query.istour && localStorage.getItem('skipTour') !='true' ? this.$tours['SettingsBusiness'].start() : '';
  },
  mounted(){
      this.bookingDays= JSON.parse(localStorage.getItem('user')).business.booking_days.map(obj => {
        obj['start_time']= obj['start_time'].substring(0, obj['start_time'].length-3) 
        obj['end_time']= obj['end_time'].substring(0, obj['end_time'].length-3) 
        return obj
      });

      this.memberBookingDays= JSON.parse(localStorage.getItem('user')).user.booking_days.map(obj => {
        obj['start_time']= obj['start_time'].substring(0, obj['start_time'].length-3) 
        obj['end_time']= obj['end_time'].substring(0, obj['end_time'].length-3) 
        return obj
      });
  },
  components: {
    WorkingDay,
    MemberWorkingDay
  }
};
</script>
