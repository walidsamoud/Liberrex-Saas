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
            <vs-button id="create-kiosks-button" icon="add" color="primary" @click="activePrompt = true">{{$t('Kiosk.AddKioskButton')}}</vs-button>
            <!---Add Kiosk --->
            <vs-prompt
                    color="primary"
                    @accept="acceptAlert"
                    @close="close"
                    @cancel="close"
                    :active.sync="activePrompt"
                    :title="$t('Kiosk.AddKioskPrompt.Title')"
                    :accept-text="$t('Kiosk.AddKioskPrompt.SubmitButton')"
                    :cancel-text="$t('Kiosk.AddKioskPrompt.CancelButton')"
            >
              <div>
                <div>
                  <div class="con-exemple-prompt px-4 py-3" style="height: 80vh;overflow-y: scroll !important;">

                    <vs-input
                            :danger="errors.name"
                            :danger-text="$t('Errors.InvalidPolite', {field: $t('Kiosk.AddKioskPrompt.Name')})"
                            :label="$t('Kiosk.AddKioskPrompt.Name')" v-model="promptData.name" class="w-100 mb-2" />
                    <vs-select
                            :danger="errors.queues"
                            :danger-text="$t('Errors.InvalidPolite', {field: $t('Kiosk.AddKioskPrompt.Queues')})"
                            :placeholder="$t('Kiosk.AddKioskPrompt.Queues')"
                            class="w-100 mb-2 mt-2"
                            :label="$t('Kiosk.AddKioskPrompt.Queues')"
                            autocomplete
                            multiple
                            v-model="promptData.queues"
                    >
                      <vs-select-item :key="index" :value="queue.id" :text="queue.title" v-for="(queue,index) in queues" />
                    </vs-select>
                    
                    <vs-row class="mb-2 mt-2">
                      <vs-col vs-w="6">
                        <vs-select style="width: 100%" class="mb-2 mt-2" :label="$t('Kiosk.AddKioskPrompt.Theme')" v-model="promptData.theme">
                          <vs-select-item
                                  :key="index"
                                  :value="item.value"
                                  :text="item.text"
                                  v-for="(item,index) in themes"
                          />
                        </vs-select>
                      </vs-col>

                      <vs-col vs-w="5">
                        <label class="vs-select--label mt-2">{{$t('Kiosk.AddKioskPrompt.Zoom')}}</label>
                        <vs-input-number style="margin: 0px 15px;" size="large" :max="100" :min="20" v-model="promptData.zoom" />
                      </vs-col>

                    </vs-row>
                    
                    <vs-row class="ml-2">
                      <label class="vs-input--label w-50 mb-2 mt-2" for="color-add-edit">{{$t('Kiosk.AddKioskPrompt.Colors.PrimaryDark')}}</label>
                      <vs-checkbox class="w-25 mb-2 mt-2" v-model="defaultPrimary">{{$t('Kiosk.AddKioskPrompt.Colors.Default')}}</vs-checkbox>
                      <input v-if="!defaultPrimary" v-model="promptData.primary" type="color" name="" value="" class="w-15 mb-2 mt-2"/>
                    </vs-row>

                    <vs-row class="ml-2">
                      <label class="vs-input--label mt-2 mb-2 w-50" for="color-add-edit">{{$t('Kiosk.AddKioskPrompt.Colors.PrimaryMedium')}}</label>
                      <vs-checkbox class="w-25 mb-2 mt-2" v-model="defaultSecondary">{{$t('Kiosk.AddKioskPrompt.Colors.Default')}}</vs-checkbox>
                      <input v-if="!defaultSecondary" v-model="promptData.secondary" type="color" name="" value="" class="w-15 mb-2 mt-2"/>
                    </vs-row> 

                    <vs-row class="ml-2">
                      <label class="vs-input--label mt-2 mb-2 w-50" for="color-add-edit">{{$t('Kiosk.AddKioskPrompt.Colors.PrimaryLight')}}</label>
                      <vs-checkbox class="w-25 mb-2 mt-2" v-model="defaultSuccess">{{$t('Kiosk.AddKioskPrompt.Colors.Default')}}</vs-checkbox>
                      <input v-if="!defaultSuccess" v-model="promptData.success" type="color" name="" value="" class="w-15 mb-2 mt-2"/>
                    </vs-row>

                    <vs-row class="ml-2">
                      <label class="vs-input--label mt-2 w-50" for="color-add-edit">{{$t('Kiosk.AddKioskPrompt.Colors.Secondary')}}</label>
                      <vs-checkbox class="w-25 mt-2" v-model="defaultDanger">{{$t('Kiosk.AddKioskPrompt.Colors.Default')}}</vs-checkbox>
                      <input v-if="!defaultDanger" v-model="promptData.danger" type="color" name="" value="" class="w-15 mt-2"/>
                    </vs-row>
                    
                    <vs-row class="ml-2">
                      <label class="vs-input--label w-50 mb-2 mt-2" for="color-add-edit">{{$t('Kiosk.AddKioskPrompt.Colors.Info')}}</label>
                      <vs-checkbox class="w-25 mb-2 mt-2" v-model="defaultInfo">{{$t('Kiosk.AddKioskPrompt.Colors.Default')}}</vs-checkbox>
                      <input v-if="!defaultInfo" v-model="promptData.info" type="color" name="" value="" class="w-15 mb-2 mt-2"/>
                    </vs-row>

                    <vs-input type="file" class="w-100 mb-2 mt-2" id="fileInput" :label="$t('Kiosk.AddKioskPrompt.Photo')" v-model="promptData.photo"/>
                    <vs-select class="w-100 mb-2 mt-2" :label="$t('Kiosk.AddKioskPrompt.Status')" v-model="promptData.status">
                      <vs-select-item :value="0" :text="$t('Kiosk.AddKioskPrompt.StatusInactive')"/>
                      <vs-select-item :value="1" :text="$t('Kiosk.AddKioskPrompt.StatusActive')"/>
                    </vs-select>
                    
                    <vs-checkbox class="justify-content-start w-100 mb-2 mt-2" v-model="promptData.printTicket" checked>
                      {{$t('Kiosk.AddKioskPrompt.PrintTicket')}}
                    </vs-checkbox>

                    <div class="ticket-sty" v-if="promptData.printTicket" style="border: 1px solid #888;padding: 10px;border-radius: 5px;">
                        <input type="radio" id="one" :value="'Long'" v-model="promptData.ticket_style">
                        <label for="one" style="margin-left: 10px;"> {{$t('Kiosk.AddKioskPrompt.LongTicket')}} </label>
                        <br>
                        <input type="radio" id="two" :value="'Short'" v-model="promptData.ticket_style">
                        <label for="two" style="margin-left: 10px;">  {{$t('Kiosk.AddKioskPrompt.ShortTicket')}}  </label>
                    </div>

                    <vs-checkbox class="justify-content-start w-100 mb-2 mt-2" v-model="promptData.smsTicket" checked>
                      {{$t('Kiosk.AddKioskPrompt.SMSTicket')}}
                    </vs-checkbox>

                    <vs-checkbox class="justify-content-start w-100 mb-2 mt-2" v-model="promptData.allowBooking">
                      {{$t('Kiosk.AddKioskPrompt.AllowBooking')}}
                    </vs-checkbox>

                    <vs-checkbox class="justify-content-start w-100 mb-2 mt-2" v-model="promptData.allowQueue">
                      {{$t('New.allowQueue')}}
                    </vs-checkbox>

                    <vs-checkbox class="justify-content-start w-100 mb-2 mt-2" v-model="promptData.collectDetails">
                      {{$t('Kiosk.AddKioskPrompt.CollectCustomerDetails')}}
                    </vs-checkbox>

                    <vs-checkbox class="justify-content-start w-100 mb-2 mt-2" v-model="promptData.require_internal_id">
                      {{$t('Kiosk.AddKioskPrompt.RequireInternalId')}}
                    </vs-checkbox>

                    <vs-checkbox class="justify-content-start w-100 mb-2 mt-2" v-model="promptData.should_print">
                      {{$t('Kiosk.AddKioskPrompt.ShouldPrint')}}
                    </vs-checkbox>

                    <vs-checkbox class="justify-content-start w-100 mb-2 mt-2" v-model="promptData.show_keyboard">
                      {{$t('Kiosk.AddKioskPrompt.ShowKeyboard')}}
                    </vs-checkbox>

                    <vs-checkbox class="justify-content-start w-100 mb-2 mt-2" v-model="promptData.loginRequired">
                      {{$t('Kiosk.AddKioskPrompt.GuestLogin')}}
                    </vs-checkbox>

                    <vs-checkbox class="justify-content-start w-100 mb-2 mt-2" v-model="promptData.multi_language">
                      Multi languages
                    </vs-checkbox>

                    <div class="ticket-sty" style="border: 1px solid #888;padding: 10px;border-radius: 5px;">
                      <b>Language par defaut: </b><br>
                        <input type="radio" id="onee" :value="'fr'" v-model="promptData.default_language">
                        <label for="onee" style="margin-left: 10px;"> Francais </label>
                        <br>
                        <input type="radio" id="twoo" :value="'en'" v-model="promptData.default_language">
                        <label for="twoo" style="margin-left: 10px;">  Anglais  </label>
                        <br>
                        <input type="radio" id="threee" :value="'ar'" v-model="promptData.default_language">
                        <label for="threee" style="margin-left: 10px;">  Arabe  </label>
                    </div>

                    <vs-select class="w-100 mb-2 mt-2" :label="$t('Kiosk.AddKioskPrompt.GuestPseudo')" v-model="promptData.pseudo" v-if="promptData.loginRequired == 0">
                      <vs-select-item :value="1" :text="$t('Kiosk.Pseudos.Customer')" />
                      <vs-select-item :value="2" :text="$t('Kiosk.Pseudos.Patient')" />
                      <vs-select-item :value="3" :text="$t('Kiosk.Pseudos.User')" />
                    </vs-select>

                    <vs-row>
                      <vs-col vs-w="6">
                        <vs-input :label="$t('Kiosk.AddKioskPrompt.IpAddress')" v-model="promptData.ip_address" class="w-100 mb-2" />
                      </vs-col>
                      <vs-col vs-w="6">
                        <vs-input :label="$t('Kiosk.AddKioskPrompt.MacAddress')" v-model="promptData.mac_address" class="w-100 mb-2" />
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
                    :title="$t('Kiosk.ShowSecretPrompt.Title')"
                    :cancel-text="$t('Kiosk.ShowSecretPrompt.CancelButton')"
                    buttonAccept="false"
            >
              <div>
                <div class="mb-4">
                  <h4 class="font-weight-light">{{$t('Kiosk.ShowSecretPrompt.Key')}}</h4>
                  <h3 class="mt-2">{{createKeyValue}}</h3>
                </div>

                <div class="mb-4">
                  <h4 class="font-weight-light">{{$t('Kiosk.ShowSecretPrompt.Secret')}}</h4>
                  <h3 class="mt-2 mb-2">{{createSecretValue}}</h3>
                  <span class="text-danger mt-2">{{$t('Kiosk.ShowSecretPrompt.SecretSave')}}</span>
                </div>

                <div class="mb-4">
                  <h4 class="font-weight-light">{{$t('Kiosk.ShowSecretPrompt.Token')}}</h4>
                  <vs-input v-model="createTokenValue" disabled class="w-100" />
                  <span class="text-danger mt-2">{{$t('Kiosk.ShowSecretPrompt.TokenSave')}}</span>
                </div>
              </div>
            </vs-prompt>

            <vs-prompt
                    color="warning"
                    @accept="updateService"
                    @close="close"
                    @cancel="close"
                    :active.sync="activeUpdatePrompt"
                    :title="$t('Kiosk.EditKioskPrompt.Title')"
                    :accept-text="$t('Kiosk.EditKioskPrompt.SubmitButton')"
                    :cancel-text="$t('Kiosk.EditKioskPrompt.CancelButton')"
            >
              <div >
                <div>
                  <div class="con-exemple-prompt px-4 py-3" style="height: 80vh;overflow-y: scroll !important;">

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

                    <vs-row class="mb-2 mt-2">
                      <vs-col vs-w="6">
                        <vs-select style="width: 100%" class="mb-2 mt-2" :label="$t('Kiosk.AddKioskPrompt.Theme')" v-model="editPromptData.theme">
                          <vs-select-item
                                  :key="index"
                                  :value="item.value"
                                  :text="item.text"
                                  v-for="(item,index) in themes"
                          />
                        </vs-select>
                      </vs-col>

                      <vs-col vs-w="5">
                        <label class="vs-select--label mt-2">{{$t('Kiosk.AddKioskPrompt.Zoom')}}</label>
                        <vs-input-number style="margin: 0px 15px;" size="large" :max="100" :min="20" v-model="editPromptData.zoom" />
                      </vs-col>

                    </vs-row>
                    
                    <vs-row class="ml-2">
                      <label class="vs-input--label mb-2 mt-2" for="color-add-edit" style="width: 50%">{{$t('Kiosk.AddKioskPrompt.Colors.PrimaryDark')}}</label>
                      <vs-checkbox class="mb-2 mt-2" style="width: 10%" v-model="defaultEditPrimary"></vs-checkbox>
                      <input v-if="!defaultEditPrimary" v-model="editPromptData.primary" type="color" style="width: 15%" class="mb-2 mt-2"/>
                    </vs-row>
                    <vs-row class="ml-2">
                      <label class="vs-input--label mt-2 mb-2" style="width: 50%" for="color-add-edit">{{$t('Kiosk.AddKioskPrompt.Colors.PrimaryMedium')}}</label>
                      <vs-checkbox class="mb-2 mt-2" style="width: 10%" v-model="defaultEditSecondary"></vs-checkbox>
                      <input v-if="!defaultEditSecondary" v-model="editPromptData.secondary" type="color" style="width: 15%" class="mb-2 mt-2"/>
                    </vs-row> 

                    <vs-row class="ml-2">
                      <label class="vs-input--label mt-2 mb-2 " for="color-add-edit" style="width: 50%">{{$t('Kiosk.AddKioskPrompt.Colors.PrimaryLight')}}</label>
                      <vs-checkbox class="mb-2 mt-2" style="width: 10%" v-model="defaultEditSuccess"></vs-checkbox>
                      <input v-if="!defaultEditSuccess" v-model="editPromptData.success" type="color" style="width: 15%" class="mb-2 mt-2"/>
                    </vs-row>
                    <vs-row class="ml-2">
                      <label class="vs-input--label mt-2 " for="color-add-edit" style="width: 50%">{{$t('Kiosk.AddKioskPrompt.Colors.Secondary')}}</label>
                      <vs-checkbox class="mb-2 mt-2" style="width: 10%" v-model="defaultEditDanger"></vs-checkbox>
                      <input v-if="!defaultEditDanger" v-model="editPromptData.danger" type="color" style="width: 15%" class="mt-2"/>
                    </vs-row>

                    <vs-row class="ml-2">
                      <label class="vs-input--label mb-2 mt-2" for="color-add-edit" style="width: 50%">{{$t('Kiosk.AddKioskPrompt.Colors.Info')}}</label>
                      <vs-checkbox class="mb-2 mt-2" style="width: 10%" v-model="defaultEditInfo"></vs-checkbox>
                      <input v-if="!defaultEditInfo" v-model="editPromptData.info" type="color" style="width: 15%" class="mb-2 mt-2"/>
                    
                      
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
                    

                    <vs-checkbox class="justify-content-start w-100 mb-2 mt-2" v-model="editPromptData.printTicket" >
                      {{$t('Kiosk.AddKioskPrompt.PrintTicket')}}
                    </vs-checkbox>

                    <div class="ticket-sty" v-if="editPromptData.printTicket" style="border: 1px solid #888;padding: 10px;border-radius: 5px;">
                        <input type="radio" id="one" :value="'Long'" v-model="editPromptData.ticket_style">
                        <label for="one" style="margin-left: 10px;"> {{$t('Kiosk.AddKioskPrompt.LongTicket')}} </label>
                        <br>
                        <input type="radio" id="two" :value="'Short'" v-model="editPromptData.ticket_style">
                        <label for="two" style="margin-left: 10px;">  {{$t('Kiosk.AddKioskPrompt.ShortTicket')}}  </label>
                    </div>

                    <vs-checkbox class="justify-content-start w-100 mb-2 mt-2" v-model="editPromptData.smsTicket" >
                      {{$t('Kiosk.AddKioskPrompt.SMSTicket')}}
                    </vs-checkbox>

                    <vs-checkbox class="justify-content-start w-100 mb-2 mt-2" v-model="editPromptData.allowBooking">
                      {{$t('Kiosk.AddKioskPrompt.AllowBooking')}}
                    </vs-checkbox>

                    <vs-checkbox class="justify-content-start w-100 mb-2 mt-2" v-model="editPromptData.allowQueue">
                      {{$t('New.allowQueue')}}
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

                    <vs-checkbox class="justify-content-start w-100 mb-2 mt-2" v-model="editPromptData.multi_language">
                      Multi languages
                    </vs-checkbox>

                    <div class="ticket-sty" style="border: 1px solid #888;padding: 10px;border-radius: 5px;">
                      <b>Language par defaut: </b><br>
                        <input type="radio" id="onee" :value="'fr'" v-model="editPromptData.default_language">
                        <label for="onee" style="margin-left: 10px;"> Francais </label>
                        <br>
                        <input type="radio" id="twoo" :value="'en'" v-model="editPromptData.default_language">
                        <label for="twoo" style="margin-left: 10px;">  Anglais  </label>
                        <br>
                        <input type="radio" id="threee" :value="'ar'" v-model="editPromptData.default_language">
                        <label for="threee" style="margin-left: 10px;">  Arabe  </label>
                    </div>

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
              </div>
            </vs-prompt>
          </div>
          <template slot="thead">
            <vs-th sort-key="name">{{$t('Kiosk.Table.Name')}}</vs-th>
            <vs-th sort-key="key">{{$t('Kiosk.Table.Key')}}</vs-th>
            <vs-th sort-key="status">{{$t('Kiosk.Table.Status')}}</vs-th>
            <vs-th sort-key="created_at">{{$t('Kiosk.Table.CreatedAt')}}</vs-th>
            <vs-th >{{$t('Kiosk.Table.Options')}}</vs-th>
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
                        {{$t('Kiosk.AddKioskPrompt.StatusInactive')}}
                    </vs-chip>

                    <vs-chip v-if="data[indextr].status == 1" color="success">
                        {{$t('Kiosk.AddKioskPrompt.StatusActive')}}
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
import { kioskService, queueService } from '../../_services'
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
    services: [],
    kiosks: [],
    industryServices: [],
    promptData: {multi_language: true, default_language: 'fr', name: '', photo: '', theme: 'liberrex', status: 1, printTicket: 1, smsTicket: 'Long', ticket_style: '1', allowBooking: 0, allowQueue: 1, collectDetails: 0, queues: [], ip_address: '',
      mac_address: '', require_internal_id: 0, should_print: 0, show_keyboard: 0,loginRequired : 0,pseudo : 0,primary : '',secondary : '', success : '', danger : '', zoom: 100, info : ''},
    editPromptData: {multi_language: '', default_language: '', id: -1, name: '', photo: '', photoUrl: '', photoDelete:false, theme: 'liberrex',
      status: 1,  printTicket: 0, smsTicket: 0, ticket_style: '', allowBooking: 0, allowQueue: 1, collectDetails: 0, queues: [], ip_address: '', mac_address: '',
      require_internal_id: 0, should_print: 0, show_keyboard: 0,loginRequired: 0 ,pseudo : 0,primary :'',secondary :'',success :'', danger :'', zoom: 100, info : ''},
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
    defaultInfo : true,
    defaultEditPrimary : false,
    defaultEditSecondary : false,
    defaultEditSuccess : false,
    defaultEditDanger : false ,
    defaultEditInfo : false 
  }),
  methods: {
    aze(){
      alert(this.promptData.ticket_style)
    },
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
      kioskData.append('allow_queue', this.promptData.allowQueue ? 1 : 0);
      kioskData.append('print_ticket', this.promptData.printTicket ? 1 : 0);
      kioskData.append('sms_ticket', this.promptData.smsTicket ? 1 : 0);
      kioskData.append('ticket_style', this.promptData.ticket_style);
      kioskData.append('collect_details', this.promptData.collectDetails ? 1 : 0);
      kioskData.append('require_internal_id', this.promptData.require_internal_id ? 1 : 0);
      kioskData.append('should_print', this.promptData.should_print ? 1 : 0);
      kioskData.append('show_keyboard', this.promptData.show_keyboard ? 1 : 0);
      kioskData.append('login_required', this.promptData.loginRequired ? 1 :0);
      kioskData.append('pseudo', this.promptData.pseudo);
      kioskData.append('zoom', this.promptData.zoom);
      kioskData.append('multi_language', this.promptData.multi_language);
      kioskData.append('default_language', this.promptData.default_language);

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
      if(!this.defaultInfo){
        kioskData.append('info', this.promptData.info);
      }
      else if (this.defaultInfo){
        kioskData.append('info', '');
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
          this.createShowSecret = true;
        this.notify(this.$t('Toasts.Successful'), this.$t('Kiosk.AddKioskPrompt.ToastSuccess'), 'success');
      }.bind(this)).catch(function () {
        this.notify(this.$t('Toasts.Error'), this.$t('Kiosk.AddKioskPrompt.ToastFail'), 'danger');
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
        kioskData.append('allow_queue', this.editPromptData.allowQueue ? 1 : 0);
        kioskData.append('print_ticket', this.editPromptData.printTicket ? 1 : 0);
        kioskData.append('sms_ticket', this.editPromptData.smsTicket ? 1 : 0);
        kioskData.append('ticket_style', this.editPromptData.ticket_style);
        kioskData.append('collect_details', this.editPromptData.collectDetails ? 1 : 0);
        kioskData.append('require_internal_id', this.editPromptData.require_internal_id ? 1 : 0);
        kioskData.append('should_print', this.editPromptData.should_print ? 1 : 0);
        kioskData.append('show_keyboard', this.editPromptData.show_keyboard ? 1 : 0);
        kioskData.append('login_required', this.editPromptData.loginRequired ? 1 : 0);
        kioskData.append('pseudo', this.editPromptData.pseudo);
        kioskData.append('primary', this.editPromptData.primary);
        kioskData.append('info', this.editPromptData.info);
        kioskData.append('secondary', this.editPromptData.secondary);
        kioskData.append('success', this.editPromptData.success);
        kioskData.append('danger', this.editPromptData.danger);
        kioskData.append('zoom', this.editPromptData.zoom);
        kioskData.append('multi_language', this.editPromptData.multi_language);
        kioskData.append('default_language', this.editPromptData.default_language);

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
        if(!this.defaultEditInfo){
         kioskData.append('info', this.editPromptData.info);
        }
        else if (this.defaultEditInfo){
          kioskData.append('info', '');
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
      this.editPromptData.zoom = kioskConfig.zoom ? kioskConfig.zoom : 100;
      this.editPromptData.primary = kioskConfig.primaryDark;
      this.editPromptData.info = kioskConfig.info;
      this.editPromptData.secondary = kioskConfig.primaryMedium;
      this.editPromptData.success = kioskConfig.primaryLight;
      this.editPromptData.danger = kioskConfig.secondary;
      this.editPromptData.default_language = (kioskConfig.default_language)?kioskConfig.default_language:'fr',
      this.editPromptData.multi_language = (kioskConfig.multi_language && kioskConfig.multi_language=='false')?false:true,
      this.editPromptData.status = selected.status;
      this.editPromptData.allowBooking = selected.allow_booking;
      this.editPromptData.allowQueue = selected.allow_queue;
      this.editPromptData.printTicket = selected.allow_print_ticket;
      this.editPromptData.smsTicket = selected.allow_sms_ticket;
      this.editPromptData.ticket_style = selected.ticket_style;
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
      if(!this.editPromptData.info){
        this.defaultEditInfo = true;
      }
      console.log(this.editPromptData)
    }
  },
  computed: {

  },
  mounted(){

    kioskService.getAll().then(function (data) {
      this.kiosks = data.kiosks.data;
      this.totalItems = data.kiosks.total;
      this.totalPages = data.kiosks.last_page;
      this.maxItems = data.kiosks.per_page;
    }.bind(this));

    queueService.getAllWithSummary().then(function (data) {
      this.queues = data.queues.map(obj => {
        return obj.queue;
      });
    }.bind(this));
    this.$t('Kiosk.Content').map((content,index)=> (
            this.steps[index].content = content
    ));
    this.$route.query.istour && localStorage.getItem('skipTour') !='true' ? this.$tours['KiosksA'].start() : '';
  }
};
</script>