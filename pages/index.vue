<template>
  <div class="home">
    <b-col lg="12" class="filters">
      <b-form-group
        label-cols-sm="3"
        label-align-sm="right"
        label-size="sm"
        description="Leave all unchecked to filter on all data"
        class="mb-0"
      >
        <b-form-checkbox-group class="mt-1">
          <b-form-checkbox @change="updateValidFilter" value="valid">Only invalid</b-form-checkbox>
          <b-form-checkbox @change="updateMissingFilter" value="missingData">Only with missing data</b-form-checkbox>
        </b-form-checkbox-group>
      </b-form-group>
    </b-col>
    <b-table hover :items="filteredMovies " :fields="fields" :tbody-tr-class="rowClass">
      <template v-slot:cell(title)="row">
        <span>
          <font-awesome-icon
            v-if="!row.item.valid"
            :icon="['fas', 'exclamation']"
            title="Invalid movie"
          />
          {{row.item.title}}
        </span>
      </template>
      <template v-slot:cell(valid)="row">
        <input type="checkbox" 
          name="valid" id="valid" 
          :checked="row.item.valid" 
          @change="toggleValidity(row.item.more.id)"/>
      </template>
      <template v-slot:cell(releaseDate)="row">{{(new Date(row.item.releaseDate)).getFullYear()}}</template>
      <template v-slot:cell(more)="row">
        <font-awesome-icon
          class="more"
          :icon="['fas', row.item.missingData ? 'edit' : 'eye']"
          @click="openModal(row.item.more)"
        />
      </template>
    </b-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { beautifyCashValue } from '@/assets/js/helpers.js'
import Vue from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faEdit, faEye, faExclamation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faEdit)
library.add(faEye)
library.add(faExclamation)

Vue.component('font-awesome-icon', FontAwesomeIcon)

export default {
  data () {
    return {
      fields: [
        { key: 'title', sortable: true },
        { key: 'releaseDate', sortable: true, label: 'Year' },
        { key: 'revenue', sortable: true },
        { key: 'valid' },
        { key: 'more' },
      ],
      movies: [],
      filters: [],
    };
  },
  mounted () {
    this.movies = this.$store.getters['movies/sortedList']().map(movie => {
      return {
        title: movie.title,
        revenue: beautifyCashValue(movie.revenue),
        releaseDate: movie.release_date,
        valid: movie.valid,
        missingData: this.missingData(movie),
        more: movie
      }
    });
  },
  computed: {
    filteredMovies () {
      if (this.filters.length) {
        return this.movies.filter(movie => {
          return this.filters.reduce((total, current) => {
            switch (current) {
              case 'valid':
                return total && !movie[current];
              default:
                return total && movie[current];
            }
          }, true);
        });
      } else {
        return this.movies;
      }
    }
  },
  methods: {
    toggleValidity (id) {
      this.$axios.post('/toggleValidity', { movie: id })
        .catch(err => { console.log("something failed while toggling validity", err) });
    },
    missingData (item) {
      //TODO create helper function to check real missing data
      const missingData = Math.random() > 0.5;
      return missingData
    },
    rowClass (item, type) {
      return item.missingData ? 'missing-data' : '';
    },
    updateValidFilter (filter, ) {
      if (filter) {
        this.filters.push(filter);
      } else {
        this.filters.splice(this.filters.indexOf('valid'), 1);
      }
    },
    updateMissingFilter (filter) {
      if (filter) {
        this.filters.push(filter);
      } else {
        this.filters.splice(this.filters.indexOf('missingData'), 1);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.home {
  margin-top: 2rem;
  .filters {
    text-align: right;
    .custom-checkbox:last-child {
      margin-right: 0;
    }
  }
  /deep/ tr.missing-data {
    background: rgba(255, 0, 0, 0.15);
  }
  .more {
    cursor: pointer;
  }
}
</style>