<template>
  <div id="booking-box" v-if="request.data">
    <div class="centerx">
     
    </div>
    <vs-prompt
      color="success"
      @accept="approve"
      @cancel="reject"
      @close="reset"
      :active.sync="popupActive4"
      :title="$t('Menu.Bookings.Request')"
      :accept-text="$t('Components.Booking.RequestItem.Approve.Title')"
      :cancel-text="$t('Components.Booking.RequestItem.Decline.Title')"
    >
      <div class="scrollable">
        
          <vs-row>
            <vs-col
              type="flex"
              vs-justify="center"
              vs-align="center"
              vs-lg="12"
              vs-xs="12"
              vs-sm="12"
            >
              <h3 class="card-title mb-0">{{request.data.fname}} {{request.data.lname}}</h3>
              <div class="mt-3 pt-3">
                <address class="mb-0">
                  <i class="mdi mdi-email"></i>
                  {{request.data.email}}
                  <br />
                  <i class="mdi mdi-cellphone-iphone mr-2"></i>
                  {{request.data.phone_number}}
                  <br />
                  {{request.data.service_names}}
                </address>
              </div>
            </vs-col>
          </vs-row>
          <vs-row class="mt-2" v-if="request.data.member!=null">
            <vs-col vs-lg="12">
              <div class="d-flex align-items-center booked-for">
                    <span  class="text-muted">
                      <b class="title">{{$t('Booking.Table.BookedFor')}}:</b><br><br>
                      <img class="booked-for-image" :src="request.data.member.photo!=null && request.data.member.photo!='' ? request.data.member.photo : require('@/assets/images/users/1.jpg')" alt="User"/>
                      {{ request.data.member.fname }} {{ request.data.member.lname }}
                    </span>
                  </div>
            </vs-col>
          </vs-row><br>
          <vs-row class="mt-2">
            <vs-col vs-lg="7" vs-xs="12" vs-sm="12">
              <vs-input @change='test()'  type="date" class="w-100 mb-2" v-model="request.date" />
            </vs-col>
            <vs-col vs-lg="5" vs-xs="12" vs-sm="12">
              <vs-input  type="time" class="w-100 mb-2" v-model="request.time" />
            </vs-col>
          </vs-row>
          <vs-row class="mt-2 mb-2">
            <vs-col vs-lg="12" vs-md="8" vs-sm="4" vs-xs="12">
              <vs-select
                :label="$t('Components.Booking.RequestItem.Department')"
                v-if="departments.length>0"
                v-model="request.data.department_id"
                :placeholder="$t('Components.Booking.RequestItem.Department')"
                class="w-100"
              >
                <vs-select-item
                  :key="index"
                  :value="item.id"
                  :text="item.name"
                  v-for="(item,index) in departments"
                />
              </vs-select>
            </vs-col>
          </vs-row>
          <vs-row class="mt-2">
              <vs-button
                      v-for="(file, index) in request.data.files"
                      :key="index"
                      @click="openFile('data:'+file.mime+';base64,'+file.base64)"
                      color="light"
                      size="large"
                      class="m-2 w-100 btn-outline-light text-dark"
              ><i class="mdi mdi-attachment"></i> {{file.title}}</vs-button>
          </vs-row>
          <vs-row class="mt-2 mb-2" v-if="additionalData">
            <vs-col vs-lg="12" vs-md="8" vs-sm="4" vs-xs="12" >
              <vs-input  type="text" class="w-100 mb-2" v-if="additionalData.lat" label="Lat" v-model="additionalData.lat"/>
              <vs-input  type="text" class="w-100 mb-2" v-if="additionalData.lng" label="Lng" v-model="additionalData.lng"/>
            </vs-col>
            <vs-col vs-lg="12" vs-md="8" vs-sm="4" vs-xs="12" v-for="(item,index_inputs) in additionalData" :key="index_inputs">
              <vs-input v-if="$i18n.locale == 'en' && typeof item ==='object'" type="text" class="w-100 mb-2" :id="index_inputs" :label="item.en" v-model="item.Data"/>
              <vs-input v-if="$i18n.locale == 'fr' && typeof item ==='object'" type="text" class="w-100 mb-2" :id="index_inputs" :label="item.fr" v-model="item.Data"/>
              <vs-input v-if="$i18n.locale == 'ar' && typeof item ==='object'" type="text" class="w-100 mb-2" :id="index_inputs" :label="item.ar" v-model="item.Data"/>
              <vs-input v-if="$i18n.locale == 'ru' && typeof item ==='object'" type="text" class="w-100 mb-2" :id="index_inputs" :label="item.ru" v-model="item.Data"/>
            </vs-col>
          </vs-row>
      </div>
    </vs-prompt>
    <!-- <vs-col vs-w="7" class="mt-4 p-3" style="float : right">
    <div v-bar class="vs-scrollable">
      <div>
        <div v-for="(file, index) in request.files" :key="index">
          
          <iframe  style="width: 100%;height: 720px;" :src="'data:'+request.files[index].mime+';base64,'+request.files[index].base64" ></iframe>
        </div>
      </div>
      
    </div>
      
    </vs-col>-->
     <vs-popup
        fullscreen
        :title="$t('Components.Booking.RequestItem.File')"
        :active.sync="filePopupActive"
        style="z-index : 100000"
      >
        <iframe style="width: 100%;height: 720px;" :src="file"></iframe>
      </vs-popup>
  </div>
