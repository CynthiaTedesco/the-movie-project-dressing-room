<template>
  <div :class="label || ''" class="detail-row">
    <label v-if="label" :for="field" >{{label}}:</label>
    <v-select
      :options="dropdownItems"
      class="custom-dropdown"
      label="name"
      :value="value"
      @input="onSelect"
    ></v-select>
    <font-awesome-icon
      v-if="showReset && !hideReset"
      class="reset"
      :icon="['fa', 'undo']"
      @click="reset"
    />
  </div>
</template>

<script>
import Vue from 'vue'
import vSelect from 'vue-select'
import { library } from '@fortawesome/fontawesome-svg-core';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faExternalLinkAlt)
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('v-select', vSelect)

export default {
  name: 'custom-dropdown',
  data () {
    return {
      editing: false,
      showReset: false,
      value: null,

      dropdownItems: []
    }
  },
  props: {
    label: {
      type: [String, Boolean],
      required: true
    },
    hideReset: {
      type: Boolean,
      default: false
    },
    initialValue: [String, Object],
    field: {
      type: String,
      required: true
    },
    dropdownUrl: {
      type: String,
      required: true
    }
  },
  beforeMount () {
    this.value = this.initialValue || null; // ? this.initialValue.name : null;
  },
  mounted () {
    this.$axios(this.dropdownUrl).then(({ data }) => {
      this.dropdownItems = data.sort((a, b) => {
        if (a.name > b.name) {
          return 1;
        }
        if (b.name > a.name) {
          return -1;
        }
        return 0;
      })
    });
  },
  methods: {
    onSelect (selected) {
      this.value = selected || null;

      if (this.value && this.initialValue) {
        this.showReset = this.value.id !== this.initialValue.id;
      } else {
        this.showReset = (this.value && !this.initialValue) || (!this.value && this.initialValue);
      }
      const itemId = typeof this.initialValue === 'object' && this.initialValue ?
        this.initialValue.id :
        null;

      this.$emit('change', {
        field: this.field,
        value: this.value,
        itemId,
        reset: this.value === this.initialValue
      })
    },
    reset () {
      this.onSelect(this.initialValue);
      this.showReset = false;
    },
  }
}
</script>

<style lang="scss" scoped>
.custom-dropdown {
  margin-right: 50px;
}
/deep/ .vs__dropdown-toggle {
  height: 35px;
}
/deep/ .vs__dropdown-menu {
  max-height: 150px;
}
</style>