<template>
  <div class="default orders view">
    <h1>
      Заказ #<span>{{ order._it }}</span>
    </h1>
    <div class="status_inf">
      <span class="status" :class="order.status ? 'open' : 'close'">
        {{ order.status ? "Открыто" : "Закрыто" }}
      </span>
    </div>
    <div class="details">
      <div class="overview">
        <h2>
          Детали <vs-button @click="editMode = true">Редактировать</vs-button>
        </h2>
        <div class="information">
          <div class="line">
            <label for="name">ФИО</label>
            <input type="text" v-model="order.name" readonly />
            <Icon icon="bi:person" />
          </div>
          <div class="line">
            <label for="name">Телефон</label>
            <input
              type="text"
              class="phone"
              v-model="order.phoneFormat"
              readonly
            />
            <Icon icon="bi:telephone" />
          </div>
          <div class="line">
            <label for="name">Email</label>
            <input type="text" class="phone" v-model="order.email" readonly />
            <Icon icon="bi:at" />
          </div>
        </div>
        <div class="cart">
          <ul>
            <li
              class="cart_item"
              v-for="(item, index) in order.cart"
              :key="index"
            >
              <div
                class="remove"
                @click="removeFromCart(item._gnrt)"
                :class="editMode ? 'editmodON' : 'editmodOFF'"
              >
                <Icon icon="bi:x" />
              </div>
              <div
                class="wrap"
                :class="item.options.length != 0 ? 'has_option' : ''"
              >
                <img :src="url + item.image" alt="" />
                <div class="name">
                  <input
                    type="text"
                    v-model="item.name"
                    class="main"
                    readonly
                  />
                  <div class="option" v-if="item.options.length != 0">
                    <input type="text" v-model="item.select.name" readonly />
                    <span>{{ item.select.price }}руб.</span>
                  </div>
                </div>

                <div class="qty" :class="editMode ? 'editmodON' : 'editmodOFF'">
                  <button type="button" @click="minusQty(item._gnrt)">
                    <Icon icon="bi:chevron-down" />
                  </button>
                  <input
                    type="text"
                    v-model="order.cart[index].quantity"
                    :id="'field-' + index"
                  />
                  <button type="button" @click="plusQty(item._gnrt)">
                    <Icon icon="bi:chevron-up" />
                  </button>
                </div>
                <div class="price">
                  <input type="text" v-model="item.price" readonly />
                  руб.
                </div>
              </div>
            </li>
          </ul>
          <vs-button
            flat
            @click="addProduct"
            :class="editMode ? 'editmodON' : 'editmodOFF'"
          >
            Добавить товар
          </vs-button>
        </div>
        <div class="bottom">
          <div class="delivery">
            <div class="pickup" v-if="order.delivery == 'pickup'">
              <label for="">Тип доставки</label>
              <input type="text" value="Заберу с собой" readonly />
            </div>

            <div class="tohome" v-if="order.delivery == 'tohome'">
              <label for="">Тип доставки: доставка на дом</label>
              <div class="address">
                <input type="text" :value="order.address.street" readonly />
                <input type="text" :value="order.address.house" readonly />
                <input type="text" :value="order.address.apartment" readonly />
              </div>
            </div>

            <div class="incafe" v-if="order.delivery == 'incafe'">
              <label for="">Тип доставки: в кафе</label>
              <input
                type="text"
                :value="'Время подачи бдюды: ' + order.time"
                readonly
              />
            </div>
          </div>
          <div class="amount">
            <div class="total">
              <div
                class="percent"
                :class="editMode ? 'editmodON' : 'editmodOFF'"
              >
                <label>Величина скидки</label>
                <input
                  type="number"
                  v-model="order.percent"
                  max="100"
                  min="1"
                />
              </div>
              <del v-if="discount">{{ getSubtotal }}</del>
              <span v-if="discount" class="discount">{{
                currencyFormat(discount)
              }}</span>
              <span v-if="!discount" class="without_discount">{{
                currencyFormat(getSubtotal)
              }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="user">
        <div class="wrap">
          <img src="../../res/user-image.png" alt="" />
          <span class="userName">{{
            order.user == "guest" ? "Не зарегистрирован" : order.name
          }}</span>
          <div class="fund" v-if="order.user != 'guest'">
            <span class="allTotal label">Суммарная цена всех заказов</span>
            <span class="allTotal value">{{ currencyFormat(user.fund) }}</span>
            <span class="discountPercent">{{ getDiscountPercent }}</span>
          </div>
        </div>
        <vs-button size="large" @click="updateOrder">Обновить</vs-button>
      </div>
    </div>
    <vs-alert shadow v-if="notfound">
      <template #title> Заказ не найден </template>
      Данный заказ к сожалению не найдено
    </vs-alert>

    <vs-dialog v-model="add_product" width="500px" :scroll="true">
      <template #header>
        <h4 class="not-margin">Добавить товар в корзину</h4>
      </template>

      <div class="con-form">
        <ul>
          <li v-for="(item, index) in products" :key="index">
            <div
              class="wrap"
              :class="item.options.length != 0 ? 'has_options' : 'not_options'"
            >
              <div class="image">
                <img :src="url + item.image" alt="" />
              </div>
              <div class="name">
                {{ item.name }}
              </div>
              <div class="options">
                <select
                  placeholder="Выбрать"
                  v-if="item.options.length != 0"
                  v-model="products[index].select"
                >
                  <option value="default" selected>Выбрать</option>
                  <option
                    v-for="(option, index) in item.options"
                    :key="index"
                    :value="option"
                    @change="changeOption('231', 'adfwfe')"
                  >
                    {{ option.name }}
                  </option>
                </select>
              </div>
              <div class="price">{{ item.price }}руб.</div>
              <vs-button flat @click="addToCart(item)">Добавить</vs-button>
            </div>
            <div class="dropdown"></div>
          </li>
        </ul>
      </div>
    </vs-dialog>
  </div>
</template>

<script>
import { Icon } from "@iconify/vue2";
import phoneFormatter from "phone-formatter";

export default {
  name: "ViewOrder",
  components: {
    Icon,
  },
  data: () => ({
    notfound: false,
    editMode: false,
    url: process.env.VUE_APP_MAIN_URL + "/uploads/",
    order: {},
    add_product: false,
    products: [],
    value1: "",
    currentProduct: {
      id: "",
      select: "default",
    },
    total: "",
    discount: "",
    user: {},
  }),
  created() {
    this.checkHaveProduct();
    // await this.addProduct();
  },
  watch: {
    editMode(val) {
      if (val) {
        this.$vs.notification({
          progress: "auto",
          position: "bottom-right",
          color: "success",
          title: "Включен режим редактирование",
        });
      }
    },
  },
  computed: {
    getSubtotal() {
      if (Object.keys(this.order).length != 0) {
        let total = 0;
        let discount = 0;

        let prices = [];
        let select_prices = [];
        this.order.cart.map((item) => {
          prices.push(item.quantity * item.price);
          if (item.options.length != 0) {
            select_prices.push(item.quantity * parseInt(item.select.price));
          }
        });

        if (select_prices.length != 0) {
          total =
            prices.reduce(
              (previousValue, currentValue) => previousValue + currentValue
            ) +
            select_prices.reduce(
              (previousValue, currentValue) => previousValue + currentValue
            );
        } else {
          total = prices.reduce(
            (previousValue, currentValue) => previousValue + currentValue
          );
        }

        if (this.order.percent != null) {
          discount = total - (total / 100) * this.order.percent;
        }

        this.discount = discount;
        this.total = total;
        return total;
      }
    },
    getDiscountPercent() {
      if (this.user) {
        if (this.user.fund >= 1000 && this.user.fund < 5000) {
          return "3%";
        }
        if (this.user.fund >= 5000 && this.user.fund < 15000) {
          return "5%";
        }
        if (this.user.fund >= 15000 && this.user.fund < 30000) {
          return "7%";
        }
        if (this.user.fund >= 30000) {
          return "10%";
        }
      }
    },
  },
  methods: {
    async checkHaveProduct() {
      const loading = this.$vs.loading();
      await this.$axios
        .get(
          `${process.env.VUE_APP_MAIN_URL}/admin/order/${this.$route.params.id}`,
          {
            headers: {
              token: localStorage.getItem("token"),
            },
          }
        )
        .then(
          (res) => {
            if (res.data.doc == null) this.notfound = true;
            this.order = res.data.doc;
            this.order.phoneFormat = this.phoneFormat(this.order.phone);
            res.data.doc.cart.map((item, index) => {
              this.order.cart[index]._gnrt = this.generateID();
            });

            if (res.data.doc.user != "guest") {
              this.checkHaveUser(res.data.doc.user);
            }
            loading.close();
          },
          (err) => {
            if (err) this.notfound = true;
          }
        );
      // if (this.order.user != "guset") {
      //   await this.$axios
      //     .get(
      //       `${process.env.VUE_APP_MAIN_URL}/admin/user/${this.order.user}`,
      //       {
      //         headers: {
      //           token: localStorage.getItem("token"),
      //         },
      //       }
      //     )
      //     .then(
      //       (res) => {
      //         this.user = res.data.doc;
      //       },
      //       (err) => {
      //         console.log(err);
      //       }
      //     );
      // }
    },
    checkHaveUser(id) {
      this.$axios
        .get(`${process.env.VUE_APP_MAIN_URL}/admin/user/${id}`, {
          headers: {
            token: localStorage.getItem("token"),
          },
        })
        .then(
          (res) => {
            this.user = res.data.doc;
          },
          (err) => {
            console.log(err);
          }
        );
    },
    phoneFormat(phone) {
      return phoneFormatter.format(phone, "(NNN) NNN-NNNN");
    },
    plusQty(id) {
      let indexProductInCart = this.order.cart.findIndex((x) => x._gnrt === id);
      this.order.cart[indexProductInCart].quantity++;

      document.getElementById("field-" + indexProductInCart).value =
        this.order.cart[indexProductInCart].quantity;
      this.calcSubtotal();
    },
    minusQty(id) {
      let indexProductInCart = this.order.cart.findIndex((x) => x._gnrt === id);
      if (this.order.cart[indexProductInCart].quantity != 1) {
        this.order.cart[indexProductInCart].quantity--;

        document.getElementById("field-" + indexProductInCart).value =
          this.order.cart[indexProductInCart].quantity;

        this.calcSubtotal();
      }
    },
    removeFromCart(id) {
      let indexProductInCart = this.order.cart.findIndex((x) => x._gnrt === id);
      if (this.order.cart.length != 1) {
        this.order.cart.splice(indexProductInCart, 1);
      } else if (this.order.cart.length == 1) {
        this.$vs.notification({
          progress: "auto",
          position: "bottom-right",
          color: "danger",
          title: "В корзине должен быть минимум 1 товар",
        });
      }
    },
    async addProduct() {
      this.add_product = true;
      await this.$axios.get(`${process.env.VUE_APP_MAIN_URL}/product`).then(
        (res) => {
          this.products = res.data.doc;
          res.data.doc.map((item, index) => {
            this.products[index]._gnrt = this.generateID();
            this.products[index].select = {};
            this.products[index].quantity = 1;
          });
        },
        (err) => {
          console.log(err);
        }
      );
    },
    calcSubtotal() {
      if (Object.keys(this.order).length != 0) {
        let total = 0;
        let discount = 0;

        let prices = [];
        let select_prices = [];
        this.order.cart.map((item) => {
          prices.push(item.quantity * item.price);
          if (item.options.length != 0) {
            select_prices.push(item.quantity * parseInt(item.select.price));
          }
        });

        if (select_prices.length != 0) {
          total =
            prices.reduce(
              (previousValue, currentValue) => previousValue + currentValue
            ) +
            select_prices.reduce(
              (previousValue, currentValue) => previousValue + currentValue
            );
        } else {
          total = prices.reduce(
            (previousValue, currentValue) => previousValue + currentValue
          );
        }

        if (this.order.percent != null) {
          discount = total - (total / 100) * this.order.percent;
        }

        this.discount = discount;
        this.total = total;
      }
    },
    changeOption(id, option) {
      // console.log(id);
      // console.log(option);
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
    addToCart(product) {
      this.order.cart.push(product);
      // console.log(product);
    },
    updateOrder() {
      if (this.editMode) {
        const data = this.order;
        data.total = this.total;
        data.discount = this.discount;

        this.$axios
          .put(
            `${process.env.VUE_APP_MAIN_URL}/admin/order/${this.order._id}`,
            data,
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
                  title: "Заказ обновлен",
                });

                this.checkHaveProduct();
              }
            },
            (err) => {
              this.$vs.notification({
                progress: "auto",
                position: "bottom-right",
                color: "error",
                title: "Произошла непредвиденная ошибка",
              });
            }
          );
      } else {
        this.$vs.notification({
          progress: "auto",
          position: "bottom-right",
          color: "warning",
          title: "С начало включите режим редактирование",
        });
      }
    },
    generateID() {
      let length = 8,
        charset =
          "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
      for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
      }
      return retVal;
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
h1 span {
  font-family: "Roboto", sans-serif;
  font-weight: 500;
}

.phone {
  font-family: "Roboto", sans-serif;
  font-weight: 300;
}
</style>