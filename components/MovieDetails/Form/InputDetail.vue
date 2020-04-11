<template>
  <div class="detail-row">
    <label :for="label">{{label}}:</label>
    <div :id="label" @click="startEditing">
      <template v-if="editing">
        <textarea
          ref="textarea"
          v-if="textarea"
          :rows="rows"
          type="text"
          v-model="value"
          @change="onChange"
          @keyup.esc="editing=false"
          @blur="editing=false"
        />
        <input
          ref="input"
          v-else
          type="text"
          v-model="value"
          @change="onChange"
          @keyup.esc="editing=false"
          @blur="editing=false"
        />
      </template>
      <template v-else>
        <span v-if="value" :class="textClass">{{text}}</span>
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
import { beautifyCashValue } from '@/assets/js/helpers.js';

library.add(faUndo)
Vue.component('font-awesome-icon', FontAwesomeIcon)

export default {
  data () {
    return {
      editing: false,
      showReset: false,
      plainInitialValue: null,
      value: null
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
    rows: {
      type: Number,
      default: 1
    },
    money: { type: Boolean, default: false },
    field: {
      type: String,
      required: true
    },
    textarea: {
      type: Boolean,
      default: false
    }
  },
  mounted () {
    this.plainInitialValue = this.getPlainInitialValue();
    this.value = this.plainInitialValue;
  },
  computed: {
    text () {
      return this.money ? this.moneyValue() : this.value
    },
    textClass () {
      return this.money ? 'money' : '';
    },
  },
  methods: {
    getPlainInitialValue () {
      return typeof this.initialValue === 'object' ?
        this.initialValue[this.field] :
        (this.initialValue || '');
    },
    startEditing () {
      this.editing = true;
      this.$nextTick(() => {
        if (this.textarea) {
          this.$refs.textarea.focus();
        } else {
          this.$refs.input.focus()
        }
      })
    },
    reset () {
      this.value = this.plainInitialValue;
      this.onChange();
      this.showReset = false;
    },
    onChange () {
      if (this.money && isNaN(this.value)) {
        this.value = this.plainInitialValue;
      }

      this.showReset = this.value != this.plainInitialValue;
      this.$emit('change', {
        field: this.field,
        value: this.value,
        itemId: typeof this.initialValue === 'object' ? this.initialValue.id : null,
        reset: this.value === this.plainInitialValue
      })
    },
    moneyValue () {
      return beautifyCashValue(this.value);
    }
  }
}
</script>

<style lang="scss" scoped>
.money {
  font-size: 1.4em;
  margin-bottom: 5px;
  margin-top: -5px;
}
.reset {
  cursor: pointer;
  font-size: 0.7em;
  color: darkgray;
}
</style>