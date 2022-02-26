<template>
  <div id="app">
    <Sidebar
      v-if="
        $router.currentRoute.path != '/' &&
        !$router.currentRoute.path.includes('print')
      "
    />
    <router-view />
  </div>
</template>

<script>
import Sidebar from "./components/Sidebar.vue";

export default {
  name: "App",
  components: {
    Sidebar,
  },
  created() {
    // localStorage.setItem(
    //   "token",
    //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MjAzMWNhOTg5MjU4YmJlNmU0MmQ4OTUiLCJpYXQiOjE2NDQ3NzE2MjN9.ffZ-4xI1fbrJWYGjqQsDRIWWaVicz7Ag5z0h0TTJuFA"
    // );
  },
};
</script>

<style lang="scss">
#app {
  font-family: "Raleway", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
