<template>
  <div>
    <vs-row>
      <vs-col vs-w="4">
        <vs-card>
          <div class="d-flex align-items-center">
            <div class="mr-2">
              <span>{{$t('SMS.Allowance')}}</span>
              <h4>{{allowance}}</h4>
            </div>
            <div class="ml-auto">
              <div>
                <i class="mdi mdi-email h1 text-primary"></i>
              </div>
            </div>
          </div>
        </vs-card>
      </vs-col>
      <vs-col vs-w="4">
        <vs-card>
          <div class="d-flex align-items-center">
            <div class="mr-2">
              <span>{{$t('SMS.Consumed')}}</span>
              <h4>{{consumed}}</h4>
            </div>
            <div class="ml-auto">
              <div>
                <i class="mdi mdi-send h1 text-danger"></i>
              </div>
            </div>
          </div>
        </vs-card>
      </vs-col>
      <vs-col vs-w="4">
        <vs-card>
          <div class="d-flex align-items-center">
            <div class="mr-2">
              <span>{{$t('SMS.Balance')}}</span>
              <h4>{{allowance == 0 ? allowance : (allowance - consumed)}}</h4>
            </div>
            <div class="ml-auto">
              <div>
                <i class="mdi mdi-cart h1 text-success"></i>
              </div>
            </div>
          </div>
        </vs-card>
      </vs-col>
    </vs-row>

    <vs-row vs-justify="center" id="customers-box">
      <vs-col type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-xs="12">
        <vs-card>
          <vs-tabs>
            <vs-tab :label="$t('SMS.History')" icon="history">
              <vs-table
                class="mt-2"
                :sst="true"
                @selected="handleSelected"
                v-model="selected"
                :total="totalItems"
                max-items="10"
                :data="transactions"
              >
                <div slot="header"></div>
                <template slot="thead">
                  <vs-th sort-key="contactname">{{$t('SMS.Table.Destination')}}</vs-th>
                  <vs-th sort-key="joindate">{{$t('SMS.Table.Message')}}</vs-th>
                  <vs-th sort-key="phone">{{$t('SMS.Table.SentAt')}}</vs-th>
                </template>

                <template slot-scope="{data}">
                  <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td :data="data[indextr].destination">
                      <div
                        class="d-flex no-block align-items-center"
                      >{{ data[indextr].destination }}</div>
                    </vs-td>

                    <vs-td :data="data[indextr].message">
                      <div class="d-flex align-items-center">{{ data[indextr].message }}</div>
                    </vs-td>

                    <vs-td :data="data[indextr].created_at">
                      <div class="d-flex align-items-center">
                        <span class="text-muted">{{data[indextr].created_at}}</span>
                      </div>
                    </vs-td>
                  </vs-tr>
                </template>
              </vs-table>
              <vs-pagination :total="totalPages" @change="handleChangePage" v-model="currentPage"></vs-pagination>
            </vs-tab>
            <vs-tab :label="$t('SMS.Settings')" icon="settings" class="tab2">
              <vs-row class="mt-4">
                <vs-col vs-w="12" class="mb-4">
                  <h3>{{$t('SMS.Language')}}</h3>
                </vs-col>

                <vs-col vs-w="12">
                  <span class="d-flex mb-2">
                    <vs-select  autocomplete class="selectExample" v-model="settings.language">
                      <vs-select-item
                        :key="index"
                        :value="item"
                        :text="$t('Languages.'+item)"
                        v-for="(item,index) in smsLanguageList"
                      />
                    </vs-select>
                  </span>
                </vs-col>
                <vs-col vs-w="12" class="mb-4 mt-4">
                  <h3>{{$t('SMS.Queue')}}</h3>
                </vs-col>

                <vs-col vs-w="12">
                  <span class="d-flex mb-2">
                    <vs-switch
                      id="queue_ticket_created"
                      color="success"
                      v-model="settings.queue_ticket_created"
                      class="mr-4"
                    />
                    <label
                      for="queue_ticket_created"
                      class="mt-0"
                    >{{$t('SMS.QUEUE_TICKET_CREATED')}}</label>
                  </span>
                  <div class="sms_text" v-if="settings.queue_ticket_created">
                    <div class="variables">
                      Les variables que vous pouvez utiliser sont :<br>
                      <b>::business</b> => Votre nom<br>
                      <b>::ticket</b> => Numéro du ticket<br>
                      <b>::waiting</b> => Temps d'attente estimé<br>
                      <b>::url</b> => URL de suivi du ticket<br>
                      <b>::arrive_at</b> => L'heure de venir
                    </div>
                    <div class="input">
                      <label for="">Francais: </label>
                      <input type="text" placeholder="Sms francais" v-model="sms_contents.queue_ticket_created.fr">
                    </div>
                    <div class="input">
                      <label for="">English: </label>
                      <input type="text" placeholder="Sms Anglais" v-model="sms_contents.queue_ticket_created.en">
                    </div>
                    <div class="input">
                      <label for="">Arabic: </label>
                      <input type="text" placeholder="Sms Arabe" v-model="sms_contents.queue_ticket_created.ar">
                    </div>
                    <hr>
                  </div>
                </vs-col>

                <vs-col vs-w="12">
                  <span class="d-flex mb-2">
                    <vs-switch
                      id="queue_ticket_updated"
                      color="success"
                      v-model="settings.queue_ticket_updated"
                      class="mr-4"
                    />
                    <label
                      for="queue_ticket_updated"
                      class="mt-0"
                    >{{$t('SMS.QUEUE_TICKET_UPDATED')}}</label>
                  </span>
                  <div class="sms_text" v-if="settings.queue_ticket_updated">
                    <div class="input">
                      <label for="">Francais: </label>
                      <input type="text" placeholder="Sms francais" v-model="sms_contents.queue_ticket_updated.fr">
                    </div>
                    <div class="input">
                      <label for="">English: </label>
                      <input type="text" placeholder="Sms Anglais" v-model="sms_contents.queue_ticket_updated.en">
                    </div>
                    <div class="input">
                      <label for="">Arabic: </label>
                      <input type="text" placeholder="Sms Arabe" v-model="sms_contents.queue_ticket_updated.ar">
                    </div>
                    <hr>
                  </div>
                </vs-col>

                <vs-col vs-w="12">
                  <span class="d-flex mb-2">
                    <vs-switch
                      id="queue_ticket_redirected"
                      color="success"
                      v-model="settings.queue_ticket_redirected"
                      class="mr-4"
                    />
                    <label
                      for="queue_ticket_redirected"
                      class="mt-0"
                    >{{$t('SMS.QUEUE_TICKET_REDIRECTED')}}</label>
                  </span>
                  <div class="sms_text" v-if="settings.queue_ticket_redirected">
                    <div class="input">
                      <label for="">Francais: </label>
                      <input type="text" placeholder="Sms francais" v-model="sms_contents.queue_ticket_redirected.fr">
                    </div>
                    <div class="input">
                      <label for="">English: </label>
                      <input type="text" placeholder="Sms Anglais" v-model="sms_contents.queue_ticket_redirected.en">
                    </div>
                    <div class="input">
                      <label for="">Arabic: </label>
                      <input type="text" placeholder="Sms Arabe" v-model="sms_contents.queue_ticket_redirected.ar">
                    </div>
                    <hr>
                  </div>
                </vs-col>

                <vs-col vs-w="12">
                  <span class="d-flex mb-2">
                    <vs-switch
                      id="queue_ticket_canceled"
                      color="success"
                      v-model="settings.queue_ticket_canceled"
                      class="mr-4"
                    />
                    <label
                      for="queue_ticket_canceled"
                      class="mt-0"
                    >{{$t('SMS.QUEUE_TICKET_CANCELED')}}</label>
                  </span>
                  <div class="sms_text" v-if="settings.queue_ticket_canceled">
                    <div class="variables">
                      Les variables que vous pouvez utiliser sont :<br>
                      <b>::url</b> => URL pour collecter les avis
                    </div>
                    <div class="input">
                      <label for="">Francais: </label>
                      <input type="text" placeholder="Sms francais" v-model="sms_contents.queue_ticket_canceled.fr">
                    </div>
                    <div class="input">
                      <label for="">English: </label>
                      <input type="text" placeholder="Sms Anglais" v-model="sms_contents.queue_ticket_canceled.en">
                    </div>
                    <div class="input">
                      <label for="">Arabic: </label>
                      <input type="text" placeholder="Sms Arabe" v-model="sms_contents.queue_ticket_canceled.ar">
                    </div>
                    <hr>
                  </div>
                </vs-col>

               

                <vs-col vs-w="12">
                  <span class="d-flex mb-2">
                    <vs-switch
                      id="queue_get_ready"
                      color="success"
                      v-model="settings.queue_get_ready"
                      class="mr-4"
                    />
                    <label for="queue_get_ready" class="mt-0">{{$t('SMS.QUEUE_GET_READY')}}</label>
                  </span>
                  <div class="sms_text" v-if="settings.queue_get_ready">
                    <div class="input">
                      <label for="">Francais: </label>
                      <input type="text" placeholder="Sms francais" v-model="sms_contents.queue_get_ready.fr">
                    </div>
                    <div class="input">
                      <label for="">English: </label>
                      <input type="text" placeholder="Sms Anglais" v-model="sms_contents.queue_get_ready.en">
                    </div>
                    <div class="input">
                      <label for="">Arabic: </label>
                      <input type="text" placeholder="Sms Arabe" v-model="sms_contents.queue_get_ready.t">
                    </div>
                    <hr>
                  </div>
                </vs-col>

                <vs-col vs-w="12">
                  <span class="d-flex mb-2">
                    <vs-switch
                      id="queue_call_next"
                      color="success"
                      v-model="settings.queue_call_next"
                      class="mr-4"
                    />
                    <label for="queue_call_next" class="mt-0">{{$t('SMS.QUEUE_CALL_NEXT')}}</label>
                  </span>
                  <div class="sms_text" v-if="settings.queue_call_next">
                    <div class="input">
                      <label for="">Francais: </label>
                      <input type="text" placeholder="Sms francais" v-model="sms_contents.queue_call_next.fr">
                    </div>
                    <div class="input">
                      <label for="">English: </label>
                      <input type="text" placeholder="Sms Anglais" v-model="sms_contents.queue_call_next.en">
                    </div>
                    <div class="input">
                      <label for="">Arabic: </label>
                      <input type="text" placeholder="Sms Arabe" v-model="sms_contents.queue_call_next.at">
                    </div>
                    <hr>
                  </div>
                </vs-col>

                <vs-col vs-w="12">
                  <span class="d-flex mb-2">
                    <vs-switch
                      id="queue_feedback"
                      color="success"
                      v-model="settings.queue_feedback"
                      class="mr-4"
                    />
                    <label for="queue_feedback" class="mt-0">{{$t('SMS.QUEUE_FEEDBACK')}}</label>
                  </span>
                  <div class="sms_text" v-if="settings.queue_feedback">
                    <div class="variables">
                      Les variables que vous pouvez utiliser sont :<br>
                      <b>::url</b> => URL pour collecter les avis
                    </div>
                    <div class="input">
                      <label for="">Francais: </label>
                      <input type="text" placeholder="Sms francais" v-model="sms_contents.queue_feedback.fr">
                    </div>
                    <div class="input">
                      <label for="">English: </label>
                      <input type="text" placeholder="Sms Anglais" v-model="sms_contents.queue_feedback.en">
                    </div>
                    <div class="input">
                      <label for="">Arabic: </label>
                      <input type="text" placeholder="Sms Arabe" v-model="sms_contents.queue_feedback.ar">
                    </div>
                    <hr>
                  </div>
                </vs-col>

                 <vs-col vs-w="12">
                  <span class="d-flex mb-2">
                    <vs-switch
                      id="delay_created"
                      color="success"
                      v-model="settings.delay_created"
                      class="mr-4"
                    />
                    <label
                      for="delay_created"
                      class="mt-0"
                    >{{$t('SMS.delay_created')}}</label>
                  </span>
                  <div class="sms_text" v-if="settings.delay_created">
                    <div class="variables">
                      Les variables que vous pouvez utiliser sont :<br>
                      <b>::delay</b> => Le temps de retard ajouté
                    </div>
                    <div class="input">
                      <label for="">Francais: </label>
                      <input type="text" placeholder="Sms francais" v-model="sms_contents.delay_created.fr">
                    </div>
                    <div class="input">
                      <label for="">English: </label>
                      <input type="text" placeholder="Sms Anglais" v-model="sms_contents.delay_created.en">
                    </div>
                    <div class="input">
                      <label for="">Arabic: </label>
                      <input type="text" placeholder="Sms Arabe" v-model="sms_contents.delay_created.ar">
                    </div>
                    <hr>
                  </div>
                </vs-col>

                <vs-col vs-w="12" class="mb-4 mt-4">
                  <h3>{{ $t('SMS.Booking') }}</h3>
                </vs-col>

                <vs-col vs-w="12">
                  <span class="d-flex mb-2">
                    <vs-switch
                      id="booking_created"
                      color="success"
                      v-model="settings.booking_created"
                      class="mr-4"
                    />
                    <label for="booking_created" class="mt-0">{{$t('SMS.BOOKING_CREATED')}}</label>
                  </span>
                  <div class="sms_text" v-if="settings.booking_created">
                    <div class="variables">
                      Les variables que vous pouvez utiliser sont :<br>
                      <b>::date</b> => Date de rendez-vous<br>
                      <b>::business</b> => Votre localisation
                    </div>
                    <div class="input">
                      <label for="">Francais: </label>
                      <input type="text" placeholder="Sms francais" v-model="sms_contents.booking_created.fr">
                    </div>
                    <div class="input">
                      <label for="">English: </label>
                      <input type="text" placeholder="Sms Anglais" v-model="sms_contents.booking_created.en">
                    </div>
                    <div class="input">
                      <label for="">Arabic: </label>
                      <input type="text" placeholder="Sms Arabe" v-model="sms_contents.booking_created.at">
                    </div>
                    <hr>
                  </div>
                </vs-col>

                <vs-col vs-w="12">
                  <span class="d-flex mb-2">
                    <vs-switch
                      id="booking_updated"
                      color="success"
                      v-model="settings.booking_updated"
                      class="mr-4"
                    />
                    <label for="booking_updated" class="mt-0">{{$t('SMS.BOOKING_UPDATED')}}</label>
                  </span>
                  <div class="sms_text" v-if="settings.booking_updated">
                    <div class="variables">
                      Les variables que vous pouvez utiliser sont :<br>
                      <b>::date</b> => Date de rendez-vous<br>
                    </div>
                    <div class="input">
                      <label for="">Francais: </label>
                      <input type="text" placeholder="Sms francais" v-model="sms_contents.booking_updated.fr">
                    </div>
                    <div class="input">
                      <label for="">English: </label>
                      <input type="text" placeholder="Sms Anglais" v-model="sms_contents.booking_updated.en">
                    </div>
                    <div class="input">
                      <label for="">Arabic: </label>
                      <input type="text" placeholder="Sms Arabe" v-model="sms_contents.booking_updated.ar">
                    </div>
                    <hr>
                  </div>
                </vs-col>

                <vs-col vs-w="12">
                  <span class="d-flex mb-2">
                    <vs-switch
                      id="booking_canceled"
                      color="success"
                      v-model="settings.booking_canceled"
                      class="mr-4"
                    />
                    <label for="booking_canceled" class="mt-0">{{$t('SMS.BOOKING_CANCELED')}}</label>
                  </span>
                  <div class="sms_text" v-if="settings.booking_canceled">
                    <div class="input">
                      <label for="">Francais: </label>
                      <input type="text" placeholder="Sms francais" v-model="sms_contents.booking_canceled.fr">
                    </div>
                    <div class="input">
                      <label for="">English: </label>
                      <input type="text" placeholder="Sms Anglais" v-model="sms_contents.booking_canceled.en">
                    </div>
                    <div class="input">
                      <label for="">Arabic: </label>
                      <input type="text" placeholder="Sms Arabe" v-model="sms_contents.booking_canceled.ar">
                    </div>
                    <hr>
                  </div>
                </vs-col>

                <vs-col vs-w="12">
                  <span class="d-flex mb-2">
                    <vs-switch
                      id="booking_reminder_7_days"
                      color="success"
                      v-model="settings.booking_reminder_7_days"
                      class="mr-4"
                    />
                    <label
                      for="booking_reminder_7_days"
                      class="mt-0"
                    >{{$t('SMS.BOOKING_REMINDER_7_DAYS')}}</label>
                  </span>
                  <div class="sms_text" v-if="settings.booking_reminder_7_days">
                    <div class="variables">
                      Les variables que vous pouvez utiliser sont :<br>
                      <b>::date</b> => Date de rendez-vous<br>
                    </div>
                    <div class="input">
                      <label for="">Francais: </label>
                      <input type="text" placeholder="Sms francais" v-model="sms_contents.booking_reminder_7_days.fr">
                    </div>
                    <div class="input">
                      <label for="">English: </label>
                      <input type="text" placeholder="Sms Anglais" v-model="sms_contents.booking_reminder_7_days.en">
                    </div>
                    <div class="input">
                      <label for="">Arabic: </label>
                      <input type="text" placeholder="Sms Arabe" v-model="sms_contents.booking_reminder_7_days.ar">
                    </div>
                    <hr>
                  </div>
                </vs-col>

                <vs-col vs-w="12">
                  <span class="d-flex mb-2">
                    <vs-switch
                      id="booking_reminder_48_hours"
                      color="success"
                      v-model="settings.booking_reminder_48_hours"
                      class="mr-4"
                    />
                    <label
                      for="booking_reminder_48_hours"
                      class="mt-0"
                    >{{$t('SMS.BOOKING_REMINDER_48_HOURS')}}</label>
                  </span>
                  <div class="sms_text" v-if="settings.booking_reminder_48_hours">
                    <div class="variables">
                      Les variables que vous pouvez utiliser sont :<br>
                      <b>::date</b> => Date de rendez-vous<br>
                    </div>
                    <div class="input">
                      <label for="">Francais: </label>
                      <input type="text" placeholder="Sms francais" v-model="sms_contents.booking_reminder_48_hours.fr">
                    </div>
                    <div class="input">
                      <label for="">English: </label>
                      <input type="text" placeholder="Sms Anglais" v-model="sms_contents.booking_reminder_48_hours.en">
                    </div>
                    <div class="input">
                      <label for="">Arabic: </label>
                      <input type="text" placeholder="Sms Arabe" v-model="sms_contents.booking_reminder_48_hours.ar">
                    </div>
                    <hr>
                  </div>
                </vs-col>

                <vs-col vs-w="12">
                  <span class="d-flex mb-2">
                    <vs-switch
                      id="booking_reminder_24_hours"
                      color="success"
                      v-model="settings.booking_reminder_24_hours"
                      class="mr-4"
                    />
                    <label
                      for="booking_reminder_24_hours"
                      class="mt-0"
                    >{{$t('SMS.BOOKING_REMINDER_24_HOURS')}}</label>
                  </span>
                  <div class="sms_text" v-if="settings.booking_reminder_24_hours">
                    <div class="variables">
                      Les variables que vous pouvez utiliser sont :<br>
                      <b>::date</b> => Date de rendez-vous<br>
                    </div>
                    <div class="input">
                      <label for="">Francais: </label>
                      <input type="text" placeholder="Sms francais" v-model="sms_contents.booking_reminder_24_hours.fr">
                    </div>
                    <div class="input">
                      <label for="">English: </label>
                      <input type="text" placeholder="Sms Anglais" v-model="sms_contents.booking_reminder_24_hours.en">
                    </div>
                    <div class="input">
                      <label for="">Arabic: </label>
                      <input type="text" placeholder="Sms Arabe" v-model="sms_contents.booking_reminder_24_hours.ar">
                    </div>
                    <hr>
                  </div>
                </vs-col>

                <vs-col vs-w="12">
                  <vs-button color="primary" type="filled" @click="updateSmsSettings">
                    <i class="mdi mdi-content-save"></i>
                    {{$t('SMS.SaveButton')}}
                  </vs-button>
                </vs-col>
              </vs-row>
            </vs-tab>


            <vs-tab :label="'Contenu des SMS'" icon="edit" class="tab3">
              <vs-row class="mt-4">

                <vs-col vs-w="12" class="mb-4 mt-4">
                  <h3>{{$t('SMS.Queue')}}</h3>
                </vs-col>

                <vs-col vs-w="4">
                  <span class="d-flex mb-2">
                    <label
                      class="mt-0"
                      style="font-size: 13px;"
                    >{{$t('SMS.QUEUE_TICKET_CREATED')}}</label>
                  </span>
                  <div class="sms_text">
                    <div class="variables">
                      Les variables que vous pouvez utiliser sont :<br>
                      <b>::business</b> => Votre nom<br>
                      <b>::ticket</b> => Numéro du ticket<br>
                      <b>::waiting_hours</b> => Heures d'attente estimé<br>
                      <b>::waiting_minutes</b> => Minutes d'attente estimé<br>
                      <b>::url</b> => URL de suivi du ticket<br>
                      <b>::arrive_at</b> => L'heure de venir
                    </div>
                    <div class="input">
                      <label for="">Francais: </label>
                      <textarea type="text" placeholder="Sms francais" v-model="sms_contents.queue_ticket_created.fr">
                        </textarea>
                    </div>
                    <div class="input">
                      <label for="">English: </label>
                      <textarea type="text" placeholder="Sms Anglais" v-model="sms_contents.queue_ticket_created.en">
                        </textarea>
                    </div>
                    <div class="input">
                      <label for="">Arabic: </label>
                      <textarea type="text" placeholder="Sms Arabe" v-model="sms_contents.queue_ticket_created.ar">
                        </textarea>
                    </div>
                    <hr>
                  </div>
                </vs-col>

                <vs-col vs-w="4">
                  <span class="d-flex mb-2">
                    <label
                      class="mt-0"
                      style="font-size: 13px;"
                    >{{$t('SMS.QUEUE_TICKET_UPDATED')}}</label>
                  </span>
                  <div class="sms_text">
                    <div class="input">
                      <label for="">Francais: </label>
                      <textarea type="text" placeholder="Sms francais" v-model="sms_contents.queue_ticket_updated.fr">
                        </textarea>
                    </div>
                    <div class="input">
                      <label for="">English: </label>
                      <textarea type="text" placeholder="Sms Anglais" v-model="sms_contents.queue_ticket_updated.en">
                        </textarea>
                    </div>
                    <div class="input">
                      <label for="">Arabic: </label>
                      <textarea type="text" placeholder="Sms Arabe" v-model="sms_contents.queue_ticket_updated.ar">
                        </textarea>
                    </div>
                    <hr>
                  </div>
                </vs-col>

                <vs-col vs-w="4">
                  <span class="d-flex mb-2">
                    <label
                      class="mt-0"
                      style="font-size: 13px;"
                    >{{$t('SMS.QUEUE_TICKET_REDIRECTED')}}</label>
                  </span>
                  <div class="sms_text">
                    <div class="input">
                      <label for="">Francais: </label>
                      <textarea type="text" placeholder="Sms francais" v-model="sms_contents.queue_ticket_redirected.fr">
                        </textarea>
                    </div>
                    <div class="input">
                      <label for="">English: </label>
                      <textarea type="text" placeholder="Sms Anglais" v-model="sms_contents.queue_ticket_redirected.en">
                        </textarea>
                    </div>
                    <div class="input">
                      <label for="">Arabic: </label>
                      <textarea type="text" placeholder="Sms Arabe" v-model="sms_contents.queue_ticket_redirected.ar">
                        </textarea>
                    </div>
                    <hr>
                  </div>
                </vs-col>

                <vs-col vs-w="4">
                  <span class="d-flex mb-2">
                    <label
                      class="mt-0"
                      style="font-size: 13px;"
                    >{{$t('SMS.QUEUE_TICKET_CANCELED')}}</label>
                  </span>
                  <div class="sms_text">
                    <div class="variables">
                      Les variables que vous pouvez utiliser sont :<br>
                      <b>::url</b> => URL pour collecter les avis
                    </div>
                    <div class="input">
                      <label for="">Francais: </label>
                      <textarea type="text" placeholder="Sms francais" v-model="sms_contents.queue_ticket_canceled.fr">
                        </textarea>
                    </div>
                    <div class="input">
                      <label for="">English: </label>
                      <textarea type="text" placeholder="Sms Anglais" v-model="sms_contents.queue_ticket_canceled.en">
                        </textarea>
                    </div>
                    <div class="input">
                      <label for="">Arabic: </label>
                      <textarea type="text" placeholder="Sms Arabe" v-model="sms_contents.queue_ticket_canceled.ar">
                        </textarea>
                    </div>
                    <hr>
                  </div>
                </vs-col>

               

                <vs-col vs-w="4">
                  <span class="d-flex mb-2">
                    <label
                      class="mt-0"
                      style="font-size: 13px;"
                    >{{$t('SMS.QUEUE_GET_READY')}}</label>
                  </span>
                  <div class="sms_text">
                    <div class="input">
                      <label for="">Francais: </label>
                      <textarea type="text" placeholder="Sms francais" v-model="sms_contents.queue_get_ready.fr">
                        </textarea>
                    </div>
                    <div class="input">
                      <label for="">English: </label>
                      <textarea type="text" placeholder="Sms Anglais" v-model="sms_contents.queue_get_ready.en">
                        </textarea>
                    </div>
                    <div class="input">
                      <label for="">Arabic: </label>
                      <textarea type="text" placeholder="Sms Arabe" v-model="sms_contents.queue_get_ready.t">
                        </textarea>
                    </div>
                    <hr>
                  </div>
                </vs-col>

                <vs-col vs-w="4">
                  <span class="d-flex mb-2">
                    <label
                      class="mt-0"
                      style="font-size: 13px;"
                    >{{$t('SMS.QUEUE_CALL_NEXT')}}</label>
                  </span>
                  <div class="sms_text">
                    <div class="input">
                      <label for="">Francais: </label>
                      <textarea type="text" placeholder="Sms francais" v-model="sms_contents.queue_call_next.fr">
                        </textarea>
                    </div>
                    <div class="input">
                      <label for="">English: </label>
                      <textarea type="text" placeholder="Sms Anglais" v-model="sms_contents.queue_call_next.en">
                        </textarea>
                    </div>
                    <div class="input">
                      <label for="">Arabic: </label>
                      <textarea type="text" placeholder="Sms Arabe" v-model="sms_contents.queue_call_next.at">
                        </textarea>
                    </div>
                    <hr>
                  </div>
                </vs-col>

                <vs-col vs-w="4">
                  <span class="d-flex mb-2">
                    <label
                      class="mt-0"
                      style="font-size: 13px;"
                    >{{$t('SMS.QUEUE_FEEDBACK')}}</label>
                  </span>
                  <div class="sms_text">
                    <div class="variables">
                      Les variables que vous pouvez utiliser sont :<br>
                      <b>::url</b> => URL pour collecter les avis
                    </div>
                    <div class="input">
                      <label for="">Francais: </label>
                      <textarea type="text" placeholder="Sms francais" v-model="sms_contents.queue_feedback.fr">
                        </textarea>
                    </div>
                    <div class="input">
                      <label for="">English: </label>
                      <textarea type="text" placeholder="Sms Anglais" v-model="sms_contents.queue_feedback.en">
                        </textarea>
                    </div>
                    <div class="input">
                      <label for="">Arabic: </label>
                      <textarea type="text" placeholder="Sms Arabe" v-model="sms_contents.queue_feedback.ar">
                        </textarea>
                    </div>
                    <hr>
                  </div>
                </vs-col>

                 <vs-col vs-w="4">
                  <span class="d-flex mb-2">
                    <label
                      class="mt-0"
                      style="font-size: 13px;"
                    >{{$t('SMS.delay_created')}}</label>
                  </span>
                  <div class="sms_text">
                    <div class="variables">
                      Les variables que vous pouvez utiliser sont :<br>
                      <b>::delay</b> => Le temps de retard ajouté
                    </div>
                    <div class="input">
                      <label for="">Francais: </label>
                      <textarea type="text" placeholder="Sms francais" v-model="sms_contents.delay_created.fr">
                        </textarea>
                    </div>
                    <div class="input">
                      <label for="">English: </label>
                      <textarea type="text" placeholder="Sms Anglais" v-model="sms_contents.delay_created.en">
                        </textarea>
                    </div>
                    <div class="input">
                      <label for="">Arabic: </label>
                      <textarea type="text" placeholder="Sms Arabe" v-model="sms_contents.delay_created.ar">
                        </textarea>
                    </div>
                    <hr>
                  </div>
                </vs-col>

                <vs-col vs-w="12" class="mb-4 mt-4">
                  <h3>{{ $t('SMS.Booking') }}</h3>
                </vs-col>

                <vs-col vs-w="4">
                  <span class="d-flex mb-2">
                    <label
                      class="mt-0"
                      style="font-size: 13px;"
                    >{{$t('SMS.BOOKING_CREATED')}}</label>
                  </span>
                  <div class="sms_text">
                    <div class="variables">
                      Les variables que vous pouvez utiliser sont :<br>
                      <b>::date</b> => Date de rendez-vous<br>
                      <b>::business</b> => Votre localisation
                    </div>
                    <div class="input">
                      <label for="">Francais: </label>
                      <textarea type="text" placeholder="Sms francais" v-model="sms_contents.booking_created.fr">
                        </textarea>
                    </div>
                    <div class="input">
                      <label for="">English: </label>
                      <textarea type="text" placeholder="Sms Anglais" v-model="sms_contents.booking_created.en">
                        </textarea>
                    </div>
                    <div class="input">
                      <label for="">Arabic: </label>
                      <textarea type="text" placeholder="Sms Arabe" v-model="sms_contents.booking_created.at">
                        </textarea>
                    </div>
                    <hr>
                  </div>
                </vs-col>

                <vs-col vs-w="4">
                  <span class="d-flex mb-2">
                    <label
                      class="mt-0"
                      style="font-size: 13px;"
                    >{{$t('SMS.BOOKING_UPDATED')}}</label>
                  </span>
                  <div class="sms_text">
                    <div class="variables">
                      Les variables que vous pouvez utiliser sont :<br>
                      <b>::date</b> => Date de rendez-vous<br>
                    </div>
                    <div class="input">
                      <label for="">Francais: </label>
                      <textarea type="text" placeholder="Sms francais" v-model="sms_contents.booking_updated.fr">
                        </textarea>
                    </div>
                    <div class="input">
                      <label for="">English: </label>
                      <textarea type="text" placeholder="Sms Anglais" v-model="sms_contents.booking_updated.en">
                        </textarea>
                    </div>
                    <div class="input">
                      <label for="">Arabic: </label>
                      <textarea type="text" placeholder="Sms Arabe" v-model="sms_contents.booking_updated.ar">
                        </textarea>
                    </div>
                    <hr>
                  </div>
                </vs-col>

                <vs-col vs-w="4">
                  <span class="d-flex mb-2">
                    <label
                      class="mt-0"
                      style="font-size: 13px;"
                    >{{$t('SMS.BOOKING_CANCELED')}}</label>
                  </span>
                  <div class="sms_text">
                    <div class="input">
                      <label for="">Francais: </label>
                      <textarea type="text" placeholder="Sms francais" v-model="sms_contents.booking_canceled.fr">
                        </textarea>
                    </div>
                    <div class="input">
                      <label for="">English: </label>
                      <textarea type="text" placeholder="Sms Anglais" v-model="sms_contents.booking_canceled.en">
                        </textarea>
                    </div>
                    <div class="input">
                      <label for="">Arabic: </label>
                      <textarea type="text" placeholder="Sms Arabe" v-model="sms_contents.booking_canceled.ar">
                        </textarea>
                    </div>
                    <hr>
                  </div>
                </vs-col>

                <vs-col vs-w="4">
                  <span class="d-flex mb-2">
                    <label
                      class="mt-0"
                      style="font-size: 13px;"
                    >{{$t('SMS.BOOKING_REMINDER_7_DAYS')}}</label>
                  </span>
                  <div class="sms_text">
                    <div class="variables">
                      Les variables que vous pouvez utiliser sont :<br>
                      <b>::date</b> => Date de rendez-vous<br>
                    </div>
                    <div class="input">
                      <label for="">Francais: </label>
                      <textarea type="text" placeholder="Sms francais" v-model="sms_contents.booking_reminder_7_days.fr">
                        </textarea>
                    </div>
                    <div class="input">
                      <label for="">English: </label>
                      <textarea type="text" placeholder="Sms Anglais" v-model="sms_contents.booking_reminder_7_days.en">
                        </textarea>
                    </div>
                    <div class="input">
                      <label for="">Arabic: </label>
                      <textarea type="text" placeholder="Sms Arabe" v-model="sms_contents.booking_reminder_7_days.ar">
                        </textarea>
                    </div>
                    <hr>
                  </div>
                </vs-col>

                <vs-col vs-w="4">
                  <span class="d-flex mb-2">
                    <label
                      class="mt-0"
                      style="font-size: 13px;"
                    >{{$t('SMS.BOOKING_REMINDER_48_HOURS')}}</label>
                  </span>
                  <div class="sms_text">
                    <div class="variables">
                      Les variables que vous pouvez utiliser sont :<br>
                      <b>::date</b> => Date de rendez-vous<br>
                    </div>
                    <div class="input">
                      <label for="">Francais: </label>
                      <textarea type="text" placeholder="Sms francais" v-model="sms_contents.booking_reminder_48_hours.fr">
                        </textarea>
                    </div>
                    <div class="input">
                      <label for="">English: </label>
                      <textarea type="text" placeholder="Sms Anglais" v-model="sms_contents.booking_reminder_48_hours.en">
                        </textarea>
                    </div>
                    <div class="input">
                      <label for="">Arabic: </label>
                      <textarea type="text" placeholder="Sms Arabe" v-model="sms_contents.booking_reminder_48_hours.ar">
                        </textarea>
                    </div>
                    <hr>
                  </div>
                </vs-col>

                <vs-col vs-w="4">
                  <span class="d-flex mb-2">
                    <label
                      class="mt-0"
                      style="font-size: 13px;"
                    >{{$t('SMS.BOOKING_REMINDER_24_HOURS')}}</label>
                  </span>
                  <div class="sms_text">
                    <div class="variables">
                      Les variables que vous pouvez utiliser sont :<br>
                      <b>::date</b> => Date de rendez-vous<br>
                    </div>
                    <div class="input">
                      <label for="">Francais: </label>
                      <textarea type="text" placeholder="Sms francais" v-model="sms_contents.booking_reminder_24_hours.fr">
                        </textarea>
                    </div>
                    <div class="input">
                      <label for="">English: </label>
                      <textarea type="text" placeholder="Sms Anglais" v-model="sms_contents.booking_reminder_24_hours.en">
                        </textarea>
                    </div>
                    <div class="input">
                      <label for="">Arabic: </label>
                      <textarea type="text" placeholder="Sms Arabe" v-model="sms_contents.booking_reminder_24_hours.ar">
                        </textarea>
                    </div>
                    <hr>
                  </div>
                </vs-col>

                <vs-col vs-w="12">
                  <vs-button color="primary" type="filled" @click="updateSmsSettings">
                    <i class="mdi mdi-content-save"></i>
                    {{$t('SMS.SaveButton')}}
                  </vs-button>
                </vs-col>
              </vs-row>
            </vs-tab>
          </vs-tabs>
        </vs-card>
      </vs-col>
    </vs-row>
  </div>
