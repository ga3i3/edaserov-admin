<template>
  <div class="default products add">
    <h1>Добавить новый товар</h1>

    <div class="wrap_main">
      <div class="content">
        <div class="line name">
          <label for="name">Название</label>
          <input
            type="text"
            id="name"
            class="default_input"
            v-model="form.name"
          />
          <Icon icon="bi:pen" />
        </div>
        <div class="line price">
          <label for="price">Цена</label>
          <input
            type="text"
            id="price"
            class="default_input"
            v-model="form.price"
          />
          <Icon icon="ph:currency-rub-bold" />
        </div>
        <div class="line">
          <label for="description">Описание</label>
          <textarea
            id="description"
            cols="30"
            rows="10"
            v-model="form.description"
          ></textarea>
          <Icon icon="bi:justify-left" />
        </div>
        <div class="line weight">
          <label for="weight">Вес</label>
          <input
            type="text"
            id="weight"
            class="default_input"
            v-model="form.weight"
          />
          <Icon icon="fluent:scales-24-regular" />
        </div>

        <div class="line stock">
          <label for="stock">Запасы</label>
          <input
            type="text"
            id="stock"
            class="default_input"
            v-model="form.stock"
          />
          <Icon icon="bi:box-seam" />
        </div>
        <div class="line">
          <label for="option">Опции</label>
          <div class="adding_option">
            <input type="text" class="default_input" id="option" />
            <vs-button flat @click="addOption"> Добавить </vs-button>
          </div>

          <Icon icon="bi:grid-3x3-gap" />

          <div class="options_list" v-if="form.options.length > 0">
            <ul>
              <li v-for="(option, index) in form.options" :key="index">
                <vs-input
                  v-model="form.options[index].name"
                  label-placeholder="Название опции"
                />
                <vs-input
                  v-model="form.options[index].price"
                  label-placeholder="Цена"
                />
                <vs-button flat danger @click="removeOption(index)">
                  Удалить
                </vs-button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="image">
        <file-pond
          name="test"
          ref="pond"
          label-idle="Перетащите картинку или кликните"
          v-bind:allow-multiple="false"
          accepted-file-types="image/jpeg, image/png"
          v-bind:files="form.myFiles"
          v-on:init="handleFilePondInit"
          v-on:processfile="onprocessfile"
          v-on:loaded="onload"
        />

        <div class="cat">
          <vs-select placeholder="Категория" v-model="form.cat">
            <vs-option label="Бизнес ланч" value="laych">
              Бизнес ланч
            </vs-option>
            <vs-option label="Салаты" value="salads"> Салаты </vs-option>
            <vs-option label="Супы" value="soups"> Супы </vs-option>
            <vs-option label="Горячее" value="hotter"> Горячее </vs-option>
            <vs-option label="Десерты" value="desserts"> Десерты </vs-option>
            <vs-option label="WOK" value="wok"> WOK </vs-option>
          </vs-select>
        </div>

        <vs-button relief size="large" block @click="publish">
          Добавить
        </vs-button>
      </div>
    </div>

    <vs-dialog v-model="repeat" :not-close="true">
      <template #header>
        <h4 class="not-margin">Товар успешно добавлен</h4>
      </template>

      <template #footer>
        <div class="footer-dialog">
          <vs-button flat @click="addMore"> Добавить еще </vs-button>
          <vs-button @click="$router.push('/dashboard/products')">
            В список товаров
          </vs-button>
        </div>
      </template>
    </vs-dialog>
  </div>
</template>

<script>
// Import Vue FilePond
import vueFilePond, { setOptions } from "vue-filepond";
import store from "../../store";
import { Icon } from "@iconify/vue2";

// Import FilePond styles
import "filepond/dist/filepond.min.css";

// Import FilePond plugins
// Please note that you need to install these plugins separately

// Import image preview plugin styles
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";

// Import image preview and file type validation plugins
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileRename from "filepond-plugin-file-rename";

// Create component
const FilePond = vueFilePond(
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview,
  FilePondPluginFileRename
);

