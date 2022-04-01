<template>
  <div>
    <multiselect v-model="value" :options="options"
                 :custom-label="customLabel"
                 track-by="id" label="name"
                 :loading="isLoading" :internal-search="false"
                 :close-on-select="true" :options-limit="300"
                 :max-height="500" :show-no-results="false"
                 :hide-selected="true" @search-change="asyncFind"
                  selectLabel="" :preserveSearch="true"
                 :placeholder="$t('Booking.CreatePrompt.CustomerPlaceholder')">
    </multiselect>
  </div>
</template>
<script>
import {customerService} from "../../_services/customer.service";

export default {
  name: "CustomerSelectFilter",
  data: () => ({
    title: "CustomerSelectFilter",
    options: [],
    value: null,
    isLoading: false
  }),
  props:{
    customer_id: Number,
  },
  methods:{
    customLabel({ name, internal_id }) {
      if (internal_id == null){
        return `${name}`;
      }else{
        return `${internal_id} - ${name}`
      }
    },
    asyncFind(query){
      if(query.length > 0){
        this.isLoading = true;
        customerService.search(encodeURIComponent(query)).then(function (data) {
          this.options = [];
          data.customers.data.forEach(obj => {
            this.options.push({id: obj.id, name: obj.fname+' '+obj.lname, internal_id: obj.internal_id});
          });
        }.bind(this)).catch(function () {
          this.options = [];
        }.bind(this)).finally(function () {
          this.isLoading  = false;
        }.bind(this));
      }
      else {
        //this.options = [];
      }
    }
  },
  mounted() {
    if (this.customer_id){
      console.log(this.value);
      customerService.getById(this.customer_id)
                        .then( function(data) {
                          let name = data.customer.fname+" "+data.customer.lname;
                          let internal_id = data.customer.internal_id;
                          this.value = {"id":this.customer_id, "name":name, "internal_id":internal_id};
                        }.bind(this))
      }

  }
};
</script>
<style>
  multiselect__content-wrapper {
    z-index: 9999999;
  }

  .multiselect__option--highlight {
    background: #48b7ff;
    outline: none;
    color: #fff;
  }

  .multiselect__tags {
    min-height: 20px !important;
    display: block;
    padding: 6px 40px 0 8px !important;;
    border-radius: 5px;
    border: 1px solid #e8e8e8;
    background: #fff;
    font-size: 14px;
  }
</style>