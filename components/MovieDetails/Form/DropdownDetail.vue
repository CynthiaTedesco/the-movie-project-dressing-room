<template>
  <div class="detail-row">
    <label :for="label">{{label}}:</label>
    <div :id="label">
      <b-dropdown
        v-if="editing"
        :text="selected && selected.id ? selected.name : 'Choose...'"
        dropup
        variant="bg-transparent"
        class="dropdown"
      >
        <b-dropdown-item
          v-for="item of options"
          :key="item.id"
          href="#"
          @click="selectItem(item)"
          @keyup.esc="editing=false"
          @blur="editing=false"
        >{{item.name}}</b-dropdown-item>
      </b-dropdown>
      <template v-else>
        <span v-if="selected && selected.name" @click="editing=true">{{selected.name}}</span>
        <span v-else class="missing-field" @click="editing=true">
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
      selected: null,
      options: []
    }
  },
  watch: {
    initialValue (a, b) {
      this.setSelectedById();
    }
  },
  props: {
    label: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: false
    },
    list: {
      type: Array,
      default: null
    },
    initialValue: {
      type: Object,
      default: () => { }
    },
    field: {
      type: String,
      required: true
    }
  },
  mounted () {
    if (this.list) {
      this.options = this.list;
      if (this.initialValue) {
        this.setSelectedById();
      }
    } else if (this.url) {
      this.$axios.get(this.url).then(results => {
        this.options = results.data;
        if (this.initialValue) {
          this.setSelectedById();
        }
      });
    }
  },
  methods: {
    setSelectedById () {
      this.selected = this.options.find(o => {
        return o.id === this.initialValue[this.field] ||
          o.name === this.initialValue[this.field];
      });
    },
    reset () {
      this.selectItem(this.options.find(o => o.id === this.initialValue[this.field]));
      this.showReset = false;
    },
    selectItem (selected) {
      this.selected = selected;
      this.editing = false;
      this.showReset =
        !!((this.initialValue && !this.initialValue[this.field] && selected) || // initial null has changed
          (selected && this.initialValue && this.initialValue[this.field] != selected.id));

      const sameAsInitial =
        (this.initialValue && !this.initialValue[this.field] && !selected) || // initial null has not changed
        (selected && this.initialValue && this.initialValue[this.field] === selected.id);

      this.$emit('change', {
        field: this.field,
        value: !this.selected ? null : this.selected,
        itemId: this.initialValue ? this.initialValue.id : null,
        reset: sameAsInitial
      })
    },
  }
}
</script>

<style lang="scss" scoped>
</style>