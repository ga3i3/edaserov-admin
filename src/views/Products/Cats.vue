<template>
  <div class="default orders cats">
    <h1>Категории <vs-button flat @click="addNew">Добавить</vs-button></h1>
    <div class="main list">
      <div class="actions" v-if="cats.length != 0">
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
          <vs-option label="Удалить" value="delete"> Удалить </vs-option>
        </vs-select>
        <vs-button @click="confirm"> Подтвердить </vs-button>
      </div>
      <div class="list_item" v-for="(order, index) in cats" :key="index">
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
                <router-link :to="'/dashboard/orders/' + order._id"
                  >Редактировать</router-link
                >
                <a href="javascript:void(0)">Удалить</a>
              </div>
            </div>
            <div class="right">
              <div class="stock">
                <vs-button flat :to="`/dashboard/orders/view/${order._id}`">
                  Посмотреть
                </vs-button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <vs-alert shadow v-if="cats.length == 0">
        <template #title> Категории не найдены </template>
        На данный момент на сайте нет никаких категории
      </vs-alert>
    </div>

    <vs-dialog v-model="addnew" not-center id="add_new_cat">
      <template #header>
        <h4 class="not-margin">Добавить новую категорию</h4>
      </template>

      <div class="con-form">
        <div class="line">
          <label for=""></label>
        </div>
      </div>

      <template #footer>
        <div class="footer-dialog">
          <vs-button block> Sign In </vs-button>

          <div class="new">New Here? <a href="#">Create New Account</a></div>
        </div>
      </template>
    </vs-dialog>
  </div>
</template>

<script>
import { Icon } from "@iconify/vue2";

export default {
  name: "Cats",
  components: {
    Icon,
  },
  data: () => ({
    cats: [],
    command: "",
    selected: [],
    allSelected: false,
    addnew: false,
  }),
  created() {
    this.$store.state.active = "products_cat";
  },
  methods: {
    addNew() {
      this.addnew = true;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>

<style lang="scss" scoped>
h1 {
  display: flex;
  align-items: center;

  button {
    margin: 0 0 0 15px;
  }
}
</style>