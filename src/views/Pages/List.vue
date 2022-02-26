<template>
  <div class="pages list default">
    <h1>Все страницы</h1>
    <div class="main list">
      <div class="actions" v-if="pages.length != 0">
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
      <div class="list_item" v-for="(page, index) in pages" :key="index">
        <vs-checkbox
          class="check"
          @change="selectOne(page._id)"
          v-model="pages[index].selected"
        >
        </vs-checkbox>
        <div class="inlist">
          <img v-if="page.image" :src="url + '/uploads/' + page.image" alt="" />
          <div class="content">
            <div class="left">
              <h2>{{ page.name }}</h2>
              <span class="cat">{{ page.slug }}</span>
            </div>
            <div class="right">
              <div class="stock">
                <vs-button flat :to="'/dashboard/pages/' + page._id">
                  Редактировать
                </vs-button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <vs-alert shadow v-if="pages.length == 0">
        <template #title> Страницы не найдены </template>
        На данный момент на сайте нет никаких страниц, с начало добавьте и после
        вернитесь на эту страницу
      </vs-alert>
    </div>
  </div>
</template>

<script>
export default {
  name: "List",
  data: () => ({
    url: process.env.VUE_APP_MAIN_URL,
    pages: [],
    command: "",
    selected: [],
    allSelected: false,
  }),
  async created() {
    this.$store.state.active = "pages";
    await this.getAll();
  },
  watch: {
    selected(val) {
      if (this.selected.length == this.pages.length) {
        this.allSelected = true;
      } else {
        this.allSelected = false;
      }
    },
  },
  methods: {
    getAll() {
      this.$axios
        .get(`${process.env.VUE_APP_MAIN_URL}/admin/page`, {
          headers: {
            token: localStorage.getItem("token"),
          },
        })
        .then(
          (res) => {
            this.pages = res.data.doc.map((element) => ({
              ...element,
              selected: false,
            }));
          },
          (err) => {
            console.log(err);
          }
        );
    },
    async confirm() {
      await this.$axios
        .post(
          `${process.env.VUE_APP_MAIN_URL}/admin/page/action`,
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
            console.log(res);
          },
          (err) => {
            console.log(err);
          }
        );

      await this.getAll();
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
        this.pages.map((item) => {
          this.selected.push(item._id);
          item.selected = true;
        });
      } else {
        this.selected = [];
        this.pages.map((item) => {
          item.selected = false;
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>