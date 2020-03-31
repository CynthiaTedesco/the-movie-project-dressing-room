<template>
  <div class="storyDetail detail">
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
    <div></div>
  </div>
</template>

<script>
import InputDetail from '@/components/MovieDetails/Form/InputDetail';

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
    InputDetail
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
      debugger;
      this.$emit('change', params)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>