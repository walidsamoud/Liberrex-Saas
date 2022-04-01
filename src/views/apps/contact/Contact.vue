<template>
  <vs-row vs-justify="center">
    <vs-col type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-xs="12">
      <vs-card>
        <vs-table
          @search="handleSearch"
          @sort="handleSort"
          @selected="handleSelected"
          v-model="selected"
          :total="totalItems"
          max-items="10"
          search
          :data="contacts">
          <div slot="header">
            <vs-button icon="add" color="primary" @click="activePrompt = true">Add Contact</vs-button>
            <!---Add Contact --->
            <vs-prompt
              color="primary"
              @cancel="fname=''"
              @accept="acceptAlert"
              @close="close"
              :is-valid="validName"
              :active.sync="activePrompt"
              title="Add Contact"
            >
              <div v-bar class="vs-scrollable" style="height: 350px;">
                <div>
                  <div class="con-exemple-prompt px-4 py-3">

                    <vs-input label="First Name" v-model="fname" class="w-100 mb-4" />
                    <vs-input label="Last Name" v-model="lname" class="w-100 mb-4" />
                    <vs-input type="email" label="Email" v-model="email" class="w-100 mb-4" />
                    <vs-input type="tel" label="Phone No" v-model="phone" class="w-100 mb-4" />
                    <vs-input label="Address" v-model="address" class="w-100 mb-4" />
                    <vs-input label="Liberrex ID" v-model="lbrxId" class="w-100 mb-4" />
                  </div>
                </div>
              </div>
            </vs-prompt>
          </div>
          <template slot="thead">
            <vs-th sort-key="contactname">User Info</vs-th>
            <vs-th sort-key="phone">Phone</vs-th>
            <vs-th sort-key="lbrx_id">Liberrex Verification</vs-th>
            <vs-th sort-key="joindate">Created At</vs-th>
          </template>

          <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">

              <vs-td :data="data[indextr].fname">
                <div class="d-flex no-block align-items-center">

                  <div class>
                    <h5 class="mb-0 font-16">{{ data[indextr].fname }} {{ data[indextr].lname }}</h5>
                    <span class="text-muted">{{ data[indextr].email }}</span>
                  </div>
                </div>
              </vs-td>

              <vs-td :data="data[indextr].phone">
                <div class="d-flex align-items-center">
                  <i class="mdi mdi-phone-classic mr-2 display-8"></i>
                  <span class="text-muted">{{data[indextr].phone_number}}</span>
                </div>
              </vs-td>

              <vs-td :data="data[indextr].lbrx_id">
                <div class="d-flex align-items-center">
                  <span class="text-muted">
                    <span class="badge-success badge badge-pill font-weight-normal"
                          v-if="data[indextr].lbrx_id != '' && data[indextr].lbrx_id != null">Verified</span>
                    <span class="badge-danger badge badge-pill font-weight-normal"
                          v-if="data[indextr].lbrx_id == '' || data[indextr].lbrx_id == null">Failed</span>
                  </span>
                </div>
              </vs-td>

              <vs-td :data="data[indextr].joindate">
                <div class="d-flex align-items-center">
                  <i class="mdi mdi-calendar-text mr-2 display-8"></i>
                  {{formatDate(data[indextr].created_at)}}
                </div>
              </vs-td>


            </vs-tr>
          </template>
        </vs-table>
        <vs-pagination :total="totalPages" @change="handleChangePage" v-model="currentPage"></vs-pagination>
      </vs-card>
    </vs-col>
  </vs-row>
</template>

<script>
import { customerService } from '../../../_services'
// moment

export default {
  name: "Contact",
  data: () => ({
    title: "Contact",
    activePrompt: false,
    contacts: [],
    selected: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    maxItems:0,

    fname: "",
    lname: "",
    phone: "",
    address: "",
    email: "",
    lbrxId: ""
  }),
  methods: {
    handleSelected(){
      /* eslint-disable */
      console.log(this.selected);
    },
    acceptAlert() {
      let user = {
        fname: this.fname, lname: this.lname, email: this.email, phone_number: this.phone,
        address: this.address, lbrx_id: this.lbrxId,
      }
      customerService.create(user).then(function () {
        this.$vs.notify({
          color: "success",
          title: "Contact Added",
          text: "Contact Added Successfully"
        });
        this.handleChangePage(1);
      }.bind(this));

    },
    close() {
      this.$vs.notify({
        color: "danger",
        title: "Closed",
        text: "You close a dialog!"
      });
    },
    handleSearch(keyword) {
      if(keyword == ''){
        customerService.getAll().then(function (data) {
          this.contacts = data.customers.data;
          this.totalItems = data.customers.total;
          this.totalPages = data.customers.last_page;
          this.maxItems = data.customers.per_page;
        }.bind(this));
      }
      customerService.search(keyword).then(function (data) {
        this.contacts = data.customers.data;
        this.totalItems = data.customers.total;
      }.bind(this));
    },
    handleChangePage(page) {
      customerService.getPage(page).then(function (data) {
        this.contacts = data.customers.data;
      }.bind(this));
    },
    handleSort(key, active) {
      /* eslint-disable */
      console.log({key, active});
    },
    formatDate: function (value) {
      let date = this.$moment(value).fromNow();
      return date;
    }
  },
  computed: {
    events() {
      return this.$store.state.contactEvents;
    },
    validName() {
      return this.fname.length > 0;
    }
  },
  components: {},
  mounted() {
    customerService.getAll().then(function (data) {
      this.contacts = data.customers.data;
      this.totalItems = data.customers.total;
      this.maxItems = data.customers.per_page;
      this.totalPages = data.customers.last_page;
    }.bind(this));

  }
};
</script>
