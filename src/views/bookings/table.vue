<template>
  <div>
    <vs-card>
      <vs-row>
        <vs-col vs-lg="6" vs-md="8" vs-sm="4" vs-xs="12">
          <vs-select
            :label="$t('Booking.DepartmentFilterPlaceholder')"
            v-if="departments.length>0"
            v-model="selectedDepartment"
            :placeholder="$t('Booking.DepartmentFilterPlaceholder')"
            class="w-100"
            @change="loadBookingsByRange"
          >
            <vs-select-item
              :key="index"
              :value="item.id"
              :text="item.name"
              v-for="(item,index) in departments"
            />
          </vs-select>
        </vs-col>
        <vs-col vs-lg="3" vs-md="4" vs-sm="6" vs-xs="12" class="d-flex align-items-center">
          <vs-input
            :label="$t('Time.From')"
            timezone="FR-fr"
            :max="endDate"
            type="date"
            class="w-100 mb-4"
            v-model="startDate"
            @change="loadBookingsByRange"
          />
        </vs-col>
        <vs-col vs-lg="3" vs-md="4" vs-sm="6" vs-xs="12" class="d-flex align-items-center">
          <vs-input
            :label="$t('Time.To')"
            timezone="FR-fr"
            :min="startDate"
            type="date"
            class="w-100 mb-4"
            v-model="endDate"
            @change="loadBookingsByRange"
          />
        </vs-col>
      </vs-row>
    </vs-card>
    <vs-row vs-justify="center" id="customers-box">
      <vs-col type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-xs="12">
        <vs-card>
          <!-- SHow Additiona Data prompt -->
                <vs-prompt
                    buttons-hidden="true"
                    color="warning"
                    @close="close"
                    @cancel="close"
                    :active.sync="activeShowAdditionalDataPrompt"
                    :title="$t('Booking.Table.AdditionalData')"
                    :cancel-text="$t('Forms.Booking.UpdatePrompt.CancelButton')"
                    >
                    <div v-bar class="vs-scrollable">
                        <div>
                            <div class="con-exemple-prompt">
                              <vs-input
                                disabled="true"
                                v-if="additionalData.lat"
                                :label="$t('Forms.Booking.Lat')"
                                v-model="additionalData.lat"
                                class="w-100 mb-4"
                              />
                              <vs-input
                                disabled="true"
                                v-if="additionalData.lng"
                                :label="$t('Forms.Booking.Lng')"
                                v-model="additionalData.lng"
                                class="w-100 mb-4"
                              />
                            </div> 
                            <div class="con-exemple-prompt" v-for="(item,index_inputs) in additionalData" :key="index_inputs"> 
                                <vs-input
                                  disabled="true"
                                  v-if="typeof item === 'object' && $i18n.locale == 'en'"
                                  :label="item.en"
                                  v-model="item.Data"
                                  class="w-100 mb-4"
                                />
                                <vs-input
                                  disabled="true"
                                  v-if="typeof item === 'object' && $i18n.locale == 'fr'"
                                  :label="item.fr"
                                  v-model="item.Data"
                                  class="w-100 mb-4"
                                />
                                <vs-input
                                  disabled="true"
                                  v-if="typeof item === 'object' && $i18n.locale == 'ar'"
                                  :label="item.ar"
                                  v-model="item.Data"
                                  class="w-100 mb-4"
                                />
                                <vs-input
                                  disabled="true" 
                                  v-if="typeof item === 'object' && $i18n.locale == 'ru'"
                                  :label="item.ru"
                                  v-model="item.Data"
                                  class="w-100 mb-4"
                                />
                            </div>
                        </div>
                    </div>
                </vs-prompt>
                <!-- END UPDATE BOOKING FIELD PROPMT -->
          <vs-table
            :sst="true"
            @selected="handleSelected"
            v-model="selected"
            :total="totalItems"
            max-items="10"
            :data="bookings"
          >
            <div slot="header"></div>
            <template slot="thead">
              <vs-th sort-key="contactname">{{$t('Booking.Table.Customer')}}</vs-th>
              <vs-th sort-key="phone">{{$t('Booking.Table.PhoneNumber')}}</vs-th>
              <vs-th sort-key="services">{{$t('Booking.Table.Services')}}</vs-th>
              <vs-th sort-key="startdate">{{$t('Booking.Table.StartDate')}}</vs-th>
              <vs-th sort-key="phone" v-if="have_multiple_member">{{$t('Booking.Table.BookedFor')}}</vs-th>
              <vs-th sort-key="additionaldata">{{$t('Booking.Table.AdditionalData')}}</vs-th>
            </template>

            <template slot-scope="{data}">
              <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                <vs-td :data="data[indextr].destination">
                  <div class="d-flex no-block align-items-center">{{ data[indextr].name }}</div>
                </vs-td>

                <vs-td :data="data[indextr].message">
                  <div class="d-flex align-items-center">{{ data[indextr].phoneNumber }}</div>
                </vs-td>

                <vs-td :data="data[indextr].created_at">
                  <div class="d-flex align-items-center">
                    <span class="text-muted">{{data[indextr].services}}</span>
                  </div>
                </vs-td>

                <vs-td :data="data[indextr].created_at">
                  <div class="d-flex align-items-center">
                    <span class="text-muted">{{data[indextr].date}}</span>
                  </div>
                </vs-td>

                <vs-td :data="data[indextr].member"  v-if="have_multiple_member">
                  <div class="d-flex align-items-center">
                    <span v-if="data[indextr].member!=null" class="text-muted">
                      <img class="booked-for-image" :src="data[indextr].member.photo!=null && data[indextr].member.photo!='' ? data[indextr].member.photo : require('@/assets/images/users/1.jpg')" alt="User"/>
                      {{ data[indextr].member.fname }} {{ data[indextr].member.lname }}
                    </span>
                    <span v-else class="text-muted">--</span>
                  </div>
                </vs-td>

                <vs-td>
                <div class="btn-alignment" v-if="data[indextr].additionalData">
                  <vs-button id="edit-service-button" radius color="success" type="border" icon="list" @click="ShowAdditionalDataPrompt(data[indextr].additionalData)"></vs-button>
                </div>
              </vs-td>
              </vs-tr>
            </template>
          </vs-table>
        </vs-card>
      </vs-col>
    </vs-row>
  </div>
