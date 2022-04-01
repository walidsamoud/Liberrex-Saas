 <template>
                    
              <div >
                <div>
                  <div class="con-exemple-prompt px-4 py-3">

                    <vs-input
                            :danger="errors.name"
                            :danger-text="$t('Errors.InvalidPolite', {field: $t('Kiosk.AddKioskPrompt.Name')})"
                            :label="$t('Kiosk.AddKioskPrompt.Name')"
                            v-model="editPromptData.name" class="w-100 mb-2" />
                    <vs-select
                            :danger="errors.queues"
                            :danger-text="$t('Errors.InvalidPolite', {field: $t('Kiosk.AddKioskPrompt.Queues')})"
                            :placeholder="$t('Kiosk.AddKioskPrompt.Queues')"
                            class="w-100 mb-2"
                            :label="$t('Kiosk.AddKioskPrompt.Queues')"
                            autocomplete
                            multiple
                            v-model="editPromptData.queues"
                    >
                      <vs-select-item :key="index" :value="queue.id" :text="queue.title" v-for="(queue,index) in queues" />
                    </vs-select>
                    <vs-select class="w-100 mt-2" :label="$t('Kiosk.AddKioskPrompt.Theme')" v-model="editPromptData.theme">
                      <vs-select-item
                              :key="index"
                              :value="item.value"
                              :text="item.text"
                              v-for="(item,index) in themes"
                      />
                    </vs-select>
                    
                    <vs-row class="ml-2">
                      <label class="vs-input--label mb-2 mt-2" for="color-add-edit" style="width: 20%">{{$t('Kiosk.AddKioskPrompt.Colors.Primary')}}</label>
                      <vs-checkbox class="mb-2 mt-2" style="width: 10%" v-model="defaultEditPrimary"></vs-checkbox>
                      <input v-if="!defaultEditPrimary" v-model="editPromptData.primary" type="color" style="width: 10%" class="mb-2 mt-2"/>
                    
                      <label class="vs-input--label mt-2 mb-2" style="width: 20%" for="color-add-edit">{{$t('Kiosk.AddKioskPrompt.Colors.Secondary')}}</label>
                      <vs-checkbox class="mb-2 mt-2" style="width: 10%" v-model="defaultEditSecondary"></vs-checkbox>
                      <input v-if="!defaultEditSecondary" v-model="editPromptData.secondary" type="color" style="width: 10%" class="mb-2 mt-2"/>
                    </vs-row> 

                    <vs-row class="ml-2">
                      <label class="vs-input--label mt-2 mb-2 " for="color-add-edit" style="width: 20%">{{$t('Kiosk.AddKioskPrompt.Colors.Success')}}</label>
                      <vs-checkbox class="mb-2 mt-2" style="width: 10%" v-model="defaultEditSuccess"></vs-checkbox>
                      <input v-if="!defaultEditSuccess" v-model="editPromptData.success" type="color" style="width: 10%" class="mb-2 mt-2"/>
                    
                      <label class="vs-input--label mt-2 " for="color-add-edit" style="width: 20%">{{$t('Kiosk.AddKioskPrompt.Colors.Danger')}}</label>
                      <vs-checkbox class="mb-2 mt-2" style="width: 10%" v-model="defaultEditDanger"></vs-checkbox>
                      <input v-if="!defaultEditDanger" v-model="editPromptData.danger" type="color" style="width: 10%" class="mt-2"/>
                    </vs-row>
                   

                    <vs-input type="file" class="w-100 mt-2" id="editFileInput" :label="$t('Kiosk.AddKioskPrompt.Photo')" v-model="editPromptData.photo"/>
                    <vs-checkbox color="danger" class="justify-content-start w-100 mb-2 mt-2" v-if="editPromptData.photoUrl.length" v-model="editPromptData.photoDelete">{{$t('Kiosk.EditKioskPrompt.PhotoUploadedDelete')}}</vs-checkbox>
                    <p v-if="editPromptData.photoUrl.length" class="mt-2">
                      <a :href="editPromptData.photoUrl" target="_blank">{{$t('Kiosk.EditKioskPrompt.PhotoUploaded')}}</a>
                    </p>
                    <vs-select class="w-100 mt-2" :label="$t('Kiosk.AddKioskPrompt.Status')" v-model="editPromptData.status">
                      <vs-select-item :value="0" :text="$t('Kiosk.AddKioskPrompt.StatusInactive')"/>
                      <vs-select-item :value="1" :text="$t('Kiosk.AddKioskPrompt.StatusActive')"/>
                    </vs-select>

                    <vs-checkbox class="justify-content-start w-100 mb-2 mt-2" v-model="editPromptData.allowBooking">
                      {{$t('Kiosk.AddKioskPrompt.AllowBooking')}}
                    </vs-checkbox>

                    <vs-checkbox class="justify-content-start w-100 mb-2 mt-2" v-model="editPromptData.collectDetails">
                      {{$t('Kiosk.AddKioskPrompt.CollectCustomerDetails')}}
                    </vs-checkbox>

                    <vs-checkbox class="justify-content-start w-100 mb-2 mt-2" v-model="editPromptData.require_internal_id">
                      {{$t('Kiosk.AddKioskPrompt.RequireInternalId')}}
                    </vs-checkbox>

                    <vs-checkbox class="justify-content-start w-100 mb-2 mt-2" v-model="editPromptData.should_print">
                      {{$t('Kiosk.AddKioskPrompt.ShouldPrint')}}
                    </vs-checkbox>

                    <vs-checkbox class="justify-content-start w-100 mb-2 mt-2" v-model="editPromptData.show_keyboard">
                      {{$t('Kiosk.AddKioskPrompt.ShowKeyboard')}}
                    </vs-checkbox>

                    <vs-checkbox class="justify-content-start w-100 mb-2 mt-2" v-model="editPromptData.loginRequired">
                      {{$t('Kiosk.AddKioskPrompt.GuestLogin')}}
                    </vs-checkbox>

                    <vs-select class="w-100 mb-2 mt-2" :label="$t('Kiosk.AddKioskPrompt.GuestPseudo')" v-model="editPromptData.pseudo" v-if="editPromptData.loginRequired == 0">
                      <vs-select-item :value="1" :text="$t('Kiosk.Pseudos.Customer')" />
                      <vs-select-item :value="2" :text="$t('Kiosk.Pseudos.Patient')" />
                      <vs-select-item :value="3" :text="$t('Kiosk.Pseudos.User')" />
                    </vs-select>

                    <vs-row>
                      <vs-col vs-w="6">
                        <vs-input :label="$t('Kiosk.AddKioskPrompt.IpAddress')" v-model="editPromptData.ip_address" class="w-100 mb-2" />
                      </vs-col>
                      <vs-col vs-w="6">
                        <vs-input :label="$t('Kiosk.AddKioskPrompt.MacAddress')" v-model="editPromptData.mac_address" class="w-100 mb-2" />
                      </vs-col>
                    </vs-row>

                  </div>
                </div>
                   <vs-col vs-w="12" class="text-right mt-4">
          <vs-button @click="close()" type="border" color="primary" class="border-0 border-bottom mr-4"> {{$t('Components.Queue.AddCustomerPrompt.CancelButton')}} </vs-button>
          <vs-button @click="updateService()" :disabled="false" color="primary" class="pr-5 pl-5 float-right"> {{$t('Kiosk.EditKioskPrompt.SubmitButton')}} </vs-button>
        </vs-col>
              </div>
