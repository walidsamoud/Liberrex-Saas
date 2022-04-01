<template>
          
        <div class>

          <MultipleCustomerSelectFilter v-if="!selected_customer" :label="$t('Customer.NotifyPrompt.SelectCustomers')" ref="customerFilter" class="mb-4"></MultipleCustomerSelectFilter>

          <vs-textarea
                  counter="75"
                  class="w-100 mt-2"
                  :label="$t('Customer.NotifyPrompt.CustomMessage')"
                  :placeholder="$t('Customer.NotifyPrompt.CustomMessagePlaceholder')"
                  v-model="notifyPrompt.message"
          />

          <vs-select  class="w-100 mb-4 selectExample" v-model="notifyPrompt.language" :label="$t('Customer.NotifyPrompt.MessageLanguage')">
            <vs-select-item
                    :key="index"
                    :value="item"
                    :text="$t('Languages.'+item)"
                    v-for="(item,index) in $i18n.availableLocales"
            />
          </vs-select>

          <vs-checkbox class="justify-content-start w-100 mb-2 mt-2" v-model="notifyPrompt.viaSMS">
            {{$t('Customer.NotifyPrompt.ViaSMSCheckbox')}}
          </vs-checkbox>

          <vs-checkbox class="justify-content-start w-100 mb-2 mt-2" v-model="notifyPrompt.viaEmail">
            {{$t('Customer.NotifyPrompt.ViaEmailCheckbox')}}
          </vs-checkbox>

          <vs-checkbox class="justify-content-start w-100 mb-2 mt-2" v-model="notifyPrompt.viaPush">
            {{$t('Customer.NotifyPrompt.ViaPushCheckbox')}}
          </vs-checkbox>

                        <vs-button @click="createCustomerNotification()" color="primary" class="pr-5 pl-5 float-right"> {{$t('Customer.NotifyPrompt.SubmitButton')}} </vs-button>

        </div>
</template>

<script>
import MultipleCustomerSelectFilter from '../../components/shared/MultipleCustomerSelectFilter'
import {customerService} from "../../_services";

export default {
    data: () => ({
    title: "Customers",
    notifyPrompt: {
      message: "",
      language: "",
      viaSMS: 1 ,
      viaEmail: 1,
      viaPush: 1
    },
    }),
    components:{
      MultipleCustomerSelectFilter
    },
    props:{
      selected_customer: Boolean,
      customer: Object
    },
    methods:{
      notify(title, text, type) {
      this.$vs.notify({
        color: type,
        title: title,
        text: text
      });
    },
    createCustomerNotification(){
          
          let payload = {
            message: this.notifyPrompt.message,
            viaSMS: this.notifyPrompt.viaSMS,
            viaEmail: this.notifyPrompt.viaEmail,
            viaPush: this.notifyPrompt.viaPush,
            language: this.notifyPrompt.language
          };
          if (this.selected_customer){
            payload["customers"] = [this.customer.id]
          }
          else{
            payload["customers"] = this.$refs.customerFilter.value.map(function (obj) { return obj.id; });

          }
          customerService.notify(payload)
              .then(function() {
                this.notify( this.$t("Toasts.Successful"), this.$t("Customer.NotifyPrompt.ToastSuccess"), "success");
              }.bind(this))
              .catch(function() {
                this.notify(this.$t("Toasts.Error"), this.$t("Customer.NotifyPrompt.ToastFail"), "danger");
              }.bind(this))
              .finally(function() { 
                // this.hideLoading();
               }.bind(this) );

    },
    },
    mounted(){
      if (this.selected_customer){
        console.log(this.customer);
        this.notifyPrompt.language = this.customer.preferred_language;
      }
    }
}
</script>