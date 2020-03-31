<template>
  <div class="movie-detail">
    <transition name="fade">
      <div v-if="show" class="sidenav-backdrop" @click="close"></div>
    </transition>
    <transition name="slide-side">
      <div class="sidenav-container container" v-if="show">
        <div class="row justify-content-md-center no-gutters sidenav">
          <div class="col-12 header">
            <nav class="navbar navbar-expand-md">
              <h2>#{{movie.position}} {{movie.title}}</h2>
              <font-awesome-icon class="close" :icon="['fas', 'times']" @click="close" />
            </nav>
          </div>
          <div class="col-12 menu-content">
            <div class="insights">
              <label for="overview">Overview:</label>
              <div id="overview" @click="editing='overview'">
                <textarea
                  rows="5"
                  v-if="editing==='overview'"
                  type="text"
                  :value="movie.more.overview"
                  @keyup.esc="editing=''"
                  @blur="editing=''"
                />
                <template v-else>
                  <span v-if="this.movie.more.overview">{{this.movie.more.overview}}</span>
                  <span v-else>Missing</span>
                </template>
              </div>
            </div>
            <div role="tablist">
              <b-card no-body class="mb-1" v-for="item in fields" :key="item.title">
                <b-card-header
                  header-tag="header"
                  role="tab"
                  :class="cardHeaderClasses(item.title)"
                >
                  <b-button block href="#" v-b-toggle="item.title" variant="info">{{item.title}}</b-button>
                </b-card-header>
                <b-collapse :id="item.title" visible accordion="my-accordion" role="tabpanel">
                  <b-card-body>
                    <component :is="item.component" v-bind="movie.more" />
                  </b-card-body>
                </b-collapse>
              </b-card>
            </div>
          </div>
          <div class="col-12 footer d-none d-md-flex">
            <nav class="navbar navbar-expand-md">
              <button type="button" class="btn btn-primary" @click="save">Save</button>
              <button type="button" class="btn btn-light" @click="close">Cancel</button>
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
import OtherDetails from '@/components/MovieDetails/OtherDetails';
import ReleaseDetail from '@/components/MovieDetails/ReleaseDetail';
import ProductionDetail from '@/components/MovieDetails/ProductionDetail';
import ScriptDetail from '@/components/MovieDetails/ScriptDetail';
import StoryDetail from '@/components/MovieDetails/StoryDetail';

library.add(faTimes)
Vue.component('font-awesome-icon', FontAwesomeIcon)

export default {
  components: { OtherDetails, ReleaseDetail, ProductionDetail, ScriptDetail, StoryDetail },
  data () {
    return {
      fields: [
        { title: 'Story', component: 'StoryDetail' },
        { title: 'Script', component: 'ScriptDetail' },
        { title: 'Production', component: 'ProductionDetail' },
        { title: 'Release', component: 'ReleaseDetail' },
        { title: 'Other Data', component: 'OtherDetails' }
      ],
      editing: ''
    }
  },
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
  computed: {
    missingStory () { return this.movie.missingData.find(md => md.menu === 'Story') },
    missingScript () { return this.movie.missingData.find(md => md.menu === 'Script') },
    missingProduction () { return this.movie.missingData.find(md => md.menu === 'Production') },
    missingRelease () { return this.movie.missingData.find(md => md.menu === 'Release') }
  },
  methods: {
    cardHeaderClasses (card) {
      switch (card) {
        case 'Story': { return this.missingStory ? 'missing' : '' }
        case 'Script': { return this.missingScript ? 'missing' : ' ' }
        case 'Production': { return this.missingProduction ? 'missing' : ' ' }
        case 'Release': { return this.missingRelease ? 'missing' : ' ' }
        default: return ''
      }
    },
    close () {
      this.editing = '';
      this.$emit('close');
    },
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
  overflow: auto;
  background: white;
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

  .menu-content {
    padding: 3rem;

    .insights {
      display: grid;
      grid-template-columns: 80px auto;
      margin-bottom: 2rem;

      label {
        font-weight: bold;
        font-size: 0.7em;
        margin-top: 4px;
        text-transform: uppercase;
      }

      textarea {
        width: 100%;
        padding: 1rem;
        font-size: 0.8em;
      }
    }

    .card {
      border: none;
      background: transparent;
      margin-top: 1rem;

      header {
        border: none;
        background: transparent;
        padding: 0;

        &.missing {
          background: rgba(255, 192, 203, 0.3);
        }
        a {
          color: #000;
          background: transparent;
          outline: none;
          border: none;
          border-bottom: 1px solid #dedede;
          text-transform: uppercase;
          font-size: 0.7em;
          font-weight: bold;
          text-align: left;
          box-shadow: none;
          padding-left: 0;

          &:focus,
          &:hover {
            box-shadow: none;
          }
        }
      }

      div {
        background: rgba(230, 230, 230, 0.47);
      }
    }
  }
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