const labels_RU = {
  // labelIdle: 'Drag & Drop your files or <span class="filepond--label-action"> Browse </span>'
  labelIdle:
    'Перетащите или выберите <span class="filepond--label-action"> Изображение </span>',
  // labelInvalidField: 'Field contains invalid files',
  labelInvalidField: "Поле содержит недопустимые файлы",
  // labelFileWaitingForSize: 'Waiting for size',
  labelFileWaitingForSize: "Укажите размер",
  // labelFileSizeNotAvailable: 'Size not available',
  labelFileSizeNotAvailable: "Размер не поддерживается",
  // labelFileLoading: 'Loading',
  labelFileLoading: "Ожидание",
  // labelFileLoadError: 'Error during load',
  labelFileLoadError: "Ошибка при ожидании",
  // labelFileProcessing: 'Uploading',
  labelFileProcessing: "Загрузка",
  // labelFileProcessingComplete: 'Upload complete',
  labelFileProcessingComplete: "Загрузка завершена",
  // labelFileProcessingAborted: 'Upload cancelled',
  labelFileProcessingAborted: "Загрузка отменена",
  // labelFileProcessingError: 'Error during upload',
  labelFileProcessingError: "Ошибка при загрузке",
  // labelFileProcessingRevertError: 'Error during revert',
  labelFileProcessingRevertError: "Ошибка при возврате",
  // labelFileRemoveError: 'Error during remove',
  labelFileRemoveError: "Ошибка при удалении",
  // labelTapToCancel: 'tap to cancel',
  labelTapToCancel: "нажмите для отмены",
  // labelTapToRetry: 'tap to retry',
  labelTapToRetry: "нажмите, чтобы повторить попытку",
  // labelTapToUndo: 'tap to undo',
  labelTapToUndo: "нажмите для отмены последнего действия",
  // labelButtonRemoveItem: 'Remove',
  labelButtonRemoveItem: "Удалить",
  // labelButtonAbortItemLoad: 'Abort',
  labelButtonAbortItemLoad: "Прекращено",
  // labelButtonRetryItemLoad: 'Retry',
  labelButtonRetryItemLoad: "Повторите попытку",
  // labelButtonAbortItemProcessing: 'Cancel',
  labelButtonAbortItemProcessing: "Отмена",
  // labelButtonUndoItemProcessing: 'Undo',
  labelButtonUndoItemProcessing: "Отмена последнего действия",
  // labelButtonRetryItemProcessing: 'Retry',
  labelButtonRetryItemProcessing: "Повторите попытку",
  // labelButtonProcessItem: 'Upload',
  labelButtonProcessItem: "Загрузка",
  // labelMaxFileSizeExceeded: 'File is too large',
  labelMaxFileSizeExceeded: "Файл слишком большой",
  // labelMaxFileSize: 'Maximum file size is {filesize}',
  labelMaxFileSize: "Максимальный размер файла: {filesize}",
  // labelMaxTotalFileSizeExceeded: 'Maximum total size exceeded',
  labelMaxTotalFileSizeExceeded: "Превышен максимальный размер",
  // labelMaxTotalFileSize: 'Maximum total file size is {filesize}',
  labelMaxTotalFileSize: "Максимальный размер файла: {filesize}",
  // labelFileTypeNotAllowed: 'File of invalid type',
  labelFileTypeNotAllowed: "Файл неверного типа",
  // fileValidateTypeLabelExpectedTypes: 'Expects {allButLastType} or {lastType}',
  fileValidateTypeLabelExpectedTypes:
    "Tipos de arquivo suportados são {allButLastType} ou {lastType}",
  // imageValidateSizeLabelFormatError: 'Image type not supported',
  imageValidateSizeLabelFormatError: "Тип изображения не поддерживается",
  // imageValidateSizeLabelImageSizeTooSmall: 'Image is too small',
  imageValidateSizeLabelImageSizeTooSmall: "Изображение слишком маленькое",
  // imageValidateSizeLabelImageSizeTooBig: 'Image is too big',
  imageValidateSizeLabelImageSizeTooBig: "Изображение слишком большое",
  // imageValidateSizeLabelExpectedMinSize: 'Minimum size is {minWidth} × {minHeight}',
  imageValidateSizeLabelExpectedMinSize:
    "Минимальный размер: {minWidth} × {minHeight}",
  // imageValidateSizeLabelExpectedMaxSize: 'Maximum size is {maxWidth} × {maxHeight}',
  imageValidateSizeLabelExpectedMaxSize:
    "Максимальный размер: {maxWidth} × {maxHeight}",
  // imageValidateSizeLabelImageResolutionTooLow: 'Resolution is too low',
  imageValidateSizeLabelImageResolutionTooLow: "Разрешение слишком низкое",
  // imageValidateSizeLabelImageResolutionTooHigh: 'Resolution is too high',
  imageValidateSizeLabelImageResolutionTooHigh: "Разрешение слишком высокое",
  // imageValidateSizeLabelExpectedMinResolution: 'Minimum resolution is {minResolution}',
  imageValidateSizeLabelExpectedMinResolution:
    "Минимальное разрешение: {minResolution}",
  // imageValidateSizeLabelExpectedMaxResolution: 'Maximum resolution is {maxResolution}'
  imageValidateSizeLabelExpectedMaxResolution:
    "Максимальное разрешение: {maxResolution}",
};
setOptions(labels_RU);

