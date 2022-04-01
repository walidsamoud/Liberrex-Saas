<template>
    <div>
                       <div class="history">
                        <div slot="header">
                </div>
                <div class='Ticket_Archive' v-if="archive.length" >
                        <vs-table :total="archive.length" :data="archive" 
                      >
                
                <template slot="thead">
                  <vs-th sort-key="date">{{$t('Queue.Archive.ServedAt')}}</vs-th>
                  <vs-th sort-key="joindate">{{$t('Queue.Archive.Services')}}</vs-th>


                </template>

                <template  slot-scope="{data}"  >
                  <vs-tr  @click="toggle(indextr)" :data="tr" :key="indextr" v-for="(tr, indextr) in data " >
                    <vs-td :data="data[indextr].statusUpdateTimestamp">
                      <div class="d-flex align-items-center">
                        <span class="text-muted">{{data[indextr].statusUpdateTimestamp}}</span>
                      </div>
                    </vs-td>
  

                    <vs-td :data="data[indextr].services">
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
      </div>
      <div class='No_Data' v-if="!archive.length">
                  <center><vs-alert :value="true" color="primary" icon="warning">
                      <h3>{{$t('Errors.NoData')}}</h3>
                  </vs-alert></center>
                  
                </div>
      <!-- <div class="center">
                        <vs-table :total="archive.length" :data="archive" >
        <template #thead>
          <vs-tr>
            <vs-th>
              {{$t('Queue.Archive.ServedAt')}}
            </vs-th>
            <vs-th>
              {{$t('Queue.Archive.Services')}}
            </vs-th>
            <vs-th>
              Queue
            </vs-th>
          </vs-tr>
        </template>
        <template #tbody>
          <vs-tr
            :key="i"
            v-for="(tr, i) in data"
          >
            <vs-td>
              {{ tr.services }}
            </vs-td>
            <vs-td>
            {{ tr.services }}
            </vs-td>
            <vs-td>
            {{ tr.id }}
            </vs-td>

            <template #expand>
              <div class="con-content">
                <div>
                  <vs-avatar>
                    <img :src="`/avatars/avatar-${i + 1}.png`" alt="">
                  </vs-avatar>
                  <p>
                    {{ tr.name }}
                  </p>
                </div>
                <div>
                  <vs-button flat icon>
                    <i class='bx bx-lock-open-alt' ></i>
                  </vs-button>
                  <vs-button flat icon>
                    Send Email
                  </vs-button>
                  <vs-button border danger>
                    Remove User
                  </vs-button>
                </div>
              </div>
            </template>
          </vs-tr>
        </template>
      </vs-table>
    </div> -->
                <!-- <vs-button @click="close()" type="border" color="primary" class="border-0 border-bottom mr-4"> {{$t('Components.Queue.AddCustomerPrompt.CancelButton')}} </vs-button> -->

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
    },
    methods:{
        toggle(id) {      
          this.opened = true;
        },
        getQueueArchive(){
            console.log("queuearchive");
            let customer = {
                customer_id:this.customer.id
            }
            customerService.getArchivedTickets(customer).then(function (data) {
            this.archive = data;
            //   this.$refs.Customizer.update_prop(this.archive,"sidebar_title");
            }.bind(this));
        }
      
    },
    mounted(){
      let customer = {
                customer_id:this.customer.id
            }
            customerService.getArchivedTickets(customer).then(function (data) {
            this.archive = data.archive;
            //   this.$refs.Customizer.update_prop(this.archive,"sidebar_title");
            }.bind(this));

    }
}
</script>