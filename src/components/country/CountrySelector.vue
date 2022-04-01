<template>
  <div id="server-box">
    <vs-dropdown vs-trigger-click class="cursor-pointer ml-4">
      <gb-flag :code="getCurrentServer" size="small" />
      <vs-dropdown-menu class="topbar-dd" v-if="selectable">
        <vs-dropdown-item @click="changeServer('gb')"><gb-flag code="gb" size="small" /> </vs-dropdown-item>
        <vs-dropdown-item @click="changeServer('tn')"><gb-flag code="tn" size="small" /> </vs-dropdown-item>
        <vs-dropdown-item @click="changeServer('ci')"><gb-flag code="ci" size="small" /> </vs-dropdown-item>
      </vs-dropdown-menu>
    </vs-dropdown>
  </div>
</template>
<script>
export default {
  name: "CountrySelector",
  data: () => ({
    title: "CountrySelector",
    server: ""
  }),
  props: {
    textstyle: String,
    selectable: Boolean
  },
  methods: {
    changeServer(server) {
      this.showLoading();
      localStorage.setItem('Server', server);
      location.reload(true);
    },
    showLoading(){
      this.$vs.loading({
        container: '#server-box',
        scale: 0.6
      });
    },
    getServer: async function  () {
      this.showLoading();
      if(this.$route.query.country){
        localStorage.setItem('Server', this.$route.query.country.toLowerCase());
        this.server = localStorage.getItem('Server');
        this.changeServer(localStorage.getItem('Server'));
      }
      await fetch('https://api.ipify.org?format=json').then(x => x.json())
              .then(async ({ip}) => {
                let accessKey = '673eb1db151c4949c392bb02a57b6e42'; //Temporary
                let url = 'https://api.ipapi.com/' + ip + '?access_key=' + accessKey;
                await fetch(url).then(data => data.json()).then(function (data) {
                  localStorage.setItem('Server', data.country_code.toLowerCase());
                }.bind(this));
              });
      this.changeServer(localStorage.getItem('Server'));
    }
  },
  computed: {
    getCurrentServer() {
      return localStorage.getItem('Server') ? localStorage.getItem('Server') : 'gb';
    },
    textStyle(){
      return this.textstyle ? this.textstyle : 'text-dark';
    }
  },
  mounted() {
    if(!localStorage.getItem('Server')){
      this.getServer();
    }
  }
};
</script>