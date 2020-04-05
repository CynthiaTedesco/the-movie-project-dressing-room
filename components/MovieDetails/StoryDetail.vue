<template>
  <div class="storyDetail detail">
    <div class="genres">
      <label for="genres">Genres:</label>
      <AssocTable
        :initial-items="genres"
        @change="onChange"
        field="genres"
        associative-table-name="movies_genres"
      ></AssocTable>
    </div>
    <input-detail
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

export default {
  data () {
    return {
      // genres_value: null,
      // cast_quantity_value: null,
      // characters_value: null,
      // story_origin_value: null,
      // set_in_place_value: null,
      // set_in_place_value: null
    }
  },
  components: {
    InputDetail,
    AssocTable
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
/deep/ label {
  font-weight: bold;
  font-size: 0.7em;
  margin-top: 4px;
  text-transform: uppercase;
}
</style>