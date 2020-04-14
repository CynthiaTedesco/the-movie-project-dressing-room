<template>
  <div>
    <div class="poster">
      <div class="poster-details">
        <img v-if="poster && poster.url" :src="posterUrl" alt="poster" />
        <div>
          <input-detail
            hide-label
            class="column"
            label="URL"
            field="url"
            :link="true"
            textarea
            :rows="4"
            @change="onChange"
            :initial-value="poster"
          />
          <br />
          <dropdown-detail
            ref="posterType"
            class="big-label column"
            label="Poster type"
            field="poster_type_id"
            url="poster_types"
            @change="onChange"
            :initial-value="poster"
          />
        </div>
      </div>
    </div>
    <date-detail
      class="big-label"
      label="Release date"
      field="release_date"
      @change="onChange"
      :initial-value="release_date"
    />
    <div class="producers">
      <label for="producers">Producers:</label>
      <AssocTable
        :initial-items="producers"
        @change="onChange"
        field="producers"
        associative-table-name="movies_producers"
        dropdown-url="producers"
      ></AssocTable>
    </div>
    <div class="restrictions">
      <label for="restrictions">Restrictions:</label>
      <AssocTable
        :initial-items="restrictions"
        @change="onChange"
        field="restrictions"
        associative-table-name="movies_restrictions"
        dropdown-url="restrictions"
      ></AssocTable>
    </div>
  </div>
</template>

<script>
import InputDetail from '@/components/MovieDetails/Form/InputDetail';
import DateDetail from '@/components/MovieDetails/Form/DateDetail';
import DropdownDetail from '@/components/MovieDetails/Form/DropdownDetail';
import AssocTable from '@/components/MovieDetails/Form/AssocTable';

export default {
  name: 'releaseDetail',
  data () {
    return {
      posterObj: null,
    }
  },
  components: {
    InputDetail,
    DateDetail,
    DropdownDetail,
    AssocTable
  },
  props: {
    id: Number,
    release_date: String,
    producers: Array,
    restrictions: Array,
    poster: Object
  },
  beforeMount () {
    this.posterUrl = this.poster ? this.poster.url : '';
    this.posterObj = Object.assign({}, this.poster);
  },
  methods: {
    onChange (params) {
      // let change;
      if (params.field === 'url' || params.field === 'poster_type_id') {
        // change = Object.assign({}, this.posterObj);
        if (params.field === 'url') {
          this.posterObj.new = true;
          this.posterObj.url = params.value;
        }
        if (params.field === 'poster_type_id') {
          this.posterObj.poster_type_id = params.value.id
          this.posterObj.poster_type = params.value;
        }
        params.field = 'poster';
        params.value = this.posterObj;
      }
      this.$emit('change', params)
    }
  }
}
</script>

<style lang="scss" scoped>
.poster {
  margin-bottom: 2rem;
  .poster-details {
    display: grid;
    grid-template-columns: 120px auto;
    grid-column-gap: 1rem;
    margin-top: 1rem;

    /deep/ #URL {
      overflow: hidden;
    }
    img {
      height: auto;
    }
  }
}
</style>