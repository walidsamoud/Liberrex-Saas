<template>
  <vs-row vs-justify="center" id="kiosks-box">
    <vs-col type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-xs="12">
      <vs-card>
        <v-tour name="KiosksA" :steps="steps">
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
                <template v-if="tour.currentStep === 0">
                  <div slot="actions" class="v-step__buttons">
                    <button @click="promptShow" class="v-step__button">Next</button>
                  </div>
                </template>
                <template v-if="tour.currentStep === 1">
                  <div slot="actions" class="v-step__buttons">
                    <button @click="goToEdit" class="v-step__button">Next</button>
                  </div>
                </template>
              </v-step>
            </transition>
          </template>
        </v-tour>
        <vs-table
                @search="handleSearch"
                @sort="handleSort"
                v-model="selected"
                :total="totalItems"
                max-items="10"
                search
                :data="holidays">
          <div slot="header">
            <vs-button id="create-kiosks-button" icon="add" color="primary" @click="activePrompt = true">{{$t('Holiday.AddHoliday')}}</vs-button>
            <!---Add Display.--->
            <vs-prompt
                    color="primary"
                    @accept="acceptAlert"
                    @close="close"
                    @cancel="close"
                    :active.sync="activePrompt"
                    :title="$t('Holiday.AddHoliday')"
                    :accept-text="$t('Display.AddDisplayPrompt.SubmitButton')"
                    :cancel-text="$t('Display.AddDisplayPrompt.CancelButton')"
            >
              <div>
                <div>
                  <div class="con-exemple-prompt px-4 py-3">

                    <label class="vs-input--label" for="color-add-edit">{{$t('Holiday.StartsAt')}}</label>
                    <vs-input type="datetime-local" class="justify-content-start w-100 mb-2" color="primary" v-model="create_holiday.start" >
                    </vs-input>

                    <label class="vs-input--label" for="color-add-edit">{{$t('Holiday.EndsAt')}}</label>
                    <vs-input type="datetime-local" class="justify-content-start w-100 mb-2" color="primary" v-model="create_holiday.end" >
                    </vs-input>

                    <vs-select
                            :placeholder="$t('Holiday.Cuz')"
                            class="w-100 mb-2 mt-2"
                            :label="$t('Holiday.Cuz')"
                            autocomplete
                            v-model="create_holiday.status"
                    >
                      <vs-select-item :value="'Vacation'" :text="$t('Holiday.Vacation')" />
                      <vs-select-item :value="'Holiday'" :text="$t('Holiday.Holiday')" />
                      <vs-select-item :value="'Other'" :text="$t('Holiday.Other')" />
                    </vs-select>

                    <label class="vs-input--label" for="color-add-edit">{{$t('Holiday.For')}}</label>
                    <br>
                    <input type="radio" id="one" :value="account_info.id" v-model="create_holiday.member_id">
                    <label for="one"> {{ $t('Holiday.ForMe') }} </label>
                    <br>
                    <input type="radio" id="two" :value="null" v-model="create_holiday.member_id">
                    <label for="two">  {{ $t('Holiday.ForBusiness') }}  </label>
                    <br>

                  </div>
                </div>
              </div>
             
            </vs-prompt>

            <!---Show Sectet --->
            <vs-prompt
                    color="success"
                    :active.sync="createShowSecret"
                    :title="$t('Display.ShowSecretPrompt.Title')"
                    :cancel-text="$t('Display.ShowSecretPrompt.CancelButton')"
                    buttonAccept="false"
            >
              <div>
                <div class="mb-4">
                  <h4 class="font-weight-light">{{$t('Display.ShowSecretPrompt.Key')}}</h4>
                  <h3 class="mt-2">{{createKeyValue}}</h3>
                </div>

                <div class="mb-4">
                  <h4 class="font-weight-light">{{$t('Display.ShowSecretPrompt.Secret')}}</h4>
                  <h3 class="mt-2 mb-2">{{createSecretValue}}</h3>
                  <span class="text-danger mt-2">{{$t('Display.ShowSecretPrompt.SecretSave')}}</span>
                </div>

                <div class="mb-4">
                  <h4 class="font-weight-light">{{$t('Display.ShowSecretPrompt.Token')}}</h4>
                  <vs-input v-model="createTokenValue" disabled class="w-100" />
                  <span class="text-danger mt-2">{{$t('Display.ShowSecretPrompt.TokenSave')}}</span>
                </div>
              </div>
            </vs-prompt>

            <vs-prompt
                    color="warning"
                    @accept="updateService"
                    @close="close"
                    @cancel="close"
                    :active.sync="activeUpdatePrompt"
                    :title="$t('Display.EditKioskPrompt.Title')"
                    :accept-text="$t('Display.EditKioskPrompt.SubmitButton')"
                    :cancel-text="$t('Display.EditKioskPrompt.CancelButton')"
            >
              <div >
                <div>
                  <div class="con-exemple-prompt px-4 py-3">

                    <vs-input
                            :danger="errors.name"
                            :danger-text="$t('Errors.InvalidPolite', {field: $t('Display.AddDisplayPrompt.Name')})"
                            :label="$t('Display.AddDisplayPrompt.Name')"
                            v-model="editPromptData.name" class="w-100 mb-2" />
                    <vs-select
                            :danger="errors.queues"
                            :danger-text="$t('Errors.InvalidPolite', {field: $t('Display.AddDisplayPrompt.Queues')})"
                            :placeholder="$t('Display.AddDisplayPrompt.Queues')"
                            class="w-100 mb-2"
                            :label="$t('Display.AddDisplayPrompt.Queues')"
                            autocomplete
                            multiple
                            v-model="editPromptData.queues"
                    >
                      <vs-select-item :key="index" :value="queue.id" :text="queue.title" v-for="(queue,index) in queues" />
                    </vs-select>
                    <vs-select class="w-100 mt-2" :label="$t('Display.AddDisplayPrompt.Theme')" v-model="editPromptData.theme">
                      <vs-select-item
                              :key="index"
                              :value="item.value"
                              :text="item.text"
                              v-for="(item,index) in themes"
                      />
                    </vs-select>

                    <label class="vs-input--label" for="color-add-edit">{{$t('Department.Color')}}</label>
                      <input id="color-add-edit" v-model="editPromptData.color" type="color" class="w-100"/>

                    <vs-input type="file" class="w-100 mt-2" id="editFileInput" :label="$t('Display.AddDisplayPrompt.Photo')" v-model="editPromptData.photo"/>
                    <vs-checkbox color="danger" class="justify-content-start w-100 mb-2 mt-2" v-if="editPromptData.photoUrl.length" v-model="editPromptData.photoDelete">{{$t('Display.EditKioskPrompt.PhotoUploadedDelete')}}</vs-checkbox>
                    <p v-if="editPromptData.photoUrl.length" class="mt-2">
                      <a :href="editPromptData.photoUrl" target="_blank">{{$t('Display.EditKioskPrompt.PhotoUploaded')}}</a>
                    </p>
                    <vs-select class="w-100 mt-2 mb-2" :label="$t('Display.AddDisplayPrompt.Language')" v-model="editPromptData.locale">
                      <vs-select-item
                              :key="index"
                              :value="index"
                              :text="item"
                              v-for="(item,index) in locales"
                      />
                    </vs-select>

                    <vs-input :label="$t('Display.AddDisplayPrompt.VideoLink')" v-model="editPromptData.video_link" class="w-100 mb-2" />
                    <vs-row>
                      <vs-col vs-w="6">
                        <vs-input :label="$t('Display.AddDisplayPrompt.IpAddress')" v-model="editPromptData.ip_address" class="w-100 mb-2" />
                      </vs-col>
                      <vs-col vs-w="6">
                        <vs-input :label="$t('Display.AddDisplayPrompt.MacAddress')" v-model="editPromptData.mac_address" class="w-100 mb-2" />
                      </vs-col>
                    </vs-row>


                    <vs-row>
                      <vs-col vs-lg="6">
                        <vs-checkbox label="Collect customer details" class="justify-content-start w-100 mb-2 mt-2" v-model="editPromptData.collectDetails">
                          {{$t('Display.AddDisplayPrompt.CollectCustomerDetails')}}
                        </vs-checkbox>
                      </vs-col>
                      <vs-col vs-lg="6">
                        <vs-checkbox label="Collect customer details" class="justify-content-start w-100 mb-2 mt-2" v-model="editPromptData.playVoiceCall">
                          {{$t('Display.AddDisplayPrompt.PlayVoiceCall')}}
                        </vs-checkbox>
                      </vs-col>
                    </vs-row>
                  </div>
                </div>
              </div>
            </vs-prompt>
          </div>
          <template slot="thead">
            <vs-th sort-key="name">{{$t('Holiday.StartsAt')}}</vs-th>
            <vs-th sort-key="name">{{$t('Holiday.EndsAt')}}</vs-th>
            <vs-th sort-key="name">{{$t('Holiday.Status')}}</vs-th>
            <vs-th sort-key="name">{{$t('Holiday.Cuz')}}</vs-th>
            <!-- <vs-th sort-key="name">{{$t('Holiday.Department')}}</vs-th> -->
            <!-- <vs-th sort-key="name">{{$t('Holiday.Member')}}</vs-th> -->
            <vs-th >{{$t('Display.Table.Options')}}</vs-th>
          </template>

          <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in holidays">
              <vs-td :data="data[indextr].start_day">
                <div class="d-flex align-items-center">
                  <h5 class="mb-0 font-12">{{data[indextr].start_date}}</h5><br>
                </div>
                  <small class="">{{data[indextr].start_time}}</small>
              </vs-td>


              <vs-td :data="data[indextr].end_date">
                <div class="d-flex align-items-center">
                  <h5 class="mb-0 font-12">{{data[indextr].end_date}}</h5>
                </div>
                  <small class="">{{data[indextr].end_time}}</small>
              </vs-td>


              <vs-td :data="data[indextr].member_id">
                <div class="d-flex align-items-center" v-if="data[indextr].member_id==null || data[indextr].member==null">
                  <span class="badge badge-primary w-100" style="padding: 5px 10px;border-radius: 5px;">{{ $t('Holiday.ForBusiness') }}</span>
                </div>
                <div class="d-flex align-items-center" v-else>
                  <span class="badge badge-success w-100" style="padding: 5px 10px;border-radius: 5px;">{{ data[indextr].member.fname }} {{ data[indextr].member.lname }}</span>
                </div>
              </vs-td>

              <vs-td :data="data[indextr].status">
                <div class="d-flex align-items-center">
                  <span style="padding: 5px 10px;border-radius: 5px;">{{data[indextr].status}}</span>
                </div>
              </vs-td>


              <vs-td>
                <div class="btn-alignment">
                  <!-- <vs-button radius color="warning" type="border" icon="edit" id="edit-kiosk-button" @click="openEdit(data[indextr])"></vs-button> -->
                  <!-- <vs-button radius color="primary" type="border" icon="lock" @click="resetSecret(data[indextr])"></vs-button> -->
                  <vs-button radius color="danger" type="border" icon="delete" @click="deleteHoliday(data[indextr].id)"></vs-button>
                </div>
              </vs-td>

            </vs-tr>
          </template>
        </vs-table>
        <vs-pagination :total="totalPages" @change="handleChangePage" v-model="currentPage"></vs-pagination>
      </vs-card>
    </vs-col>
  </vs-row>
