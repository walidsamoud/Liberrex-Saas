<template>
  <vs-row vs-justify="center" id="customers-box">
    <vs-col type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-xs="12">
      <vs-card>
        <vs-row class="w-100">
          <vs-col vs-lg="6" vs-sm="12"></vs-col>
          <vs-col vs-lg="2" vs-sm="12">
            <vs-button
              id="add-customer-form"
              class="mr-2 w-100"
              icon="add"
              color="primary"
              @click="openAddCustomerPrompt()"
            >{{$t('Customer.AddCustomerButton')}}</vs-button>
          </vs-col>
          <vs-col vs-lg="2" vs-sm="12">
            <vs-button
                    id="notify-customer-form"
                    class="mr-2 w-100"
                    icon="send"
                    color="warning"
                    @click="activeNotification()"
            >{{$t('Customer.NotifyCustomerButton')}}</vs-button>
          </vs-col>
          <vs-col vs-lg="2" vs-sm="12">
            <vs-dropdown class="w-100">
              <vs-button
                class="btn-drop w-100"
                color="dark"
                type="filled"
                icon="settings"
              >{{$t('Customer.ActionsBookingsButton')}}</vs-button>
              <vs-dropdown-menu>
                <vs-dropdown-item @click="csvExport(contacts)">
                  <download-csv
                    :data="contacts"
                    :fields="['fname', 'lname', 'phone_number', 'email', 'dateOfBirth', 'internalId']"
                    :separator-excel="true"
                    name="customers.csv"
                  >
                    <i class="fa fa-download"></i>
                    {{$t('Customer.ExportBookingsButton')}}
                  </download-csv>
                </vs-dropdown-item>
                <vs-dropdown-item @click="activeUploadPrompt=true">
                  <i class="fa fa-upload"></i>
                  {{$t('Customer.ImportBookingsButton')}}
                </vs-dropdown-item>
              </vs-dropdown-menu>
            </vs-dropdown>
          </vs-col>
        </vs-row>
      </vs-card>

      <!---Upload Booking --->
      <vs-prompt
        color="dark"
        @accept="uploadFile"
        @cancel="reset"
        @close="reset"
        :active.sync="activeUploadPrompt"
        :title="$t('Customer.UploadPrompt.Title')"
        :accept-text="$t('Customer.UploadPrompt.SubmitButton')"
        :cancel-text="$t('Customer.UploadPrompt.CancelButton')"
      >
        <div class>
          <vs-input
            type="file"
            class="w-100 mt-3 mb-3"
            id="fileInput"
            :label="$t('Customer.UploadPrompt.FileLabel')"
            v-model="importModal.file"
          />
        </div>
      </vs-prompt>

      <!---Notification Prompt --->
     <CustomizerAddCustomer 
            ref="Notify"
            :selectedCustomer="selected_customer"
            :notifyCustomer= true
            :side-bar-title="$t('Customer.NotifyPrompt.Title')"
      ></CustomizerAddCustomer>

      <vs-card>
        <vs-table
          :sst="true"
          @search="handleSearch"
          @sort="handleSort"
          @selected="handleSelected"
          v-model="selected"
          :total="totalItems"
          max-items="10"
          search
          :data="contacts"
        >
          <div slot="header">

            <CustomizerAddCustomer v-if="selected"
            ref="Customizer"
            :selectedCustomer="selected_customer"
            :customerSummary= true
            :side-bar-title="$t('Booking.EditPrompt.Title')"
      ></CustomizerAddCustomer>
            <!---Add Customer --->
            <div >
            <CustomizerAddCustomer
            ref="AddCustomerCustomizer"
            :side-bar-title="$t('Customer.AddCustomerPrompt.Title')"
            :customer="true"
          ></CustomizerAddCustomer>
            </div>

            

            <!--- Customer Book--->
            <vs-prompt
              color="primary"
              @accept="updateCustomerCategory"
              :active.sync="activeBookPrompt"
              :title="$t('Customer.CustomerBookPrompt.Title')"
              :accept-text="$t('Customer.CustomerBookPrompt.ConfirmButton')"
              :cancel-text="$t('Customer.CustomerBookPrompt.CancelButton')"
            >
              <div v-bar class="vs-scrollable">
                <div>
                  <h5 class="mt-2 p-2">{{selected.fname}} {{selected.lname}}</h5>
                  <vs-select
                    v-model="selected.book"
                    :label="$t('Customer.Table.Book')"
                    class="mt-2 w-100"
                  >
                    <vs-select-item value="1" :text="$t('Customer.Table.BookBasic')"></vs-select-item>
                    <vs-select-item value="2" :text="$t('Customer.Table.BookVip')"></vs-select-item>
                    <vs-select-item value="4" :text="$t('Customer.Table.BookBlackList')"></vs-select-item>
                  </vs-select>
                </div>
              </div>
            </vs-prompt>
          </div>
          <template slot="thead">
            <vs-th sort-key="contactname">{{$t('Customer.Table.UserInfo')}}</vs-th>
            <vs-th sort-key="joindate">{{$t('Customer.InternalId')}}</vs-th>
            <vs-th sort-key="phone">{{$t('Customer.Table.Phone')}}</vs-th>
            <vs-th sort-key="lbrx_id">{{$t('Customer.Table.LiberrexVerification')}}</vs-th>
            <vs-th sort-key="book_id">{{$t('Customer.Table.Book')}}</vs-th>
            <vs-th sort-key="book_id">{{$t('Customer.Table.NextBook')}}</vs-th>
            <vs-th>{{$t('Customer.Table.Options')}}</vs-th>
          </template>

          <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
              <vs-td :data="data[indextr].fname">
                <div class="d-flex no-block align-items-center">
                  <div class>
                    <h5 class="mb-0 font-16">{{ data[indextr].fname }} {{ data[indextr].lname}}</h5>
                    <span class="text-muted">{{ data[indextr].email }}</span>
                  </div>
                </div>
              </vs-td>

              <vs-td :data="data[indextr].internal_id">
                <div
                  class="d-flex align-items-center"
                >{{ data[indextr].internal_id ? data[indextr].internal_id : '-' }}</div>
              </vs-td>

              <vs-td :data="data[indextr].phone_number">
                <div class="d-flex align-items-center">
                  <i class="mdi mdi-phone-classic mr-2 display-8"></i>
                  <span class="text-muted">{{data[indextr].phone_number}}</span>
                </div>
                <div class="d-flex align-items-center" v-if="data[indextr].phone_number_2">
                  <i class="mdi mdi-phone mr-2 display-8"></i>
                  <span class="text-muted">{{data[indextr].phone_number_2}}</span>
                </div>
              </vs-td>

              <vs-td :data="data[indextr].lbrx_id">
                <div class="d-flex align-items-center">
                  <span v-if="data[indextr].lbrx_id != '' && data[indextr].lbrx_id != null">
                    <vs-chip color="success">
                      <vs-avatar icon="check" color="success" />
                      {{$t('Customer.Table.LiberrexVerificationSuccess')}}
                    </vs-chip>
                  </span>

                  <span v-if="data[indextr].lbrx_id == '' || data[indextr].lbrx_id == null">
                    <vs-chip color="danger">
                      <vs-avatar icon="close" color="danger" />
                      {{$t('Customer.Table.LiberrexVerificationFail')}}
                    </vs-chip>
                  </span>
                </div>
              </vs-td>

              <vs-td :data="data[indextr].book">
                <div class="d-flex align-items-center">
                  <div class="d-flex align-items-center">
                    <span v-if="data[indextr].book == 1">
                      <vs-chip>
                        <vs-avatar icon="supervised_user_circle" color="success" />
                        {{$t('Customer.Table.BookBasic')}}
                      </vs-chip>
                    </span>

                    <span v-if="data[indextr].book == 2">
                      <vs-chip>
                        <vs-avatar icon="star" color="warning" />
                        {{$t('Customer.Table.BookVip')}}
                      </vs-chip>
                    </span>

                    <span v-if="data[indextr].book == 4">
                      <vs-chip>
                        <vs-avatar icon="block" color="danger" />
                        {{$t('Customer.Table.BookBlackList')}}
                      </vs-chip>
                    </span>
                  </div>
                </div>
              </vs-td>

              <vs-td :data="data[indextr].bookings">
                <div class="d-flex align-items-center">
                  <div class="d-flex align-items-center">
                    <span>
                        <span v-if="data[indextr].bookings.length===0"> ---- </span>
                        <span v-else>{{data[indextr].bookings[0].start_datetime}}</span>
                    </span>
                  </div>
                </div>
              </vs-td>

              <vs-td>
                <div class="btn-alignment">
                  <vs-button
                    radius
                    color="primary"
                    type="border"
                    icon="book"
                    @click="activeBookPrompt = true;$refs.Customizer.hide();"
                  ></vs-button>
                  <vs-button
                    id="edit-customer-button"
                    radius
                    color="warning"
                    type="border"
                    icon="edit"
                    @click="activeUpdatePrompt();$refs.Customizer.hide();"
                  ></vs-button>
                  <vs-button
                    radius
                    color="danger"
                    type="border"
                    icon="delete"
                    @click="activeDeletePrompt= true;deleteCustomer(data[indextr]);$refs.Customizer.hide();"
                  ></vs-button>
                  <!-- <vs-button
                    radius
                    color="success"
                    type="border"
                    icon="sms"
                    @click="activeSmsPrompt= true;SmsCustomer(data[indextr]);$refs.Customizer.hide();"
                  ></vs-button> -->
                </div>
              </vs-td>
            </vs-tr>
          </template>
        </vs-table>
        <vs-pagination :total="totalPages" @change="handleChangePage" v-model="currentPage"></vs-pagination>
      </vs-card>
      <v-tour name="CustomersA" :steps="steps">
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
                  <button @click="tour.previousStep" class="v-step__button">Previous</button>
                  <button @click="goToNextPage" class="v-step__button">Next</button>
                </div>
              </template>
            </v-step>
          </transition>
        </template>
      </v-tour>
    </vs-col>
  </vs-row>
