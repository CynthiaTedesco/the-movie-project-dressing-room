<template>
  <div class="movie-detail">
    <transition name="fade">
      <div v-if="show" class="sidenav-backdrop" @click="$emit('close')"></div>
    </transition>
    <transition name="slide-side">
      <div class="sidenav-container container" v-if="show">
        <div class="row justify-content-md-center no-gutters sidenav">
          <div class="col-12 header">
            <nav class="navbar navbar-expand-md">
              <button type="button" class="close" aria-label="Close" @click="$emit('close')">
                <i class="icon-close"></i>
              </button>
            </nav>
          </div>
          <div class="col-12 menu-content">
            <ul class="nav flex-column sidebar-nav" @click="$emit('close')">
              {{movie.title}}
              <!-- <li v-for="menuItem in menuItems" :key="menuItem.title" class="nav-item">
                <nuxt-link :to="menuItem.route" class="nav-link">{{ $t(menuItem.title) }}</nuxt-link>
              </li>-->
            </ul>
          </div>
          <div class="col-11 footer d-none d-md-flex">
            <nav class="navbar navbar-expand-md">
              <span>Follow us:</span>
              <ul class="navbar-nav ml-auto social-networks">
                <!-- <li v-for="socialItem in socialItems" :key="socialItem.name" class="nav-item">
                  <a :href="socialItem.href" target="_blank" class="fa-lg link-dark">
                    <i :class="socialItem.icon"></i>
                  </a>
                </li>-->
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    movie: {
      type: Object,
      default: () => { }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/styles/common.scss';

.close {
  color: $dark;
  opacity: 1;

  &:not(:disabled):not(.disabled):hover {
    opacity: 1;
  }

  .icon-close {
    font-size: 20px;
    position: relative;
    width: 30px;
    height: 30px;
    display: inline-block;
    &:before {
      position: absolute;
      right: 5px;
      top: 5px;
    }

    @include media-breakpoint-up(sm) {
      font-size: 30px;
      width: 40px;
      height: 40px;
    }
  }
}
.sidenav-container {
  max-width: 684px;
  height: 100%;
  width: 90vw;
  position: fixed;
  top: 0;
  right: 0;
  z-index: 1050;

  @include media-breakpoint-up(md) {
    width: 60vw;
  }

  @include media-breakpoint-up(lg) {
    width: 49vw;
  }

  &.container {
    padding: 0;
    height: 100%;

    > .row {
      height: 100%;
      align-content: center;

      @include media-breakpoint-up(md) {
        align-content: space-between;
      }
    }
  }
}
.sidenav-backdrop {
  @include full-sized;
  background-color: $backdrop;
  z-index: 1000;
  position: fixed;
  top: 0;
  right: 0;
  opacity: 1;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease-in;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.sidenav {
  height: 100%;
  width: 100%;
  background-color: $white;
}

.slide-side-enter-active,
.slide-side-leave-active {
  transition: all 0.3s ease-in;
}
.slide-side-enter,
.slide-side-leave-to {
  transform: translateX(100%);
}
</style>