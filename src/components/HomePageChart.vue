<template>
  <div class="chart">
    <h2>Статистика за месяц</h2>
    <apexchart
      :width="width"
      :height="height"
      type="area"
      :options="chartOptions"
      :series="series"
    ></apexchart>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "HomePageChart",
  components: {},
  data: () => ({
    width: "100%",
    height: 450,
    chartOptions: {
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      chart: {
        id: "vuechart-example",
        toolbar: {
          show: false,
        },
        sparkline: {
          enabled: true,
        },
      },
      xaxis: {
        type: "category",
        categories: [],
      },
      // tooltip: {
      //   x: {
      //     format: "dd/MM/yy HH:mm",
      //   },
      // },
      series: [],
    },
    series: [],
  }),
  async created() {
    await axios
      .get(`${process.env.VUE_APP_MAIN_URL}/admin/order/stat/month/graphic`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      })
      .then(
        (res) => {
          console.log(res.data);

          this.chartOptions.xaxis.categories = res.data.days;

          this.series.push({
            name: "На сумму",
            data: res.data.data,
          });

          // console.log(res.data.days);
          // console.log(res.data.totals);
        },
        (err) => {
          console.log(err);
        }
      );
  },
};
</script>

<style scoped>
svg {
  overflow: hidden;
  border-radius: 10px;
}
</style>