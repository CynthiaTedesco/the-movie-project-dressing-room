<template>
  <div class="login">
    <form @submit.prevent="onSubmit">
      <div>
        <label for="email">Email</label>
        <input id="email" v-model="userInfo.email" label="Email" />
      </div>

      <div>
        <label for="password">Password</label>
        <input
          id="password"
          v-model="userInfo.password"
          label="Password"
          :type="showPassword ? 'text' : 'password'"
        />
      </div>
      <!-- :class="passwordClasses"
      @click="showPassword = !showPassword"-->

      <b-button :disabled="!valid">Login</b-button>
    </form>
  </div>
</template>
<script>
export default {
  data () {
    return {
      valid: true,
      showPassword: false,
      hasName: false,
      userInfo: {
        email: '',
        password: ''
      }
    }
  },
  computed: {
    passwordClasses () {
      return showPassword ?
        'fas fa-eye' : 'fas fa-eye-slash'
    }
  },
  methods: {
    onSubmit () {
      //validate
      alert('you pressed a button!');
    }
  }
}
</script>

<style lang="scss" scoped>
div.login {
  text-align: center;
  padding-top: 10rem;

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
      }
    }

    > button {
      width: 100px;
      margin-left: auto;
    }
  }
}
</style>