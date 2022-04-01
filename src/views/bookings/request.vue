<template>
  <div>
      <!-- POPUP VIEW DETAILS -->
    <div class="centerx">
    
      <BookingRequestItem 
            @approve="requestApproved"
            @reject="requestRejected"
            :request="selected"
            :popupActive4="popupActive4"
            :departments="departments"
            :additionalData ="additionalData"
          ></BookingRequestItem>

  </div>
  <!-- END POPUP VIEW DETAILS -->
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
          <vs-table
            :sst="true"
            @selected="handleSelected"
            v-model="selected"
            :data="bookingsRequest"
          >
            <div slot="header"></div>
            <template slot="thead">
              <vs-th sort-key="contactname">{{$t('Booking.Table.Customer')}}</vs-th>
              <vs-th sort-key="joindate">{{$t('Booking.Table.PhoneNumber')}}</vs-th>
              <vs-th sort-key="phone">{{$t('Booking.Table.Services')}}</vs-th>
              <vs-th sort-key="phone">{{$t('Booking.Table.StartDate')}}</vs-th>
              <vs-th sort-key="phone" v-if="have_multiple_member">{{$t('Booking.Table.BookedFor')}}</vs-th>
              <vs-th sort-key="phone">{{$t('Booking.Table.SentAt')}}</vs-th>
            </template>

            <template slot-scope="{data}">
              <vs-tr :data="request" :key="indextr" v-for="(request, indextr) in data">
                <vs-td :data="data[indextr].destination">
                  <div class="d-flex no-block align-items-center">{{request.fname}} {{request.lname}}</div>
                </vs-td>

                <vs-td :data="data[indextr].message">
                  <div class="d-flex align-items-center"> {{request.phone_number}} </div>
                </vs-td>

                <vs-td :data="data[indextr].created_at">
                  <div class="d-flex align-items-center">
                    <span class="text-muted">{{request.service_names}}</span>
                  </div>
                </vs-td>

                <vs-td :data="data[indextr].created_at">
                  <div class="d-flex align-items-center">
                    <span class="text-muted">{{$moment(request.start_datetime).format('dddd, DD MMMM YYYY [at] HH:mm')}}</span>
                    
                        
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
                    <span class="ml-2">
                            <i class="mdi mdi-clock"></i> {{$moment(request.created_at).fromNow()}}
                        </span>
                </vs-td>
              </vs-tr>
            </template>
          </vs-table>
         <vs-pagination :total="totalPages" @change="handleChangePage" v-model="currentPage"></vs-pagination>
        </vs-card>
         
      </vs-col>
    </vs-row>
  </div>
</template>

<script>
import { departmentService, bookingRequestService } from "../../_services";
import BookingRequestItem from "../../components/booking/BookingRequestItem";
import router from "../../_helpers/router";
// moment

export default {
  name: "Sms",
  data: () => ({
    selected : {},
    selectedDepartment: -1,
    departments: [],
    title: "Sms",
    popupActive4:false,
    bookingsRequest: [],
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
    additionalInputs : {},
    have_multiple_member: false
  }),
  methods: {
    requestApproved() {
        this.popupActive4=false;
    },
    requestRejected() {
      this.popupActive4=false;
    },
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
      this.selected={
        data : this.selected,
        date : this.$moment(this.selected.start_datetime).format('YYYY-MM-DD'),
        time : this.$moment(this.selected.start_datetime).format('HH:mm')
      }
      if(this.selected.data.additionalData){
        this.additionalData = JSON.parse(this.selected.data.additionalData);
      }
      
      console.log(this.additionalInputs);
      console.log(this.selected);
      this.popupActive4=true;
    },
    loadBookingsByRange() {
      let obj= {};
      if (this.startDate != "" && this.endDate != "") {
        this.showLoading();
        if (this.selectedDepartment == -1) {
          obj = {
            start : this.startDate, end : this.endDate
          }
          
        }
        else
        {
          obj = {
            start : this.startDate, end : this.endDate , department_id : this.selectedDepartment
          }
        }
        bookingRequestService
            .filtre(obj)
            .then((data) => {
              this.bookingsRequest=data.requests.data;
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
      this.showLoading();
      bookingRequestService.getPage(page).then(data =>{
      console.log(data);
      this.bookingsRequest=data.requests.data;
      this.totalItems = data.requests.total;
      this.maxItems = data.requests.per_page;
      this.totalPages = data.requests.last_page;
        
    }).finally(()=>{
      this.hideLoading();
    });
      
    },
    handleSort(key, active) {
      /* eslint-disable */
    },
    formatDate: function (value) {
      let date = this.$moment(value).fromNow();
      return date;
    },
  },
  mounted() {
    
    this.showLoading();
    bookingRequestService.getAll().then(data =>{
        const self= this
        console.log(data);
        this.bookingsRequest=data.requests.data.map((obj)=>{
          //CHECK IF THERE IS ANY MEMBER ID != NULL
          self.have_multiple_member= self.have_multiple_member || obj.member!=null ;

          return obj;
        });
        this.totalItems = data.requests.total;
        this.maxItems = data.requests.per_page;
        this.totalPages = data.requests.last_page;
        console.log('bookingsRequest0');
    console.log(this.bookingsRequest);
    console.log('bookingsRequest1');
    }).finally(()=>{
      this.hideLoading();
    });
    departmentService.getAll().then(data => {
              this.departments.push({
                name: this.$t("Booking.DepartmentAllOption"),
                id: -1
              });
              this.departments = this.departments.concat(data.departments);
            }
    );
  },
  components: {
    
    BookingRequestItem,
    
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