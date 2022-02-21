<template>
  <div class="auth">
    <div class="login">
      <div class="line">
        <label for="email">Email</label>
        <input type="text" name="email" id="email" v-model="login.email" />
        <Icon icon="bi:at" />
      </div>

      <div class="line">
        <label for="password">Пароль</label>
        <input
          type="password"
          name="password"
          id="password"
          v-model="login.password"
        />
        <Icon icon="bi:key" />
      </div>

      <vs-button flat block size="large" @click="auth" class="ma-0"
        >Войти</vs-button
      >
    </div>
  </div>
</template>

<script>
import { Icon } from "@iconify/vue2";

export default {
  name: "Home",
  components: {
    Icon,
  },
  data: () => ({
    login: {
      email: "",
      password: "",
    },
  }),
  methods: {
    auth() {
      this.$axios
        .post(`${process.env.VUE_APP_MAIN_URL}/admin/user/login`, this.login)
        .then(
          (res) => {
            if (res.status == 200) {
              localStorage.setItem("token", res.data.token);
              this.$router.push("/dashboard");
            }
          },
          (err) => {
            if (err.response) {
              this.$vs.notification({
                progress: "auto",
                position: "bottom-right",
                color: "error",
                title: "Неправильный логин или пароль",
              });
            }
            router.push("/");
          }
        );
    },
  },
};
</script>

<style lang="scss" scoped>
* {
  overflow-x: none !important;
  overflow-y: none !important;
}

.auth {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  .login {
    width: 350px;
  }
}

.line {
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  position: relative;

  label {
    margin-bottom: 10px;
    font-weight: 500;
  }

  input {
    width: 100%;
    height: 40px;
    border-radius: 9px;
    border: 2px solid #ddd;
    padding: 0 15px 0 35px;
    font-size: 18px;

    &:focus {
      border-color: #ef7b4f;
    }
  }

  svg {
    position: absolute;
    left: 10px;
    font-size: 20px;
    top: 39px;
  }

  button {
    margin: 0 !important;
  }
}
</style>