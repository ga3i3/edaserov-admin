<template>
  <div class="orders search default">
    <h1>Поиск заказа</h1>
    <div class="search">
      <div class="type">
        <vs-radio v-model="type" val="phone"> По телефону </vs-radio>
        <vs-radio v-model="type" val="_it"> ID заказа </vs-radio>
      </div>
      <div class="enter">
        <input
          type="text"
          v-model="search"
          placeholder="Поиск по заказам"
          v-mask="type == 'phone' ? '(###) ### ## ##' : '#####'"
          :readonly="type == '' ? true : false"
        />
        <button
          type="button"
          @click="getAllOrders"
          :disabled="search.length == 0 ? true : false"
        >
          <Icon icon="bi:search" /> Искать
        </button>
      </div>
    </div>
    <div class="main list">
      <div class="actions" v-if="orders.length != 0">
        <div class="checkall">
          <div class="selectall">
            <vs-checkbox
              v-model="allSelected"
              @change="selectAll"
              indeterminate
            >
            </vs-checkbox>
          </div>
          <span>{{ allSelected ? "Отменить" : "Выбрать все" }}</span>
        </div>
        <vs-select placeholder="Выбрать" v-model="command">
          <vs-option label="Открыть" value="open"> Открыть </vs-option>
          <vs-option label="Закрыть" value="close"> Закрыть </vs-option>
          <vs-option label="Удалить" value="delete"> Удалить </vs-option>
        </vs-select>
        <vs-button @click="confirm"> Подтвердить </vs-button>

        <!-- <div class="filter">
          <span>Фильтровать по: </span>
          <a href="javascript:void(0)">Открыто</a>
          <a href="javascript:void(0)">Закрыто</a>
        </div> -->
      </div>
      <div class="list_item" v-for="(order, index) in orders" :key="index">
        <vs-checkbox
          class="check"
          @change="selectOne(order._id)"
          v-model="orders[index].selected"
        >
        </vs-checkbox>
        <div class="inlist">
          <div class="content">
            <div class="left">
              <div class="cat">
                <span class="status" :class="order.status ? 'open' : 'close'">
                  {{ order.status ? "Открыто" : "Закрыто" }}
                </span>
                <Icon icon="bi:dot" />
                <span class="date">
                  {{ getTime(order._timestamp) }}
                </span>
                <Icon icon="bi:dot" />
                <span class="phone">
                  <a :href="'tel:+7' + order.phone">{{
                    phoneFormat(order.phone)
                  }}</a>
                </span>
                <Icon icon="bi:dot" />
                <span class="delivery">
                  {{ deliveryType(order.delivery) }}
                </span>
              </div>
              <div class="order_name">
                <vs-tooltip v-if="order.user != 'guest'">
                  <span class="icon"
                    ><Icon icon="iconoir:verified-user"
                  /></span>
                  <template #tooltip> Клиент зарегистрирован </template>
                </vs-tooltip>

                <vs-tooltip v-else>
                  <span class="icon"><Icon icon="iconoir:user-cart" /></span>
                  <template #tooltip> Клиент не зарегистрирован </template>
                </vs-tooltip>
                <h2>{{ order.name }}</h2>
              </div>
              <div class="links" v-show="false">
                <router-link :to="'/orders/' + order._id"
                  >Редактировать</router-link
                >
                <a href="javascript:void(0)">Удалить</a>
              </div>
            </div>
            <div class="right">
              <span class="price">{{
                order.discount
                  ? $currency(order.discount)
                  : $currency(order.total)
              }}</span>
              <div class="stock">
                <vs-button flat :to="`/dashboard/orders/view/${order._id}`">
                  Посмотреть
                </vs-button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <vs-alert shadow v-if="orders.length == 0">
        <template #title> Заказы не найдены </template>
        На данный момент на сайте нет никаких заказов, с начало добавьте и после
        вернитесь на данную страницу
      </vs-alert>
    </div>
  </div>
</template>

<script>
import { mask } from "vue-the-mask";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

import "dayjs/locale/ru";
dayjs.locale("ru");

import phoneFormatter from "phone-formatter";
import { Icon } from "@iconify/vue2";

import Loading from "../../components/logading.vue";

export default {
  name: "ListOrders",
  directives: { mask },
  components: {
    Icon,
    Loading,
  },
  data: () => ({
    type: "",
    search: "",
    orders: [],
    command: "",
    selected: [],
    allSelected: false,
  }),
  async created() {
    this.$store.state.active = "orders_search";
  },
  watch: {
    selected(val) {
      if (this.selected.length == this.orders.length) {
        this.allSelected = true;
      } else {
        this.allSelected = false;
      }
    },
  },
  methods: {
    getAllOrders() {
      const search = this.search;

      if (search.length == 0) {
        this.$vs.notification({
          progress: "auto",
          position: "bottom-right",
          color: "danger",
          title: "Введите телефон покупателя или ID заказа",
        });
      } else {
        let type = "";
        if (search.length > 9) {
          type = "phone";
        } else if (search.length < 5) {
          type = "it";
        }

        console.log(type);
      }

      const loading = this.$vs.loading();
      this.$axios
        .get(`${process.env.VUE_APP_MAIN_URL}/admin/order/search/by`, {
          headers: {
            token: localStorage.getItem("token"),
            type: this.type,
            search: this.search,
          },
        })
        .then(
          (res) => {
            this.orders = res.data.docs.map((element) => ({
              ...element,
              selected: false,
            }));
            loading.close();
          },
          (err) => {
            console.log(err);
          }
        );
    },
    getTime(time) {
      return dayjs(parseInt(time)).fromNow();
    },
    phoneFormat(phone) {
      return phoneFormatter.format(phone, "(NNN) NNN-NNNN");
    },
    selectOne(id) {
      if (this.selected.includes(id)) {
        let myIndex = this.selected.indexOf(id);
        if (this.selected !== -1) {
          this.selected.splice(myIndex, 1);
        }
      } else {
        this.selected.push(id);
      }
    },
    selectAll() {
      if (this.allSelected) {
        this.selected = [];
        this.orders.map((item) => {
          this.selected.push(item._id);
          item.selected = true;
        });
      } else {
        this.selected = [];
        this.orders.map((item) => {
          item.selected = false;
        });
      }
    },

    async confirm() {
      await this.$axios
        .post(
          `${process.env.VUE_APP_MAIN_URL}/admin/order/action`,
          {
            ids: this.selected,
            command: this.command,
          },
          {
            headers: {
              token: localStorage.getItem("token"),
            },
          }
        )
        .then(
          (res) => {
            this.selected = [];
          },
          (err) => {
            console.log(err);
          }
        );

      await this.getAllOrders();
    },

    deliveryType(type) {
      if (type == "tohome") {
        return "Доставка на дом";
      } else if (type == "pickup") {
        return "Самовывоз";
      } else if (type == "incafe") {
        return "В кафе";
      }
    },

    currencyFormat(total) {
      const total_format = new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "RUB",
      }).format(total);
      return total_format;
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

