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
      <CharactersTable
        :initial-items="characters"
        @change="onChange"
        field="characters"
        associative-table-name="movies_characters"
        dropdown-url="characters"
      ></CharactersTable>
    </div>
    <input-detail
      :textarea="true"
      label="Plot"
      field="plot_line"
      @change="onChange"
      :initial-value="plot_line"
      :rows="2"
    />
    <div></div>
    <div></div>
    <div></div>
  </div>
</template>

<script>
import InputDetail from '@/components/MovieDetails/Form/InputDetail';
import AssocTable from '@/components/MovieDetails/Form/AssocTable';
import CharactersTable from '@/components/MovieDetails/Form/CharactersTable';

export default {
  name: 'storyDetail',
  data () {
    return {
    }
  },
  components: {
    InputDetail,
    AssocTable,
    CharactersTable
  },
  props: {
    id: Number,
    genres: Array,
    cast_quantity: Number,
    characters: Array,
    story_origin: Object,
    set_in_place: Object,
    set_in_time: Object,
    plot_line: String
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