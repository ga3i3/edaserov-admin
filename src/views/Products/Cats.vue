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
      <div class="list_item" v-for="(cat, index) in cats" :key="index">
        <vs-checkbox
          class="check"
          @change="selectOne(cat._id)"
          v-model="cats[index].selected"
        >
        </vs-checkbox>
        <div class="inlist">
          <div class="content">
            <div class="left">
              <div class="order_name">
                <h2>{{ cat.name }}</h2>
              </div>
              <div class="links" v-show="false">
                <!-- <router-link :to="'/dashboard/orders/' + order._id"
                  >Редактировать</router-link
                >
                <a href="javascript:void(0)">Удалить</a> -->
              </div>
            </div>
            <div class="right">
              <div class="working">
                <select placeholder="Select" v-model="cats[index].working[0]">
                  <option
                    v-for="n in 24"
                    :key="n"
                    :label="n"
                    :value="n.toString()"
                  >
                    {{ n }}
                  </option>
                </select>

                <select placeholder="Select" v-model="cats[index].working[1]">
                  <option
                    v-for="n in 24"
                    :key="n"
                    :label="n"
                    :value="n.toString()"
                  >
                    {{ n }}
                  </option>
                </select>
                <vs-button flat @click="update(cat)"> Обновить </vs-button>
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

    <vs-dialog v-model="addnew" not-center id="add_new_cat" width="400px">
      <template #header>
        <h4 class="not-margin">Добавить новую категорию</h4>
      </template>

      <div class="con-form">
        <div class="line">
          <label for="cat_name"> Название </label>
          <input
            type="text"
            name="cat_name"
            id="cat_name"
            v-model="new_cat.cat_name"
            @input="enterCatName"
          />
          <span></span>
        </div>
        <div class="line">
          <label> Время работы </label>
          <div class="inset">
            <input type="number" v-model="new_cat.working[0]" />
            <input type="number" v-model="new_cat.working[1]" />
          </div>
        </div>
      </div>

      <template #footer>
        <div class="footer-dialog">
          <vs-button block @click="addNewCat" size="large">Добавить</vs-button>
        </div>
      </template>
    </vs-dialog>
  </div>
</template>

<script>
import { Icon } from "@iconify/vue2";
import cyrillicToTranslit from "cyrillic-to-translit-js";

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
    new_cat: {
      cat_name: "",
      cat_slug: "",
      working: ["", ""],
    },
  }),
  async created() {
    this.$store.state.active = "products_cat";

    await this.getAll();
  },
  watch: {
    selected(val) {
      if (this.selected.length == this.cats.length) {
        this.allSelected = true;
      } else {
        this.allSelected = false;
      }
    },
  },
  methods: {
    getAll() {
      const loading = this.$vs.loading();

      this.$axios
        .get(`${process.env.VUE_APP_MAIN_URL}/admin/category`, {
          headers: {
            token: localStorage.getItem("token"),
          },
        })
        .then(
          (res) => {
            this.cats = res.data.doc.map((element) => ({
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

    addNew() {
      this.addnew = true;
    },
    enterCatName() {
      this.new_cat.cat_slug = cyrillicToTranslit()
        .transform(this.new_cat.cat_name, "_")
        .toLowerCase();
    },

    addNewCat() {
      this.$axios
        .post(
          `${process.env.VUE_APP_MAIN_URL}/admin/category`,
          {
            name: this.new_cat.cat_name,
            slug: this.new_cat.cat_slug,
            working: this.new_cat.working,
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
                title: "Новая категория добавлена",
              });

              this.new_cat.cat_name = "";
              this.new_cat.cat_slug = "";
              this.new_cat.working = ["", ""];
            }
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
        this.cats.map((item) => {
          this.selected.push(item._id);
          item.selected = true;
        });
      } else {
        this.selected = [];
        this.cats.map((item) => {
          item.selected = false;
        });
      }
    },

    async confirm() {
      await this.$axios
        .post(
          `${process.env.VUE_APP_MAIN_URL}/admin/category/action`,
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

    update(cat) {
      console.log(cat);
      this.$axios
        .put(`${process.env.VUE_APP_MAIN_URL}/admin/category/`, cat, {
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
                title: "Время работы категории обновлена",
              });
            }
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
</style>

<style lang="scss" scoped>
h1 {
  display: flex;
  align-items: center;

  button {
    margin: 0 0 0 15px;
  }
}

.cat {
  font-family: "Oswald", sans-serif;
}

select {
  width: 60px;
  text-align: center;
  height: 30px !important;
  padding: 0px !important;
}
</style>