<template>
  <div>
    <label><b>{{label}}</b></label>
    <multiselect v-model="value"
                 :options="options"
                 :custom-label="customLabel"
                 :multiple="true"
                 track-by="id"
                 label="name"
                 :loading="isLoading"
                 :internal-search="false"
                 :close-on-select="true"
                 :options-limit="300"
                 :max-height="500"
                 :show-no-results="false"
                 :hide-selected="true"
                 @search-change="asyncFind"
                 selectLabel=""
                 :preserveSearch="true"
                 :placeholder="label">
    </multiselect>
  </div>
</template>
<script>
import {customerService} from "../../_services/customer.service";

export default {
  name: "MultipleCustomerSelectFilter",
  data: () => ({
    title: "MultipleCustomerSelectFilter",
    options: [],
    value: null,
    isLoading: false,
    searching: false
  }),
  props: {
    label: String,
  },
  methods:{
    customLabel({ name, internal_id }) {
      return `${internal_id} - ${name}`
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