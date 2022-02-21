<template>
  <div class="last_orders">
    <h2>Последнее заказы</h2>
    <vs-table>
      <template #thead>
        <vs-tr>
          <vs-th> Имя </vs-th>
          <vs-th> Номер </vs-th>
          <vs-th> На сумму </vs-th>
          <vs-th> Время </vs-th>
          <vs-th> </vs-th>
        </vs-tr>
      </template>
      <template #tbody>
        <vs-tr
          :key="i"
          v-for="(tr, i) in $vs.getPage(orders, page, max)"
          :data="tr"
        >
          <vs-td>
            {{ tr.name }}
          </vs-td>
          <vs-td>
            <span>{{ phoneFormat(tr.phone) }}</span>
          </vs-td>
          <vs-td>
            <span>{{
              tr.discount ? $currency(tr.discount) : $currency(tr.total)
            }}</span>
          </vs-td>
          <vs-td>
            {{ getTime(tr._timestamp) }}
          </vs-td>
          <vs-td>
            <vs-button flat :to="`/dashboard/orders/view/${tr._id}`">
              Перейты
            </vs-button>
          </vs-td>
        </vs-tr>
      </template>
      <template #footer>
        <vs-pagination v-model="page" :length="$vs.getLength(orders, max)" />
      </template>
    </vs-table>
  </div>
</template>

<script>
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

import "dayjs/locale/ru";
dayjs.locale("ru");

import phoneFormatter from "phone-formatter";

export default {
  name: "HomePageLastOrders",
  data: () => ({
    users: [
      {
        id: 1,
        name: "Leanne Graham",
        username: "Bret",
        email: "Sincere@april.biz",
        website: "hildegard.org",
      },
      {
        id: 2,
        name: "Ervin Howell",
        username: "Antonette",
        email: "Shanna@melissa.tv",
        website: "anastasia.net",
      },
      {
        id: 3,
        name: "Clementine Bauch",
        username: "Samantha",
        email: "Nathan@yesenia.net",
        website: "ramiro.info",
      },
      {
        id: 4,
        name: "Patricia Lebsack",
        username: "Karianne",
        email: "Julianne.OConner@kory.org",
        website: "kale.biz",
      },
      {
        id: 5,
        name: "Chelsey Dietrich",
        username: "Kamren",
        email: "Lucio_Hettinger@annie.ca",
        website: "demarco.info",
      },
      {
        id: 6,
        name: "Mrs. Dennis Schulist",
        username: "Leopoldo_Corkery",
        email: "Karley_Dach@jasper.info",
        website: "ola.org",
      },
      {
        id: 7,
        name: "Kurtis Weissnat",
        username: "Elwyn.Skiles",
        email: "Telly.Hoeger@billy.biz",
        website: "elvis.io",
      },
      {
        id: 8,
        name: "Nicholas Runolfsdottir V",
        username: "Maxime_Nienow",
        email: "Sherwood@rosamond.me",
        website: "jacynthe.com",
      },
      {
        id: 9,
        name: "Glenna Reichert",
        username: "Delphine",
        email: "Chaim_McDermott@dana.io",
        website: "conrad.com",
      },
      {
        id: 10,
        name: "Clementina DuBuque",
        username: "Moriah.Stanton",
        email: "Rey.Padberg@karina.biz",
        website: "ambrose.net",
      },
    ],
    orders: [],
    page: 1,
    max: 6,
  }),
  async created() {
    this.$axios
      .get(`${process.env.VUE_APP_MAIN_URL}/admin/order/last/orders`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      })
      .then(
        (res) => {
          this.orders = res.data.docs.reverse();
        },
        (err) => {
          console.log(err);
        }
      );
  },
  computed: {},
  methods: {
    getTime(time) {
      return dayjs(parseInt(time)).fromNow();
    },
    phoneFormat(phone) {
      return phoneFormatter.format(phone, "(NNN) NNN-NNNN");
    },
  },
};
</script>

<style lang="scss" scoped>
span {
  font-family: "Roboto", sans-serif;
}

.vs-table__tr > .vs-table__th {
  width: auto !important;

  &:last-child {
    width: 40px !important;
  }
}
</style>