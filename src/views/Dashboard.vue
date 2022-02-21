<template>
  <div class="default dashboard">
    <HomePageStat />
    <div class="line">
      <HomePageChart />
      <HomePageLastOrders />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import HomePageChart from "../components/HomePageChart.vue";
import HomePageStat from "../components/HomePageStat.vue";
import HomePageLastOrders from "../components/HomePageLastOrders.vue";

export default {
  name: "Dashboard",
  components: {
    HomePageChart,
    HomePageStat,
    HomePageLastOrders,
  },
  data: () => ({}),
  created() {
    this.$store.state.active = "home";
  },
};
</script>

<style scoped>
</style>