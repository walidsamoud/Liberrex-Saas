<template>
  <div>
    <vs-prompt
            color="warning"
            @cancel="reset"
            @accept="pushCustomer"
            @close="reset"
            :title="$t('Components.Queue.AddDelayPrompt.Title')"
            :accept-text="$t('Components.Queue.AddDelayPrompt.SubmitButton')"
            :cancel-text="$t('Components.Queue.AddDelayPrompt.CancelButton')"
            :active.sync="isActive">
      <div class="con-exemple-prompt">

        <vs-input type="time" :label="$t('Components.Queue.AddDelayPrompt.ResumeAtLabel')" v-model="delay" class="w-100 mb-2" />

        <vs-checkbox class="justify-content-start w-100 mb-4" v-model="notifyCustomers" style="z-index: 1">
          {{$t('Components.Queue.AddDelayPrompt.NotifyCustomersCheckboxText')}}
        </vs-checkbox>

        <vs-textarea
                v-if="notifyCustomers"
                counter="75"
                class="w-100 mt-2"
                :label="$t('Components.Queue.AddDelayPrompt.NotificationMessage')"
                :placeholder="$t('Components.Queue.AddDelayPrompt.NotificationMessage')"
                v-model="message"
        />
      </div>
    </vs-prompt>
  </div>
</template>
<script>
import { queueService } from '../../_services'
export default {
  name: "AddDelayPrompt",
  data: () => ({
    addDelayIsValid : false,
    title: "AddDelayPrompt",
    isActive: false,
    notifyCustomers: true,
    delay: "00:00",
    message: "",
  }),
  props: {
    queue_id: Number
  },
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
        container: '#queue-box',
        scale: 0.6
      });
    },
    hideLoading(){
      this.$vs.loading.close('#queue-box > .con-vs-loading')
    },
    show(){
      this.isActive = true
    },
    hide(){
      this.isActive = false
    },
    pushCustomer(){

      this.show();
      this.showLoading();

      let payload = {
          delay: this.delay,
          notify: this.notifyCustomers,
          message: this.message
      };

      queueService.addDelay(this.queue_id, payload).then(function (data) {
        
         this.hide();
         this.$emit("updateDelay", data.delay);
         this.notify(this.$t('Toasts.Successful'), this.$t('Components.Queue.AddDelayPrompt.ToastSuccessMessage'), 'success');
      }.bind(this)).catch(function () {
         this.notify(this.$t('Toasts.Error'), this.$t('Components.Queue.AddDelayPrompt.ToastErrorMessage'), 'danger');
      }.bind(this)).finally(function () {
          this.hideLoading();
      }.bind(this))
    },

    reset(){
      this.addDelayIsValid = false;

    }
  },
  computed: {

  },
  components: {

  }
};
</script>