</template>

<script>
import MultipleCustomerSelectFilter from '../../components/shared/MultipleCustomerSelectFilter'
import { customerService, customerBookService } from "../../_services";
import router from "../../_helpers/router";
import AddNewCustomer from '../../components/shared/AddNewCustomer'
import CustomizerAddCustomer from '../../layout/full/customizer/CustomizerAddCustomer.vue';

// moment

export default {
  name: "Customers",
  data: () => ({
    title: "Customers",
    activePrompt: false,
    activeNotificationPrompt: false,
    activeUpdatePrompt: false,
    activeBookPrompt: false,
    activeUploadPrompt: false,
    customer: {},
    contacts: [],
    selected: {},
    selected_customer: {},
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    maxItems: 0,
    importModal: {
      file: null
    },
    notifyPrompt: {
      message: "",
      language: "",
      viaSMS: 0,
      viaEmail: 1,
      viaPush: 1
    },
    steps: [
      {
        target: "#add-customer-form", // We're using document.querySelector() under the hood
        header: {
          title: "Get Started"
        },
        params: {
          placement: "right-start" // Any valid Popper.js placement. See https://popper.js.org/popper-documentation.html#Popper.placements
        }
      },
      {
        target: "#edit-customer-button",
        params: {
          placement: "auto" // Any valid Popper.js placement. See https://popper.js.org/popper-documentation.html#Popper.placements
        }
      }
    ],
    errors: {
      firstName: false,
      lastName: false,
      email: false,
      phoneNumber: false,
      libID: false,
      selected: {
        firstName: false,
        lastName: false,
        email: false,
        phoneNumber: false,
        libID: false
      }
    },
    fname: "",
    lname: "",
    phone_number: "",
    address: "",
    email: "",
    notes: "",
    internalId: "",
    dateOfBirth: "",
    searchKeyword: "",
    activeDeletePrompt: false,
    activeSmsPrompt: false
  }),
  methods: {
    notify(title, text, type) {
      this.$vs.notify({
        color: type,
        title: title,
        text: text
      });
    },
    showLoading() {
      this.$vs.loading({
        container: "#customers-box",
        scale: 0.6
      });
    },
    activeUpdatePrompt(){
      this.$refs.Customizer.update_prop(this.selected_customer,"customer");
      this.$refs.Customizer.show();
   },
    promptShow() {
      this.$tours["CustomersA"].stop();
      this.activePrompt = true;
      this.steps[0].content = this.$t("Customer.Prompt.Content");
      this.steps[0].target = ".vs-button-primary";
      this.steps[0].params.placement = "auto";
      setTimeout(() => this.$tours["CustomersB"].start(), 500);
    },
    promptShowNew() {
      this.$tours["CustomersB"].stop();
      this.activePrompt = false;
      setTimeout(() => this.$tours["CustomersA"].start(1), 500);
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
      this.selected_customer = this.selected;
      this.$refs.Customizer.update_prop(this.selected_customer,"customer");
      if(!this.activeBookPrompt && !this.activeDeletePrompt){
        this.$refs.Customizer.show();
      }
      $refs.Customizer.hide();
      this.$refs.Customizer.update_prop(this.selected.fname + " " + this.selected.lname,"sidebar_title");
    },
    acceptAlert() {
      let res = this.validateFields();
      if (!res) {
        this.activePrompt = true;
        return false;
      }
      this.showLoading();

      let user = {
        fname: this.fname,
        lname: this.lname,
        email: this.email,
        phone_number: this.phone_number,
        address: this.address,
        dateofbirth: this.dateOfBirth,
        internal_id: this.internalId,
        notes: this.notes
      };
      customerService
        .create(user)
        .then(
          function() {
            this.notify(
              this.$t("Toasts.Successful"),
              this.$t("Customer.AddCustomerPrompt.ToastSuccessMessage"),
              "success"
            );
            this.handleChangePage(1);
            this.activePrompt = false;
          }.bind(this)
        )
        .catch(
          function() {
            this.notify(
              this.$t("Toasts.Error"),
              this.$t("Customer.AddCustomerPrompt.ToastFailMessage"),
              "danger"
            );
          }.bind(this)
        )
        .finally(
          function() {
            this.hideLoading();
          }.bind(this)
        );
    },

    handleSearch(keyword) {
      this.showLoading();
      this.searchKeyword = keyword;
      if (keyword == "") {
        customerService
          .getPage(1)
          .then(
            function(data) {
              this.contacts = data.customers.data;
              this.totalItems = data.customers.total;
              this.totalPages = data.customers.last_page;
              this.maxItems = data.customers.per_page;
            }.bind(this)
          )
          .finally(
            function() {
              this.hideLoading();
            }.bind(this)
          );
      }
      customerService
        .search(keyword, 1)
        .then(
          function(data) {
            this.contacts = data.customers.data;
            this.totalItems = data.customers.total;
            this.totalPages = data.customers.last_page;
            this.maxItems = data.customers.per_page;
          }.bind(this)
        )
        .finally(
          function() {
            this.hideLoading();
          }.bind(this)
        );
    },
    handleChangePage(page) {
      this.showLoading();
      if (this.searchKeyword != "") {
        customerService
          .search(this.searchKeyword, page)
          .then(
            function(data) {
              this.contacts = data.customers.data;
              this.totalItems = data.customers.total;
              this.totalPages = data.customers.last_page;
              this.maxItems = data.customers.per_page;
              console.log(data);
            }.bind(this)
          )
          .finally(
            function() {
              this.hideLoading();
            }.bind(this)
          );
      } else {
        customerService
          .getPage(page)
          .then(
            function(data) {
              this.contacts = data.customers.data;
            }.bind(this)
          )
          .finally(
            function() {
              this.hideLoading();
            }.bind(this)
          );
      }
    },
    handleSort(key, active) {
      /* eslint-disable */
      console.log({ key, active });
    },
    formatDate: function(value) {
      let date = this.$moment(value).fromNow();
      return date;
    },
    deleteCustomer(customer) {
      this.$vs.dialog({
        type: "confirm",
        color: "danger",
        title: this.$t("Customer.DeleteCustomerPrompt.Title"),
        text: this.$t("Customer.DeleteCustomerPrompt.Text", {
          name: customer.fname + " " + customer.lname
        }),
        acceptText: this.$t("Toasts.AcceptButton"),
        cancelText: this.$t("Toasts.CancelButton"),
        cancel: function() {
          this.activeDeletePrompt= false
        }.bind(this),
        accept: function() {
          this.showLoading();
          customerService
            .delete(customer.id)
            .then(
              function(data) {
                this.handleChangePage(this.currentPage);
                this.notify(
                  this.$t("Toasts.Successful"),
                  this.$t("Customer.DeleteCustomerPrompt.ToastSuccessMessage"),
                  "success"
                );
              }.bind(this)
            )
            .catch(
              function() {
                this.notify(
                  this.$t("Toasts.Error"),
                  this.$t("Customer.DeleteCustomerPrompt.ToastFailMessage"),
                  "danger"
                );
              }.bind(this)
            )
            .finally(
              function() {
                this.hideLoading();
              }.bind(this)
            );
        }.bind(this)
      });
    },
    SmsCustomer(customer) {
      this.$vs.dialog({
        type: "confirm",
        color: "success",
        title: this.$t("Customer.SmsCustomerPrompt.Title"),
        text: this.$t("Customer.SmsCustomerPrompt.Text", {
          name: customer.fname + " " + customer.lname
        }),
        acceptText: this.$t("Toasts.AcceptButton"),
        cancelText: this.$t("Toasts.CancelButton"),
        cancel: function() {
          this.activeSmsPrompt= false
        }.bind(this),
        accept: function() {
          this.showLoading();
          customerService
            .delete(customer.id)
            .then(
              function(data) {
                this.handleChangePage(this.currentPage);
                this.notify(
                  this.$t("Toasts.Successful"),
                  this.$t("Customer.DeleteCustomerPrompt.ToastSuccessMessage"),
                  "success"
                );
              }.bind(this)
            )
            .catch(
              function() {
                this.notify(
                  this.$t("Toasts.Error"),
                  this.$t("Customer.DeleteCustomerPrompt.ToastFailMessage"),
                  "danger"
                );
              }.bind(this)
            )
            .finally(
              function() {
                this.hideLoading();
              }.bind(this)
            );
        }.bind(this)
      });
    },
    openAddCustomerPrompt() {
      console.log(this.$refs);
      this.$refs.AddCustomerCustomizer.show();
    },
    updateCustomer() {
      let res = this.validateUpdateCustomerFields();
      if (!res) {
        this.activeUpdatePrompt = true;
        return false;
      }

      this.showLoading();
      this.activeUpdatePrompt = true;
      customerService
        .update(this.selected)
        .then(
          function(data) {
            this.handleChangePage(this.currentPage);
            this.activeUpdatePrompt = false;
            this.notify(
              this.$t("Toasts.Successful"),
              this.$t("Customer.EditCustomerPrompt.ToastSuccessMessage"),
              "success"
            );
          }.bind(this)
        )
        .catch(
          function() {
            this.notify(
              this.$t("Toasts.Error"),
              this.$t("Customer.EditCustomerPrompt.ToastFailMessage"),
              "danger"
            );
          }.bind(this)
        )
        .finally(
          function() {
            this.hideLoading();
          }.bind(this)
        );
    },
    updateCustomerCategory() {
      this.showLoading();
      this.activeBookPrompt = true;
      customerBookService
        .add(this.selected.book, this.selected.id)
        .then(
          function(data) {
            this.handleChangePage(this.currentPage);
            this.activeBookPrompt = false;
            this.notify(
              this.$t("Toasts.Successful"),
              this.$t("Customer.CustomerBookPrompt.ToastSuccessMessage"),
              "success"
            );
          }.bind(this)
        )
        .catch(
          function() {
            this.notify(
              this.$t("Toasts.Error"),
              this.$t("Customer.CustomerBookPrompt.ToastFailMessage"),
              "danger"
            );
          }.bind(this)
        )
        .finally(
          function() {
            this.hideLoading();
          }.bind(this)
        );
    },
    reset() {
      this.activePrompt = false;
      this.activeUpdatePrompt = false;
      this.activeBookPrompt = false;
      this.selected = [];
      this.fname = "";
      this.lname = "";
      this.phone_number = "";
      this.address = "";
      this.email = "";
      this.notes = "";
      this.importModal = { file: null };
    },
    validateFields() {
      this.errors.firstName = this.fname.length < 3 ? true : false;
      this.errors.lastName = this.lname.length < 3 ? true : false;
      this.errors.phoneNumber =
        this.phone_number.length < 3 ||
        !this.isValidPhoneNumber(this.phone_number)
          ? true
          : false;
      if (this.email.length > 0) {
        this.errors.email = this.isValidEmail(this.email) ? false : true;
      } else {
        this.errors.email = false;
      }

      let { firstName, lastName, phoneNumber, email } = this.errors;
      return !(firstName || lastName || phoneNumber || email);
    },

    validateUpdateCustomerFields() {
      this.errors.selected.firstName = !this.selected.fname || this.selected.fname.length < 3 ? true : false;
      this.errors.selected.lastName = !this.selected.lname || this.selected.lname.length < 3 ? true : false;
      this.errors.selected.phoneNumber = !this.selected.phone_number || this.selected.phone_number.length < 3 || !this.isValidPhoneNumber(this.selected.phone_number) ? true : false;
      if (this.selected.email && this.selected.email.length > 0) this.errors.selected.email = this.isValidEmail(this.selected.email) ? false : true;
      else this.errors.selected.email = false;

      let { firstName, lastName, phoneNumber, email } = this.errors.selected;

      return !(firstName || lastName || phoneNumber || email);
    },
    isValidPhoneNumber(value) {
      // let phoneNumber = this.phone_number;
      return /^[+\d]\d+$/.test(value);
    },
    isValidEmail: function(value) {
      let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(value);
    },
    createCustomerNotification(){

      let payload = {
        customers: this.$refs.customerFilter.value.map(function (obj) { return obj.id; }),
        message: this.notifyPrompt.message,
        viaSMS: this.notifyPrompt.viaSMS,
        viaEmail: this.notifyPrompt.viaEmail,
        viaPush: this.notifyPrompt.viaPush,
        language: this.notifyPrompt.language
      };

      customerService.notify(payload)
              .then(function() {
                this.notify( this.$t("Toasts.Successful"), this.$t("Customer.NotifyPrompt.ToastSuccess"), "success");
              }.bind(this))
              .catch(function() {
                this.notify(this.$t("Toasts.Error"), this.$t("Customer.NotifyPrompt.ToastFail"), "danger");
              }.bind(this))
              .finally(function() { this.hideLoading(); }.bind(this) );

    },
    uploadFile() {
      let importForm = new FormData();
      importForm.append("file", document.getElementById("fileInput").files[0]);
      this.showLoading();
      customerService
        .upload(importForm)
        .then(function() {}.bind(this))
        .catch(
          function() {
            window.location.reload();
          }.bind(this)
        )
        .finally(
          function() {
            this.hideLoading();
          }.bind(this)
        );
    }
  },
  computed: {
    events() {
      return this.$store.state.contactEvents;
    },
    validateAddCustomerForm() {
      // return this.fname.length > 0;
      // return true
    }
  },
  components: {
    MultipleCustomerSelectFilter,
    AddNewCustomer,
    CustomizerAddCustomer
  },
  mounted() {
    this.notifyPrompt.language = this.$i18n.locale;
    customerService.getPage(1).then(
      function(data) {
        this.contacts = data.customers.data;
        this.totalItems = data.customers.total;
        this.maxItems = data.customers.per_page;
        this.totalPages = data.customers.last_page;
        this.$t("Customer.Content").map(
          (content, index) => (this.steps[index].content = content)
        );
        this.$route.query.istour && localStorage.getItem("skipTour") != "true"
          ? this.$tours["CustomersA"].start()
          : "";
      }.bind(this)
    );
  }
};
</script>