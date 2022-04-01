<template>
    <div>
                       <div class="history">
                        <div slot="header">
                </div>
               
                <div class='Booking_Archive' v-if="!archive.length == 0">
                        <vs-table :total="archive.length" :data="archive" 
                      >
                
                <template slot="thead">
                  <vs-th sort-key="date">{{$t('Components.Queue.TicketItem.BookedFor')}}</vs-th>
                  <vs-th sort-key="joindate">{{$t('Queue.Archive.Services')}}</vs-th>


                </template>

                <template  slot-scope="{data}"  >
    
                  <vs-tr  @click="toggle(indextr)" :data="tr" :key="indextr" v-for="(tr, indextr) in data " >
                    <vs-td :data="data[indextr].start_datetime">
                      <div class="d-flex align-items-center">
                        <span class="text-muted">{{data[indextr].start_datetime}}</span>
                      </div>
                    </vs-td>
  

                    <vs-td :data="data[indextr].service_names">
                      <div class="d-flex align-items-center">
                        {{ data[indextr].service_names }}
                      </div>
                     
                    </vs-td>

                  <!-- </vs-tr > -->
                  <!-- <vs-tr v-if="opened">
                            <vs-td :data="data[indextr].services">
                      <div class="d-flex align-items-center">
                        {{ data[indextr].service_names }}
                      </div>
                     
                    </vs-td>
                     <-- </vs-tr> -->
                  </vs-tr>
                </template>
              </vs-table>

              <!-- <v-data-table
      :headers="headers"
      :items="archive"
      :single-expand="singleExpand"
      :expanded.sync="expanded"
      item-key="name"
      show-expand
      class="elevation-1"
    >
              </v-data-table> -->
        </div>
                <div class='No_Data' v-if="archive.length == 0">
                  <center><vs-alert :value="true" color="primary" icon="warning">
                      <h3>{{$t('Errors.NoData')}}</h3>
                  </vs-alert></center>
                  
                </div>

      </div>
    </div>
</template>

<script>
import {customerService} from "../../_services";
export default {
    name: "AddCustomerCustomizer",
    data: () => ({
        archive: [],
        expanded: [],
        singleExpand: false,
        opened: false,
    }),
    props:{
        data_archive: Array,
        customer: Object,
        bookings_type: String        
    },
    methods:{
        toggle(id) {      
          this.opened = true;
        },
        getBookings(){
            console.log("queuearchive");
            let customer = {
                customer_id: this.customer
            }
            
            customerService.getBookings(customer).then(function (data) {
            this.archive = data;
            //   this.$refs.Customizer.update_prop(this.archive,"sidebar_title");
            console.log(data)
            }.bind(this));
        }
      
    },
    mounted(){
      console.log(this.archive);
      let customer = {
                customer_id:this.customer
            }
            if (this.bookings_type == "next_bookings"){
              customerService.getBookings(customer).then(function (data) {
            this.archive = data.bookings;
            //   this.$refs.Customizer.update_prop(this.archive,"sidebar_title");
            }.bind(this));
            }
            else if (this.bookings_type == "archived_bookings"){
              customerService.getArchivedBookings(customer).then(function (data) {
            this.archive = data.bookings;
            //   this.$refs.Customizer.update_prop(this.archive,"sidebar_title");
            }.bind(this));
            }
            

    }
}
</script>