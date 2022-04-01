<template>
    <vs-row vs-justify="center" vs-align="center" :class="'full-height '+authClass ">
        <vs-col vs-lg="8" vs-sm="6"  vs-xs="0"></vs-col>
        <vs-col type="flex"  vs-justify="center" vs-align="center" class="p-0 full-height" vs-sm="6"  vs-lg="4" vs-xs="12">
            <vs-card class="mb-0 full-height login-box" id="reset-password-box" fixedHeight>
                <div slot="header">
                    <h3 class="mb-1">{{$t('Auth.ResetPasswordTitle')}}
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
                    <form @submit="checkForm" novalidate="true" autocomplete="off">

                        <vs-input icon-after="true" size="large" class="w-100 mb-4 mt-2 vs-input-large" icon="email" autocomplete="off" :placeholder="$t('Auth.Email')" v-model="email" type="email"/>
                        <vs-input icon-after="true" size="large" class="w-100 mb-4 vs-input-large" type="password" autocomplete="off" icon="lock" :placeholder="$t('Profile.NewPassword')" v-model="password"/>
                        <vs-input icon-after="true" size="large" class="w-100 mb-4 vs-input-large" type="password" autocomplete="off" icon="lock" :placeholder="$t('Profile.PasswordConfirm')" v-model="password_confirm"/>
                        <vs-input icon-after="true" size="large" class="w-100 mb-4 vs-input-large" icon="flag" autocomplete="off" :placeholder="$t('Auth.ResetPasswordCode')" v-model="token" type="text"/>
                        <vs-button class="btn-block btn btn-primary submit-button" type="submit" @click.stop.prevent="checkForm">
                            {{$t('Auth.ResetPasswordSubmitButton')}}
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
    name: 'ResetPassword',
    data:()=>({
        msg: "ResetPassword",
        email:'',
        password:'',
        password_confirm:'',
        token:'',
        requestFailed: false,
        errors:[]
    }),
    methods:{
        checkForm(e) {
            this.errors = [];
            if(!this.email)
                this.errors.push(this.$t('Errors.Required', {field: this.$t('Auth.Email')}));
            else if(!this.validEmail(this.email))
                this.errors.push(this.$t('Errors.Invalid', {field: this.$t('Auth.Email')}));
            if(!this.password)
                this.errors.push(this.$t('Errors.Required', {field: this.$t('Profile.NewPassword')}));
            if(!this.password_confirm)
                this.errors.push(this.$t('Errors.Required', {field: this.$t('Profile.PasswordConfirm')}));
            else if(this.password_confirm != this.password)
                this.errors.push(this.$t('Errors.PasswordConfirmDoNotMatch'));
            if(!this.token)
                this.errors.push(this.$t('Errors.Required', {field: this.$t('Auth.ResetPasswordCode')}));
            if(this.errors.length > 0) return true;
            else {
                this.handleSubmit();
            }
            e.preventDefault();
        },
        /* eslint-disable */
        validEmail:function(email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/;
            return re.test(email);
        },
        ...mapActions('account', ['logout']),
        handleSubmit () {
            this.requestFailed = false;
            this.submitted = true;
            const { email, password, token } = this;

            if (email && password && token) {
                this.$vs.loading({
                    container: '#reset-password-box',
                    scale: 0.6
                });
                let payload = { email: email, password: password, token: token };
                userService.passwordReset(payload).then(function (data) {
                    this.$router.push('/login');
                }.bind(this)).catch(function (data) {
                    this.errors.push(this.$t('Errors.PasswordResetFail'));
                    this.requestFailed = true;
                }.bind(this)).finally(function () {
                    this.$vs.loading.close('#reset-password-box > .con-vs-loading');
                }.bind(this));
            }
        }
    },
    computed: {
        ...mapState('account', ['status']),
        inputValid(){
            if(this.validEmail(this.email) && this.password && this.password_confirm && this.token && !this.requestFailed){
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
        console.log(this.email)
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

