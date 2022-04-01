<template>

  <vs-row vs-justify="center" vs-align="center" :class="'full-height '+authClass ">
    <vs-col vs-lg="8" vs-sm="6" vs-xs="0"></vs-col>
    <vs-col type="flex"  vs-justify="center" vs-align="center" class="full-height p-0" vs-lg="4" vs-sm="6" vs-xs="12">
    <vs-card class="mb-0 full-height register-box" id="register-box" fixedHeight>
      <div slot="header">
        <h3 class="mb-1">{{$t('Auth.Register')}}
          <div class="float-right">
            <CountrySelector :selectable="true"></CountrySelector>
          </div>
          <div class="float-right">
            <LanguageSelector></LanguageSelector>
          </div>
        </h3>
      </div>

      <div>
      <div class="text-center m-2 mb-3">
        <img :src="require('@/assets/logo-horizontal.png')" width="155">
      </div>

        <form-wizard
                id="wizard-signup"
                @on-complete="onComplete"
                color="rgba(var(--vs-primary), 1)"
                :title="null"
                :subtitle="null"
                :back-button-text="$t('Navigation.Previous')"
                :next-button-text="$t('Navigation.Next')"
                :finish-button-text="$t('Auth.RegisterSubmit')"
                shape="square"
                stepSize="xs"
                error-color="#f62c51"
        >
          <tab-content icon="ti-user" :before-change="validatePersonalTab">
            <vs-row>

                <vs-input icon-after="true" size="medium" class="w-100 mb-2 mt-2 vs-input-medium"
                          :danger="errors.firstname" :danger-text="$t('Errors.InvalidPolite', {field: $t('Profile.FirstName')})"
                          icon="person" :placeholder="$t('Profile.FirstName')" v-model="firstname" type="text"/>
                <vs-input icon-after="true" size="medium" class="w-100 mb-2 mt-2 vs-input-medium"
                          :danger="errors.lastname" :danger-text="$t('Errors.InvalidPolite', {field: $t('Profile.LastName')})"
                          icon="person" :placeholder="$t('Profile.LastName')" v-model="lastname" type="text"/>
                <vs-input icon-after="true" size="medium" class="w-100 mb-2 mt-2 vs-input-medium"
                          :danger="errors.email" :danger-text="$t('Errors.InvalidEmailOrUsed')"
                          icon="mail" :placeholder="$t('Auth.Email')" v-model="email" type="email"/>
                <vs-input icon-after="true" size="medium" class="w-100 mb-2 mt-2 vs-input-medium"
                          :danger="errors.pwd" :danger-text="$t('Errors.InvalidPassword')"
                          type="password" icon="lock" :placeholder="$t('Auth.Password')" v-model="pwd"/>

            </vs-row>
          </tab-content>
          <tab-content icon="ti-briefcase" :before-change="validateBusinessTab">
            <vs-row>


              <vs-input icon-after="true" size="medium" class="w-100 mb-2 mt-2 vs-input-medium"
                        :danger="errors.companyName" :danger-text="$t('Errors.InvalidPolite', {field: $t('Company.Name')})"
                        icon="home" :placeholder="$t('Company.Name')" v-model="companyName" type="text"/>
              <vs-select
                      class="w-100 mb-2 mt-2"
                      size="large"
                      :placeholder="$t('Company.Industry')"
                      v-model="industry"
                      :danger="errors.industry"  :danger-text="$t('Errors.InvalidSelectPolite', {field: $t('Company.Industry')})"
              >
                <vs-select-item :key="index" :value="item.value" :text="item.text" v-for="(item,index) in industries" />
              </vs-select>

              <vs-select
                      class="w-100 mb-2 mt-2"
                      size="large"
                      :placeholder="$t('Company.Country')"
                      v-model="country"
                      @change="updateCities"
                      :danger="errors.country"  :danger-text="$t('Errors.InvalidSelectPolite', {field: $t('Company.Country')})"
              >
                <vs-select-item :key="index" :value="index" :text="index" v-for="(item,index) in countries"/>
              </vs-select>

              <vs-select
                      class="w-100 mb-2 mt-2"
                      size="large"
                      :placeholder="$t('Company.City')"
                      v-model="city"
                      :danger="errors.city"  :danger-text="$t('Errors.InvalidSelectPolite', {field: $t('Company.City')})"
              >
                <vs-select-item :key="index" :value="item" :text="item" v-for="(item,index) in cities" />
              </vs-select>

              <vs-input type="file" size="medium" class="w-100 mb-2 mt-2 vs-input-medium" id="fileInput"
                        :danger="errors.logo"  :danger-text="$t('Errors.InvalidFilePolite', {field: $t('Company.Logo')})"
                        :label="$t('Company.Logo')" v-model="logo"/>

            </vs-row>
          </tab-content>
          <tab-content icon="ti-location-pin"  :before-change="validateLocationTab">
            <vs-row>


              <vs-input icon-after="true" size="medium" class="w-100 mb-2 mt-2 vs-input-medium"
                        :danger="errors.address" :danger-text="$t('Errors.InvalidPolite', {field: $t('Company.Address')})"
                        icon="home" :placeholder="$t('Company.Address')" v-model="address" type="text"/>
              <vs-input icon-after="true" size="medium" class="w-100 mb-2 mt-2 vs-input-medium"
                        :danger="errors.postalCode" :danger-text="$t('Errors.InvalidPolite', {field: $t('Company.PostalCode')})"
                        icon="home" :placeholder="$t('Company.PostalCode')" v-model="postalCode" type="text"/>


              <GmapMap
                      :center="currentLocation"
                      :zoom="16"
                      map-type-id="terrain"
                      style="width: 500px; height: 250px"
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
                        :position="marker"
                        :clickable="true"
                        :draggable="true"
                        @dragend="updateCoordinates"
                />
              </GmapMap>

            </vs-row>
          </tab-content>
          <tab-content icon="ti-rocket">
            <vs-row>

              <p>{{$t('Auth.RegisterTermsIntro')}}
                <router-link  target="_blank" to="/terms"> {{$t('Terms')}}</router-link> {{$t('Auth.RegisterTermsIntroAnd')}}
                <router-link  target="_blank" to="/privacy"> {{$t('Privacy')}}</router-link>.</p>


              <vs-checkbox v-model="terms" class="mb-4 mt-4">
                {{$t('Auth.AcceptTerms')}}
              </vs-checkbox>
              <vs-alert v-if="errors.terms" class="mb-3 mt-2"  color="danger">
                <b>{{$t('Errors.RegisterTermsFail')}}</b>
              </vs-alert>

            </vs-row>
          </tab-content>
        </form-wizard>

        <div class="d-flex justify-content-center mt-3">
          {{$t('Auth.DoHaveAnAccount')}}  &nbsp;<router-link to="/login"> {{$t('Auth.Login')}} </router-link>
        </div>
      </div>
      <div slot="footer" class="text-center w-100">
        <AuthCopyright></AuthCopyright>
      </div>
    </vs-card>
    </vs-col>
  </vs-row>

  
