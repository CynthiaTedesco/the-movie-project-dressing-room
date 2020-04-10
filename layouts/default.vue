<template>
  <div>
    <!-- <img src="movie-film.jpg" alt /> -->
    <nuxt />
  </div>
</template>

<script>
export default {
  middleware: ['check-auth', 'auth']
};
</script>

<style lang="scss" scoped>
@import '~/assets/styles/common.scss';

div {
  max-width: 1140px;
  margin: auto;
}
.dressing-alert.toasted.toasted-primary {
  display: flex;
  font-size: 16px;
  justify-content: center;
  min-height: 50px;
  font-weight: 400;

  &.success {
    background-color: $green;
  }

  &.error {
    background-color: $red;
  }
}

</style>
<style>
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
img {
  width: 100%;
  height: 18rem;
}

</style>
