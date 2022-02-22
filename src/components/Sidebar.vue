<template>
  <vs-sidebar fixed v-model="$store.state.active" :open="true">
    <template #logo>
      <img src="https://d.stat01.com/d536217/logo.png?lc=1643735798" alt="" />
    </template>
    <vs-sidebar-item id="home" to="/dashboard">
      <template #icon>
        <Icon icon="iconoir:home-simple-door" />
      </template>
      Обзор
    </vs-sidebar-item>

    <vs-sidebar-group>
      <template #header>
        <vs-sidebar-item arrow>
          <template #icon>
            <Icon icon="bi:file-earmark" />
          </template>
          Страницы
        </vs-sidebar-item>
      </template>

      <vs-sidebar-item id="pages" to="/dashboard/pages">
        Все странцы
      </vs-sidebar-item>
      <vs-sidebar-item id="pages_add" to="/dashboard/pages/add"
        >Добавить</vs-sidebar-item
      >
    </vs-sidebar-group>

    <vs-sidebar-group>
      <template #header>
        <vs-sidebar-item arrow>
          <template #icon>
            <Icon icon="iconoir:filter" />
          </template>
          Заказы
        </vs-sidebar-item>
      </template>

      <vs-sidebar-item id="orders" to="/dashboard/orders">
        Все заказы
      </vs-sidebar-item>
      <vs-sidebar-item id="orders_search" to="/dashboard/orders/search"
        >Поиск по заказам</vs-sidebar-item
      >
    </vs-sidebar-group>

    <vs-sidebar-group>
      <template #header>
        <vs-sidebar-item arrow>
          <template #icon>
            <Icon icon="iconoir:box-iso" />
          </template>
          Товары
        </vs-sidebar-item>
      </template>

      <vs-sidebar-item id="products" to="/dashboard/products">
        Все товары
      </vs-sidebar-item>
      <vs-sidebar-item id="products_add" to="/dashboard/products/add">
        Добавить новый
      </vs-sidebar-item>
      <vs-sidebar-item id="products_cat" to="/dashboard/products/categories">
        Категории
      </vs-sidebar-item>
    </vs-sidebar-group>

    <vs-sidebar-group>
      <template #header>
        <vs-sidebar-item arrow>
          <template #icon>
            <Icon icon="iconoir:user-cart" />
          </template>
          Клиенты
        </vs-sidebar-item>
      </template>

      <vs-sidebar-item id="users" to="/dashboard/users">
        Все клиенты
      </vs-sidebar-item>
      <vs-sidebar-item id="users_search" to="/dashboard/users/search">
        Поиск по клиентам
      </vs-sidebar-item>
    </vs-sidebar-group>

    <vs-sidebar-group>
      <template #header>
        <vs-sidebar-item arrow>
          <template #icon>
            <Icon icon="bi:gear" />
          </template>
          Настройки
        </vs-sidebar-item>
      </template>

      <vs-sidebar-item id="params" to="/dashboard/params">
        Редактировать
      </vs-sidebar-item>
    </vs-sidebar-group>

    <template #footer>
      <vs-row justify="space-between">
        <vs-avatar>
          <img src="@/res/user-image.png" alt="" />
        </vs-avatar>

        <vs-button flat size="large" @click="logout">
          <Icon icon="iconoir:log-out" />
        </vs-button>
      </vs-row>
    </template>
  </vs-sidebar>
</template>

<script>
import { Icon } from "@iconify/vue2";

export default {
  name: "Sidebar",
  components: {
    Icon,
  },
  data: () => ({}),
  methods: {
    logout() {
      localStorage.clear();
      this.$router.push("/");
    },
  },
};
</script>

<style lang="scss" scoped>
</style>