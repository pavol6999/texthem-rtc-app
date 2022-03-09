<template>
	<q-layout view="hhh lpR fFf">
		<q-header elevated class="bg-primary text-white">
			<q-toolbar class="navbar-color">
				<q-toolbar-title class="absolute-center">
					<q-avatar>
						<img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
					</q-avatar>TexThem
				</q-toolbar-title>
			</q-toolbar>
		</q-header>

		<q-page-container>
			<router-view />
		</q-page-container>
	</q-layout>
</template>


<script>


export default {

}
</script>
<style scoped>
.navbar-color {
	background-color: #443eb7;
}
</style>