</template>

<script>
import { FormWizard, TabContent } from "vue-form-wizard";
import "vue-form-wizard/dist/vue-form-wizard.min.css";
import { helpersService, userService } from '../../_services'
import {gmapApi} from 'vue2-google-maps'
import { mapActions } from 'vuex'
import LanguageSelector from '../../components/language/LanguageSelector'
import CountrySelector from '../../components/country/CountrySelector'
import AuthCopyright from '../../components/copyright/AuthCopyright'
import {authBranding} from '../../_helpers/auth-branding'

export default {
  name: 'login-register-box',
  data:()=>({
    msg: "Signup",
    rememberme:false,
    firstname:'',
    lastname:'',
    email:'',
    pwd:'',
    companyName:'',
    address:'',
    postalCode:'',
    industry:'',
    country:'',
    city:'',
    logo:'',
    terms: false,
    errors: {
      firstname: false,
      lastname: false,
      email: false,
      pwd: false,
      companyName: false,
      industry: false,
      country: false,
      city: false,
      logo: false,
      address: false,
      postalCode: false,
      terms: false
    },
    industries: [],
    countries: [],
    cities: [],
    marker: {lat: 0.0, lng: 0.0},
    currentLocation : { lat : 0, lng : 0},
  }),
  methods:{
    ...mapActions('account', ['register']),
    checkForm:function(e) {
      this.errors = [];
      if(!this.email) {
        this.errors.push("Email required.");
      } else if(!this.validEmail(this.email)) {
        this.errors.push("Valid email required.");        
      }
      if(!this.firstname) this.errors.push("Firstname required.");
      if(!this.lastname) this.errors.push("Lastname required.");
      if(!this.pwd) this.errors.push("Password required.");
      if(!this.errors.length) return true;
      e.preventDefault();
    },
    /* eslint-disable */
    validEmail:function(email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
    },
    /* eslint-enable */

    geolocation : function() {
      navigator.geolocation.getCurrentPosition((position) => {
        this.currentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        this.marker = this.currentLocation;
      });
    },

    updateCoordinates(location) {
      this.marker = { lat: location.latLng.lat(), lng: location.latLng.lng() };
    },

    onComplete(){
      this.errors.terms = (this.terms == false) ? true : false;
      if(this.errors.terms) return; // abort mission

      this.$vs.loading({
        container: '#register-box',
        scale: 0.6
      });

      try{

        let user = new FormData()
        user.append('fname',this.firstname);
        user.append('lname',this.lastname);
        user.append('email',this.email);
        user.append('password',this.pwd);
        user.append('name',this.companyName);
        user.append('industry_id',this.industry.toString());
        user.append('business_photo', document.getElementById("fileInput").files[0]);
        user.append('address', this.address);
        user.append('postal_code', this.postalCode);
        user.append('user_photo', document.getElementById("fileInput").files[0]);
        user.append('country', this.country);
        user.append('city', this.city);
        user.append('lat', this.marker.lat);
        user.append('lng', this.marker.lng);
        user.append('phone', 0);
        user.append('position', 0);
        user.append('_method', 'PUT');

        this.register(user).catch(function () {
        }.bind(this)).finally(function () {
          this.$vs.loading.close('#register-box > .con-vs-loading')
        }.bind(this));
      } catch (e) {
        this.$vs.loading.close('#register-box > .con-vs-loading')
      }



    },

    async validatePersonalTab() {
      let valid = false;
      let availableEmail = await this.availableEmail(this.email);
      this.errors.firstname = (this.firstname.length < 3) ? true : false;
      this.errors.lastname = (this.lastname.length < 3) ? true : false;
      this.errors.pwd = (this.pwd.length < 6) ? true : false;
      this.errors.email = (!this.validEmail(this.email) || !availableEmail) ? true : false;
      valid = !(this.errors.firstname || this.errors.lastname || this.errors.pwd || this.errors.email);
      return valid;
    },

    async availableEmail(email){
      let available = false;
      await userService.checkEmail(email).then(function (data) {
        available = !data.exists;
      }).catch(function() {
        available = false;
      });
      return available;
    },

    validateBusinessTab() {
      let valid = false;
      this.errors.companyName = (this.companyName.length < 5) ? true : false;
      this.errors.industry = (this.industry == '') ? true : false;
      this.errors.country = (this.country == '') ? true : false;
      this.errors.city = (this.city == '') ? true : false;
      this.errors.logo = (this.logo == '') ? true : false;
      valid = !(this.errors.companyName || this.errors.industry || this.errors.country || this.errors.city || this.errors.logo);
      return valid;
    },

    validateLocationTab() {
      let valid = false;
      this.errors.address = (this.address.length < 5) ? true : false;
      this.errors.postalCode = (this.postalCode == '') ? true : false;
      valid = !(this.errors.address || this.errors.postalCode);
      return valid;
    },


    updateCities(){
      this.city = '';
      this.cities = this.countries[this.country];
    }
  },  
  computed: {
    inputValid(){
      if(this.validEmail(this.email) && this.pwd && this.firstname && this.lastname){
        return false
      } else {
        return true
      }
    },
    google: gmapApi,
    authClass(){
        return authBranding();
    }
  },
  components: {
    FormWizard,
    TabContent,
    LanguageSelector,
    CountrySelector,
    AuthCopyright
  },
  mounted() {
    this.geolocation();
    helpersService.getIndustries().then(function (data) {
      this.industries = [];
      data.industries.forEach(obj => {
        this.industries.push({
          value: obj.id,
          text: obj.name
        })
      })
    }.bind(this));

    helpersService.getCountries().then(function (data) {
      this.countries = data.countries;
    }.bind(this));
  }
}
</script>
<style>
.login-register-bg{
  margin:0 auto;
  background:url(../../assets/images/background/auth-bg.jpg) no-repeat center center;
}
.register-box{
  border-radius:0px;
}
.vue-form-wizard .wizard-header {
  display: none !important;
}
.vs-card--footer{
  width: 100% !important;
}
</style>

