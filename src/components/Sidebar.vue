<template>
  <vs-sidebar fixed v-model="$store.state.active" :open="true">
    <template #logo>
      <img src="https://d.stat01.com/d536217/logo.png?lc=1643735798" alt="" />
    </template>
    <vs-sidebar-item id="home" to="/">
      <template #icon>
        <Icon icon="iconoir:home-simple-door" />
      </template>
      Обзор
    </vs-sidebar-item>

    <vs-sidebar-group>
      <template #header>
        <vs-sidebar-item arrow>
          <template #icon>
            <Icon icon="iconoir:filter" />
          </template>
          Заказы
        </vs-sidebar-item>
      </template>

      <vs-sidebar-item id="orders" to="/orders"> Все заказы </vs-sidebar-item>
      <vs-sidebar-item id="orders_search" to="/orders/search"
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

      <vs-sidebar-item id="products" to="/products">
        Все товары
      </vs-sidebar-item>
      <vs-sidebar-item id="products_add" to="/products/add">
        Добавить новый
      </vs-sidebar-item>
    </vs-sidebar-group>

    <vs-sidebar-item id="users" to="/users">
      <template #icon>
        <Icon icon="iconoir:user-cart" />
      </template>
      Клиенты
    </vs-sidebar-item>
    <template #footer>
      <vs-row justify="space-between">
        <vs-avatar>
          <img src="@/res/image.jpg" alt="" />
        </vs-avatar>

        <vs-tooltip>
          <vs-button flat size="large">
            <Icon icon="iconoir:log-out" />
          </vs-button>
          <template #tooltip> Выйти из кабинета </template>
        </vs-tooltip>
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
};
</script>

<style lang="scss" scoped>
</style>