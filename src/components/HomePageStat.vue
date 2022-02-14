<template>
  <div class="stat">
    <div class="open_orders">
      <h4>Всего открытых <span>За месяц</span></h4>
      <div class="number">
        <span>{{ openOrdersCount }}</span> {{ truthText(openOrdersCount) }}
      </div>
    </div>
    <div class="close_orders">
      <h4>Всего закрытых <span>За месяц</span></h4>
      <div class="number">
        <span>{{ closeOrdersCount }}</span> {{ truthText(closeOrdersCount) }}
      </div>
    </div>

    <div class="all_orders">
      <h4>Всего за период <span>За месяц</span></h4>
      <div class="number">
        <span>{{ ordersCount }}</span> {{ truthText(ordersCount) }}
      </div>
    </div>

    <div class="total_orders">
      <h4>Всего на сумму <span>За месяц</span></h4>
      <div class="number">
        <span>{{ ordersTotal }}</span> руб.
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "HomePageStat",
  data: () => ({
    openOrdersCount: "",
    closeOrdersCount: "",
    ordersCount: "",
    ordersTotal: "",
  }),
  async created() {
    await axios
      .get(`${process.env.VUE_APP_MAIN_URL}/admin/order/stat/month`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      })
      .then(
        (res) => {
          this.openOrdersCount = res.data.doc.openOrdersCount;
          this.closeOrdersCount = res.data.doc.closeOrdersCount;
          this.ordersCount = res.data.doc.ordersCount;
          this.ordersTotal = res.data.doc.ordersTotal;

          console.log(res.data);
        },
        (err) => {
          console.log(err);
        }
      );
  },
  methods: {
    truthText(count) {
      if (count == 1) {
        return "заказ";
      } else if (count <= 4) {
        return "заказа";
      } else if (count > 4) {
        return "заказов";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.stat {
  margin: 0 0 25px;
  display: flex;
  justify-content: space-between;

  > * {
    width: calc(25% - 20px);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    padding: 25px;
    border-radius: 15px;

    h4 {
      margin: 0 0 10px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 400;

      span {
        font-size: 14px;
        color: rgb(95, 95, 95);
        text-transform: none;
      }
    }
  }
}

.number {
  font-weight: 600;
  font-size: 42px;
  color: #0693e3;

  span {
    font-family: "Roboto", sans-serif;
    font-weight: 500;
  }
}

.open_orders {
  background-color: #0693e3;

  * {
    color: #fff !important;
  }
}
</style>