setOptions({
  server: {
    url: process.env.VUE_APP_MAIN_URL + "/admin/product/upload/image",
    headers: {
      token: localStorage.getItem("token"),
    },
    process: {
      method: "POST",
      headers: {
        token: localStorage.getItem("token"),
      },
      withCredentials: false,
      onload: (response) => {
        store.state.imagename = JSON.parse(response).filename;
      },
      onerror: (response) => console.log(response),
    },
  },
});

export default {
  name: "AddProduct",
  components: {
    FilePond,
    Icon,
  },
  data: () => ({
    repeat: false,
    form: {
      name: "",
      price: "",
      description: "",
      weight: "",
      stock: "",
      options: [],
      myFiles: [],
      imagename: store.state.imagename,
      cat: "",
    },
  }),
  async created() {
    this.$store.state.active = "products_add";
  },
  methods: {
    addOption() {
      let nameOfOption = document.getElementById("option").value;
      if (nameOfOption.length != 0) {
        this.form.options.push({
          name: nameOfOption,
          price: null,
        });
        document.getElementById("option").value = "";
      } else {
        this.$vs.notification({
          progress: "auto",
          position: "bottom-right",
          color: "danger",
          title: "Введите название опции",
        });
      }
    },
    removeOption(index) {
      this.form.options.splice(index, 1);
      console.log(this.form.options);
    },
    handleFilePondInit: function (err, file) {
      if (err) console.log(err);

      // FilePond instance methods are available on `this.$refs.pond`
    },
    onprocessfile: function (err, file) {
      if (err) console.log(err);
      // console.log("Filename", file);
      this.$refs.pond.onprocessfile = (error, file1) => {
        console.log("done", file1.serverId);
      };
    },
    onload: function (res) {
      console.log("RES", res);
    },

    async publish() {
      const data = {
        name: this.form.name,
        description: this.form.description,
        weight: this.form.weight,
        options: this.form.options,
        price: this.form.price,
        image: this.$store.state.imagename,
        cat: this.form.cat,
        stock: this.form.stock,
      };

      await this.$axios
        .post(`${process.env.VUE_APP_MAIN_URL}/admin/product`, data, {
          headers: {
            token: localStorage.getItem("token"),
          },
        })
        .then(
          (res) => {
            if (res.status == 200) {
              this.repeat = true;
            }
            console.log(res);
          },
          (err) => {
            console.log(err);
          }
        );
    },
    addMore() {
      window.open("/dashboard/products/add/", "_self");
    },
  },
};
</script>

<style lang="scss" scoped>
</style>