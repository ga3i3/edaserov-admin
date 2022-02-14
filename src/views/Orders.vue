<template>
  <div class="orders default">
    <h1>Заказы</h1>
    <div class="order">
      <div class="list">
        <vs-table>
          <template #thead>
            <vs-tr>
              <vs-th> Статус </vs-th>
              <vs-th> Имя </vs-th>
              <vs-th> Номер </vs-th>
              <vs-th> На сумму </vs-th>
              <vs-th> Время </vs-th>
              <vs-th> </vs-th>
            </vs-tr>
          </template>
          <template #tbody>
            <vs-tr
              :key="i"
              v-for="(tr, i) in $vs.getPage(orders, page, max)"
              :data="tr"
            >
              <vs-td class="status">
                <div class="inside">
                  <Loading v-if="tr.status" />
                  <Icon icon="iconoir:check" v-if="!tr.status" close="close" />
                  {{ tr.status ? "Открытый" : "Закрыт" }}
                </div> </vs-td
              ><vs-td>
                {{ tr.name }}
              </vs-td>
              <vs-td>
                <span>{{ phoneFormat(tr.phone) }}</span>
              </vs-td>
              <vs-td>
                <span>{{ tr.total }}</span> руб.
              </vs-td>
              <vs-td>
                <span
                  >{{ tr._created }} /
                  <b>[{{ getTime(tr._timestamp) }}]</b></span
                >
              </vs-td>
              <vs-td>
                <vs-button flat @click="openCurrentOrder(tr)">
                  Открыть
                </vs-button>
              </vs-td>
            </vs-tr>
          </template>
          <template #footer>
            <vs-pagination
              v-model="page"
              :length="$vs.getLength(orders, max)"
            />
          </template>
        </vs-table>
      </div>
      <div class="current" v-if="current._id">
        <h2>Текущий заказ</h2>
        <hr />
        <div class="info">
          <div class="time">
            <Icon icon="carbon:time" />
            <span
              >{{ current._created }} / [{{
                getTime(current._timestamp)
              }}]</span
            >
          </div>
          <ul>
            <li>
              <Icon icon="carbon:document-blank" />
              <span>{{ current._id }}</span>
            </li>
            <li class="half name">
              <Icon icon="carbon:user-avatar" /> {{ current.name }}
            </li>
            <li class="half phone">
              <Icon icon="carbon:phone" />
              <span>{{ phoneFormat(current.phone) }}</span>
            </li>
            <li><Icon icon="carbon:at" /> {{ current.email }}</li>
            <li><Icon icon="iconoir:delivery" /> {{ current.delivery }}</li>
            <li v-if="current.delivery == 'На дом'">
              <Icon icon="iconoir:home-simple-door" /> {{ current.address }}
            </li>
            <li v-if="current.delivery == 'В кафе'">
              <span>{{ current.time }}</span>
            </li>
          </ul>
        </div>
        <h2 class="cart_of_buyer">Корзина покупателя</h2>
        <vs-card
          type="3"
          class="cart_item"
          v-for="(item, index) in current.cart"
          :key="index"
        >
          <template #title>
            <h3>
              {{ item.name }} x
              <span>{{ item.quantity }} — {{ item.price }}руб.</span>
            </h3>
          </template>
          <template #img>
            <img :src="item.image" alt="" />
          </template>
          <template #text>
            <p>
              <u>{{ item.select }}</u>
            </p>
          </template>
        </vs-card>

        <div class="total">
          Итого: <span>{{ current.total }}руб.</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

import "dayjs/locale/ru";
dayjs.locale("ru");

import phoneFormatter from "phone-formatter";
import { Icon } from "@iconify/vue2";

import Loading from "../components/logading.vue";

export default {
  name: "Orders",
  components: {
    Icon,
    Loading,
  },
  data: () => ({
    current: {},
    orders: [],
    page: 1,
    max: 20,
  }),
  async created() {
    this.$store.state.active = "orders";
    await this.getAllOrders();
  },
  methods: {
    getAllOrders() {
      const loading = this.$vs.loading();

      this.$axios(`${process.env.VUE_APP_MAIN_URL}/admin/order`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      }).then((res) => {
        this.orders = res.data.docs.reverse();
        loading.close();
      });
    },
    getTime(time) {
      return dayjs(parseInt(time)).fromNow();
    },
    phoneFormat(phone) {
      return phoneFormatter.format(phone, "(NNN) NNN-NNNN");
    },
    openCurrentOrder(order) {
      this.current = order;
    },
  },
};
</script>

<style lang="scss" scoped>
span,
b {
  font-family: "Roboto", sans-serif;
}

span {
  font-weight: 300;
}

.vs-table__tr > .vs-table__th {
  width: auto !important;

  &:last-child {
    width: 40px !important;
  }
}

.status {
  .inside {
    display: flex;
    align-items: center;
  }
  svg {
    margin-right: 10px;
    font-size: 22px;

    &.open {
      color: rgb(52, 184, 0);
    }
    &.close {
      color: rgb(184, 89, 0);
    }
  }
}
</style>