</template>


<script>
import { kioskService, queueService } from '../../_services'
import router from "../../_helpers/router";
// moment

export default {
  name: "EditKiosk",
  data: () => ({
    title: "EditKiosk",
    activePrompt: false,
    activeUpdatePrompt: false,
    createShowSecret: false,
    createSecretValue: '',
    createKeyValue: '',
    createTokenValue: '',
    services: [],
    kiosks: [],
    industryServices: [],
    promptData: {name: '', photo: '', theme: 'liberrex', status: 1, allowBooking: 0, collectDetails: 0, queues: [], ip_address: '',
      mac_address: '', require_internal_id: 0, should_print: 0, show_keyboard: 0,loginRequired : 0,pseudo : 0,primary : '',secondary : '', success : '', danger : ''},
    editPromptData: {id: -1, name: '', photo: '', photoUrl: '', photoDelete:false, theme: 'liberrex',
      status: 1, allowBooking: 0, collectDetails: 0, queues: [], ip_address: '', mac_address: '',
      require_internal_id: 0, should_print: 0, show_keyboard: 0,loginRequired: 0 ,pseudo : 0,primary :'',secondary :'',success :'', danger :''},
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
    pseudo : 0,
    defaultPrimary : true,
    defaultSecondary : true,
    defaultSuccess : true,
    defaultDanger : true,
    defaultEditPrimary : false,
    defaultEditSecondary : false,
    defaultEditSuccess : false,
    defaultEditDanger : false 
  }),
  props:{
      kiosk_data_edit: Object,
  },
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
    close(){
        console.log('blabla');
        this.$emit('hide', 'close');
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
      console.log(this.promptData.pseudo);
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
      kioskData.append('status', this.promptData.status);
      kioskData.append('ip_address', this.promptData.ip_address);
      kioskData.append('mac_address', this.promptData.mac_address);
      kioskData.append('allow_booking', this.promptData.allowBooking ? 1 : 0);
      kioskData.append('collect_details', this.promptData.collectDetails ? 1 : 0);
      kioskData.append('require_internal_id', this.promptData.require_internal_id ? 1 : 0);
      kioskData.append('should_print', this.promptData.should_print ? 1 : 0);
      kioskData.append('show_keyboard', this.promptData.show_keyboard ? 1 : 0);
      kioskData.append('login_required', this.promptData.loginRequired ? 1 :0);
      kioskData.append('pseudo', this.promptData.pseudo);

      if(!this.defaultPrimary){
        kioskData.append('primary', this.promptData.primary);
      }
      else if (this.defaultPrimary){
        kioskData.append('primary', '');
      }
      if(!this.defaultSecondary){
        kioskData.append('secondary', this.promptData.secondary);
      }
      else if (this.defaultSecondary){
        kioskData.append('secondary', '');
      }
      if(!this.defaultSuccess){
        kioskData.append('success', this.promptData.success);
      }
      else if (this.defaultSuccess){
        kioskData.append('success', '');
      }
      if(!this.defaultDanger){
        kioskData.append('danger', this.promptData.danger);
      }
      else if (this.defaultDanger){
        kioskData.append('danger', '');
      }


      if(document.getElementById("fileInput").files[0]){
        kioskData.append('photo', document.getElementById("fileInput").files[0]);
      }
      kioskData.append('_method', 'PUT');

      kioskService.create(kioskData).then(function (data) {
          this.activePrompt = false;
          this.close();
          this.currentPage = 1;
          this.handleChangePage(this.currentPage);
          this.createKeyValue = data.key;
          this.createSecretValue = data.secret;
          this.createTokenValue = data.auto_auth_token;
        //   location.reload();
          this.createShowSecret = true;
        this.notify(this.$t('Toasts.Successful'), this.$t('Kiosk.AddKioskPrompt.ToastSuccess'), 'success');
      }.bind(this)).catch(function () {
        this.notify(this.$t('Toasts.Error'), this.$t('Kiosk.AddKioskPrompt.ToastFail'), 'danger');
      }.bind(this)).finally(function () {
        this.hideLoading();
      }.bind(this));
    },

    handleSearch(keyword) {
      if(keyword == ''){
          kioskService.getAll().then(function (data) {
          this.kiosks = data.kiosks.data;
          this.totalItems = data.kiosks.total;
          this.totalPages = data.kiosks.last_page;
          this.maxItems = data.kiosks.per_page;
        }.bind(this));
      }
        kioskService.filter(keyword).then(function (data) {
        this.kiosks = data.kiosks.data;
        this.totalItems = data.kiosks.total;
      }.bind(this));
    },
    handleChangePage(page) {
        kioskService.getPage(page).then(function (data) {
        this.kiosks = data.kiosks.data;
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
        kioskData.append('status', this.editPromptData.status);
        kioskData.append('ip_address', this.promptData.ip_address);
        kioskData.append('mac_address', this.promptData.mac_address);
        kioskData.append('deletePhoto', this.editPromptData.photoDelete);
        kioskData.append('allow_booking', this.editPromptData.allowBooking ? 1 : 0);
        kioskData.append('collect_details', this.editPromptData.collectDetails ? 1 : 0);
        kioskData.append('require_internal_id', this.editPromptData.require_internal_id ? 1 : 0);
        kioskData.append('should_print', this.editPromptData.should_print ? 1 : 0);
        kioskData.append('show_keyboard', this.editPromptData.show_keyboard ? 1 : 0);
        kioskData.append('login_required', this.editPromptData.loginRequired ? 1 : 0);
        kioskData.append('pseudo', this.editPromptData.pseudo);
        kioskData.append('primary', this.editPromptData.primary);
        kioskData.append('secondary', this.editPromptData.secondary);
        kioskData.append('success', this.editPromptData.success);
        kioskData.append('danger', this.editPromptData.danger);

        if(!this.defaultEditPrimary){
         kioskData.append('primary', this.editPromptData.primary);
        }
        else if (this.defaultEditPrimary){
          kioskData.append('primary', '');
        }
        if(!this.defaultEditSecondary){
          kioskData.append('secondary', this.editPromptData.secondary);
        }
        else if (this.defaultEditSecondary){
          kioskData.append('secondary', '');
        }
        if(!this.defaultEditSuccess){
          kioskData.append('success', this.editPromptData.success);
        }
        else if (this.defaultEditSuccess){
          kioskData.append('success', '');
        }
        if(!this.defaultEditDanger){
          kioskData.append('danger', this.editPromptData.danger);
        }
        else if (this.defaultEditDanger){
          kioskData.append('danger', '');
        }

        if(document.getElementById("editFileInput").files[0]){
          kioskData.append('photo', document.getElementById("editFileInput").files[0]);
        }
        kioskService.update(this.editPromptData.id, kioskData).then(function (data) {
          this.handleChangePage(this.currentPage);
          console.log(data);
          this.activeUpdatePrompt = false;
        this.notify(this.$t('Toasts.Successful'), this.$t('Kiosk.EditKioskPrompt.ToastSuccess'), 'success');
      }.bind(this)).catch(function () {
        this.notify(this.$t('Toasts.Error'), this.$t('Kiosk.EditKioskPrompt.ToastFail'), 'danger');
      }.bind(this)).finally(function () {
          this.hideLoading();
          this.close();
          location.reload();
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
        title: this.$t('Kiosk.ResetSecretPrompt.Title'),
        text: this.$t('Kiosk.ResetSecretPrompt.Text', {name: kiosk.name}),
        acceptText: this.$t('Toasts.AcceptButton'),
        cancelText: this.$t('Toasts.CancelButton'),
        accept: function () {
          this.showLoading();
          kioskService.resetPassword(kiosk.id).then(function (data) {
            this.handleChangePage(this.currentPage);
            this.createKeyValue = data.key;
            this.createSecretValue = data.secret;
            this.createTokenValue = data.auto_auth_token;
            this.createShowSecret = true;
            this.notify(this.$t('Toasts.Successful'), this.$t('Kiosk.ResetSecretPrompt.ToastSuccess'), 'success');
          }.bind(this)).catch(function () {
            this.notify(this.$t('Toasts.Error'), this.$t('Kiosk.ResetSecretPrompt.ToastFail'), 'danger');
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
        title: this.$t('Kiosk.DeleteKioskPrompt.Title'),
        text: this.$t('Kiosk.DeleteKioskPrompt.Text', {name: kiosk.name}),
        acceptText: this.$t('Toasts.AcceptButton'),
        cancelText: this.$t('Toasts.CancelButton'),
        accept: function () {
            this.showLoading();
            kioskService.delete(kiosk.id).then(function (data) {
            this.handleChangePage(this.currentPage);
            this.notify(this.$t('Toasts.Successful'), this.$t('Kiosk.DeleteKioskPrompt.ToastSuccess'), 'success');
          }.bind(this)).catch(function () {
            this.notify(this.$t('Toasts.Error'), this.$t('Kiosk.DeleteKioskPrompt.ToastFail'), 'danger');
          }.bind(this)).finally(function () {
              this.hideLoading();
            }.bind(this));
        }.bind(this)
      });
    },
    openEdit(selected){
      let kioskConfig = JSON.parse(selected.config);
      this.editPromptData.id = selected.id;
      this.editPromptData.name = selected.name;
      this.editPromptData.queues = [...kioskConfig.queues.toString().split(',')];
      this.editPromptData.theme = kioskConfig.theme;
      this.editPromptData.primary = kioskConfig.primary;
      this.editPromptData.secondary = kioskConfig.secondary;
      this.editPromptData.success = kioskConfig.success;
      this.editPromptData.danger = kioskConfig.danger;
      this.editPromptData.status = selected.status;
      this.editPromptData.allowBooking = selected.allow_booking;
      this.editPromptData.collectDetails = selected.collect_details;
      this.editPromptData.should_print = selected.should_print;
      this.editPromptData.photoUrl = kioskConfig.photo ? kioskConfig.photo : "";
      this.editPromptData.loginRequired = selected.login_required;
      this.editPromptData.pseudo = selected.pseudo;
      this.activeUpdatePrompt = true;

      if(!this.editPromptData.primary){
        this.defaultEditPrimary = true;
      }
      if(!this.editPromptData.secondary){
        this.defaultEditSecondary = true;
      }
      if(!this.editPromptData.success){
        this.defaultEditSuccess = true;
      }
      if(!this.editPromptData.danger){
        this.defaultEditDanger = true;
      }
      console.log(this.editPromptData)
    }
  },
  computed: {

  },
  mounted(){
      this.editPromptData = this.kiosk_data_edit;
            console.log(this.editPromptData)
            console.log(this.kiosk_data_edit);
    queueService.getAllWithSummary().then(function (data) {
      this.queues = data.queues.map(obj => {
        return obj.queue;
      });
    }.bind(this));
    
  }
};
</script>
