<template>
  <div class="assoc-table-container">
    <b-table :items="items" :fields="fields" tbody-tr-class="assoc-table-row" class="assoc-table">
      <template v-slot:cell(primary)="row">
        <input
          class="primary-checkbox"
          type="radio"
          name="primary"
          id="primary"
          :checked="row.item.id === primary"
          @change="primaryChanged(row.item.id)"
        />
      </template>
    </b-table>
    <font-awesome-icon v-if="showReset" class="reset" :icon="['fa', 'undo']" @click="reset" />
  </div>
</template>

<script>
import Vue from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUndo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faUndo)
Vue.component('font-awesome-icon', FontAwesomeIcon)

export default {
  data () {
    return {
      items: [],
      primary: null,
      showReset: false
    }
  },
  props: {
    initialItems: {
      type: Array,
      required: true
    },
    associativeTableName: {
      type: String,
      required: true
    },
    fields: {
      type: Array,
      default: () => ['name', 'primary']
    },
    field: {
      type: String,
      required: true
    }
  },
  mounted () {
    this.items = this.initialItems;
    this.primary = this.initialPrimary;
    // .map(item => {
    //   return {
    //     id: item.id,
    //     name: item.name,
    //     primary: item[this.associativeTableName].primary
    //   }
    // })
  },
  computed: {
    initialPrimary () {
      return this.initialItems
        .find(item => item[this.associativeTableName].primary).id;
    }
  },
  methods: {
    reset () {
      this.items = this.initialItems;
      this.primary = this.initialPrimary;
      this.$emit('change', {
        field: this.field,
        reset: true
      })
      this.showReset = false;
    },
    primaryChanged (newPrimary) {
      this.primary = newPrimary;
      this.showReset = newPrimary != this.initialPrimary;
      this.$emit('change', {
        field: this.field,
        subfield: this.associativeTableName,
        attribute: 'primary',
        newId: newPrimary,
        reset: newPrimary === this.initialPrimary
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.assoc-table-container {
  margin-bottom: 2rem;
  .assoc-table {
    width: 350px;
    position: relative;

    /deep/ th {
      padding: 0.5em 0.75em;
      font-size: 0.8em;
      opacity: 0.8;
    }
  }
}
/deep/ .assoc-table-row {
  td {
    padding: 0.3em 0.75em;
    font-size: 0.8em;
  }

  .primary-checkbox {
    margin: auto;
  }
}
.reset {
  cursor: pointer;
  font-size: 0.7em;
  color: darkgray;
  position: absolute;
  top: 65px;
  right: 30px;
}
</style>