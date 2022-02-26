<template>
  <div class="pages add default">
    <h1>Добавить новый</h1>

    <div class="wrap">
      <div class="content">
        <div class="line">
          <label for="name">Название</label>
          <input
            type="text"
            id="name"
            name="name"
            v-model="form.name"
            @input="slugGenerate"
          />
          <Icon icon="bi:pencil" />
        </div>

        <div class="slug">
          <span>/</span>
          <input type="text" v-if="form.slug" v-model="form.slug" />
        </div>

        <VueEditor
          v-model="form.content"
          :editorToolbar="toolbar"
          id="editor"
        />
      </div>
      <div class="publish">
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
        <vs-button flat size="large" block @click="createPage"
          >Опубликовать</vs-button
        >
      </div>
    </div>

    <vs-dialog v-model="created" :not-close="true">
      <template #header>
        <h4 class="not-margin">Страница успешно добавлен</h4>
      </template>

      <template #footer>
        <div class="footer-dialog">
          <vs-button flat @click="addMore"> Добавить еще </vs-button>
          <vs-button @click="$router.push('/dashboard/pages')">
            В список страниц
          </vs-button>
        </div>
      </template>
    </vs-dialog>
  </div>
</template>

<script>
import cyrillicToTranslit from "cyrillic-to-translit-js";
import { VueEditor } from "vue2-editor";
import { Icon } from "@iconify/vue2";

import vueFilePond, { setOptions } from "vue-filepond";
import store from "../../store";

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
    url: process.env.VUE_APP_MAIN_URL + "/admin/page/upload/image",
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
  name: "Add",
  components: {
    VueEditor,
    Icon,
  },
  data: () => ({
    form: {
      name: "",
      slug: "",
      content: "",
    },
    created: false,
    toolbar: [
      // [{ header: [false, 1, 2, 3, 4, 5, 6] }],
      [{ size: ["small", false, "large", "huge"] }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["image", "code-block"],
    ],
  }),
  created() {
    this.$store.state.active = "pages_add";
  },
  methods: {
    slugGenerate() {
      this.form.slug = cyrillicToTranslit()
        .transform(this.form.name, "_")
        .toLowerCase();
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

    createPage() {
      this.$axios
        .post(
          `${process.env.VUE_APP_MAIN_URL}/admin/page`,
          {
            name: this.form.name,
            slug: this.form.slug,
            content: this.form.content,
            image: this.$store.state.imagename,
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
                title: "Страница добавлена",
              });

              this.created = true;
            }
          },
          (err) => {
            if (err) {
              this.$vs.notification({
                progress: "auto",
                position: "bottom-right",
                color: "error",
                title: "Страница с таким названием уже существует",
              });
            }
          }
        );
    },

    addMore() {
      window.open("/dashboard/pages/add/", "_self");
    },
  },
};
</script>

<style lang="scss" scoped>
</style>