<template>
  <div class="productionDetail detail">
    <input-detail
      label="Budget"
      field="budget"
      @change="onChange"
      :initial-value="budget"
      :money="true"
    />
    <div class="characters">
      <label for="characters">Directors:</label>
      <PeopleTable
        :initial-items="directors"
        @change="onChange"
        field="directors"
        :release_date="release_date"
        associative-table-name="movies_directors"
        dropdown-url="directors"
      ></PeopleTable>
    </div>
    <div class="producers">
      <label for="producers">Production companies:</label>
      <AssocTable
        :initial-items="producers"
        @change="onChange"
        field="producers"
        associative-table-name="movies_producers"
        :fields="['name', 'primary', 'country', { key: 'id', label: '' }]"
        dropdown-url="producers"
      ></AssocTable>
    </div>
    <autocomplete-detail
      label="Cinematography"
      field="cinematography"
      :initial-value="cinematography"
      @change="onChange"
      dropdown-url="cinematographies"
    />
    <input-detail label="Length" field="length" @change="onChange" :initial-value="length" />
    <div class="subtitles">
      <input-detail
        label="Word count"
        field="word_count"
        @change="onChange"
        :initial-value="word_count"
      />
      <label for="subtitle">Change Subtitle file</label>
      <input ref="file" type="file" id="subtitle" @change="onChangedFile" />
      <div v-if="calculatedWordCount" class="updated">
        <label for="newWordCount">Calculated word count based on subtitle:</label>
        <span>{{calculatedWordCount}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import PeopleTable from "@/components/MovieDetails/Form/PeopleTable";
import InputDetail from "@/components/MovieDetails/Form/InputDetail";
import AssocTable from "@/components/MovieDetails/Form/AssocTable";
import AutocompleteDetail from "@/components/MovieDetails/Form/AutocompleteDetail";

export default {
  name: "productionDetail",
  data() {
    return {
      calculatedWordCount: null
    };
  },
  components: {
    PeopleTable,
    InputDetail,
    AssocTable,
    AutocompleteDetail
  },
  props: {
    id: Number,
    budget: String,
    directors: Array,
    producers: Array,
    length: Number,
    cinematography: Object,
    subtitles: String,
    word_count: Number,
    release_date: String
  },
  methods: {
    onChange(params) {
      this.$emit("change", params);
    },
    onChangedFile(event) {
      if (event.srcElement.value !== "") {
        let formData = new FormData();
        formData.append("subs", this.$refs.file.files[0]);
        formData.append("movieId", this.id);

        const contentType = {
          headers: {
            "content-type": "multipart/form-data"
          }
        };

        this.$axios
          .post("/uploadSubs", formData, contentType)
          .then(response => {
            this.calculatedWordCount = response.data.updated.word_count;
          })
          .catch(error => {
            console.log("error", error);
          });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>