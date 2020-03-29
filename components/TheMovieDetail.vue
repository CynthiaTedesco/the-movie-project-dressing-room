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
              <h2>#{{movie.title}}</h2>
              <font-awesome-icon class="close" :icon="['fas', 'times']" @click="$emit('close')" />
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
          <div class="col-12 footer d-none d-md-flex">
            <nav class="navbar navbar-expand-md">
              <button type="button" class="btn btn-primary" @click="save">Save</button>
              <button type="button" class="btn btn-light" @click="$emit('close')">Cancel</button>
            </nav>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import Vue from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faTimes)
Vue.component('font-awesome-icon', FontAwesomeIcon)

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
  },
  methods: {
    save () {
      this.$emit('close');
      this.$toast.success(`${this.movie.title} has been succesfully updated!`);
      
      //TODO
      console.log('saving', this.movie.title);
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/styles/common.scss';

.header {
  .navbar {
    border-bottom: 1px solid #d0d0d0;
    h2 {
      margin: 1rem;
    }
  }
}

.footer {
  padding: 0.5rem 1rem;
  .navbar {
    margin-left: auto;
  }
}
.close {
  position: absolute;
  right: 30px;
  font-size: 35px;
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