<template>
  <div class="home">
    <div class="bulk">
      <div class="bulk-title">Bulk functions</div>
      <div class="bulk-functions">
        <small>Bulk functions will iterate and process each of the movies. Be aware that this procedure may take several minutes.</small>
        <br />
        <br />
        <b-button @click="updatePeopleDetails">Update people details</b-button>
        <small>(gender and birthdate)</small>
        <div class="mt-1">
          <b-button @click="updateRevenues">Update revenues</b-button>
        </div>
        <div class="mt-1">
          <b-button @click="updateAll">Autoupdate all movies</b-button>
        </div>
      </div>
      <b-modal ref="bulkModal" hide-footer no-close-on-backdrop no-close-on-esc hide-header>
        <div class="d-block text-center">
          <div class="bulk-modal-content">
            <span>{{`${bulkAction} being processed...`}}</span>
            <font-awesome-icon icon="spinner" spin />
          </div>
        </div>
      </b-modal>
    </div>
    <div v-if="showSave" class="save-btn" @click="updateMoviesInSitu">Save changes?</div>
    <b-col lg="12" class="filters">
      <b-button @click="showColumnFilters = !showColumnFilters">Filter columns</b-button>
      <b-button @click="showRowFilters = !showRowFilters">Filter rows</b-button>
      <b-form-group
        label-cols-sm="3"
        label-align-sm="right"
        label-size="sm"
        class="mb-0 mt-1"
        v-if="showColumnFilters"
      >
        <div class="columns-checkbox mt-1">
          <b-form-checkbox @change="updateColumns('universe')" value="valid">Universe</b-form-checkbox>
          <b-form-checkbox @change="updateColumns('cinematography')" value="valid">Cinematography</b-form-checkbox>
          <b-form-checkbox @change="updateColumns('serie')" value="valid">Serie</b-form-checkbox>
          <b-form-checkbox @change="updateColumns('origin')" value="valid">Origin</b-form-checkbox>
          <b-form-checkbox @change="updateColumns('language')" value="valid">Language</b-form-checkbox>
        </div>
      </b-form-group>
      <b-form-group
        label-cols-sm="3"
        label-align-sm="right"
        label-size="sm"
        description="Leave all unchecked to filter on all data"
        class="mb-0"
        v-if="showRowFilters"
      >
        <b-form-checkbox-group class="mt-1">
          <b-form-checkbox @change="updateValidFilter" value="valid">Only invalid</b-form-checkbox>
          <b-form-checkbox @change="updateMissingFilter" value="missingData">Only with missing data</b-form-checkbox>
        </b-form-checkbox-group>
      </b-form-group>
    </b-col>
    <b-table
      hover
      :items="filteredMovies "
      :fields="fields.filter(f=>f.show)"
      :tbody-tr-class="rowClass"
    >
      <template v-slot:cell(position)="row">
        <span v-if="row.item.position" class="position">#{{row.item.position}}</span>
        <font-awesome-icon v-else :icon="['fas', 'exclamation-circle']" title="Invalid movie" />
      </template>
      <template v-slot:cell(title)="row">
        <span class="title">{{row.item.title}}</span>
      </template>
      <template v-slot:cell(universe)="row">
        <autocomplete-detail
          v-if="!row.item.more.universe"
          :label="false"
          field="universe"
          :initial-value="row.item.more.universe"
          @change="onChange($event, row.item)"
          :hide-reset="true"
          dropdown-url="universes"
        />
        <template>{{row.item.more.universe ? row.item.more.universe.name : ''}}</template>
      </template>
      <template v-slot:cell(cinematography)="row">
        <autocomplete-detail
          v-if="!row.item.more.cinematography"
          :label="false"
          field="cinematography"
          :initial-value="row.item.more.cinematography"
          @change="onChange($event, row.item)"
          :hide-reset="true"
          dropdown-url="cinematographies"
        />
        <template>{{row.item.more.cinematography ? row.item.more.cinematography.name : ''}}</template>
      </template>
      <template v-slot:cell(serie)="row">
        <autocomplete-detail
          v-if="!row.item.more.serie"
          :label="false"
          field="serie"
          :initial-value="row.item.more.serie"
          @change="onChange($event, row.item)"
          :hide-reset="true"
          dropdown-url="series"
        />
        <template>{{row.item.more.serie ? row.item.more.serie.name : ''}}</template>
      </template>
      <template v-slot:cell(language)="row">
        <autocomplete-detail
          v-if="!row.item.more.languages.find(a=>a.movies_languages.primary)"
          :label="false"
          field="languages"
          subfield="primary"
          :initial-value="row.item.more.languages.find(a=>a.movies_languages.primary)"
          @change="onChange($event, row.item)"
          :hide-reset="true"
          dropdown-url="languages"
        />
        <template>{{row.item.more.languages.find(a=>a.movies_languages.primary) ? row.item.more.languages.find(a=>a.movies_languages.primary).name : ''}}</template>
      </template>
      <template v-slot:cell(origin)="row">
        <autocomplete-detail
          v-if="!row.item.more.story_origin"
          :label="false"
          field="story_origin"
          :initial-value="row.item.more.story_origin"
          @change="onChange($event, row.item)"
          :hide-reset="true"
          dropdown-url="origins"
        />
        <template>{{row.item.more.story_origin ? row.item.more.story_origin.name : ''}}</template>
      </template>
      <template v-slot:cell(valid)="row">
        <input
          class="validity-checkbox"
          type="checkbox"
          name="valid"
          id="valid"
          :checked="row.item.valid"
          @change="toggleValidity(row.item.more.id)"
        />
      </template>
      <template v-slot:cell(releaseDate)="row">{{(new Date(row.item.releaseDate)).getFullYear()}}</template>
      <template v-slot:cell(more)="row">
        <div class="more-column">
          <font-awesome-icon
            class="more"
            :icon="['fas', row.item.missingData.length ? 'edit' : 'eye']"
            @click="displayDetailSection(row.item)"
          />
          <font-awesome-icon
            class="trash"
            :icon="['fas', 'trash']"
            @click="deleteMovie(row.item)"
            title="delete"
          />
          <font-awesome-icon
            class="refresh"
            :icon="['fas', 'sync']"
            @click="refreshMovie(row.item)"
            title="Autoupdate"
          />
        </div>
      </template>
    </b-table>
    <the-movie-detail :show="displayDetail" :movie="currentMovie" @close="displayDetail = false" />
  </div>
