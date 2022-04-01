<template>
    <vs-row vs-justify="center" id="general-settings-box">

        <!--
        <vs-col  vs-lg="3" vs-md="3" vs-sm="12" vs-xs="12">
          <vs-card>
            <div slot="header">
              <h3>{{$t('GeneralSettings.Notifications.Title')}}</h3>
            </div>
            <div>
              <vs-row>
                <vs-col vs-w="12" class="mb-2">
                <span class="d-flex">
                  <vs-switch id="notificaitions_email" color="success" v-model="notifications.email" class="mr-4"/>
                  <label for="notificaitions_email" class="mt-0">{{$t('GeneralSettings.Notifications.Email')}}</label>
                </span>
                </vs-col>
                <vs-col vs-w="12">
                <span class="d-flex mb-2">
                  <vs-switch id="notificaitions_push" color="success" v-model="notifications.push" class="mr-4"/>
                  <label for="notificaitions_push" class="mt-0">{{$t('GeneralSettings.Notifications.Push')}}</label>
                </span>
                </vs-col>
                <vs-col vs-w="12">
                <span class="d-flex mb-2">
                  <vs-switch id="notificaitions_sms" color="success" v-model="notifications.sms" class="mr-4"/>
                  <label for="notificaitions_sms" class="mt-0">{{$t('GeneralSettings.Notifications.SMS')}}</label>
                </span>
                </vs-col>
              </vs-row>
            </div>
          </vs-card>
        </vs-col>
        -->
        <!-- <vs-col vs-lg="12" vs-md="12" vs-sm="12" vs-xs="12">
            <vs-card>
                <div slot="header" id="data-privacy">
                    <h3>{{$t('GeneralSettings.MyLiberrex.Title')}}</h3>
                </div>
                <div>
                    <vs-row>

                        <vs-col vs-w="12">
                          <span class="d-flex mb-2">
                            <vs-switch id="myLiberrex_booking_allowed" color="success" v-model="myLiberrex.booking_allowed" class="mr-4"/>
                            <label for="myLiberrex_booking_allowed" class="mt-0">
                              {{$t('GeneralSettings.MyLiberrex.BookingAllowed')}}
                            </label>
                          </span>
                        </vs-col>

                        <vs-col vs-w="12">
                          <span class="d-flex mb-2">
                            <vs-switch id="myLiberrex_booking_select_date" color="success" v-model="myLiberrex.booking_select_date" class="mr-4"/>
                            <label for="myLiberrex_booking_select_date" class="mt-0">
                              {{$t('GeneralSettings.MyLiberrex.BookingSelectDate')}}
                            </label>
                          </span>
                        </vs-col>

                        <vs-col vs-w="12">
                          <span class="d-flex mb-2">
                            <vs-switch id="myLiberrex_booking_select_slot" color="success" v-model="myLiberrex.booking_select_slot" class="mr-4"/>
                            <label for="myLiberrex_booking_select_slot" class="mt-0">
                              {{$t('GeneralSettings.MyLiberrex.BookingSelectSlot')}}
                            </label>
                          </span>
                        </vs-col>

                        <vs-col vs-w="12">
                          <span class="d-flex mb-2">
                            <vs-switch id="myLiberrex_booking_select_department" color="success" v-model="myLiberrex.booking_select_department" class="mr-4"/>
                            <label for="myLiberrex_booking_select_department" class="mt-0">
                              {{$t('GeneralSettings.MyLiberrex.BookingSelectDepartment')}}
                            </label>
                          </span>
                        </vs-col>

                        <vs-col vs-w="12">
                          <span class="d-flex mb-2">
                            <vs-switch id="myLiberrex_booking_allow_attachments" color="success" v-model="myLiberrex.booking_allow_attachments" class="mr-4"/>
                            <label for="myLiberrex_booking_allow_attachments" class="mt-0">
                              {{$t('GeneralSettings.MyLiberrex.BookingAllowAttachments')}}
                            </label>
                          </span>
                        </vs-col>

                        <vs-col vs-w="12">
                          <span class="d-flex mb-2">
                            <vs-switch id="myLiberrex_booking_require_attachments" color="success" v-model="myLiberrex.booking_require_attachments" class="mr-4"/>
                            <label for="myLiberrex_booking_require_attachments" class="mt-0">
                              {{$t('GeneralSettings.MyLiberrex.BookingRequireAttachments')}}
                            </label>
                          </span>
                        </vs-col>


                        <vs-col vs-w="12">
                          <span class="d-flex mb-2">
                            <vs-switch id="myLiberrex_queue_allowed" color="success" v-model="myLiberrex.queue_allowed" class="mr-4"/>
                            <label for="myLiberrex_queue_allowed" class="mt-0">
                              {{$t('GeneralSettings.MyLiberrex.QueueAllowed')}}
                            </label>
                          </span>
                        </vs-col>


                        <vs-col vs-w="12">
                          <span class="d-flex mb-2">
                            <vs-switch id="myLiberrex_queue_only_booked" color="success" v-model="myLiberrex.queue_only_booked" class="mr-4"/>
                            <label for="myLiberrex_queue_only_booked" class="mt-0">
                              {{$t('GeneralSettings.MyLiberrex.QueueOnlyBooked')}}
                            </label>
                          </span>
                        </vs-col>


                        <vs-col vs-w="12">
                          <span class="d-flex mb-2">
                            <vs-switch id="myLiberrex_queue_require_payment" color="success" v-model="myLiberrex.queue_require_payment" class="mr-4"/>
                            <label for="myLiberrex_queue_require_payment" class="mt-0">
                              {{$t('GeneralSettings.MyLiberrex.QueueRequirePayment')}}
                            </label>
                          </span>
                        </vs-col>

                        <vs-col vs-w="12">
                          <span class="d-flex mb-2">
                            <vs-switch id="myLiberrex_anonymous_feedback" color="success" v-model="myLiberrex.anonymous_feedback" class="mr-4"/>
                            <label for="myLiberrex_anonymous_feedback" class="mt-0">
                              {{$t('GeneralSettings.MyLiberrex.AnonymousFeedback')}}
                            </label>
                          </span>
                        </vs-col>

                        <vs-col vs-w="12">
                          <span class="d-flex mb-2">
                            <vs-switch id="myLiberrex_feedback_view" color="success" v-model="myLiberrex.feedback_view" class="mr-4"/>
                            <label for="myLiberrex_feedback_view" class="mt-0">
                              {{$t('GeneralSettings.MyLiberrex.FeedbackView')}}
                            </label>
                          </span>
                        </vs-col>

                        <vs-col vs-w="12">
                          <span class="d-flex mb-2">
                            <vs-switch id="myLiberrex_feedback_view" color="success" v-model="myLiberrex.booking_require_approval" class="mr-4"/>
                            <label for="myLiberrex_feedback_view" class="mt-0">
                              {{$t('GeneralSettings.MyLiberrex.BookingAutomatic')}}
                            </label>
                          </span>
                        </vs-col>

                        <vs-col vs-w="12">
                          <span class="d-flex mb-2">
                            <vs-switch id="myLiberrex_feedback_view" color="success" v-model="myLiberrex.queue_require_approval" class="mr-4"/>
                            <label for="myLiberrex_feedback_view" class="mt-0">
                              {{$t('GeneralSettings.MyLiberrex.QueueAutomatic')}}
                            </label>
                          </span>
                        </vs-col>


                        <vs-col vs-w="12">
                            <vs-button color="primary" type="filled" @click="updateMyLiberrex">
                                <i class="mdi mdi-content-save"></i>
                                {{$t('GeneralSettings.MyLiberrex.SaveButton')}}
                            </vs-button>
                        </vs-col>

                    </vs-row>
                </div>
            </vs-card>
        </vs-col> -->

        <vs-col vs-lg="12" vs-md="12" vs-sm="12" vs-xs="12">
            <vs-card>
                <div slot="header" id="data-privacy">
                    <h3>{{$t('GeneralSettings.DataAndPrivacy.Title')}}</h3>
                </div>
                <div>
                    <vs-row>
                        <vs-col vs-w="12">
                          <span class="d-flex mb-2">
                            <vs-switch id="privacy_history" color="danger" v-model="privacy.history" class="mr-4"/>
                            <label for="privacy_history" class="mt-0">
                              {{$t('GeneralSettings.DataAndPrivacy.DeleteHistoryDaily')}}
                            </label>
                          </span>
                        </vs-col>

                        <vs-col vs-w="12">
                          <span class="d-flex mb-2">
                            <vs-switch id="privacy_share" color="success" v-model="privacy.share" class="mr-4"/>
                            <label for="privacy_share" class="mt-0">
                              {{$t('GeneralSettings.DataAndPrivacy.ShareData')}}
                            </label>
                          </span>
                        </vs-col>

                        <vs-col vs-w="12">
                          <span class="d-flex mb-2">
                            <vs-switch id="privacy_public" color="success" v-model="privacy.public" class="mr-4"/>
                            <label for="privacy_public" class="mt-0">
                              {{$t('GeneralSettings.DataAndPrivacy.ShareWaitingTime')}}
                            </label>
                          </span>
                        </vs-col>

                        <vs-col vs-w="12">
                            <vs-button color="primary" type="filled" @click="updatePrivacy">
                                <i class="mdi mdi-content-save"></i>
                                {{$t('GeneralSettings.BusinessAccount.SaveButton')}}
                            </vs-button>
                        </vs-col>

                    </vs-row>
                </div>
            </vs-card>
        </vs-col>

        <vs-col vs-w="12">
            <vs-card>
                <div slot="header">
                    <h3>{{$t('GeneralSettings.BusinessAccount.Title')}}</h3>
                </div>
                <div>
                    <vs-row>
                        <vs-col vs-w="12">
                          <span class="d-flex mb-2">
                            <vs-switch id="business_publish" color="success" v-model="business.publish" class="mr-4"/>
                            <label for="business_publish" class="mt-0">
                              {{$t('GeneralSettings.BusinessAccount.IsPublished')}}
                            </label>
                          </span>
                        </vs-col>


                        <vs-col vs-w="12" id="business-account">

                            <vs-button color="primary" type="filled" class="mr-4" @click="updateBusiness">
                                <i class="mdi mdi-content-save"></i>
                                {{$t('GeneralSettings.BusinessAccount.SaveButton')}}
                            </vs-button>

                            <vs-button color="danger" type="filled" class="mr-4" @click="deleteAccountConfirm=true">
                                <i class="mdi mdi-delete-forever"></i>
                                {{$t('GeneralSettings.BusinessAccount.DeleteAccount')}}
                            </vs-button>

                            <vs-button color="dark" type="filled" @click="deleteHistory">
                                <i class="mdi mdi-history"></i> {{$t('GeneralSettings.BusinessAccount.DeleteHistory')}}
                            </vs-button>
                        </vs-col>

                    </vs-row>
                </div>
            </vs-card>
        </vs-col>

        <!--V-Tour start-->
        <v-tour name="General" :steps="steps">
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
                        <template v-if="tour.currentStep === 1">
                            <div slot="actions" class="v-step__buttons">
                                <button @click="tour.previousStep" class="v-step__button">Previous</button>
                                <button @click="skipTour" class="v-step__button">Finish</button>
                            </div>
                        </template>
                    </v-step>
                </transition>
            </template>
        </v-tour>

        <vs-prompt
                color="danger"
                @cancel="deleteAccountConfirm=false, deleteAccountConfirmPass=''"
                @accept="deleteAccountConfirmed"
                :is-valid="validPassword"
                :title="$t('GeneralSettings.DeleteAccountPrompt.Title')"
                :active.sync="deleteAccountConfirm">
            <div>
                {{$t('GeneralSettings.DeleteAccountPrompt.Text')}}
                <div>
                    <vs-input style="margin:0 auto;" placeholder="password" v-model="deleteAccountConfirmPass"/>
                    <vs-alert style="margin-top:10px;" :active="!validPassword" color="danger" icon="new_releases">
                        Password field is required for this action to be completed.
                    </vs-alert>
                </div>
            </div>
        </vs-prompt>

    </vs-row>