</template>
<script>
import { bookingRequestService } from "../../_services";
export default {
  name: "RequestItem",
  data: () => ({
    img: { encodedImage: "" },
    file: "",
    filePopupActive: false,
    title: "RequestItem",
  }),
  props: {
    request: Object,
    popupActive4: Boolean,
    departments: Array,
    additionalData : Object,
  },
  methods: {
    reset() {
      //this.request = {};
    },
    openFile(file) {
      this.file = file;
      this.filePopupActive = true;
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
        container: "#booking-box",
        scale: 0.6,
      });
    },
    hideLoading() {
      this.$vs.loading.close("#booking-box > .con-vs-loading");
    },
    reject() {
      this.$vs.dialog({
        type: "confirm",
        color: "danger",
        title: this.$t("Components.Booking.RequestItem.Decline.Title"),
        text: this.$t("Components.Booking.RequestItem.Decline.Text", {
          name: this.request.data.fname + " " + this.request.data.lname,
        }),
        acceptText: this.$t("Toasts.AcceptButton"),
        cancelText: this.$t("Toasts.CancelButton"),
        accept: function () {
          this.showLoading();
          bookingRequestService
            .decline(this.request.data)
            .then(
              function () {
                this.$emit("reject");
                this.notify(
                  this.$t("Toasts.Successful"),
                  this.$t(
                    "Components.Booking.RequestItem.Decline.ToastSuccess"
                  ),
                  "warning"
                );
              }.bind(this)
            )
            .catch(
              function () {
                this.notify(
                  this.$t("Toasts.Error"),
                  this.$t("Components.Booking.RequestItem.Decline.ToastFail"),
                  "danger"
                );
              }.bind(this)
            )
            .finally(
              function () {
                this.hideLoading();
              }.bind(this)
            );
        }.bind(this),
      });
    },
    test(){
      console.log(this.request.date);
    },
    approve() {
      this.$vs.dialog({
        type: "confirm",
        color: "success",
        title: this.$t("Components.Booking.RequestItem.Approve.Title"),
        text: this.$t("Components.Booking.RequestItem.Approve.Text", {
          name: this.request.data.fname + " " + this.request.data.lname,
        }),
        acceptText: this.$t("Toasts.AcceptButton"),
        cancelText: this.$t("Toasts.CancelButton"),
        accept: function () {
          this.showLoading();
          let updatedAdditionalData = {}

          if(Object.keys(this.additionalData).length != 0){
            if(this.additionalData.lat){
              updatedAdditionalData["lat"] = this.additionalData.lat;
            }
            if(this.additionalData.lng){
              updatedAdditionalData["lng"] = this.additionalData.lng
            }

            Object.keys(this.additionalData).forEach((key,i) => {
              if(typeof this.additionalData[key] === 'object'){
                updatedAdditionalData[key] = this.additionalData[key].Data;
              }
            })
            this.request.data.additionalData = JSON.stringify(updatedAdditionalData);
          }
          
          console.log('this.request0');
          console.log(this.request);
          console.log('this.request1');
          bookingRequestService
            .approve(this.request)
            .then(
              function () {
                this.$emit("approve");
                this.notify(
                  this.$t("Toasts.Successful"),
                  this.$t(
                    "Components.Booking.RequestItem.Approve.ToastSuccess"
                  ),
                  "success"
                );
                location.reload();
              }.bind(this)
            )
            .catch(
              function () {
                this.notify(
                  this.$t("Toasts.Error"),
                  this.$t("Components.Booking.RequestItem.Approve.ToastFail"),
                  "danger"
                );
              }.bind(this)
            )
            .finally(
              function () {
                this.hideLoading();
              }.bind(this)
            );
        }.bind(this)
       });
    },
  },

  computed: {
    requestedDate: function () {
      return this.$moment(this.request.data.start_datetime).format(
        "YYYY-MM-DD"
      );
    },
    createdAt: function () {
      return this.$moment(this.request.data.created_at).fromNow();
    },
  },
  mounted() {
    // this.img.encodedImage='data:image/jpg;base64,'+request

  },
};
</script>

<style scoped>
  .booked-for{
    border: 1px solid #eee;
    padding: 10px;
    font-weight: bold;
  }
  .booked-for-image{
    width: 40px;
    border-radius: 50px;
    margin-right: 10px;
  }
</style>