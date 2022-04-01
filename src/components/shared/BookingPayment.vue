<template>
    <div id="BookingPayment">
        <div class="container">
            <div class="row boxes p-0 m-0" :style="total_paid >= total_to_pay?'background: cornflowerblue;':'background: red;'">
                <div class="col-4 box box1">
                    <span>{{$t('New.TotalToPay')}}</span>
                    <b>{{total_to_pay}}<sup>DT</sup></b>
                </div>
                <div class="col-4 box box2">
                    <span>{{$t('New.Paid')}}</span>
                    <b>{{total_paid}}<sup>DT</sup></b>
                </div>
                <div class="col-4 box box3">
                    <span>{{$t('New.RestToPay')}}</span>
                    <b v-if="total_to_pay-total_paid>0">{{total_to_pay-total_paid}}<sup>DT</sup></b>
                    <b v-else>0<sup>DT</sup></b>
                </div>
            </div>
            <hr>
            <div class="title">
                <div class="paid-badge">
                    <a class="badge badge-success" v-if="total_paid >= total_to_pay">{{$t('New.Paid')}}</a>
                    <a class="badge badge-danger" v-else-if="total_paid == 0">{{$t('New.Unpaid')}}</a>
                    <a class="badge badge-warning" v-else>{{$t('New.PartiallyPaid')}}</a>
                </div>
                Transactions ( {{transactions.length}} )
                <button class="btn btn-info" @click="optToAdd=true" v-if="!optToAdd">{{$t('New.AddTransaction')}}</button>
                <button class="btn btn-success" @click="submitTransaction" v-if="optToAdd">{{$t('New.Add')}}</button>
                <button class="btn btn-danger" @click="optToAdd=false" v-if="optToAdd" style="margin-right: 10px;">{{$t('New.Cancel')}}</button>
            </div>
            <div class="transactions" v-if="optToAdd">
                <div class="transaction">
                    <select class="input" v-model="toAdd.method" placeholder="Méthode du paiement">
                        <option value="Espèces">{{$t('New.Especes')}}</option>
                        <option value="Chèque">{{$t('New.Cheque')}}</option>
                        <option value="En ligne">{{$t('New.Online')}}</option>
                        <option value="Autre">{{$t('New.Other')}}</option>
                    </select>

                    <input class="input" type="number" v-model="toAdd.amount" placeholder="Montant">
                </div>
            </div>
            <div class="transactions" v-else>
                <div class="transaction">
                    <table>
                        <tr>
                            <td style="font-weight: bold;">{{$t('New.PaymentMethod')}}</td>
                            <td style="font-weight: bold;">{{$t('New.Amount')}}</td>
                        </tr>
                        <tr v-for="transaction in transactions" :key="transaction.id">
                            <td>
                                {{transaction.method}}
                                <span style="display: block;font-size: 13px;color: #666;">{{$t('New.PaidOn')}}: {{transaction.created_at}}</span>
                            </td>
                            <td>
                                {{transaction.amount}}<sup>DT</sup>
                                <span class="delete" @click="_delete(transaction.id)">&times;</span>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
            <vue-confirm-dialog></vue-confirm-dialog>
        </div>
    </div>
</template>

<script>
import { transactionService } from '../../_services'
import moment from 'moment'

export default({
    data:()=>({
        total_to_pay: 0,
        total_paid: 0,
        transactions: [],
        optToAdd: false,
        loading: true,
        toAdd: {
            method: 'Espèces',
            amount: null
        }
    }),
    props: {
        services: Array,
        customer: Number,
        booking_id: Number
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
            this.$vs.loading.close("#BookingPayment > .con-vs-loading");
        },
        showLoading() {
            this.$vs.loading({
                container: "#BookingPayment",
                scale: 0.6
            });
        },
        submitTransaction(){
            if(this.toAdd.amount>0 && this.toAdd.method){
                this.showLoading()
                let data = {
                    id: this.booking_id,
                    method: this.toAdd.method,
                    amount: this.toAdd.amount,
                    user_id: this.customer,
                    model_id: this.booking_id,
                    purchases: this.services.map((obj)=>{return obj.id}).join(',')
                }
                console.log(data)
                transactionService.create(data).then(function(data){
                    this.total_paid = 0
                    this.transactions = data.data.map((obj)=>{
                        obj.created_at = moment(obj.created_at).format('DD/MM/YYYY HH:mm')
                        this.total_paid += Number(obj.amount)
                        return obj
                    })
                }.bind(this)).finally(function(){
                    this.optToAdd = false
                    this.hideLoading()
                }.bind(this))
            }
        },
        _delete(id){
            this.$confirm(
                {
                    title: this.$t('New.Confirmation'),
                    message: this.$t('New.ConfirmTransactionDelete'),
                    button: {
                        no: this.$t('New.Cancel'),
                        yes: this.$t('New.Yes')
                    },
                    /**
                     * Callback Function
                     * @param {Boolean} confirm 
                     */
                    callback: confirm => {
                        if (confirm) {
                            this.showLoading()
                            transactionService.delete(id).then(function(data){
                                this.total_paid = 0
                                this.transactions = data.data.map((obj)=>{
                                    obj.created_at = moment(obj.created_at).format('DD/MM/YYYY HH:mm')
                                    this.total_paid += Number(obj.amount)
                                    return obj
                                })
                            }.bind(this)).finally(function(){
                                this.hideLoading()
                            }.bind(this))
                        }
                    }
                }
            )
        }
    },
    mounted(){
        this.showLoading()
        this.services.map((obj)=>{
            this.total_to_pay += obj.price?Number(obj.price):0
            return obj
        })
        this.total_paid = 0
        transactionService.getAllByBooking(this.booking_id).then(function(data){
            this.transactions = data.data.map((obj)=>{
                obj.created_at = moment(obj.created_at).format('DD/MM/YYYY HH:mm')
                this.total_paid += Number(obj.amount)
                return obj
            })
        }.bind(this)).finally(function(){
            this.hideLoading()
            this.loading = false
        }.bind(this))
    },
    watch: {
        // whenever question changes, this function will run
        services: function (newQuestion, oldQuestion) {
            this.services.map((obj)=>{
                this.total_to_pay += obj.price?Number(obj.price):0
                return obj
            })
        }
    },
})
</script>

<style lang="scss" scoped>
#BookingPayment{
    .boxes{
        width: 100%;
        text-align: center;
        // background: cornflowerblue;
        color: #fff;
        border-radius: 10px;
        padding: 10px !important;
        span{
            font-size: 14px;
            display: block;
        }
        b{
            font-weight: 700;
            font-size: 20px;
            display: block;
        }
        .box1{
            border-right: 2px solid #fff;
        }
        .box3{
            border-left: 2px solid #fff;
        }
    }
    .title{
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 30px;
        button{
            float: right;border-radius: 5px;
        }
    }
    table{
        width: 100%;
    }
    table td{
        padding: 10px;
        font-size: 15px;
        border-bottom: 1px solid #ddd;
    }
    table td:last-child{
        text-align: right;
    }
    .input{
        width: 45%;
        height: 40px;
        padding-left: 10px;
        letter-spacing: 1px;
        border: 1px solid #ccc;
        border-radius: 2px;
    }
    select{
        margin-right: 5%;
    }
    input{
        margin-left: 5%;
    }
    .delete{
        color: red;
        font-size: 20px;
        margin-left: 10px;
        cursor: pointer;
        transition: .4s;
    }
    .delete:hover{
        transform: scale(1.2);
    }
    .paid-badge{
        .badge{
            border-radius: 5px;
            color: #fff;
        }
    }
}
</style>