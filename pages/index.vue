<template>
  <div>
    <b-table
      hover
      :items="movies"
      :fields="fields"
      :tbody-tr-class="rowClass"
    >
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
        <input type="checkbox" name="valid" id="valid" :checked="row.item.valid" />
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

<style>
</style>

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
      items: [{ name: "Joe", age: 33 }, { name: "Sue", age: 77 }],
      movies: []
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
  methods: {
    missingData (item) {
      //TODO create helper function to check real missing data
      const missingData = Math.random() > 0.5;
      return missingData
    },
    rowClass (item, type) {
      return item.missingData ? 'missing-data' : '';
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/ tr.missing-data {
  background: rgba(255, 0, 0, 0.15);
}
.more {
  cursor: pointer;
}
</style>