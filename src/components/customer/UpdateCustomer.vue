<template>
        
              <div v-bar class="vs-scrollable" style="display: flex;">
                <div>
                  <div class="con-exemple-prompt px-4 py-3">
                    <vs-row>
                      <vs-col vs-w="6">
                        <vs-input
                          :danger="errors.selected.firstName"
                          :danger-text="$t('Errors.InvalidPolite', {field: $t('Customer.LastName')})"
                          :label="$t('Customer.FirstName')"
                          v-model="selected.fname"
                          class="w-100 mb-2"
                        />
                      </vs-col>
                      <vs-col vs-w="6">
                        <vs-input
                          :danger="errors.selected.lastName"
                          :danger-text="$t('Errors.InvalidPolite', {field: $t('Customer.LastName')})"
                          :label="$t('Customer.LastName')"
                          v-model="selected.lname"
                          class="w-100 mb-2"
                        />
                      </vs-col>
                    </vs-row>
                    <vs-row>
                        <vs-col vs-w="6">

                            <vs-input
                            :danger="errors.selected.email"
                            :danger-text="$t('Errors.InvalidPolite', {field: $t('Customer.Email')})"
                            type="email"
                            :label="$t('Customer.Email')"
                            v-model="selected.email"
                            class="w-100 mb-2"
                            />
                        </vs-col> 
                        <vs-col vs-w="6">

                            <vs-input
                            :danger="errors.selected.phoneNumber"
                            :danger-text="$t('Errors.InvalidPolite', {field: $t('Customer.PhoneNumber')})"
                            type="tel"
                            :label="$t('Customer.PhoneNumber')"
                            v-model="selected.phone_number"
                            class="w-100 mb-2"
                            />
                        </vs-col>
                        <vs-col vs-w="6">

                            <vs-input
                            :danger="errors.selected.phoneNumber2"
                            :danger-text="$t('Errors.InvalidPolite', {field: $t('Customer.PhoneNumber2')})"
                            type="tel"
                            :label="$t('Customer.PhoneNumber2')"
                            v-model="selected.phone_number_2"
                            class="w-100 mb-2"
                            />
                        </vs-col>
                    </vs-row>
                        <vs-row>
                      <vs-col vs-w="6">
                        <vs-input
                          type="date"
                          :label="$t('Customer.DateOfBirth')"
                          v-model="selected.dateofbirth"
                          class="w-100 mb-2"
                        />
                      </vs-col>
                      <vs-col vs-w="6">
                                 <vs-input
                            :label="$t('Customer.PlaceOfBirth')"
                            v-model="selected.placeofbirt"
                            class="w-100 mb-2"
                            />

                      </vs-col>

                    </vs-row>
                    <vs-row>
                        <vs-col vs-w="6">

                            <vs-select
                                  v-model="selected.nationality"
                                  :label="$t('Customer.Nationality')"
                                  class="w-100 mb-4"
                                >
                                  <vs-select-item
                                    :key="index"
                                    :value="item.code"
                                    :text="item.name"
                                    v-for="(item,index) in countries"
                                  />
                              </vs-select>
                        </vs-col>
                        <vs-col vs-w="6">
                              <vs-select
                                  v-model="selected.preferred_language"
                                  :label="$t('Customer.PreferredLanguage')"
                                  class="w-100 mb-4"
                                >
                                  <vs-select-item
                                    :key="index"
                                    :value="item.value"
                                    :text="item.name"
                                    v-for="(item,index) in languages"
                                  />
                              </vs-select>

                      </vs-col>
                    </vs-row>
                    <vs-row>
                        <vs-col vs-w="6">

                            <vs-select
                                v-model="selected.book"
                                :label="$t('Customer.Table.Book')"
                                class="w-100 mb-4"
                            >
                                <vs-select-item value="1" :text="$t('Customer.Table.BookBasic')"></vs-select-item>
                                <vs-select-item value="2" :text="$t('Customer.Table.BookVip')"></vs-select-item>
                                <vs-select-item value="4" :text="$t('Customer.Table.BookBlackList')"></vs-select-item>
                            </vs-select>
                        </vs-col>

                      <vs-col vs-w="6">
                        <vs-input
                          :label="$t('Customer.InternalId')"
                          v-model="selected.internal_id"
                          class="w-100 mb-2"
                        />
                      </vs-col>
                    </vs-row>
                        <vs-input
                          :label="$t('Customer.Address')"
                          v-model="selected.address"
                          class="w-100 mb-2"
                        />
                   

                    <vs-textarea
                      counter="500"
                      class="w-100 mt-2"
                      :label="$t('Customer.Notes')"
                      :placeholder="$t('Customer.Notes')"
                      :description-text="$t('Customer.NotesHint')"
                      v-model="selected.notes"
                    />
                  </div>
                  <vs-col vs-w="12" class="text-right mt-4">
                        <vs-button @click="close()" type="border" color="primary" class="border-0 border-bottom mr-4"> {{$t('Components.Queue.AddCustomerPrompt.CancelButton')}} </vs-button>
                        <vs-button @click="update()" color="primary" class="pr-5 pl-5 float-right"> {{$t('Customer.EditCustomerPrompt.ConfirmButton')}} </vs-button>
                    </vs-col>
                </div>
                
              </div>

</template>

<script>
import {
  customerService,
  customerBookService
} from "../../_services";
export default {
     name: "AddCustomerCustomizer",
    data: () => ({
        countries: require("../../_helpers/countries-selector.js"),
        languages: [{"name":"عربية","value":"ar"},{"name":"Français","value":"fr"},{"name":"English","value":"en"}],
        customer_prop: {},
        archive: {},
          errors: {
            firstName: false,
            lastName: false,
            email: false,
            phoneNumber: false,
            phoneNumber2: false,
            libID: false,
            selected: {
                firstName: false,
                lastName: false,
                email: false,
                phoneNumber: false,
                phoneNumber2: false,
                libID: false
      }
    },
    }),
    props:{
        selected: Object
    },
    methods:{
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
        hideLoading(){
      this.$vs.loading.close('#customers-box > .con-vs-loading')
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
    update(){
      let res = this.validateUpdateCustomerFields();
      if (!res) {
        this.activeUpdatePrompt = true;
        return false;
      }

      this.showLoading();
    //   this.activeUpdatePrompt = true;
    customerBookService
        .add(this.selected.book, this.selected.id);
      customerService
        .update(this.selected)
        .then(
          function(data) {
            this.close();
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
    close(){
      this.$emit('close', 'close');

    }
    }
}
</script>