</template>

<script>
import { displayService, queueService, businessService } from '../../_services'
import router from "../../_helpers/router";
import { mapState } from 'vuex'
// moment

export default {
  name: "Services",
  data: () => ({
    title: "Services",
    activePrompt: false,
    activeUpdatePrompt: false,
    createShowSecret: false,
    createSecretValue: '',
    createKeyValue: '',
    createTokenValue: '',
    color: "",
    services: [],
    kiosks: [],
    locales: {
      en: 'English',
      fr: 'Français',
      es: 'Española',
      pt: 'Portugues',
      de: 'Deutsche',
      ru: 'Русский',
      ar: 'العريية',
      he: 'עברי'
    },
    industryServices: [],
    promptData: {name: '', photo: '', theme: 'liberrex', locale: '', collectDetails: 0, queues: [],video_link: '', ip_address: '', mac_address: '', playVoiceCall: ''},
    editPromptData: {id: -1, name: '', photo: '', photoUrl: '', photoDelete:false, theme: 'liberrex', locale: '',
      collectDetails: 0, queues: [],video_link: '', ip_address: '', mac_address: '' , playVoiceCall : '', color: ''},
    selected: {},
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    maxItems:0,
    steps: [
      {
        target: 'header div .vs-button-primary',  // We're using document.querySelector() under the hood
        header: {
          title: 'Get Started',
        },
        params: {
          placement: 'right' // Any valid Popper.js placement. See https://popper.js.org/popper-documentation.html#Popper.placements
        }

      },
      {
        target: '#edit-kiosk-button',
        params: {
          placement: 'auto'
        }
      }
    ],
    themes: [
      {value: 'dark_mode', text: 'Liberrex dark_mode'},
      {value: 'light_mode', text: 'Liberrex dark_mode'},
      {value: 'liberrex', text: 'Liberrex Default'},
      {value: 'light', text: 'Snowy'},
      {value: 'dark', text: 'Dracula'},
      {value: 'orange', text: 'Orangina'},
      {value: 'terra', text: 'Terra'},
      {value: 'greena', text: 'Greena'},
      {value: 'lemon', text: 'Lemon'},
    ],
    queues: [],
    errors:{
      name:false,
      queues:false
    },

    holidays: [],
    create_holiday: {
        start: "",
        end: "",
        status: "",
        member_id: null
    }
  }),
  methods: {
    notify(title, text, type) {
      this.$vs.notify({
        color: type,
        title: title,
        text: text
      });
    },
    validateFields() {
      this.errors.name = this.promptData.name ? false : true
      this.errors.queues = this.promptData.queues.length > 0 ? false : true;

      let {name, queues} = this.errors;
      return !(name || queues);
    },
    validateEditPromptFields() {
      this.errors.name = this.editPromptData.name ? false : true
      this.errors.queues = this.editPromptData.queues.length > 0 ? false : true;

      let {name, queues} = this.errors;
      return !(name || queues);
    },
    reset(){
      this.promptData= {name: '', photo: '', theme: 'liberrex', status: 1, collectDetails: 0, queues: []}
    },
    showLoading(){
      this.$vs.loading({
        container: '#kiosks-box',
        scale: 0.6
      });
    },
    hideLoading(){
      this.$vs.loading.close('#kiosks-box > .con-vs-loading')
    },
    handleSelected(){
      /* eslint-disable */
      console.log(this.selected);
    },
    promptShow(){
      this.$tours['KiosksA'].stop();
      this.activePrompt=true
      this.steps[0].content=this.$t('Customer.Prompt.Content');
      this.steps[0].target='.vs-button-primary';
      this.steps[0].params.placement='auto';
      setTimeout(() => this.$tours['KiosksB'].start(), 500);
    },
    promptShowNew(){
      this.$tours['KiosksB'].stop();
      this.activePrompt = false;
      setTimeout(() => this.$tours['KiosksA'].start(1), 500);

    },
    goToEdit(){
      router.push({ path: "/feedback?istour=on" });
    },
    acceptAlert() {
      this.showLoading();

      let holidayData = new FormData();
      holidayData.append('starts_at', this.create_holiday.start);
      holidayData.append('ends_at', this.create_holiday.end);
      holidayData.append('status', this.create_holiday.status);
      holidayData.append('member_id', this.create_holiday.member_id);

      holidayData.append('_method', 'POST');

      businessService.createHoliday(holidayData).then(function (data) {
          this.activePrompt = false;
          this.close();
          this.currentPage = 1;
          this.handleChangePage(this.currentPage);

          this.$router.go();
        this.notify(this.$t('Toasts.Successful'), this.$t('Display.AddDisplayPrompt.ToastSuccess'), 'success');
      }.bind(this)).catch(function () {
        this.notify(this.$t('Toasts.Error'), this.$t('Display.AddDisplayPrompt.ToastFail'), 'danger');
      }.bind(this)).finally(function () {
        this.hideLoading();
      }.bind(this));
    },
    close() {
        this.createShowSecret = false;
        this.createKeyValue = '';
        this.createSecretValue = '';
        this.promptData = {name: '', photo: '', theme: 'liberrex', status: 1, queues: []};
    },
    handleSearch(keyword) {
      if(keyword == ''){
        displayService.getAll().then(function (data) {
          this.kiosks = data.displays.data;
          this.totalItems = data.displays.total;
          this.totalPages = data.displays.last_page;
          this.maxItems = data.displays.per_page;
        }.bind(this));
      }
      displayService.filter(keyword).then(function (data) {
        this.kiosks = data.displays.data;
        this.totalItems = data.displays.total;
      }.bind(this));
    },
    handleChangePage(page) {
        displayService.getPage(page).then(function (data) {
        this.kiosks = data.displays.data;
      }.bind(this));
    },
    updateService(){
        let res = this.validateEditPromptFields();
        if (!res) {
          this.activeUpdatePrompt = true
          return false;
        }
        this.showLoading();
        let kioskData = new FormData();
        kioskData.append('name', this.editPromptData.name);
        kioskData.append('queues', this.editPromptData.queues.join(','));
        kioskData.append('theme', this.editPromptData.theme);
        kioskData.append('color', this.editPromptData.color);
        kioskData.append('video_link', this.editPromptData.video_link);
        kioskData.append('voice_call', this.editPromptData.playVoiceCall);
        kioskData.append('ip_address', this.editPromptData.ip_address);
        kioskData.append('mac_address', this.editPromptData.mac_address);
        kioskData.append('status', 1);
        kioskData.append('deletePhoto', this.editPromptData.photoDelete);
        kioskData.append('collect_details', this.editPromptData.collectDetails ? 1 : 0);
        kioskData.append('locale', this.editPromptData.locale);
        if(document.getElementById("editFileInput").files[0]){
          kioskData.append('photo', document.getElementById("editFileInput").files[0]);
        }
        displayService.update(this.editPromptData.id, kioskData).then(function (data) {
          this.handleChangePage(this.currentPage);
          this.activeUpdatePrompt = false;
        this.notify(this.$t('Toasts.Successful'), this.$t('Display.EditKioskPrompt.ToastSuccess'), 'success');
      }.bind(this)).catch(function () {
        this.notify(this.$t('Toasts.Error'), this.$t('Display.EditKioskPrompt.ToastFail'), 'danger');
      }.bind(this)).finally(function () {
          this.hideLoading();
        }.bind(this));
    },
    handleSort(key, active) {
      /* eslint-disable */
      console.log({key, active});
    },
    formatDate: function (value) {
      let date = this.$moment(value).format('DD MMMM YYYY [at] HH:mm');
      return date;
    },
    resetSecret(kiosk){
      this.$vs.dialog({
        type: 'confirm',
        color: 'primary',
        title: this.$t('Display.ResetSecretPrompt.Title'),
        text: this.$t('Display.ResetSecretPrompt.Text', {name: kiosk.name}),
        acceptText: this.$t('Toasts.AcceptButton'),
        cancelText: this.$t('Toasts.CancelButton'),
        accept: function () {
          this.showLoading();
          displayService.resetPassword(kiosk.id).then(function (data) {
            this.handleChangePage(this.currentPage);
            this.createKeyValue = data.key;
            this.createSecretValue = data.secret;
            this.createTokenValue = data.auto_auth_token;
            this.createShowSecret = true;
            this.notify(this.$t('Toasts.Successful'), this.$t('Display.ResetSecretPrompt.ToastSuccess'), 'success');
          }.bind(this)).catch(function () {
            this.notify(this.$t('Toasts.Error'), this.$t('Display.ResetSecretPrompt.ToastFail'), 'danger');
          }.bind(this)).finally(function () {
            this.hideLoading();
          }.bind(this));
        }.bind(this)
      });
    },
    deleteHoliday(holiday_id) {
      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: this.$t('Holiday.DeleteHoliday'),
        text: this.$t('Holiday.DeleteHolidayText'),
        acceptText: this.$t('Toasts.AcceptButton'),
        cancelText: this.$t('Toasts.CancelButton'),
        accept: function () {
            this.showLoading();
            businessService.deleteHoliday(holiday_id).then(function (data) {
            this.handleChangePage(this.currentPage);
            this.notify(this.$t('Toasts.Successful'), this.$t('Display.DeleteKioskPrompt.ToastSuccess'), 'success');
            this.$router.go();
          }.bind(this)).catch(function () {
            this.notify(this.$t('Toasts.Error'), this.$t('Display.DeleteKioskPrompt.ToastFail'), 'danger');
          }.bind(this)).finally(function () {
              this.hideLoading();
            }.bind(this));
        }.bind(this)
      });
    },
    openEdit(selected){
      let displayConfig = JSON.parse(selected.config);
      this.editPromptData.id = selected.id;
      this.editPromptData.name = selected.name;
      this.editPromptData.queues= displayConfig.queues.split(',').map(x=>+x);
      this.editPromptData.video_link = displayConfig.video_link ? displayConfig.video_link.toString() : "";
      this.editPromptData.playVoiceCall = displayConfig.voice_call ? displayConfig.voice_call.toString() : "";
      this.editPromptData.theme = displayConfig.theme;
      this.editPromptData.color = displayConfig.color;
      this.editPromptData.status = selected.status;
      this.editPromptData.collectDetails = selected.collect_details;
      this.editPromptData.photoUrl = displayConfig.photo ? displayConfig.photo : "";
      this.editPromptData.locale = displayConfig.locale ? displayConfig.locale : "";
      this.activeUpdatePrompt = true;
      console.log(this.editPromptData.playVoiceCall);
    }
  },
  computed: {
...mapState({
        account_info: state => state.account.user.user,
    }),
  },
  mounted(){
    this.create_holiday.member_id= this.account_info.id
    this.promptData.locale = this.$i18n.locale;

    businessService.getAllHolidays().then(function (data) {
        console.log('holoisay')
        console.log(data)
        this.holidays= data.holidays
    }.bind(this));
  }
};
</script>
