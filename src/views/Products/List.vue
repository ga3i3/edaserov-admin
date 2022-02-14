<template>
  <div class="default products list">
    <h1>Товары</h1>
    <div class="main list">
      <div class="actions">
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
        <vs-select placeholder="Выбрать" v-model="simple">
          <vs-option label="Показать" value="1"> Показать </vs-option>
          <vs-option label="Скрыть" value="1"> Скрыть </vs-option>
          <vs-option label="Удалить" value="2"> Удалить </vs-option>
        </vs-select>
        <vs-button> Подтвердить </vs-button>
      </div>
      <div class="list_item" v-for="(product, index) in products" :key="index">
        <vs-checkbox
          class="check"
          @change="selectOne(product._id)"
          v-model="products[index].selected"
        >
        </vs-checkbox>
        <div class="inlist">
          <img :src="url + '/uploads/' + product.image + '.jpg'" alt="" />
          <div class="content">
            <div class="left">
              <div class="cat">{{ getCategoryName(product.cat) }}</div>
              <h2>{{ product.name }}</h2>
            </div>
            <div class="right">
              <span class="price">{{ product.price }}руб.</span>
              <div class="stock">
                <span>Запасы:</span>
                <vs-input
                  placeholder="Запасы"
                  v-model="products[index].stock"
                />
                <vs-button flat> OK </vs-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ListProducts",
  data: () => ({
    url: process.env.VUE_APP_MAIN_URL,
    products: [],
    products_new: [],
    simple: "",
    selected: [],
    allSelected: false,
  }),
  async created() {
    this.$store.state.active = "products";
    await this.getAll();
  },
  watch: {},
  computed: {},
  methods: {
    getAll() {
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
          },
          (err) => {
            console.log(err);
          }
        );
    },
    selectOne(id) {
      this.allSelected = false;
      if (this.selected.includes(id)) {
        this.allSelected = false;
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
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>