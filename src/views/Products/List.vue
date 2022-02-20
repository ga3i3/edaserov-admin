<template>
  <div class="default products list">
    <h1>Товары</h1>
    <div class="main list">
      <div class="actions" v-if="products.length != 0">
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
          <vs-option label="Показать" value="visible"> Показать </vs-option>
          <vs-option label="Скрыть" value="hide"> Скрыть </vs-option>
          <vs-option label="Удалить" value="delete"> Удалить </vs-option>
        </vs-select>
        <vs-button @click="confirm"> Подтвердить </vs-button>
      </div>
      <div class="list_item" v-for="(product, index) in products" :key="index">
        <vs-checkbox
          class="check"
          @change="selectOne(product._id)"
          v-model="products[index].selected"
        >
        </vs-checkbox>
        <div :class="product.visibility ? 'inlist' : 'inlist hidden'">
          <img :src="url + '/uploads/' + product.image" alt="" />
          <div class="content">
            <div class="left">
              <div class="cat">{{ getCategoryName(product.cat) }}</div>
              <h2>{{ product.name }}</h2>
              <div class="links">
                <router-link :to="'/products/' + product._id"
                  >Редактировать</router-link
                >
              </div>
            </div>
            <div class="right">
              <span class="price">{{ $currency(product.price) }}</span>
              <div class="stock">
                <span>Запасы:</span>
                <vs-input
                  placeholder="Запасы"
                  v-model="products[index].stock"
                />
                <vs-button
                  flat
                  @click="updateStock(product._id, products[index].stock)"
                >
                  OK
                </vs-button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <vs-alert shadow v-if="products.length == 0">
        <template #title> Товары не найдены </template>
        На данный момент на сайте нет никаких товаров, с начало добавьте и после
        вернитесь на данную страницу
      </vs-alert>
    </div>
  </div>
</template>

<script>
export default {
  name: "ListProducts",
  data: () => ({
    url: process.env.VUE_APP_MAIN_URL,
    products: [],
    command: "",
    selected: [],
    allSelected: false,
  }),
  async created() {
    this.$store.state.active = "products";
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
        .get(`${process.env.VUE_APP_MAIN_URL}/admin/product`, {
          headers: {
            token: localStorage.getItem("token"),
          },
        })
        .then(
          (res) => {
            this.products = res.data.doc.map((element) => ({
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
        this.products.map((item) => {
          this.selected.push(item._id);
          item.selected = true;
        });
      } else {
        this.selected = [];
        this.products.map((item) => {
          item.selected = false;
        });
      }
    },
    getCategoryName(name) {
      switch (name) {
        case "hotter":
          return "Горячее";
        case "laych":
          return "Бизнес ланч";
        case "salads":
          return "Салаты";
        case "soups":
          return "Супы";
        case "desserts":
          return "Десерты";
        case "wok":
          return "WOK";
      }
    },
    async confirm() {
      await this.$axios
        .post(
          `${process.env.VUE_APP_MAIN_URL}/admin/product/action`,
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

      await this.getAll();
    },
    async updateStock(id, stock) {
      await this.$axios
        .post(
          `${process.env.VUE_APP_MAIN_URL}/admin/product/stock`,
          {
            id,
            stock,
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
                title: "Запас успешно обновлен",
              });
            }
          },
          (err) => {
            console.log(err);
          }
        );
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