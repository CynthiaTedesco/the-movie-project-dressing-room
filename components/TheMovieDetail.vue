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
            <div v-if="showSave" class="save-btn" @click="save">Save changes?</div>
            <div class="insights">
              <input-detail
                label="Revenue"
                field="revenue"
                @change="onChange"
                :initial-value="movie.more.revenue"
                :money="true"
              />
              <input-detail
                :textarea="true"
                label="Overview"
                field="overview"
                :rows="5"
                @change="onChange"
                :initial-value="movie.more.overview"
              />
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
                <b-collapse
                  :id="item.title"
                  :visible="cardHeaderClasses(item.title).indexOf('missing')>-1"
                  accordion="my-accordion"
                  role="tabpanel"
                >
                  <b-card-body>
                    <component :is="item.component" v-bind="movie.more" @change="onChange" />
                  </b-card-body>
                </b-collapse>
              </b-card>
            </div>
          </div>
          <div class="col-12 footer d-none d-md-flex">
            <nav class="navbar navbar-expand-md">
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
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import OtherDetails from '@/components/MovieDetails/OtherDetails';
import ReleaseDetail from '@/components/MovieDetails/ReleaseDetail';
import ProductionDetail from '@/components/MovieDetails/ProductionDetail';
import ScriptDetail from '@/components/MovieDetails/ScriptDetail';
import StoryDetail from '@/components/MovieDetails/StoryDetail';
import InputDetail from '@/components/MovieDetails/Form/InputDetail';

library.add(faTimes)
Vue.component('font-awesome-icon', FontAwesomeIcon)

export default {
  components: {
    OtherDetails,
    ReleaseDetail,
    ProductionDetail,
    ScriptDetail,
    StoryDetail,
    InputDetail
  },
  data () {
    return {
      fields: [
        { title: 'Story', component: 'StoryDetail' },
        { title: 'Script', component: 'ScriptDetail' },
        { title: 'Production', component: 'ProductionDetail' },
        { title: 'Release', component: 'ReleaseDetail' },
        { title: 'Other Data', component: 'OtherDetails' }
      ],
      changes: {},
      showSave: false
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
    onChange ({ field, value, reset, subfield, list }) {
      let sameValueAsInitial = false;
      if (value) {
        const initialValue = !subfield ?
          this.movie.more[field] :
          (this.movie.more[field] ? this.movie.more[field][subfield] : null);
        sameValueAsInitial = JSON.stringify(initialValue) === JSON.stringify(value);
      } else if (list) {
        if (list.length !== this.movie.more[field].length) {
          sameValueAsInitial = false; //we added or deleted something
        } else {
          const equality = this.movie.more[field].map((item, index) => {
            const plainEquality =
              item.name === list[index].name &&
              item.gender === list[index].gender &&
              item.date_of_birth === list[index].date_of_birth;
            const relationEquality =
              item[subfield].primary === list[index][subfield].primary &&
              item[subfield].main === list[index][subfield].main &&
              item[subfield].character_name === list[index][subfield].character_name &&
              item[subfield].type === list[index][subfield].type

            return plainEquality && relationEquality
          });
          sameValueAsInitial = equality.reduce((curr, next) => curr && next, true);
        }
      }

      if (reset || sameValueAsInitial) {
        if (this.changes[field]) {
          delete this.changes[field];
        }
      } else {
        if (!this.changes[field]) {
          this.changes[field] = [];
        }
        let toPush;
        if (value) {
          if(subfield){
            toPush = {};
            toPush[subfield] = value;
          } else {
            toPush = value;
          }
        } else if (list) {
          toPush = { list };
        }
        this.changes[field].push(toPush);
      }

      this.showSave = Object.keys(this.changes).length > 0;
    },
    close () {
      this.changes = {};
      this.showSave = false;
      this.$emit('close');
    },
    save () {
      let revenueHasChanged = false;
      console.log('saving', this.movie.title);

      //prepare changes
      Object.keys(this.changes).forEach(field => {
        if (field === 'revenue') {
          revenueHasChanged = true;
        }
        //we only keep the last change 
        this.changes[field] = this.changes[field].pop();
        if (this.changes[field].list) {
          this.changes[field] = this.changes[field].list;
        }
      });

      this.$store.dispatch('movies/updateMovie', {
        id: this.movie.more.id,
        updates: this.changes
      }).then(updatedMovie => {
        this.$parent.updatedMovie(updatedMovie, revenueHasChanged);
        this.$toast.success(`${this.movie.title} has been succesfully updated!`);
      })

      this.close();
    }
  }}
</script>

<style lang="scss" scoped>
@import '~/assets/styles/common.scss';

.header {
  position: fixed;
  width: 88vw;
  max-width: 684px;
  background: white;
  z-index: 1;

  @include media-breakpoint-up(md) {
    width: 58vw;
  }

  @include media-breakpoint-up(lg) {
    width: 48%;
    max-width: none;
  }

  .navbar {
    border-bottom: 1px solid #d0d0d0;
    h2 {
      margin: 1rem;
      white-space: nowrap;
      overflow: hidden;
    }
  }
}

.footer {
  padding: 0.5rem 1rem;
}
.close {
  position: absolute;
  right: 30px;
  font-size: 35px;
}

.save-btn {
  background-color: $blue;
  border-radius: 10px;
  position: fixed;
  bottom: 21px;
  right: 25px;
  color: white;
  font-size: 14px;
  font-style: italic;
  padding: 10px;
  z-index: 1;
  cursor: pointer;
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
    max-width: none;
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
    padding: 1rem 2rem;
    position: absolute;
    top: 150px;

    @include media-breakpoint-up(xsm) {
      top: 100px;
    }

    /deep/ .detail-row {
      display: grid;
      grid-template-columns: 80px auto 1px;
      margin-bottom: 0.5rem;

      &.big-label {
        grid-template-columns: 100px auto 0px;
      }

      &.column {
        grid-template-columns: 100%;
        grid-template-rows: 1fr auto;
        position: relative;

        svg.reset {
          position: absolute;
          right: 0;
          // top: -10px;
        }
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