</template>

<script>
import { bookingService, departmentService } from "../../_services";
import router from "../../_helpers/router";
// moment

export default {
  name: "Sms",
  data: () => ({
    selectedDepartment: -1,
    departments: [],
    title: "Sms",
    bookings: [],
    selected: {},
    allowance: 0,
    consumed: 0,
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    maxItems: 0,
    startDate: "",
    endDate: "",
    searchKeyword: "",
    additionalData : {},
    activeShowAdditionalDataPrompt: false,
    have_multiple_member: false
  }),
  methods: {
    notify(title, text, type) {
      this.$vs.notify({
        color: type,
        title: title,
        text: text,
      });
    },
    goToNextPage() {
      router.push({ path: "/kiosks?istour=on" });
    },
    showLoading() {
      this.$vs.loading({
        container: "#customers-box",
        scale: 0.6,
      });
    },

    hideLoading() {
      this.$vs.loading.close("#customers-box > .con-vs-loading");
    },
    handleSelected() {
      /* eslint-disable */
      console.log(this.selected);
    },
    loadBookingsByRange() {
      this.showLoading();
      let obj = {};
      if (this.startDate != "" && this.endDate != "") {
        if (this.selectedDepartment == -1) {
          obj = {
            start: this.startDate,
            end: this.endDate,
          };
        } else {
          obj = {
            start: this.startDate,
            end: this.endDate,
            department_id: this.selectedDepartment,
          };
        }
      } else {
        if (this.selectedDepartment != -1) {
          obj={
            department_id: this.selectedDepartment
          }
        }
        else
         obj=null;
      }
      if(obj){
        const self= this
        bookingService
        .range(obj)
        .then((data) => {
          this.bookings = [];
          console.log(data);
          data.bookings.forEach((obj) => {
            //CHECK IF THERE IS ANY MEMBER ID != NULL
            self.have_multiple_member= self.have_multiple_member || obj.member!=null ;

            this.bookings.push({
              name: obj.fname + " " + obj.lname,
              phoneNumber: obj.phone_number,
              services: obj.services_array
                .map((obj) => {
                  return obj.title;
                })
                .join(","),
              date: obj.start_datetime,
              additionalData : JSON.parse(obj.additionalData),
              member: obj.member
            });
          });
        })
        .finally(() => {
          this.hideLoading();
        });
      }
      
    },
    handleSearch(keyword) {
      /*this.showLoading();
                this.searchKeyword = keyword;
                if (keyword == '') {
                    customerService.getPage(1).then(function (data) {
                        this.contacts = data.customers.data;
                        this.totalItems = data.customers.total;
                        this.totalPages = data.customers.last_page;
                        this.maxItems = data.customers.per_page;
                    }.bind(this)).finally(function () {
                        this.hideLoading();
                    }.bind(this));
                }*/
    },
    handleChangePage(page) {
      // this.showLoading();
      // if(this.searchKeyword != ''){
      //     smsService.getPage(page).then(function (data) {
      //         this.transactions = data.transactions.data;
      //         this.totalItems = data.transactions.total;
      //         this.totalPages = data.transactions.last_page;
      //         this.maxItems = data.transactions.per_page;
      //     }.bind(this)).finally(function () {
      //         this.hideLoading();
      //     }.bind(this));
      // }
      // else{
      //     smsService.getPage(page).then(function (data) {
      //         this.transactions = data.transactions.data;
      //     }.bind(this)).finally(function () {
      //         this.hideLoading();
      //     }.bind(this));
      // }
    },
    handleSort(key, active) {
      /* eslint-disable */
    },
    formatDate: function (value) {
      let date = this.$moment(value).fromNow();
      return date;
    },
    ShowAdditionalDataPrompt(item){
      this.activeShowAdditionalDataPrompt = true;
      this.additionalData = item;
      console.log(item);
    },
    close(){

    }
  },
  mounted() {
    const self= this
    this.endDate = this.$moment().format("YYYY-MM-DD");
    this.startDate = this.$moment().format("YYYY-MM-DD");
    let obj = {
      start: this.startDate,
      end: this.endDate,
    };
    console.log(obj);
    bookingService.range(obj).then((data) => {
      console.log(data);
      data.bookings.forEach((obj) => {
        //CHECK IF THERE IS ANY MEMBER ID != NULL
        self.have_multiple_member= self.have_multiple_member || obj.member!=null ;

        this.bookings.push({
          name: obj.fname + " " + obj.lname,
          phoneNumber: obj.phone_number,
          services: obj.services_array
            .map((obj) => {
              return obj.title;
            })
            .join(","),
          date: obj.start_datetime,
          additionalData : JSON.parse(obj.additionalData),
          member: obj.member
        });
      });
    });
    departmentService.getAll().then(
      function (data) {
        this.departments.push({
          name: this.$t("Booking.DepartmentAllOption"),
          id: -1,
        });
        this.departments = this.departments.concat(data.departments);
      }.bind(this)
    );
  },
};
</script>
<style scoped>
  .booked-for-image{
    width: 40px;
    border-radius: 50px;
    margin-right: 10px;
  }
</style>