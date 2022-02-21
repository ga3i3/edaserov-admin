<template>
  <div class="params default">
    <h1>Настройки сайта</h1>

    <div class="edit" v-if="Object.keys(params).length != 0">
      <div class="details">
        <div class="line">
          <label for="sitename">Название сайта</label>
          <input
            type="text"
            id="sitename"
            name="sitename"
            v-model="params.sitename"
          />
          <Icon icon="bi:pencil-square" />
        </div>

        <div class="line">
          <label for="description">Описание сайта</label>
          <input
            type="text"
            id="description"
            name="description"
            v-model="params.description"
          />
          <Icon icon="bi:blockquote-right" />
        </div>

        <div class="line">
          <label>Время работы сайта</label>
          <div class="inset">
            <span>
              <label for="from_working">Откроется</label>
              <input
                type="number"
                id="from_working"
                name="from_working"
                v-model="params.working_time[0]"
                class="number"
              />
            </span>
            <span>
              <label for="to_working">Закроется</label>
              <input
                type="number"
                id="to_working"
                name="to_working"
                v-model="params.working_time[1]"
                class="number"
              />
            </span>
          </div>
        </div>

        <div class="line">
          <label>Цена доставки</label>
          <div class="inset">
            <span>
              <label for="default">По умолчанию</label>
              <input
                type="number"
                id="default"
                name="default"
                v-model="params.delivery.default"
                class="number"
              />
            </span>
            <span>
              <label for="free_from">Бесплатно от</label>
              <input
                type="number"
                id="free_from"
                name="free_from"
                v-model="params.delivery.freeupto"
                class="number"
              />
            </span>
          </div>
        </div>

        <div class="line">
          <label>Время доставки</label>
          <div class="inset">
            <span>
              <label for="from_delivery">Работает с</label>
              <input
                type="number"
                id="from_delivery"
                name="from_delivery"
                v-model="params.delivery.working_time[0]"
                class="number"
              />
            </span>
            <span>
              <label for="to_delivery">Работает до</label>
              <input
                type="number"
                id="to_delivery"
                name="to_delivery"
                v-model="params.delivery.working_time[1]"
                class="number"
              />
            </span>
          </div>
        </div>
        <div class="line checkbox">
          <vs-checkbox v-model="params.working">
            {{ params.working ? "Сайт включен" : "Сайт отключен" }}
          </vs-checkbox>
        </div>
      </div>
      <div class="save">
        <vs-button block size="large" @click="update">Обновить</vs-button>
      </div>
    </div>
  </div>
</template>

<script>
import { Icon } from "@iconify/vue2";

export default {
  name: "Params",
  components: {
    Icon,
  },
  data: () => ({
    params: {},
  }),
  async created() {
    this.$store.state.active = "params";

    await this.getParams();
  },
  methods: {
    getParams() {
      const loading = this.$vs.loading();

      this.$axios
        .get(`${process.env.VUE_APP_MAIN_URL}/admin/params`, {
          headers: {
            token: localStorage.getItem("token"),
          },
        })
        .then(
          (res) => {
            if (res.status == 200) {
              this.params = res.data.doc;
              loading.close();
            }
          },
          (err) => {
            console.log(err);
          }
        );
    },
    update() {
      this.$axios
        .put(`${process.env.VUE_APP_MAIN_URL}/admin/params`, this.params, {
          headers: {
            token: localStorage.getItem("token"),
          },
        })
        .then(
          (res) => {
            if (res.status == 200) {
              this.$vs.notification({
                progress: "auto",
                position: "bottom-right",
                color: "success",
                title: "Настройки обновлены",
              });
            }
            console.log(res);
          },
          (err) => {
            console.log(err);
          }
        );
    },
  },
};
</script>

<style lang="scss" scoped>
input.number {
  font-family: "Roboto", sans-serif;
  font-weight: 300;
}
</style>