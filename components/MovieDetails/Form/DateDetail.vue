<template>
  <div class="detail-row">
    <label :for="label">{{label}}:</label>
    <div :id="label">
      <template v-if="editing">
        <input
          ref="input"
          placeholder="yyyy-mm-dd"
          type="text"
          v-model="value"
          @change="onChange"
          @keyup.esc="setEditingFalse"
          @blur="setEditingFalse"
        />
        <small v-show="showInvalid" class="invalid">Invalid</small>
      </template>
      <template v-else>
        <span v-if="value" @click="editing=true">{{text}}</span>
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
import { isValid } from 'date-fns';
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
      showInvalid: false,
      showReset: false,
      plainInitialValue: null,
      value: ''
    }
  },
  watch: {
    initialValue (a, b) {
      this.plainInitialValue = this.getPlainInitialValue();
      this.value = this.plainInitialValue;
    }
  },
  props: {
    label: {
      type: String,
      required: true
    },
    initialValue: [String, Object],
    field: {
      type: String,
      required: true
    },
    customValidation: {
      type: Function,
      default: null
    }
  },
  mounted () {
    this.plainInitialValue = this.getPlainInitialValue();
    this.value = this.plainInitialValue;
  },
  computed: {
    text () { return this.value; }
  },
  methods: {
    setEditingFalse () {
      if (this.checkValidity()) {
        this.editing = false;
      } else {
        this.invalidBehaviour();
      }
    },
    invalidBehaviour () {
      this.showInvalid = true;
      const innerFn = () => {
        this.value = this.getPlainInitialValue()
        this.showInvalid = false;
        this.editing = false;
      }
      setTimeout(innerFn, 1000);
    },
    getPlainInitialValue () {
      return this.initialValue && typeof this.initialValue === 'object' ?
        this.initialValue[this.field] :
        (this.initialValue || '');
    },
    startEditing () {
      this.editing = true;
      this.$nextTick(() => {
        this.$refs.datepicker.focus();
      })
    },
    reset () {
      this.value = this.plainInitialValue;
      this.onChange();
      this.showReset = false;
    },
    checkValidity () {
      const innerValidation = isValid(new Date(this.value));
      const custom = this.customValidation ? this.customValidation(this.value) : true;
      return innerValidation && custom;
    },
    onChange () {
      if (this.checkValidity()) {
        this.showReset = this.value != this.plainInitialValue;
        const itemId = typeof this.initialValue === 'object' && this.initialValue ?
          this.initialValue.id :
          null;
        this.$emit('change', {
          field: this.field,
          value: this.value,
          itemId,
          reset: this.value === this.plainInitialValue
        })
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.reset {
  cursor: pointer;
  font-size: 0.7em;
  color: darkgray;
}
</style>