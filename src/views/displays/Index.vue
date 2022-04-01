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
                :data="kiosks">
          <div slot="header">
            <vs-button id="create-kiosks-button" icon="add" color="primary" @click="activePrompt = true">{{$t('Display.AddDisplayButton')}}</vs-button>
            <!---Add Display.--->
            <vs-prompt
                    color="primary"
                    @accept="acceptAlert"
                    @close="close"
                    @cancel="close"
                    :active.sync="activePrompt"
                    :title="$t('Display.AddDisplayPrompt.Title')"
                    :accept-text="$t('Display.AddDisplayPrompt.SubmitButton')"
                    :cancel-text="$t('Display.AddDisplayPrompt.CancelButton')"
            >
              <div>
                <div>
                  <div class="con-exemple-prompt px-4 py-3"  style="height: 80vh;overflow-y: scroll !important;">

                    <vs-input
                            :danger="errors.name"
                            :danger-text="$t('Errors.InvalidPolite', {field: $t('Display.AddDisplayPrompt.Name')})"
                            :label="$t('Display.AddDisplayPrompt.Name')" v-model="promptData.name" class="w-100 mb-2" />
                    <vs-select
                            :danger="errors.queues"
                            :danger-text="$t('Errors.InvalidPolite', {field: $t('Display.AddDisplayPrompt.Queues')})"
                            :placeholder="$t('Display.AddDisplayPrompt.Queues')"
                            class="w-100 mb-2 mt-2"
                            :label="$t('Display.AddDisplayPrompt.Queues')"
                            autocomplete
                            multiple
                            v-model="promptData.queues"
                    >
                      <vs-select-item :key="index" :value="queue.id" :text="queue.title" v-for="(queue,index) in queues" />
                    </vs-select>
                    <vs-select class="w-100 mb-2 mt-2" :label="$t('Display.AddDisplayPrompt.Theme')" v-model="promptData.theme">
                      <vs-select-item
                              :key="index"
                              :value="item.value"
                              :text="item.text"
                              v-for="(item,index) in themes"
                      />
                    </vs-select>
                    <label class="vs-input--label" for="color-add-edit">{{$t('Department.Color')}}</label>
                      <input id="color-add-edit" v-model="promptData.color" type="color" class="w-100"/>

                    <vs-input type="file" class="w-100 mb-2 mt-2" id="fileInput" :label="$t('Display.AddDisplayPrompt.Photo')" v-model="promptData.photo"/>
                    <vs-select class="w-100 mb-2 mt-2" :label="$t('Display.AddDisplayPrompt.Language')" v-model="promptData.locale">
                      <vs-select-item
                              :key="index"
                              :value="index"
                              :text="item"
                              v-for="(item,index) in locales"
                      />
                    </vs-select>

                    <vs-input :label="$t('Display.AddDisplayPrompt.VideoLink')" v-model="promptData.video_link" class="w-100 mb-2" />
                    <vs-input :label="$t('Display.AddDisplayPrompt.IpAddress')" v-model="promptData.ip_address" class="w-100 mb-2" />
                    <vs-input :label="$t('Display.AddDisplayPrompt.MacAddress')" v-model="promptData.mac_address" class="w-100 mb-2" />
                    
                    <vs-row>
                      <vs-col vs-lg="6">
                        <vs-checkbox label="Collect customer details" class="justify-content-start w-100 mb-2 mt-2" v-model="promptData.collectDetails">
                          {{$t('Display.AddDisplayPrompt.CollectCustomerDetails')}}
                        </vs-checkbox>
                      </vs-col>
                      <vs-col vs-lg="6">
                        <vs-checkbox label="Collect customer details" class="justify-content-start w-100 mb-2 mt-2" v-model="promptData.playVoiceCall">
                          {{$t('Display.AddDisplayPrompt.PlayVoiceCall')}}
                        </vs-checkbox>
                      </vs-col>
                    </vs-row>

                    <div v-if="promptData.playVoiceCall">
                      <vs-input :label="$t('New.voiceNumber')" v-model="promptData.voiceNumber" class="w-100 mb-2" />
                      <vs-input :label="$t('New.voiceCounter')" v-model="promptData.voiceCounter" class="w-100 mb-2" />
                      <vs-input :label="$t('New.textNumber')" v-model="promptData.textNumber" class="w-100 mb-2" />
                      <vs-input :label="$t('New.textCounter')" v-model="promptData.textCounter" class="w-100 mb-2" />
                      <hr>
                    </div>

                    <vs-row>
                      <vs-col vs-lg="6">
                        <vs-checkbox label="Collect customer details" class="justify-content-start w-100 mb-2 mt-2" v-model="promptData.show_approx_time">
                          Afficher l'approximation d'attente
                        </vs-checkbox>
                      </vs-col>
                      <vs-col vs-lg="6">
                        <vs-checkbox label="Collect customer details" class="justify-content-start w-100 mb-2 mt-2" v-model="promptData.show_time">
                          Afficher l'heure
                        </vs-checkbox>
                      </vs-col>
                    </vs-row>
                  </div>
                </div>
              </div>
              <v-tour name="KiosksB" :steps="steps">
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
                          <button @click="promptShowNew" class="v-step__button">Next</button>
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
                  <div class="con-exemple-prompt px-4 py-3"  style="height: 80vh;overflow-y: scroll !important;">

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

                    <div v-if="editPromptData.playVoiceCall">
                      <vs-input :label="$t('New.voiceNumber')" v-model="editPromptData.voiceNumber" class="w-100 mb-2" />
                      <vs-input :label="$t('New.voiceCounter')" v-model="editPromptData.voiceCounter" class="w-100 mb-2" />
                      <vs-input :label="$t('New.textNumber')" v-model="editPromptData.textNumber" class="w-100 mb-2" />
                      <vs-input :label="$t('New.textCounter')" v-model="editPromptData.textCounter" class="w-100 mb-2" />
                      <hr>
                    </div>

                    <vs-row>
                      <vs-col vs-lg="6">
                        <vs-checkbox label="Collect customer details" class="justify-content-start w-100 mb-2 mt-2" v-model="editPromptData.show_approx_time">
                          Afficher l'approximation d'attente {{editPromptData.show_approx_time}}
                        </vs-checkbox>
                      </vs-col>
                      <vs-col vs-lg="6">
                        <vs-checkbox label="Collect customer details" class="justify-content-start w-100 mb-2 mt-2" v-model="editPromptData.show_time">
                          Afficher l'heure
                        </vs-checkbox>
                      </vs-col>
                    </vs-row>

                  </div>
                </div>
              </div>
            </vs-prompt>
          </div>
          <template slot="thead">
            <vs-th sort-key="name">{{$t('Display.Table.Name')}}</vs-th>
            <vs-th sort-key="key">{{$t('Display.Table.Key')}}</vs-th>
            <vs-th sort-key="status">{{$t('Display.Table.Status')}}</vs-th>
            <vs-th sort-key="created_at">{{$t('Display.Table.CreatedAt')}}</vs-th>
            <vs-th >{{$t('Display.Table.Options')}}</vs-th>
          </template>

          <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">

              <vs-td :data="data[indextr].name">
                <div class="d-flex align-items-center">
                  <h5 class="mb-0 font-12">{{data[indextr].name}}</h5>
                </div>
              </vs-td>

              <vs-td :data="data[indextr].key">
                <div class="d-flex align-items-center">
                  <span class="">{{data[indextr].key}}</span>
                </div>
              </vs-td>

              <vs-td :data="data[indextr].status">
                <div class="d-flex align-items-center">
                    <vs-chip v-if="data[indextr].status == 0" color="danger">
                        {{$t('Display.AddDisplayPrompt.StatusInactive')}}
                    </vs-chip>

                    <vs-chip v-if="data[indextr].status == 1" color="success">
                        {{$t('Display.AddDisplayPrompt.StatusActive')}}
                    </vs-chip>
                </div>
              </vs-td>

              <vs-td :data="data[indextr].created_at">
                <div class="d-flex align-items-center">
                  <i class="mdi mdi-calendar-text mr-2 display-8"></i>
                  {{formatDate(data[indextr].created_at)}}
                </div>
              </vs-td>

              <vs-td>
                <div class="btn-alignment">
                  <vs-button radius color="warning" type="border" icon="edit" id="edit-kiosk-button" @click="openEdit(data[indextr])"></vs-button>
                  <vs-button radius color="primary" type="border" icon="lock" @click="resetSecret(data[indextr])"></vs-button>
                  <vs-button radius color="danger" type="border" icon="delete" @click="deleteKiosk(data[indextr])"></vs-button>
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
import { displayService, queueService } from '../../_services'
import router from "../../_helpers/router";
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
    promptData: {
      show_approx_time: true,
      show_time: true,
      name: '', photo: '', theme: 'liberrex', locale: '', collectDetails: 0, queues: [],video_link: '', ip_address: '', mac_address: '', playVoiceCall: '', color: '', voiceCounter: '',  voiceNumber: '', textCounter: '',  textNumber: ''},
    editPromptData: {id: -1, name: '', photo: '', photoUrl: '', photoDelete:false, theme: 'liberrex', locale: '',
      collectDetails: 0, queues: [],video_link: '', ip_address: '', mac_address: '' , playVoiceCall : '', color: '', voiceNumber: '', voiceCounter: '', textCounter: '',  textNumber: '', 
      show_approx_time: true,
      show_time: true},
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
      let res = this.validateFields();
      if (!res) {
        this.activePrompt = true;
        return false;
      }
      this.showLoading();

      let kioskData = new FormData();
      kioskData.append('name', this.promptData.name);
      kioskData.append('queues', this.promptData.queues.join(','));
      kioskData.append('theme', this.promptData.theme);
      kioskData.append('color', this.promptData.color);
      kioskData.append('ip_address', this.promptData.ip_address);
      kioskData.append('video_link', this.promptData.video_link);
      kioskData.append('voice_call', this.promptData.playVoiceCall);
      kioskData.append('voiceNumber', this.promptData.voiceNumber);
      kioskData.append('voiceCounter', this.promptData.voiceCounter);
      kioskData.append('textNumber', this.promptData.textNumber);
      kioskData.append('textCounter', this.promptData.textCounter);
      kioskData.append('mac_address', this.promptData.mac_address);
      kioskData.append('status', 1);
      kioskData.append('collect_details', this.promptData.collectDetails ? 1 : 0);
      kioskData.append('locale', this.promptData.locale);
      if(document.getElementById("fileInput").files[0]){
        kioskData.append('photo', document.getElementById("fileInput").files[0]);
      }
      kioskData.append('show_time', this.promptData.show_time);
      kioskData.append('show_approx_time', this.promptData.show_approx_time);
      kioskData.append('_method', 'PUT');

      displayService.create(kioskData).then(function (data) {
          this.activePrompt = false;
          this.close();
          this.currentPage = 1;
          this.handleChangePage(this.currentPage);
          this.createKeyValue = data.key;
          this.createSecretValue = data.secret;
          this.createTokenValue = data.auto_auth_token;
          this.createShowSecret = true;
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
        kioskData.append('voiceCounter', this.editPromptData.voiceCounter);
        kioskData.append('voiceNumber', this.editPromptData.voiceNumber);
        kioskData.append('textNumber', this.editPromptData.textNumber);
        kioskData.append('textCounter', this.editPromptData.textCounter);
        kioskData.append('ip_address', this.editPromptData.ip_address);
        kioskData.append('mac_address', this.editPromptData.mac_address);
        kioskData.append('status', 1);
        kioskData.append('deletePhoto', this.editPromptData.photoDelete);
        kioskData.append('collect_details', this.editPromptData.collectDetails ? 1 : 0);
        kioskData.append('locale', this.editPromptData.locale);
        if(document.getElementById("editFileInput").files[0]){
          kioskData.append('photo', document.getElementById("editFileInput").files[0]);
        }

        kioskData.append('show_time', this.editPromptData.show_time);
        kioskData.append('show_approx_time', this.editPromptData.show_approx_time)

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
    deleteKiosk(kiosk) {
      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: this.$t('Display.DeleteKioskPrompt.Title'),
        text: this.$t('Display.DeleteKioskPrompt.Text', {name: kiosk.name}),
        acceptText: this.$t('Toasts.AcceptButton'),
        cancelText: this.$t('Toasts.CancelButton'),
        accept: function () {
            this.showLoading();
            displayService.delete(kiosk.id).then(function (data) {
            this.handleChangePage(this.currentPage);
            this.notify(this.$t('Toasts.Successful'), this.$t('Display.DeleteKioskPrompt.ToastSuccess'), 'success');
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
      this.editPromptData.show_approx_time = selected.show_approx_time=="true" ? true : false;
      this.editPromptData.show_time = selected.show_time=="true" ? true : false;
      this.editPromptData.name = selected.name;
      this.editPromptData.queues= displayConfig.queues.split(',').map(x=>+x);
      this.editPromptData.video_link = displayConfig.video_link ? displayConfig.video_link.toString() : "";
      this.editPromptData.playVoiceCall = displayConfig.voice_call=="true" ? true : false;
      // this.editPromptData.playVoiceCall = displayConfig.playVoiceCall ? displayConfig.playVoiceCall.toString() : "";
      this.editPromptData.theme = displayConfig.theme;
      this.editPromptData.color = displayConfig.color;
      this.editPromptData.status = selected.status;
      this.editPromptData.collectDetails = selected.collect_details;
      this.editPromptData.photoUrl = displayConfig.photo ? displayConfig.photo : "";
      this.editPromptData.locale = displayConfig.locale ? displayConfig.locale : "";
      this.activeUpdatePrompt = true;
      // alert(this.editPromptData.playVoiceCall=="false")
    }
  },
  computed: {

  },
  mounted(){

    this.promptData.locale = this.$i18n.locale;

    displayService.getAll().then(function (data) {
      this.kiosks = data.displays.data;
      this.totalItems = data.displays.total;
      this.totalPages = data.displays.last_page;
      this.maxItems = data.displays.per_page;
    }.bind(this));

    queueService.getAllWithSummary().then(function (data) {
      this.queues = data.queues.map(obj => {
        return obj.queue;
      });
    }.bind(this));
    this.$t('Display.Content').map((content,index)=> (
            this.steps[index].content = content
    ));
    this.$route.query.istour && localStorage.getItem('skipTour') !='true' ? this.$tours['KiosksA'].start() : '';
  }
};
</script>
