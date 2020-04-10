<template>
  <div class="detail-row">
    <label :for="label">{{label}}:</label>
    <div :id="label" @click="editing=true">
      <b-dropdown
        v-if="editing"
        :text="selected ? selected.name : 'Choose...'"
        dropup
        variant="bg-transparent"
        class="dropdown"
      >
        <b-dropdown-item
          v-for="item of items"
          :key="item.id"
          href="#"
          @click="selectItem(item)"
          @keyup.esc="editing=false"
          @blur="editing=false"
        >{{item.name}}</b-dropdown-item>
      </b-dropdown>
      <template v-else>
        <span v-if="selected">{{selected.name}}</span>
        <span v-else class="missing-field">
          Missing &nbsp;
          <small>Click to edit</small>
        </span>
      </template>
    </div>
    <font-awesome-icon
      v-if="showReset && !editing"
      class="reset"
      :icon="['fa', 'undo']"
      @click="reset"
    />
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
      editing: false,
      showReset: false,
      selected: null
    }
  },
  props: {
    label: {
      type: String,
      required: true
    },
    initialValue: String,
    field: {
      type: String,
      required: true
    }
  },
  mounted () {
    this.selected = this.initialValue || '';
  },
  methods: {
    reset () {
      this.selected = this.initialValue;
      this.selectItem();
      this.showReset = false;
    },
    selectItem () {
      this.showReset = this.selected != this.initialValue;
      this.$emit('change', {
        field: this.field,
        value: this.selected,
        reset: this.selected === this.initialValue
      })
    },
  }
}
</script>

<style lang="scss" scoped>
</style>