</template>

<script>
import { beautifyCashValue, calculateMissingData } from '@/assets/js/helpers.js'
import TheMovieDetail from '@/components/TheMovieDetail';
import Vue from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faEdit, faEye, faExclamationCircle, faTrash, faSpinner, faFunnelDollar, faSync } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import AutocompleteDetail from '@/components/MovieDetails/Form/AutocompleteDetail'

library.add(faSpinner)
library.add(faEdit)
library.add(faEye)
library.add(faTrash)
library.add(faSync)
library.add(faExclamationCircle)

Vue.component('font-awesome-icon', FontAwesomeIcon)

export default {
  components: { TheMovieDetail, AutocompleteDetail },
  data () {
    return {
      showRowFilters: false,
      showColumnFilters: false,
      fields: [
        { key: 'position', sortable: true, label: '#', show: true },
        { key: 'title', sortable: true, show: true },
        { key: 'releaseDate', sortable: true, label: 'Year', show: true },
        { key: 'revenue', sortable: true, show: true },
        {          key: 'universe', sortable: true, show: false,
          sortByFormatted: true,
          formatter: (value, key, item) => item.more.universe ? item.more.universe.name : ''        },
        {          key: 'cinematography', sortable: true, show: false,
          sortByFormatted: true,
          formatter: (value, key, item) => item.more.cinematography ? item.more.cinematography.name : ''        },
        {          key: 'serie', sortable: true, show: false, sortByFormatted: true,
          formatter: (value, key, item) => item.more.serie ? item.more.serie.name : ''        },
        {          key: 'origin', sortable: true, show: false, sortByFormatted: true,
          formatter: (value, key, item) => item.more.story_origin ? item.more.story_origin.name : ''        },
        {          key: 'language', sortable: true, show: false, sortByFormatted: true,
          formatter: (value, key, item) => item.more.languages.find(a => a.primary) ? item.more.languages.find(a => a.primary).name : ''        },
        { key: 'valid', show: true },
        { key: 'more', show: true },
      ],
      displayDetail: false,
      currentMovie: null,
      movies: [],
      filters: [],
      bulkAction: '',
      showSave: false,
      changes: {}
    };
  },
  mounted () {
    let position = 1;
    this.movies = this.$store.getters['movies/sortedList']().map(movie => {
      return {
        position: movie.valid ? position++ : null,
        title: movie.title,
        revenue: beautifyCashValue(movie.revenue),
        releaseDate: movie.release_date,
        valid: movie.valid,
        missingData: calculateMissingData(movie),
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
                return total && movie[current] && movie[current].length;
            }
          }, true);
        });
      } else {
        return this.movies;
      }
    }
  },
  methods: {
    updateColumns (columnName) {
      this.fields = this.fields.map(field => {
        if (field.key === columnName) {
          field.show = !field.show
        }
        return field;
      })
    },
    updateMoviePositions (updated, toggle) {
      let position = 1;

      this.movies = this.movies.map(m => {
        if (toggle) {
          if (m.more.id === updated) {
            m.valid = !m.valid;
          }
        }
        m.position = m.valid ? position++ : null;
        return m;
      });
    },
    async updatedMovie (updated, sort) {
      const fullMovie = await this.$axios.get(`movies/${updated.id}`);

      let updatedMovies = this.movies.map(m => {
        if (m.more.id === updated.id) {
          m.revenue = beautifyCashValue(updated.revenue);
          m.releaseDate = updated.release_date;
          m.more = fullMovie.data;
          m.missingData = calculateMissingData(fullMovie.data);
        }
        return m;
      });

      if (sort) {
        updatedMovies = updatedMovies
          .sort((a, b) => -parseInt(a.revenue) + parseInt(b.revenue))
        this.movies = updatedMovies;
        this.updateMoviePositions(updated.id);
      }
      this.movies = updatedMovies;
    },
    refreshMovie (movie) {
      const fn = () => {
        return this.$store.dispatch('movies/autoUpdate', movie.more.imdb_id)
      }
      this.bulkActionFn('Movie update is', null, fn)
        .then(() => {
          // this.movies = this.movies.filter(fm => fm.more.id !== movie.more.id);
          // if (movie.position) {
          this.updateMoviePositions();
          // }
          // this.$toast.success(`Auto update successfuly done`);
        })
    },
    deleteMovie (movie) {
      this.$store.dispatch('movies/deleteMovie', movie.more.id).then(() => {
        this.movies = this.movies.filter(fm => fm.more.id !== movie.more.id);
        if (movie.position) {
          this.updateMoviePositions();
        }
        this.$toast.success(`${movie.more.title} successfuly removed`);
      })
    },
    displayDetailSection (item) {
      this.displayDetail = !this.displayDetail;
      this.currentMovie = this.displayDetail ? item : null;
    },
    toggleValidity (id) {
      this.$axios.post(`/movies/${id}/toggleValidity`)
        .then(() => {
          this.updateMoviePositions(id, true);
        })
        .catch(err => { console.log("something failed while toggling validity", err) });
    },
    rowClass (item, type) {
      return item.missingData.length ? 'missing-data' : '';
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
    },
    bulkActionFn (actionText, postUrl, customFn) {
      this.bulkAction = actionText;
      this.$refs['bulkModal'].show();

      const fn = customFn ? customFn() : this.$axios.post(postUrl);
      return fn.then(result => {
        this.bulkAction = '';
        this.$refs['bulkModal'].hide();
        this.$toast.success(result && result.data ? (result.data.data || result.data.message) : 'Success');
      }).catch(err => {
        this.bulkAction = '';
        this.$refs['bulkModal'].hide();
        this.$toast.error(err);
      });
    },
    updateMoviesInSitu () {
      this.bulkActionFn('Movies update is', null, this.save);
    },
    updateRevenues () {
      this.bulkActionFn('Revenues are', 'movies/updateRevenues');
    },
    updateAll(){
      this.bulkActionFn('Massive autoupdate is', 'movies/autoUpdateAll');
    },
    updatePeopleDetails () {
      this.bulkActionFn('People details are', 'people/updateDetails');
    },
    onChange (params, movie) {
      const { field, value, reset, subfield, list } = params;
      let sameValueAsInitial = false;
      const initialValue = !subfield ?
        movie.more[field] :
        (movie.more[field] ? movie.more[field][subfield] : null);
      if (value) {
        sameValueAsInitial = JSON.stringify(initialValue) === JSON.stringify(value);
      } else {
        sameValueAsInitial = !initialValue
      }

      if (sameValueAsInitial && this.changes[movie.more.id]) {
        if (this.changes[movie.more.id][field]) {
          delete this.changes[movie.more.id][field];
          if (Object.keys(this.changes[movie.more.id]).length === 0) {
            delete this.changes[movie.more.id];
          }
        }
      } else {
        if (!this.changes[movie.more.id]) {
          this.changes[movie.more.id] = {}
          this.changes[movie.more.id][field] = [];
        } else if (!this.changes[movie.more.id][field]) {
          this.changes[movie.more.id][field] = [];
        }

        let toPush;
        if (value) {
          if (subfield) {
            toPush = {};
            toPush[subfield] = value;
          } else {
            toPush = value;
          }
        } else if (list) {
          toPush = { list };
        } else {
          toPush = null;
        }
        this.changes[movie.more.id][field].push(toPush);
      }

      this.showSave = Object.keys(this.changes).length > 0;
    },
    save () {
      console.log('saving');

      //prepare changes
      Object.entries(this.changes).forEach(entry => {
        const movieId = entry[0];
        const movieChanges = entry[1];

        Object.keys(movieChanges).forEach(key => {
          //we only keep the last change
          this.changes[movieId][key] = this.changes[movieId][key].pop();
        })
      });

      const updatePromise = this.$store.dispatch('movies/bulkUpdate', {
        updates: this.changes
      }).then(updatedMovies => {
        updatedMovies.map(um => {
          this.updatedMovie(um);
        })
        this.$toast.success(`Succesfully updated!`);
      })

      //hide save button
      this.changes = {};
      this.showSave = false;

      return updatePromise;
    }
  }
};
</script>

