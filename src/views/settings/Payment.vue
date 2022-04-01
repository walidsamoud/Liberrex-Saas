<template>
<vs-row vs-justify="center" id="customers-box">
    <vs-col type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-xs="12">
        <vs-card>
            <vs-tabs>
                <vs-tab :label="$t('Payments.Tabs.PaymentsList')" icon="list">
                    <div class="con-tab-ejemplo">
                    Payments
                    </div>
                </vs-tab>
                <vs-tab :label="$t('Payments.Tabs.Settings')" icon="settings">
                    <div class="con-tab-ejemplo">
                    Settings
                    </div>
                </vs-tab>
            </vs-tabs>
        </vs-card>
    </vs-col>
</vs-row> 
</template>

<script>
export default {

}
</script>

<style>

</style>