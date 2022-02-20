<template>
  <div class="default users products list">
    <h1>Клиенты</h1>
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
        <template #title> Юзеры не найдены </template>
        На данный момент на сайте никто не зарегистрирован, здесь появится ваши
        клиенты когда люди зарегистрируется.
      </vs-alert>
    </div>
  </div>
</template>

<script>
import phoneFormatter from "phone-formatter";

export default {
  name: "ListUsers",
  data: () => ({
    url: process.env.VUE_APP_MAIN_URL,
    users: [],
    command: "",
    selected: [],
    allSelected: false,
  }),
  async created() {
    this.$store.state.active = "users";
    await this.getAll();
  },
  watch: {
    selected(val) {
      if (this.selected.length == this.products.length) {
        this.allSelected = true;
      } else {
        this.allSelected = false;
      }
    },
  },
  computed: {},
  methods: {
    getAll() {
      const loading = this.$vs.loading();

      this.$axios
        .get(`${process.env.VUE_APP_MAIN_URL}/admin/user`, {
          headers: {
            token: localStorage.getItem("token"),
          },
        })
        .then(
          (res) => {
            // this.products = res.data.doc.map((element) => ({
            //   ...element,
            //   selected: false,
            // }));

            this.users = res.data.doc;

            res.data.doc.map((user, index) => {
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

              // this.getAll();
            }
          },
          (err) => {
            console.log(err);
          }
        );
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
</style>