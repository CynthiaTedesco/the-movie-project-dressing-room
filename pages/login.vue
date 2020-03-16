<template>
  <div class="login">
    <img src="movie-film.jpg" alt />
    <form @submit.prevent>
      <div>
        <label for="username">User</label>
        <input
          id="username"
          v-model="userInfo.username"
          :class="{invalid: !userInfo.username && !valid}"
        />
      </div>

      <div>
        <label for="password">Password</label>
        <input
          id="password"
          v-model="userInfo.password"
          label="Password"
          :type="showPassword ? 'text' : 'password'"
          :class="{invalid: !userInfo.password && !valid}"
        />
      </div>
      <!-- :class="passwordClasses"
      @click="showPassword = !showPassword"-->

      <b-button @click="onSubmit">Login</b-button>
    </form>
  </div>
</template>
<script>
export default {
  name: 'login',
  data () {
    return {
      valid: true,
      //   validUsername: true,
      //   validPassword: true,
      showPassword: false,
      userInfo: {
        username: '',
        password: ''
      }
    }
  },
  computed: {
    passwordClasses () {
      return showPassword ?
        'fas fa-eye' : 'fas fa-eye-slash'
    },
    validForm () {
      return !!this.userInfo.username && !!this.userInfo.password;
    }
  },
  methods: {
    onSubmit () {
      this.valid = this.validForm;
      if (this.valid) {
        this.$store.dispatch("authenticateUser", {
          username: this.userInfo.username,
          password: this.userInfo.password
        })
          .then(() => {
            this.$router.push('/');
          });
      }
    }
  }
}
</script>

<style lang="scss" scoped>
div.login {
  text-align: center;
  padding-top: 4rem;

  img {
    width: 100%;
    height: 18rem;
  }
  form {
    display: flex;
    justify-content: center;
    flex-direction: column;
    padding: 3rem;

    > div {
      display: grid;
      grid-template-columns: 20% 80%;
      margin-bottom: 2rem;

      > label {
        text-align: right;
        padding-right: 1rem;
        margin-bottom: 0;
        line-height: 2em;
      }

      > input {
        border-color: #dad8d8;
        border-style: solid;
        border-width: thin;
        border-radius: 5px;
        border-radius: 5px;
        padding: 0.3rem 1rem;

        &.invalid {
          border-color: red;
        }
      }
    }

    > button {
      width: 100px;
      margin-left: auto;
    }
  }
}
</style>