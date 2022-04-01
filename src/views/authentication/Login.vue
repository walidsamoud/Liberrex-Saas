<template>
  <vs-row vs-justify="center" vs-align="center" :class="'full-height '+authClass ">
    <vs-col vs-lg="8" vs-sm="6"  vs-xs="0"></vs-col>
    <vs-col type="flex"  vs-justify="center" vs-align="center" class="p-0 full-height"  vs-sm="6" vs-lg="4" vs-xs="12">
    <vs-card class="mb-0 full-height login-box" id="login-box" fixedHeight>
      <div slot="header">
        <h3 class="mb-1">{{$t('Auth.Login')}}
            <div class="float-right">
                <CountrySelector :selectable="true"></CountrySelector>
            </div>
            <div class="float-right">
                <LanguageSelector></LanguageSelector>
            </div>
        </h3>
      </div>
      <div class="p-4">
          <div class="text-center m-2 mb-5">
              <img :src="require('@/assets/logo-horizontal.png')" width="155">
          </div>
          <vs-alert v-if="errors.length" class="mb-3 mt-2"  color="danger" :active="inputValid">
            <b>{{$t('Auth.ErrorTitle')}}:</b>
            <ul class="common-list">
              <li v-for="error in errors" :key="error">{{ error }}</li>
            </ul>
          </vs-alert>
          <vs-alert v-if="alertVerifyByAdmin" class="mb-3 mt-2"  color="success" >
            <b>{{$t('Auth.RegisterSuccess')[0]}}:</b>
            <ul class="common-list">
              <li >{{$t('Auth.RegisterSuccess')[1]}}</li>
            </ul>
          </vs-alert>
          <form @submit="checkForm" @keyup.enter="checkForm" novalidate="true">

          <vs-input icon-after="true" size="large" class="w-100 mb-4 mt-2 vs-input-large" icon="email" :placeholder="$t('Auth.Email')" v-model="email" type="email"/>
          <vs-input icon-after="true" size="large" class="w-100 vs-input-large" type="password" icon="lock" :placeholder="$t('Auth.Password')" v-model="password"/>
          <div class="d-flex pt-3 pb-3">
              <vs-checkbox v-model="rememberme">{{$t('Auth.Remember')}}</vs-checkbox>
              <router-link to="/password/forgot" class="ml-auto">{{$t('Auth.ForgotPassword')}} </router-link>
          </div>
              <vs-button class="btn-block btn btn-primary submit-button" type="submit" @click.stop.prevent="checkForm">
                  {{$t('Auth.LoginButton')}}
              </vs-button>
        </form>

         <div class="d-flex justify-content-center mt-3">
             {{$t('Auth.DontHaveAnAccount')}}  &nbsp; <router-link to="/register"> {{$t('Auth.CreateAnAccount')}}</router-link>
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
import { mapState, mapActions } from 'vuex'
import LanguageSelector from '../../components/language/LanguageSelector'
import CountrySelector from '../../components/country/CountrySelector'
import AuthCopyright from '../../components/copyright/AuthCopyright'
import {authBranding} from '../../_helpers/auth-branding'
export default {
  name: 'Login',
  data:()=>({
    alertVerifyByAdmin : false,
    msg: "Login",
    rememberme:false,
    email:'',
    password:'',
    requestFailed: false,
    errors:[],
  }),
  methods:{
    checkForm:function(e) {
      this.errors = [];
      if(!this.email) {
        this.errors.push(this.$t('Errors.Required', {field: this.$t('Auth.Email')}));
      } else if(!this.validEmail(this.email)) {
        this.errors.push(this.$t('Errors.Invalid', {field: this.$t('Auth.Email')}));
      } else {
          this.submit();
        //this.$router.push('/dashboards/classic-dashboard');
      }
      if(!this.password) this.errors.push(this.$t('Errors.Required', {field: this.$t('Auth.Password')}));
      if(!this.errors.length) return true;
      e.preventDefault();
      
    },
    /* eslint-disable */
    validEmail:function(email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/;
    return re.test(email);
    },
    /* eslint-disable */
    submit(){
      if(this.validEmail(this.email)){
        this.handleSubmit();
      }else {
          this.errors.push(this.$t('Errors.Invalid', {field: this.$t('Auth.Email')}));
      }
    },
    ...mapActions('account', ['login', 'logout']),
    handleSubmit () {
        this.requestFailed = false;
        this.submitted = true;
        const { email, password } = this;
        if (email && password) {
            this.$vs.loading({
                container: '#login-box',
                scale: 0.6
            });
            this.login({ email, password }).catch(function (data) {
                this.errors.push(this.$t('Errors.LoginFail'));
                this.requestFailed = true;
            }.bind(this)).finally(function () {
                this.$vs.loading.close('#login-box > .con-vs-loading');
            }.bind(this));
        }
    }
  },  
  mounted(){
    if(this.$route.query.fromRegister)
    {
      this.alertVerifyByAdmin=true
    }
      
    else
      this.alertVerifyByAdmin=false  
  },
  computed: {
    ...mapState('account', ['status']),
    inputValid(){
      if(this.validEmail(this.email) && this.password && !this.requestFailed){
        return false
      } else {
        return true
      }
    },
    authClass(){
        return authBranding();
    }
  },
  created () {
    // reset login status
    //this.logout();
  },
  components:{
      LanguageSelector,
      AuthCopyright,
      CountrySelector
  }
}
</script>

