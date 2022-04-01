<template>
    <vs-row vs-justify="center" vs-align="center" :class="'full-height '+authClass ">
        <vs-col vs-lg="8" vs-sm="6"  vs-xs="0"></vs-col>
        <vs-col type="flex"  vs-justify="center" vs-align="center" class="p-0 full-height" vs-sm="6" vs-lg="4" vs-xs="12">
            <vs-card class="mb-0 full-height login-box" id="forgot-password-box" fixedHeight>
                <div slot="header">
                    <h3 class="mb-1">{{$t('Auth.PasswordForgotTitle')}}
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
                    <form @submit="checkForm" novalidate="true">

                        <p>{{$t('Auth.PasswordForgotText')}}</p>
                        <vs-input icon-after="true" size="large" class="w-100 mb-4 mt-2 vs-input-large" icon="email" :placeholder="$t('Auth.Email')" v-model="email" type="email"/>

                        <vs-button class="btn-block btn btn-primary submit-button" type="submit" @click.stop.prevent="checkForm">
                            {{$t('Auth.PasswordForgotSubmitButton')}}
                        </vs-button>

                        <vs-button class="btn-outline-secondary btn w-100 mt-2" type="button"  to="/password/reset">
                            {{$t('Auth.AlreadyHaveResetCodeButton')}}
                        </vs-button>

                        <p class="mt-4 text-black-50">{{$t('Auth.PasswordForgotGoToLoginText')}}</p>

                        <vs-button class="btn-outline-primary btn w-100 mt-2" type="button"  to="/login">
                            {{$t('Auth.LoginButton')}}
                        </vs-button>
                    </form>
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
import { userService } from "../../_services";
import {authBranding} from '../../_helpers/auth-branding'

export default {
    name: 'Login',
    data:()=>({
        msg: "Login",
        rememberme:false,
        requestStatus: false,
        errors:[],
        email: ''
    }),
    methods:{
        checkForm:function(e) {
            this.errors = [];
            if(!this.email) {
                this.errors.push(this.$t('Errors.Required', {field: this.$t('Auth.Email')}));
            } else {
                this.submit();
            }
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
        ...mapActions('account', ['logout']),
        handleSubmit () {
            this.requestFailed = false;
            this.submitted = true;
            const { email } = this;
            if (email) {
                this.$vs.loading({
                    container: '#forgot-password-box',
                    scale: 0.6
                });

                userService.requestPasswordReset({ email: email }).then(function (data) {
                    this.$router.push('/password/reset');
                }.bind(this)).catch(function (data) {
                    this.errors.push(this.$t('Errors.EmailDoesNotExist'));
                    this.requestFailed = true;
                }.bind(this)).finally(function () {
                    this.$vs.loading.close('#forgot-password-box > .con-vs-loading');
                }.bind(this));
            }
        }
    },
    computed: {
        ...mapState('account', ['status']),
        inputValid(){
            if(this.validEmail(this.email) && !this.requestFailed){
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
        this.logout();
    },
    components:{
        LanguageSelector,
        CountrySelector,
        AuthCopyright
    }
}
</script>
<style>
    .login-register-bg{
        margin:0 auto;
        background:url(../../assets/images/background/auth-bg.jpg) no-repeat center center;
    }
    .login-box{
        border-radius:0px;
    }
    .vs-card--footer{
        width: 100% !important;
    }

</style>