</template>

<script>
import { smsService } from "../../_services";
import router from "../../_helpers/router";
// moment

export default {
  name: "Sms",
  data: () => ({
    sms_contents: {
      //QUEUE
      queue_ticket_created: {
        ar: '',
        fr: '',
        en: ''
      },
      queue_ticket_updated: {
        ar: '',
        fr: '',
        en: ''
      },
      queue_ticket_redirected: {
        ar: '',
        fr: '',
        en: ''
      },
      queue_ticket_canceled: {
        ar: '',
        fr: '',
        en: ''
      },
      queue_get_ready: {
        ar: '',
        fr: '',
        en: ''
      },
      queue_call_next: {
        ar: '',
        fr: '',
        en: ''
      },
      queue_feedback: {
        ar: '',
        fr: '',
        en: ''
      },
      delay_created: {
        ar: '',
        fr: '',
        en: ''
      },
      //BOOKING
      booking_created: {
        ar: '',
        fr: '',
        en: ''
      },
      booking_updated: {
        ar: '',
        fr: '',
        en: ''
      },
      booking_canceled: {
        ar: '',
        fr: '',
        en: ''
      },
      booking_reminder_7_days: {
        ar: '',
        fr: '',
        en: ''
      },
      booking_reminder_48_hours: {
        ar: '',
        fr: '',
        en: ''
      },
      booking_reminder_24_hours: {
        ar: '',
        fr: '',
        en: ''
      },
    },
    selectedSmaLanguage : "",
    smsLanguageList: [],
    title: "Sms",
    transactions: [],
    selected: {},
    allowance: 0,
    consumed: 0,
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    maxItems: 0,
    searchKeyword: "",
    settings: {
      //LANGUAGE
      language : 1,
      // QUEUE
      queue_ticket_created: 0,
      queue_ticket_updated: 0,
      queue_ticket_redirected: 0,
      queue_ticket_canceled: 0,
      queue_get_ready: 0,
      queue_call_next: 0,
      queue_feedback: 0,
      delay_created: 0,
      // BOOKING
      booking_created: 0,
      booking_updated: 0,
      booking_canceled: 0,
      booking_reminder_7_days: 0,
      booking_reminder_48_hours: 0,
      booking_reminder_24_hours: 0,
    },
  }),
  methods: {
    notify(title, text, type) {
      this.$vs.notify({
        color: type,
        title: title,
        text: text,
      });
    },
    showLoading() {
      this.$vs.loading({
        container: "#customers-box",
        scale: 0.6,
      });
    },

    goToNextPage() {
      router.push({ path: "/kiosks?istour=on" });
    },
    hideLoading() {
      this.$vs.loading.close("#customers-box > .con-vs-loading");
    },
    handleSelected() {
      /* eslint-disable */
      console.log(this.selected);
    },

    handleSearch(keyword) {
      this.showLoading();
      this.searchKeyword = keyword;
      if (keyword == "") {
        customerService
          .getPage(1)
          .then(
            function (data) {
              this.contacts = data.customers.data;
              this.totalItems = data.customers.total;
              this.totalPages = data.customers.last_page;
              this.maxItems = data.customers.per_page;
            }.bind(this)
          )
          .finally(
            function () {
              this.hideLoading();
            }.bind(this)
          );
      }
      customerService
        .search(keyword, 1)
        .then(
          function (data) {
            this.contacts = data.customers.data;
            this.totalItems = data.customers.total;
            this.totalPages = data.customers.last_page;
            this.maxItems = data.customers.per_page;
          }.bind(this)
        )
        .finally(
          function () {
            this.hideLoading();
          }.bind(this)
        );
    },
    handleChangePage(page) {
      this.showLoading();
      if (this.searchKeyword != "") {
        smsService
          .getPage(page)
          .then(
            function (data) {
              this.transactions = data.transactions.data;
              this.totalItems = data.transactions.total;
              this.totalPages = data.transactions.last_page;
              this.maxItems = data.transactions.per_page;
            }.bind(this)
          )
          .finally(
            function () {
              this.hideLoading();
            }.bind(this)
          );
      } else {
        smsService
          .getPage(page)
          .then(
            function (data) {
              this.transactions = data.transactions.data;
            }.bind(this)
          )
          .finally(
            function () {
              this.hideLoading();
            }.bind(this)
          );
      }
    },
    handleSort(key, active) {
      /* eslint-disable */
      console.log({ key, active });
    },
    formatDate: function (value) {
      let date = this.$moment(value).fromNow();
      return date;
    },
    updateSmsSettings() {
      this.showLoading();
      console.log(this.settings);
      this.settings.sms_contents= this.sms_contents;
      smsService
        .updateSettings(this.settings)
        .then(
          function () {
            this.notify(
              this.$t("Toasts.Successful"),
              this.$t("SMS.SettingUpdate.ToastSuccess"),
              "success"
            );
          }.bind(this)
        )
        .catch(
          function () {
            this.notify(
              this.$t("Toasts.Error"),
              this.$t("SMS.SettingUpdate.ToastFail"),
              "danger"
            );
          }.bind(this)
        )
        .finally(
          function () {
            this.hideLoading();
          }.bind(this)
        );
    },
  },
  mounted() {
    smsService.getPage(1).then(
      function (data) {
        this.transactions = data.transactions.data;
        this.allowance = data.allowance;
        this.consumed = data.consumed;
        this.totalItems = data.transactions.total;
        this.maxItems = data.transactions.per_page;
        this.totalPages = data.transactions.last_page;
      }.bind(this)
    );
    smsService.getSettings().then(
      function (data) {
        this.settings = data.settings;
        if(data.settings.sms_contents){
          this.sms_contents = JSON.parse(data.settings.sms_contents);
        }
      }.bind(this)
    );
    this.smsLanguageList = this.$i18n.availableLocales;
  },
};
</script>

<style scoped>
.sms_text{
  width: 300px;
}
.sms_text label{
  display: block;
}
.input{
  width: 100%;
}
.sms_text input, .sms_text textarea{
  width: 100%;
  border: 1px solid #999;
  border-radius: 5px;
  padding: 5px;
  margin-bottom: 10px;
}
.variables{
  border: 1px solid #ddd;
  padding: 5px 10px;
  background: #ddd;
  border-radius: 5px;
  margin-bottom: 10px;
}

.tab3 hr{
  display: none;
}
.tab3 .vs-col{
  display: inline-block;
  padding: 10px;
  border: 10px solid #fff;
  background: #eeeeee83;
  border-radius: 25px;
  width: 100%;
}

.tab3 .vs-col span:first-child{
  background: #008fc9;
  padding: 5px 10px 0 10px;
  color: #fff;
  border-radius: 5px;
}
/* .tab3 .vs-col span label:first-child{
  background: red;
} */
.tab2 .sms_text{
  display: none;
}

.sms_text{
  width: 100%;
}
</style>