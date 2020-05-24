<template>
  <div class="storyDetail detail">
    <div class="genres">
      <label for="genres">Genres:</label>
      <AssocTable
        :initial-items="genres"
        @change="onChange"
        field="genres"
        associative-table-name="movies_genres"
        dropdown-url="genres"
      ></AssocTable>
    </div>
    <div class="characters">
      <label for="characters">Characters:</label>
      <PeopleTable
        :initial-items="characters"
        @change="onChange"
        field="characters"
        :release_date="release_date"
        associative-table-name="movies_characters"
        dropdown-url="characters"
      ></PeopleTable>
    </div>
    <autocomplete-detail
      label="Story Origin"
      field="story_origin"
      :initial-value="story_origin"
      @change="onChange"
      dropdown-url="origins"
    />
    <autocomplete-detail
      label="Universe"
      field="universe"
      :initial-value="universe"
      @change="onChange"
      dropdown-url="universes"
    />
    <autocomplete-detail
      label="Serie"
      field="serie"
      :initial-value="serie"
      @change="onChange"
      dropdown-url="series"
    />
    <div class="languages">
      <label for="languages">Languages:</label>
      <AssocTable
        :initial-items="languages"
        @change="onChange"
        field="languages"
        associative-table-name="movies_languages"
        dropdown-url="languages"
      ></AssocTable>
    </div>
    <input-detail
      :textarea="true"
      label="Plot"
      field="plot_line"
      @change="onChange"
      :initial-value="plot_line"
      :rows="2"
    />
  </div>
</template>

<script>
import InputDetail from '@/components/MovieDetails/Form/InputDetail';
import AssocTable from '@/components/MovieDetails/Form/AssocTable';
import PeopleTable from '@/components/MovieDetails/Form/PeopleTable';
import AutocompleteDetail from '@/components/MovieDetails/Form/AutocompleteDetail';

export default {
  name: 'storyDetail',
  data () {
    return {
    }
  },
  components: {
    InputDetail,
    AssocTable,
    PeopleTable,
    AutocompleteDetail
  },
  props: {
    id: Number,
    genres: Array,
    cast_quantity: Number,
    characters: Array,
    story_origin: Object,
    universe: Object,
    serie: Object,
    languages: Array,
    plot_line: String,
    release_date: String
  },
  methods: {
    onChange (params) {
      this.$emit('change', params)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>