<style lang="scss" scoped>
.home {
  margin-top: 2rem;

  .fa-exclamation-circle {
    color: red;
  }
  .title {
    position: relative;
  }
  .filters {
    text-align: right;
    padding: 1rem;
    .columns-checkbox {
      display: flex;
      justify-content: flex-end;

      /deep/ .custom-checkbox {
        margin-left: 1rem;

        .custom-control-label::before {
          margin-top: -0.2rem;
        }
      }
    }
    .custom-checkbox:last-child {
      margin-right: 0;
    }
  }
  /deep/ tr.missing-data {
    background: rgba(255, 0, 0, 0.15);
  }
  .more-column {
    display: inline-flex;
    .more,
    .trash {
      cursor: pointer;
      margin-right: 1rem;
    }
  }
  .validity-checkbox {
    cursor: pointer;
  }

  .bulk {
    background: #567abb;
    color: white;
    border-radius: 5px;
    margin-bottom: 2rem;

    .bulk-title {
      text-transform: uppercase;
      font-size: 0.8em;
      font-weight: bold;
      padding: 0.5rem;
    }

    .bulk-functions {
      padding: 2rem;
      background: #fff;
      border: 1px solid #567abb;

      small {
        padding-left: 0.5rem;
        font-style: italic;
        color: black;
      }

      button {
        background: transparent;
        border-radius: 5px;
        border-color: #567abb;
        color: #567abb;
        padding: 10px 20px;
        box-shadow: none;
        text-transform: uppercase;
        font-size: 12px;
        letter-spacing: 1.05px;
        margin: 0.5rem;
      }
    }
  }
}
/deep/ .bulk-modal-content {
  padding: 3rem 0;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;

  svg {
    font-size: 3rem;
    margin-top: 2rem;
    cursor: default;
  }
}

.save-btn {
  background-color: #314963;
  border-radius: 10px;
  color: white;
  font-style: italic;
  padding: 10px;
  z-index: 1;
  cursor: pointer;
  font-size: 1.3em;
  text-align: center;
  position: sticky;
  top: 10px;
}

table {
  /deep/ .custom-dropdown {
    min-width: 120px;
    max-width: 150px;
  }
}
</style>