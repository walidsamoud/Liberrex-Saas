<template>
    <div class>
          <!-- <vs-input
                type="file"
                multiple
                id="Attachments"
                class="w-100 mt-2"
                :label="$t('New.AddAttachments')"
          /> -->
            <label for="Attachments">{{$t('New.AddAttachments')}}</label><br>
            <input type="file" id="Attachments" ref="Attachments" multiple="multiple" class="fileInput">
          <vs-textarea
                  class="w-100 mt-2"
                  :label="$t('Customer.NotifyPrompt.CustomMessage')"
                  :placeholder="$t('...')"
                  v-model="message"
          />

          <vs-button @click="addAttachments()" color="primary" class="pr-5 pl-5 float-right"> {{$t('New.Add')}} </vs-button>
        <hr style="margin-top: 100px;">

        <h5 style="margin-top: 40px;margin-bottom: 40px;">{{$t('New.Attachments')}}</h5>

        <div class='No_Data' v-if="attachs.length == 0">
            <center><vs-alert :value="true" color="primary" icon="warning">
                <h3>{{$t('Errors.NoData')}}</h3>
            </vs-alert></center>
            
        </div>
        <div v-else>
            <div class="attach" :id="'attach-'+item.id" v-for="item in attachs" :key="item.id">
              <!-- <b>{{$t('New.Note')}}: </b><br>
                <p>
                    {{item.message}}
                </p> -->
                <div class="images">
                  <img 
                    :src="img.thumbnail" 
                    alt="AZE" 
                    v-for="(img, index) in item.attachments" 
                    :key="'img'+index" 
                    @click="showGellary(item.attachments, index, item.message)"
                    v-if="img.thumbnail.indexOf('/video/')<0"
                  >
                  
                  <video 
                    controls
                    v-for="(img, index) in item.attachments" 
                    :key="'img'+index" 
                    v-if="img.thumbnail.indexOf('/video/')>=0"
                  >
                    <source :src="img.thumbnail" type="video/mp4">
                  </video>
                 
                </div>
                <p style="color: #666;">Ajouté le:  {{item.created_at}}</p>
                <p class="btn btn-danger" style="width: 100px;border-radius: 5px;float: right;cursor: pointer;" @click="deletee(item.id, item.attachments.length)">Supprimer</p>
                <!-- <p>{{$t('New.AddedOn')}} {{item.created_at}}</p> -->
            </div>
        </div>

        <gallery :images="gallery_images" :index="index_gallery" @close="index_gallery = null"></gallery>
        <vue-confirm-dialog></vue-confirm-dialog>
    </div>
</template>

<script>
import MultipleCustomerSelectFilter from '../../components/shared/MultipleCustomerSelectFilter'
import {customerService} from "../../_services";
import moment from 'moment'
import VueGallery from 'vue-gallery';
import $ from 'jquery'

export default {
    data: () => ({
    title: "Customers",
    attachs: [],
    gallery_images: [
       "https://liberrex.s3.eu-west-2.amazonaws.com/development/customer_attachments/thumbnail/2951635869554.jpg?v=1635869554443",
       "https://liberrex.s3.eu-west-2.amazonaws.com/development/customer_attachments/thumbnail/2951635869554.jpg?v=1635869554443",
       "https://liberrex.s3.eu-west-2.amazonaws.com/development/customer_attachments/thumbnail/2951635869554.jpg?v=1635869554443",
    ],
    index_gallery: null,
    message: "",
    notifyPrompt: {
      message: "",
      language: "",
      viaSMS: 1 ,
      viaEmail: 1,
      viaPush: 1
    },
    }),
    components:{
      MultipleCustomerSelectFilter,
      'gallery': VueGallery    
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
    hideLoading() {
      this.$vs.loading.close("#customers-box > .con-vs-loading");
    },
    showLoading() {
      this.$vs.loading({
        container: "#customers-box",
        scale: 0.6
      });
    },
    showGellary(images, index, message){
      this.gallery_images= images.map((image)=>{
        if(image.photo.indexOf('/video/')<0){
          return {title: message, href: image.photo};
        }
      })

      this.index_gallery= index
    },
    addAttachments(){
        this.showLoading();

        let data = new FormData();
        for( var i = 0; i < this.$refs.Attachments.files.length; i++ ){
            let file = this.$refs.Attachments.files[i];
            data.append('attachment_' + i, file);
        }
        data.append("nb_attachments", this.$refs.Attachments.files.length);
        data.append("message", this.message);
        data.append("customer_id", this.customer.id);
          
          customerService.addAttachments(data)
              .then(function(data) {
                  this.attachs = data.data.map((obj)=>{
                      obj.created_at = moment(obj.created_at).format('DD/MM/YYYY HH:mm');
                      obj.attachments = JSON.parse(obj.attachments)
                      return obj
                  })
                this.message = ''
                document.getElementById("Attachments").value = "";
              }.bind(this))
              .catch(function() {
                this.notify(this.$t("Toasts.Error"), this.$t("Customer.NotifyPrompt.ToastFail"), "danger");
              }.bind(this))
              .finally(function() { 
                this.hideLoading();
               }.bind(this) );

    },
    deletee(id, attachs_count){
      this.$confirm(
        {
          message: 'Êtes-vous sûr de supprimer ces pièces jointes?',
          button: {
            no: 'Annuler',
            yes: 'Supprimer'
          },
          /**
          * Callback Function
          * @param {Boolean} confirm 
          */
          callback: confirm => {
            if (confirm) {
              this.showLoading();
              customerService.deleteAttachments(id)
              .then(function(data) {
                  $('#attach-'+id).hide()
                  this.message = ''
                document.getElementById("Attachments").value = "";
              }.bind(this))
              .finally(function() { 
                this.hideLoading();
                
               }.bind(this) );
            }
          }
        }
      )
    }
    },
    mounted(){
        this.showLoading();
      customerService.getAttachments(this.customer.id)
              .then(function(data) {
                  this.attachs= data.data.map((obj)=>{
                      obj.created_at = moment(obj.created_at).format('DD/MM/YYYY HH:mm');
                      obj.attachments = JSON.parse(obj.attachments)
                      return obj
                  })
              }.bind(this)).finally(function() { 
                this.hideLoading();
               }.bind(this) );
    }
}
</script>

<style lang="scss" scoped>
    .fileInput{
        width: 100%;
        display: block;
        border: 1px solid #aaa;
        border-radius: 5px;
    }

    .attach{
        border-bottom: 1px solid #aaa;
        padding: 20px;
        width: 100%;
        // background: #eee;
        // border-radius: 10px;
        // margin-bottom: 20px;
        p{
          width: 50%;
          display: inline-block;
        }
        .images{
          padding: 10px;
          // margin-top: -40px;
          width: 100%;
          display: inline-block;
          // text-align: right;
          img, video{
            width: 23%;
            margin-right: 10px;
            margin-bottom: 10px;
            border: 1px solid #ddd;
            padding: 10px;
            border-radius: 10px;
            cursor: pointer;
            transition: .5s;
          }
          video{
            width: 50%;
          }
          img:hover{
            transform: scale(1.1);
          }
        }
    }
</style>