</template>

<script>
    import {mapState, mapActions} from 'vuex'
    import {myLiberrexService, privacyService} from "../../_services";

    export default {
        name: "General",
        data: () => ({
            title: "General",
            activePrompt: false,
            deleteAccountConfirm: false,
            deleteAccountConfirmPass: null,
            notifications: {
                email: true,
                push: true,
                sms: false
            },
            privacy: {
                history: false,
                share: false,
                public: false
            },
            myLiberrex: {
                booking_allowed: false,
                booking_require_approval: false,
                booking_select_date: false,
                booking_select_slot: false,
                booking_select_department: false,
                booking_allow_attachments: false,
                booking_require_attachments: false,
                queue_allowed: false,
                queue_require_approval: false,
                queue_only_booked: false,
                queue_require_payment: false,
                anonymous_feedback: false,
                feedback_view: false
            },
            business: {
                publish: false
            },
            steps: [
                {
                    target: '#data-privacy',  // We're using document.querySelector() under the hood
                    params: {
                        placement: 'top' // Any valid Popper.js placement. See https://popper.js.org/popper-documentation.html#Popper.placements
                    }
                },
                {
                    target: '#business-account',
                }
            ],
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
            skipTour() {
                localStorage.setItem('skipTour', 'true');
                this.$tours['General'].stop();
            },
            showLoading() {
                this.$vs.loading({
                    container: '#general-settings-box',
                    scale: 0.6
                });
            },
            hideLoading() {
                this.$vs.loading.close('#general-settings-box > .con-vs-loading')
            },
            deleteAccount() {
                this.$vs.dialog({
                    type: 'confirm',
                    color: 'danger',
                    title: this.$t('GeneralSettings.DeleteAccountPrompt.Title'),
                    text: this.$t('GeneralSettings.DeleteAccountPrompt.Text'),
                    acceptText: this.$t('Toasts.AcceptButton'),
                    cancelText: this.$t('Toasts.CancelButton'),
                    accept: function () {
                    }.bind(this)
                });
            },

            updatePrivacy() {
                this.showLoading();
                privacyService.updatePrivacy({
                    daily_data_flush: this.privacy.history,
                    allow_third_party: this.privacy.share,
                    public_availability: this.privacy.public
                }).then(() => {
                    this.notify(this.$t('Toasts.Successful'), this.$t('Profile.updatePrivacySettings.ToastSuccess'), 'success');
                }).catch(() => {
                    this.notify(this.$t('Toasts.Error'), this.$t('Profile.updatePrivacySettings.ToastFail'), 'danger');
                }).finally(() => this.hideLoading());
            },
            deleteHistory() {
                this.$vs.dialog({
                    type: 'confirm',
                    color: 'dark',
                    title: this.$t('GeneralSettings.DeleteHistoryPrompt.Title'),
                    text: this.$t('GeneralSettings.DeleteHistoryPrompt.Text'),
                    acceptText: this.$t('Toasts.AcceptButton'),
                    cancelText: this.$t('Toasts.CancelButton'),
                    accept: function () {
                        this.showLoading();
                        privacyService.deleteHistory().then(({status}) => {
                            if (status === 'success')
                                this.notify(this.$t('Toasts.Successful'), this.$t('Profile.updatePrivacySettings.DeleteHistorySuccess'), 'success');
                            else
                                this.notify(this.$t('Toasts.Error'), this.$t('Profile.updatePrivacySettings.DeleteHistoryFail'), 'danger');

                        }).catch(() => {
                            this.notify(this.$t('Toasts.Error'), this.$t('Profile.updatePrivacySettings.DeleteHistoryFail'), 'danger');
                            this.deleteHistory();
                        }).finally(() => this.hideLoading());
                    }.bind(this)
                });
            },
            deleteAccountConfirmed() {
                this.showLoading();
                privacyService.deleteAccount({
                    password: this.deleteAccountConfirmPass
                })
                    .then(({status}) => {
                        if (status === 'success') {
                            this.notify(this.$t('Toasts.Successful'), this.$t('Profile.updatePrivacySettings.DeleteAccountSuccess'), 'success');
                            localStorage.removeItem('user');
                            localStorage.removeItem('targetCounter')
                        }
                        else
                            this.notify(this.$t('Toasts.Error'), this.$t('Profile.updatePrivacySettings.DeleteAccountFail'), 'danger');
                    })
                    .catch(() => {
                        this.notify(this.$t('Toasts.Error'), this.$t('Profile.updatePrivacySettings.DeleteAccountFail'), 'danger');
                    })
                    .finally(() => {
                        this.hideLoading();
                        this.deleteAccountConfirmPass = "";
                    });
            },
            updateBusiness() {
                this.showLoading();
                privacyService.businessUpdate({
                    published: this.business.publish
                }).then(({business, status}) => {
                    if (status && status === 'success') {
                        let user = this.businessIsPublished(true);
                        user.business = business;
                        localStorage.setItem('user', JSON.stringify(user));
                        this.notify(this.$t('Toasts.Successful'), this.$t('Profile.updatePrivacySettings.businessUpdateSuccess'), 'success');
                    }
                }).catch(() => {
                    this.notify(this.$t('Toasts.Error'), this.$t('Profile.updatePrivacySettings.businessUpdateFail'), 'danger');
                }).finally(()=>this.hideLoading());
            },
            businessIsPublished(fullBusinessObject = false) {
                let user = localStorage.getItem('user');
                if(user)
                    user = JSON.parse(user);

                if(!fullBusinessObject)
                    return ((user.business)?Boolean(user.business.published):false);

                return user;
            },
            updateMyLiberrex(){
                this.showLoading();
                myLiberrexService.update(this.myLiberrex).then(function (data) {
                    this.myLiberrex = data.settings;
                }.bind(this)).finally(function () {
                    this.hideLoading();
                }.bind(this));
            }
        },
        computed: {
            ...mapState({
                business_info: state => state.account.user.business,
            }),
            validPassword() {
                return (this.deleteAccountConfirmPass && this.deleteAccountConfirmPass.length > 0)
            }
        },
        mounted() {
            this.business_data = {...this.business_info};
            this.business.publish =  this.businessIsPublished();
            privacyService.getAll().then(({privacy: {daily_data_flush, allow_third_party, public_availability}}) => {
                this.privacy.history = Boolean(daily_data_flush);
                this.privacy.share = Boolean(allow_third_party);
                this.privacy.public = Boolean(public_availability);
            });

            myLiberrexService.getAll().then(function (data) {
                this.myLiberrex = data.settings;
            }.bind(this));
            this.$t('GeneralSettings.Content').map((content, index) => (
                this.steps[index].content = content
            ));
            setTimeout(() => this.$route.query.istour && localStorage.getItem('skipTour') != 'true' ? this.$tours['General'].start() : '', 500);
        },
        components: {}
    };
</script>
