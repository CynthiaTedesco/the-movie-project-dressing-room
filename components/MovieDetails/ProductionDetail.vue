<template>
  <div class="productionDetail detail">
    <div class="characters">
      <label for="characters">Characters:</label>
      <PeopleTable
        :initial-items="directors"
        @change="onChange"
        field="directors"
        :release_date="release_date"
        associative-table-name="movies_directors"
        dropdown-url="directors"
      ></PeopleTable>
    </div>
  </div>
</template>

<script>
import PeopleTable from '@/components/MovieDetails/Form/PeopleTable';

export default {
  name: 'productionDetail',
  data () {
    return {
    }
  },
  components: {
    PeopleTable,
  },
  props: {
    id: Number,
    directors: Array,
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