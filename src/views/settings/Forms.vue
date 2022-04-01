<template>
    <vs-row vs-justify="center" id="Forms-box">
        <vs-col type="flex" vs-lg="6" vs-xs="12">
        <vs-card id="form" fixedHeight>
            <div slot="header">
                <vs-row>
                    <vs-col>
                        <h3>
                            {{$t('Forms.Booking.Title')}}
                        </h3>
                    </vs-col>
                    <vs-col v-if="bookingSettings.map == 1" vs-lg="3" vs-offset="4">
                        <vs-button class="w-100" id="map-active" icon="map" color="#808080" @click="hideMap">{{$t('Forms.Booking.HideMap')}}</vs-button>
                    </vs-col>
                    <vs-col v-if="bookingSettings.map == 0" vs-lg="3" vs-offset="4">
                        <vs-button class="w-100" id="map-active" icon="map" color="success" @click="showMap">{{$t('Forms.Booking.ShowMap')}}</vs-button>
                    </vs-col>
                    <vs-col vs-lg="5" >
                        <vs-button class="w-100" id="add-Booking-Field-form" icon="add" color="primary" @click="activeAddBookingFieldPrompt = true">{{$t('Forms.Booking.AddButton')}}</vs-button>
                    </vs-col>
                </vs-row>
            </div>
            
        <vs-table
            v-model="selected"
            :data="values">
            <div slot="header">
            <!-- Add booking field Button -->
                
                <!-- Add booking field prompt -->
                <vs-prompt
                    color="primary"
                    @accept="addBookingField"
                    @close="close"
                    @cancel="close"
                    :active.sync="activeAddBookingFieldPrompt"
                    :title="$t('Forms.Booking.CreatePrompt.Title')"
                    :accept-text="$t('Forms.Booking.CreatePrompt.SubmitButton')"
                    :cancel-text="$t('Forms.Booking.CreatePrompt.CancelButton')"
                    >
                    <div v-bar class="vs-scrollable">
                        <div>
                            <div class="con-exemple-prompt px-4 py-3">
                                <vs-input
                                    :label="$t('Forms.Booking.Name.En')"
                                    v-model="name.en"
                                    class="w-100 mb-4"
                                />
                                <vs-input
                                    :label="$t('Forms.Booking.Name.Fr')"
                                    v-model="name.fr"
                                    class="w-100 mb-4"
                                />
                                <vs-input
                                    :label="$t('Forms.Booking.Name.Ar')"
                                    v-model="name.ar"
                                    class="w-100 mb-4"
                                />
                                <vs-input
                                    :label="$t('Forms.Booking.Name.Ru')"
                                    v-model="name.ru"
                                    class="w-100 mb-4"
                                />
                                <vs-select
                                    :label="$t('Forms.Booking.Type')"
                                    v-model="type"
                                    class="w-100 mb-4"
                                >
                                    <vs-select-item :key="item" :value="item" :text="item" v-for="item in types" />
                                </vs-select>
                            </div>
                        </div>
                    </div>
                </vs-prompt>
                <!-- END ADD BOOKING FIELD PROPMT -->

                <!-- Update booking field prompt -->
                <vs-prompt
                    color="warning"
                    @accept="updateField(selected)"
                    @close="close"
                    @cancel="close"
                    :active.sync="activeUpdateBookingFieldPrompt"
                    :title="$t('Forms.Booking.UpdatePrompt.Title')"
                    :accept-text="$t('Forms.Booking.UpdatePrompt.SubmitButton')"
                    :cancel-text="$t('Forms.Booking.UpdatePrompt.CancelButton')"
                    >
                    <div v-bar class="vs-scrollable">
                        <div>
                            <div class="con-exemple-prompt px-4 py-3">
                                <vs-input
                                    :label="$t('Forms.Booking.Name.En')"
                                    v-model="selected.name.en"
                                    class="w-100 mb-4"
                                />
                                <vs-input
                                :label="$t('Forms.Booking.Name.Fr')"
                                v-model="selected.name.fr"
                                class="w-100 mb-4"
                                />
                                <vs-input
                                :label="$t('Forms.Booking.Name.Ar')"
                                v-model="selected.name.ar"
                                class="w-100 mb-4"
                                />
                                <vs-input
                                :label="$t('Forms.Booking.Name.Ru')"
                                v-model="selected.name.ru"
                                class="w-100 mb-4"
                                />
                                <vs-select
                                    :label="$t('Forms.Booking.Type')"
                                    v-model="selected.type"
                                    class="w-100 mb-4"
                                >
                                    <vs-select-item :key="item" :value="item" :text="item" v-for="item in types" />
                                </vs-select>
                            </div>
                        </div>
                    </div>
                </vs-prompt>
                <!-- END UPDATE BOOKING FIELD PROPMT -->
            </div>
            <template slot="thead">
                <vs-th sort-key="field">{{$t('Forms.Booking.Name.Name')}}</vs-th>
                <vs-th sort-key="type">{{$t('Forms.Booking.Type')}}</vs-th>
                <vs-th sort-key="options">{{$t('Forms.Booking.Options')}}</vs-th>
            </template>

          <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">

              <vs-td  v-if="$i18n.locale == 'fr'" :data="data[indextr].name.fr">
                <div class="d-flex align-items-center">
                  <h5 class="mb-0 font-12">{{data[indextr].name.fr}}</h5>
                </div>
              </vs-td>
              <vs-td  v-if="$i18n.locale == 'ar'" :data="data[indextr].name.ar">
                <div class="d-flex align-items-center">
                  <h5 class="mb-0 font-12">{{data[indextr].name.ar}}</h5>
                </div>
              </vs-td>
              <vs-td  v-if="$i18n.locale == 'ru'" :data="data[indextr].name.ru">
                <div class="d-flex align-items-center">
                  <h5 class="mb-0 font-12">{{data[indextr].name.ru}}</h5>
                </div>
              </vs-td>
              <vs-td  v-if="$i18n.locale == 'en'" :data="data[indextr].name.en">
                <div class="d-flex align-items-center">
                  <h5 class="mb-0 font-12">{{data[indextr].name.en}}</h5>
                </div>
              </vs-td>
              <vs-td  v-if="$i18n.locale == 'es'" :data="data[indextr].name.en">
                <div class="d-flex align-items-center">
                  <h5 class="mb-0 font-12">{{data[indextr].name.en}}</h5>
                </div>
              </vs-td>
              <vs-td  v-if="$i18n.locale == 'pt'" :data="data[indextr].name.en">
                <div class="d-flex align-items-center">
                  <h5 class="mb-0 font-12">{{data[indextr].name.en}}</h5>
                </div>
              </vs-td>
              <vs-td :data="data[indextr].type">
                <div class="d-flex align-items-center">
                  <h5 class="mb-0 font-12">{{data[indextr].type}}</h5>
                </div>
              </vs-td>

              <vs-td>
                <div class="btn-alignment">
                  <vs-button id="edit-service-button" radius color="warning" type="border" icon="edit" @click="updateInputPrompt(data[indextr],indextr)"></vs-button>
                  <vs-button radius color="danger" type="border" icon="delete" @click="deleteInput(data[indextr])"></vs-button>
                </div>
              </vs-td>

            </vs-tr>
          </template>
        </vs-table>
    </vs-card>
        </vs-col> 
    <vs-col type="flex" vs-lg="6" vs-xs="12">
        <vs-card>
            <div slot="header">
                <h3>
                    {{$t('Forms.Queue.Title')}}
                </h3>
            </div>
            <p></p>
        </vs-card>
    </vs-col> 
  </vs-row>
