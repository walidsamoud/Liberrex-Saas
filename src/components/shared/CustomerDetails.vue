  <template
              
            >
              <div v-bar class="vs-scrollable" style="line-height: 2.45; display: flex;">
                <div>
                  <div class="con-exemple-customer-prompt px-4 py-3">
                    <vs-row>
                      <b>{{$t('Customer.FirstName')}} </b>: {{selected.fname}}
                    </vs-row>
                     <vs-row>
                      <b>{{$t('Customer.LastName')}}</b> : {{selected.lname}}
                    </vs-row>

                    <vs-row>
                      <b>{{$t('Customer.Email')}}</b> : {{selected.email}}
                    </vs-row>

                    <vs-row>
                      <b>{{$t('Customer.PhoneNumber')}}</b> : {{selected.phone_number}}
                    </vs-row>

                    <vs-row>
                      <b>{{$t('Customer.DateOfBirth')}}</b> : {{selected.dateofbirth}}
                    </vs-row>

                    <vs-row>
                      <b>{{$t('Customer.InternalId')}}</b> : {{selected.internal_id}}
                    </vs-row>

                    <vs-row>
                      <b>{{$t('Customer.Nationality')}}</b> : {{selected.nationality}}
                    </vs-row>
                    <vs-row>
                      <b>{{$t('Customer.Address')}}</b> : {{selected.address}}
                    </vs-row>
                    <vs-row>
                      <b>{{$t('Customer.PreferredLanguage')}} </b>: {{selected.preferred_language}}
                    </vs-row>

                    <vs-row>
                      <b>{{$t('Customer.Notes')}} </b>: {{selected.notes}}
                    </vs-row>

                   
                  </div>
                </div>
              </div>
</template>

<script>
export default {
    name:"CustomerDetails",
    data: () => ({
    fname: "",
    lname: "",
    phone_number: "",
    address: "",
    email: "",
    notes: "",
    internalId: "",
    }),
    props:{
        selected : Object
    },
    mounted(){
    }
}
</script>
