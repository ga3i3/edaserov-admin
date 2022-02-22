<template>
  <div class="orders users search products list default">
    <h1>Поиск клиентам</h1>
    <div class="search">
      <div class="enter">
        <input
          type="text"
          v-model="search"
          placeholder="Поиск по телефону"
          v-mask="'+7 (###) ### ## ##'"
        />
        <button
          type="button"
          @click="getUser"
          :disabled="search.length == 0 ? true : false"
        >
          <Icon icon="bi:search" /> Искать
        </button>
      </div>
    </div>
    <div class="main list">
      <div class="list_item" v-for="(user, index) in users" :key="index">
        <div class="inlist">
          <div class="content">
            <div class="left">
              <div class="cat">
                <a :href="'tel:+7' + user.phone">{{
                  phoneFormat(user.phone)
                }}</a>
              </div>
              <h2>{{ user.name }}</h2>
              <div class="links">
                <router-link :to="'/products/' + user._id"
                  >Редактировать</router-link
                >
                <a href="javascript:void(0)">Удалить</a>
              </div>
            </div>
            <div class="right">
              <span class="price">Скидка: {{ calcFund(user.fund) }}</span>
              <div class="stock">
                <span>Фонд:</span>
                <vs-input placeholder="Запасы" v-model="users[index].fund" />
                <vs-button
                  flat
                  @click="updateFund(user._id, users[index].fund)"
                >
                  OK
                </vs-button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <vs-alert shadow v-if="users.length == 0">
        <template #title> Пользователь не найден </template>
        Возможно вы не правильно ввели номер или такого пользователя не
        существует.
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
    search: "",
    users: [],
  }),
  async created() {
    this.$store.state.active = "users_search";
  },
  watch: {},
  methods: {
    getUser() {
      const search = this.search;

      if (search.length == 0) {
        this.$vs.notification({
          progress: "auto",
          position: "bottom-right",
          color: "danger",
          title: "Введите телефон пользователя",
        });
      }

      const loading = this.$vs.loading();
      this.$axios
        .get(`${process.env.VUE_APP_MAIN_URL}/admin/user/search/phone`, {
          headers: {
            token: localStorage.getItem("token"),
            search: this.search,
          },
        })
        .then(
          (res) => {
            this.users = res.data.docs;

            res.data.docs.map((user, index) => {
              let new_fund = Math.round(user.fund);
              this.users[index].fund = new_fund;
            });
            loading.close();
          },
          (err) => {
            console.log(err);
          }
        );
    },
    async updateFund(id, fund) {
      // console.log("ID", id);
      // console.log("Fund", fund);
      await this.$axios
        .post(
          `${process.env.VUE_APP_MAIN_URL}/admin/user/update/fund`,
          {
            id,
            fund,
          },
          {
            headers: {
              token: localStorage.getItem("token"),
            },
          }
        )
        .then(
          (res) => {
            if (res.status == 200) {
              this.$vs.notification({
                progress: "auto",
                position: "bottom-right",
                color: "success",
                title: "Фонд пользователя успешно обновлен",
              });

              // this.getUser();
            }
          },
          (err) => {
            console.log(err);
          }
        );
    },

    getTime(time) {
      return dayjs(parseInt(time)).fromNow();
    },

    calcFund(deposit) {
      if (deposit < 1000) {
        return "0%";
      }

      if (deposit >= 1000 && deposit < 5000) {
        return "3%";
      }
      if (deposit >= 5000 && deposit < 15000) {
        return "5%";
      }
      if (deposit >= 15000 && deposit < 30000) {
        return "7%";
      }
      if (deposit >= 30000) {
        return "10%";
      }
    },
    phoneFormat(phone) {
      return phoneFormatter.format(phone, "(NNN) NNN-NNNN");
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

