<template>
  <vs-row vs-justify="center" id="business-box">
    <vs-col type="flex" vs-lg="12" vs-xs="12">
      <vs-card id="form">
        <vs-tabs :value="activeTab">
          <vs-tab :label="$t('Company.Tabs.BasicInformation')" icon="info" id="information-tab">
            <vs-row class="mt-4">
              <vs-col vs-lg="4" vs-xs="12" vs-sm="6" align="center">
                <img :src="business.photo" width="250" class="" alt="user" />
                <vs-input type="file" class="w-75 mt-4" id="fileInput" :label="$t('Company.Logo')" v-model="photo"/>
              </vs-col>
              <vs-col vs-lg="8" vs-xs="12" vs-sm="6">
                <vs-row>
                  <vs-col vs-w="6">
                    <vs-input
                            :danger="errors.name"
                            :danger-text="$t('Errors.InvalidPolite', {field: $t('Company.Name')})"
                            :label="$t('Company.Name')"
                            placeholder="12n"
                            v-model="business.name"
                            class="w-100 mb-2"
                    />
                  </vs-col>
                  <vs-col vs-w="6">
                    <vs-input
                            :label="$t('Company.Email')"
                            placeholder="12n"
                            v-model="business.email"
                            class="w-100 mb-2"
                            disabled="true"
                    />
                  </vs-col>
                </vs-row>

                <vs-row>
                  <vs-col vs-w="8">
                    <vs-input
                            :danger="errors.address"
                            :danger-text="$t('Errors.InvalidPolite', {field: $t('Company.Address')})"
                            :label="$t('Company.Address')"
                            placeholder="1, Building name, Street Name"
                            v-model="business.address"
                            class="w-100 mb-2 mt-2"
                    />
                  </vs-col>
                  <vs-col vs-w="4">
                    <vs-input
                            :danger="errors.postal_code"
                            :danger-text="$t('Errors.InvalidPolite', {field: $t('Company.PostalCode')})"
                            :label="$t('Company.PostalCode')"
                            placeholder="12345"
                            v-model="business.postal_code"
                            class="w-100 mb-2 mt-2"
                    />
                  </vs-col>
                </vs-row>


                <vs-row>
                  <vs-col vs-w="6">
                    <vs-select
                            :danger="errors.country"
                            :danger-text="$t('Errors.Required', {field: $t('Company.Country')})"
                            class="w-100 mb-2 mt-2"
                            size="large"
                            :placeholder="$t('Company.Country')"
                            :label="$t('Company.Country')"
                            v-model="business.country"
                            @change="updateCities"
                    >
                      <vs-select-item :key="index" :value="index" :text="index" v-for="(item,index) in countries"/>
                    </vs-select>
                  </vs-col>
                  <vs-col vs-w="6">
                    <vs-select
                            :danger="errors.city"
                            :danger-text="$t('Errors.Required', {field: $t('Company.City')})"
                            class="w-100 mb-2 mt-2"
                            size="large"
                            :placeholder="$t('Company.City')"
                            :label="$t('Company.City')"
                            v-model="business.city"
                    >
                      <vs-select-item :key="index" :value="item" :text="item" v-for="(item,index) in cities" />
                    </vs-select>
                  </vs-col>
                </vs-row>


                <vs-row>
                  <vs-col vs-w="6">
                    <vs-input
                            :danger="errors.phone"
                            :danger-text="$t('Errors.InvalidPolite', {field: $t('Company.PhoneNumber')})"
                            :label="$t('Company.PhoneNumber')"
                            :placeholder="$t('Company.PhoneNumber')"
                            v-model="business.phone"
                            class="w-100 mt-2"
                    />
                  </vs-col>
                  
                </vs-row>
                <hr>
                <vs-row>
                  <vs-col vs-w="6">
                    <vs-input
                            :danger="errors.nb_booking_slot_min"
                            :danger-text="$t('Errors.InvalidPolite', {field: $t('Company.SlotMin')})"
                            :label="$t('Company.SlotMin')"
                            :placeholder="$t('Company.SlotMin')"
                            v-model="business.nb_booking_slot_min"
                            class="w-100 mt-2"
                    />
                  </vs-col>
                </vs-row>
                <vs-row class="mt-4">
                  <vs-col vs-w="12">
                    <vs-checkbox
                      class="justify-content-start w-100 mb-4"
                      v-model="allow_max_booking_days_before"
                    >{{$t('Company.AllowBookingjBefore')}}
                    </vs-checkbox>
                  </vs-col>

                  <vs-col vs-w="6">
                    <vs-input
                            v-if="allow_max_booking_days_before"
                            :danger="errors.max_booking_days_before"
                            :danger-text="$t('Errors.InvalidPolite', {field: $t('Company.BookingJBeforeError')})"
                            :label="$t('Company.BookingJBeforeLabel')"
                            :placeholder="$t('Company.BookingJBefore')"
                            v-model="business.max_booking_days_before"
                            class="w-100 mt-2"
                            min="-1"
                    />
                  </vs-col>
                </vs-row>

                <!--
                <vs-divider></vs-divider>
                <vs-row>
                  <vs-col vs-w="6">
                    <vs-select
                            :danger="errors.industry"
                            :danger-text="$t('Errors.Required', {field: $t('Company.Industry')})"
                            class="w-100 mb-2 mt-2"
                            size="large"
                            :placeholder="$t('Company.Industry')"
                            :label="$t('Company.Industry')"
                            v-model="business.industry"
                    >
                      <vs-select-item :key="index" :value="item.value" :text="item.text" v-for="(item,index) in industries" />
                    </vs-select>
                  </vs-col>
                </vs-row>

              -->
              </vs-col>
            </vs-row>

            <div class="btn-alignment float-right mt-4">
              <vs-button color="primary" @click="updateInformation">{{$t('Company.UpdateButton')}}</vs-button>
            </div>
          </vs-tab>
          <vs-tab :label="$t('Company.Tabs.WorkingDays')" icon="calendar_today" id="working-days-tab">
            <WorkingDay :key="index" v-for="(day, index) in workingDays" :day="day"></WorkingDay>
            <div class="btn-alignment mt-4">
              <vs-button color="primary" @click="updateWorkingDays">{{$t('Company.UpdateButton')}}</vs-button>
            </div>
          </vs-tab>
          <vs-tab :label="$t('Company.Tabs.Location')" icon="map" id="location-tab">
            <GmapMap
                    :center="currentLocation"
                    :zoom="16"
                    map-type-id="terrain"
                    style="width: 100%; height: 400px"
                    :options="{
                       zoomControl: true,
                       mapTypeControl: false,
                       streetViewControl: false,
                       rotateControl: false,
                       fullscreenControl: true,
                       disableDefaultUi: false
                     }"
            >
              <GmapMarker
                      :key="index"
                      v-for="(m, index) in markers"
                      :position="m.position"
                      :clickable="true"
                      :draggable="true"
                      @click="center=m.position"
                      @dragend="updateCoordinates"
              />
            </GmapMap>
            <div class="btn-alignment mt-4">
              <vs-button color="primary" @click="updateLocation">{{$t('Company.UpdateButton')}}</vs-button>
            </div>
          </vs-tab>
          <vs-tab :label="$t('Company.Tabs.Translation')" icon="translate" id="translation-tab">

            <h4>Business Name:</h4>

            <vs-row>
              <vs-col vs-w="6" v-for="(item, index) in languages" :key="index">
                  <vs-input :placeholder="item" :label="item" v-model="business_translations[item]" class="w-100 mt-2 mb-2"></vs-input>
              </vs-col>
            </vs-row>

            <div class="btn-alignment mt-4">
              <vs-button color="primary" @click="updateTranslations">{{$t('Company.UpdateButton')}}</vs-button>
            </div>
          </vs-tab>
        </vs-tabs>
      </vs-card>
    </vs-col>

    <!--V-Tour start-->
    <v-tour name="SettingsBusiness" :steps="steps">
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
            <template v-if="tour.currentStep !== 3">
              <div slot="actions" class="v-step__buttons">
                <button @click="goToNextTab(tour.currentStep)" class="v-step__button">Next</button>
              </div>
            </template>
            <template v-if="tour.currentStep === 3">
              <div slot="actions" class="v-step__buttons">
                <button @click="goToNextPage" class="v-step__button">Next</button>
              </div>
            </template>
          </v-step>
        </transition>
      </template>
    </v-tour>
  </vs-row>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { helpersService, businessService } from '../../_services'
import {gmapApi} from 'vue2-google-maps'
import WorkingDay from '../../components/settings/WorkingDay'
import router from "../../_helpers/router";
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
      industry: false,
      max_booking_days_before: false
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
    max_booking_days_before: '',
    allow_max_booking_days_before: false
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
    updateWorkingDays(){
      this.showLoading();
      let days = [];
      this.workingDays.forEach(obj => {
        days.push({
          day: obj.day,
          start_time: obj.start_time,
          end_time: obj.end_time,
          active: obj.active
        })
      });
      businessService.updateWorkingDays({working_days: JSON.stringify(days)})
              .then(function (data) {
                this.notify(this.$t('Toasts.Successful'), this.$t('Company.EditWorkingDays.ToastSuccess'), 'success');
                let userOld = JSON.parse(localStorage.getItem('user'));
                userOld.working_days = data.working_days;
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
      business.append('allow_max_booking_days_before', this.allow_max_booking_days_before);
      business.append('max_booking_days_before', this.business.max_booking_days_before);
      
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

    if(this.business.max_booking_days_before>=0){
      this.allow_max_booking_days_before= true;
    }
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


  },
  components: {
    WorkingDay
  }
};
</script>