</template>

<script>
import { bookingSettingsService } from '../../_services';

export default {
name: "Forms",
data: () => ({
    selected : {
        name : {
            en : "",
            fr : "",
            ar : "",
            ru : ""
        },
        type : ""
    },
    selectedKey : 0,
    bookingSettings : {},
    inputs : {},
    values : {},
    name : {
        en : "",
        fr : "",
        ar : "",
        ru : ""
    },
    type : "",
    activeAddBookingFieldPrompt : false,
    activeUpdateBookingFieldPrompt : false,
    types : []
}),
methods: {
    notify(title, text, type) {
      this.$vs.notify({
        color: type,
        title: title,
        text: text
      });
    },
    showLoading(){
      this.$vs.loading({
        container: '#Forms-box',
        scale: 0.6
      });
    },
    hideLoading(){
      this.$vs.loading.close('#Forms-box > .con-vs-loading')
    },
    updateSettings(){
        this.showLoading();
        let updatedBookingSettings = {
            map : this.bookingSettings.map ? 1 : 0,
            input : JSON.stringify(this.inputs)
        }
        bookingSettingsService.updateSettings(updatedBookingSettings).then(function(data) {
            console.log(data);
            this.bookingSettings = data.BookingSettings;
            this.inputs = JSON.parse(this.bookingSettings.input);
            this.values = Object.values(this.inputs);
            this.notify(this.$t('Toasts.Successful'), this.$t('Forms.Booking.UpdateForm.ToastSuccess'), 'success');
        }.bind(this)).catch(function () {
            this.notify(this.$t('Toasts.Error'), this.$t('Forms.Booking.UpdateForm.ToastFail'), 'danger');
        }.bind(this)).finally(() => {
            this.hideLoading();
        })
    },
    deleteInput(index){
        this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: this.$t('Forms.Booking.DeletePrompt.Title'),
        text: this.$t('Forms.Booking.DeletePrompt.Text', {name: index.name.en}),
        acceptText: this.$t('Forms.Booking.DeletePrompt.SubmitButton'),
        cancelText: this.$t('Forms.Booking.DeletePrompt.CancelButton'),
        accept: function () {
          this.showLoading();
          Object.keys(this.inputs).forEach(function(key){
            if(this.inputs[key]==index)
                delete this.inputs[key];
            }.bind(this));
        let updatedBookingSettings = {
            map : this.bookingSettings.map ? 1 : 0,
            input : JSON.stringify(this.inputs)
        }
        bookingSettingsService.updateSettings(updatedBookingSettings).then(function(data) {
            console.log(data);
            this.bookingSettings = data.BookingSettings;
            this.inputs = JSON.parse(this.bookingSettings.input);
            this.values = Object.values(this.inputs);
            this.notify(this.$t('Toasts.Successful'), this.$t('Forms.Booking.DeleteForm.ToastSuccess'), 'success');
        }.bind(this)).catch(function () {
            this.notify(this.$t('Toasts.Error'), this.$t('Forms.Booking.DeleteForm.ToastFail'), 'danger');
        }.bind(this)).finally(() => {
            this.hideLoading();
        })
        }.bind(this)
      });
    },
    updateField(a){
        this.showLoading();
        let updatedField = {
            "name" : {
                "en" : this.selected.name.en,
                "fr" : this.selected.name.fr,
                "ar" : this.selected.name.ar,
                "ru" : this.selected.name.ru
            },
            "type" : this.selected.type
        }
        this.inputs[this.selectedKey] = updatedField;
        console.log(this.inputs)
        let updatedBookingSettings = {
            map : this.bookingSettings.map ? 1 : 0,
            input : JSON.stringify(this.inputs)
        }
        bookingSettingsService.updateSettings(updatedBookingSettings).then(function(data) {
            console.log(data);
            this.bookingSettings = data.BookingSettings;
            this.inputs = JSON.parse(this.bookingSettings.input);
            this.values = Object.values(this.inputs);
            this.notify(this.$t('Toasts.Successful'), this.$t('Forms.Booking.UpdateForm.ToastSuccess'), 'success');
        }.bind(this)).catch(function () {
            this.notify(this.$t('Toasts.Error'), this.$t('Forms.Booking.UpdateForm.ToastFail'), 'danger');
        }.bind(this)).finally(() => {
            this.hideLoading();
        })
    },
    addBookingField(){
        this.showLoading();
        let newField = {
            "name" : {
                "en" : this.name.en,
                "fr" : this.name.fr,
                "ar" : this.name.ar,
                "ru" : this.name.ru
            },
            "type" : this.type
        }
        if(this.inputs != null){
            this.inputs[Object.keys(this.inputs).length] = newField;
        }
        else {
            this.inputs = {};
            this.inputs[Object.keys(this.inputs).length] = newField;
        }
        let updatedBookingSettings = {
            map : this.bookingSettings.map ? 1 : 0,
            input : JSON.stringify(this.inputs)
        }
        bookingSettingsService.updateSettings(updatedBookingSettings).then(function(data) {
            console.log(data);
            this.bookingSettings = data.BookingSettings;
            this.inputs = JSON.parse(this.bookingSettings.input);
            this.values = Object.values(this.inputs);
            this.notify(this.$t('Toasts.Successful'), this.$t('Forms.Booking.CreateForm.ToastSuccess'), 'success');
        }.bind(this)).catch(function () {
            this.notify(this.$t('Toasts.Error'), this.$t('Forms.Booking.CreateForm.ToastFail'), 'danger');
        }.bind(this)).finally(() => {
            this.hideLoading();
        })
    },
    updateInputPrompt(item,index){
        console.log(index);
        this.selectedKey = index;
        this.selected = item;
        this.activeUpdateBookingFieldPrompt = true;
    },
    close(){
        this.name = "";
        this.type = "";
    },
    hideMap(){
        this.showLoading()
        let updatedBookingSettings = {}
        if(this.inputs != null){
             updatedBookingSettings = {
                map : 0,
                input : JSON.stringify(this.inputs)
            }
        }
        else {
             updatedBookingSettings = {
                map : 0,
                input : null
            }
        }
        
        bookingSettingsService.updateSettings(updatedBookingSettings).then(function(data) {
            console.log(data);
            this.bookingSettings = data.BookingSettings;
            if(this.inputs){
                this.inputs = JSON.parse(this.bookingSettings.input);
            }            
            this.values = Object.values(this.inputs);
            this.notify(this.$t('Toasts.Successful'), this.$t('Forms.Booking.ToastSuccess'), 'success');
        }.bind(this)).catch(function () {
            this.notify(this.$t('Toasts.Error'), this.$t('Forms.Booking.ToastFail'), 'danger');
        }.bind(this)).finally(() => {
            this.hideLoading()
        })
    },
    showMap(){
        this.showLoading()
        let updatedBookingSettings = {}
        if(this.inputs != null){
            updatedBookingSettings = {
                map : 1,
                input : JSON.stringify(this.inputs)
            }
        }
        else {
            updatedBookingSettings = {
                map : 1,
                input : null
            }
        }
        bookingSettingsService.updateSettings(updatedBookingSettings).then(function(data) {
            console.log(data);
            this.bookingSettings = data.BookingSettings;
            if(this.inputs){
                this.inputs = JSON.parse(this.bookingSettings.input);
            }
            
            this.values = Object.values(this.inputs);
            this.notify(this.$t('Toasts.Successful'), this.$t('Forms.Booking.ToastSuccess'), 'success');
        }.bind(this)).catch(function () {
            this.notify(this.$t('Toasts.Error'), this.$t('Forms.Booking.ToastFail'), 'danger');
        }.bind(this)).finally(() => {
            this.hideLoading();
        })
    }
},
mounted(){
    this.showLoading();
    this.types = ["text","number"];
    bookingSettingsService.getSettings().then(function (data) {
        
        this.bookingSettings = data.BookingSettings;
        console.log(this.bookingSettings);
        this.inputs = JSON.parse(this.bookingSettings.input);
        if(this.inputs){
            this.values = Object.values(this.inputs);
        }
        
    }.bind(this)).finally(() => {
        this.hideLoading();
    })
}
}
</script>

<style>

</style>