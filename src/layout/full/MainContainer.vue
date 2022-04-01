<template>
	<div class="main-wrapper" :class="[mainWrapperClass]">
		<!---Navigation-->
		<!-- <Navbar :topbarColor="topbarColor" :logo="require('@/assets/images/logo/logo-light-icon.png')" :title="require('@/assets/images/logo/logo-light-text.png')" /> -->
		<Navbar :topbarColor="topbarColor" :logo="require('@/assets/images/logo/Logo_Original_1@2x.png')"/>
		<!---Sidebar-->
		<SideBar parent=".main-wrapper" :sidebarLinks="sidebarLinks"/>
		<!---Page Container-->
		<div class="main-container-fluid">
		<Breadcrumb/>	
		<transition name="router-anim" enter-active-class="fade-enter-active fade-enter" leave-active-class="fade-leave-active fade-enter">
			
		<router-view></router-view>
		</transition>
		<!---Customizer /
		Settings-->
		<Customizer @updateTopbarColor="updateTopbarColor" />
		<v-tour name="myTour" :steps="steps"></v-tour>

		</div>	
	</div>
</template>

<script>
 
import Navbar from '@/layout/full/header/Navbar.vue';
import SideBar from '@/layout/full/sidebar/SideBar.vue';
import Customizer from '@/layout/full/customizer/Customizer.vue';
import sidebarLinks from '@/layout/full/sidebar/sidebarlinks.js';
import Breadcrumb from '@/layout/full/breadcrumb/Breadcrumb.vue';
import themeConfig from '@/../themeConfig.js';

export default {
name: "MainContainer",
components: {
Navbar,
SideBar,
Customizer,
Breadcrumb
},
data:() => ({
	topbarColor: themeConfig.topbarColor,
	logotitle: themeConfig.logotitle,
	sidebarLinks: sidebarLinks,
	steps: [
		{
			target: '#v-step-0',  // We're using document.querySelector() under the hood
			content: `Discover <strong>Vue Tour</strong>!`
		},
		{
			target: '.v-step-1',
			content: 'An awesome plugin made with Vue.js!'
		},
		{
			target: '[data-v-step="2"]',
			content: 'Try it, you\'ll love it!<br>You can put HTML in the steps and completely customize the DOM to suit your needs.',
			params: {
				placement: 'top'
			}
		}
	]
}),
	methods: {
		updateTopbarColor(val) {
			this.topbarColor = val;
		}
	},
	computed: {
		sidebarWidth: function() {
			return this.$store.state.sidebarWidth;
		},
		mainWrapperClass: function() {
			if(this.sidebarWidth == "default") {
				return "main-wrapper-default"
			}
			else if(this.sidebarWidth == "mini") {return "main-wrapper-mini"}
			else if(this.sidebarWidth){ return "main-wrapper-full"}
			return "default"
		}
	},
	mounted() {

	}
}  	
</script>
<!--Start of Tawk.to Script-->

<!--End of Tawk.to Script-->