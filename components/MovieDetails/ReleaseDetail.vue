<template>
  <div>
    <div class="poster">
      <div class="poster-details">
        <img :src="posterObj.url" alt="poster" />
        <div>
          <input-detail
            :hide-label="!!poster"
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
    <autocomplete-detail
      label="Distribution Company"
      field="distribution_company"
      :initial-value="distribution_company"
      @change="onChange"
      dropdown-url="distribution_companies"
    />
  </div>
</template>

<script>
import InputDetail from '@/components/MovieDetails/Form/InputDetail';
import DateDetail from '@/components/MovieDetails/Form/DateDetail';
import DropdownDetail from '@/components/MovieDetails/Form/DropdownDetail';
import AssocTable from '@/components/MovieDetails/Form/AssocTable';
import AutocompleteDetail from '@/components/MovieDetails/Form/AutocompleteDetail';

export default {
  name: 'releaseDetail',
  components: {
    InputDetail,
    DateDetail,
    DropdownDetail,
    AutocompleteDetail,
    AssocTable
  },
  data () {
    return {
      posterObj: null
    }
  },
  props: {
    id: Number,
    release_date: String,
    producers: Array,
    distribution_company: Object,
    restrictions: Array,
    poster: Object
  },
  beforeMount () {
    this.posterObj = Object.assign({}, this.poster);
  },
  computed: {
    posterURL () {
      console.log('posterURL being calculated!');
      return (this.posterObj || {}).url;
    }
  },
  methods: {
    onChange (params) {
      if (params.field === 'url' || params.field === 'poster_type_id') {

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

    textarea{
      width: 100%;
    }
    /deep/ #URL {
      overflow: hidden;
    }
    img {
      height: auto;
    }
  }
}
</style>