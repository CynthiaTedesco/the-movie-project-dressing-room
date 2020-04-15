<template>
  <div class="detail-row">
    <label v-if="!hideLabel" :for="label">{{label}}:</label>
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
        <template v-if="value">
          <span :class="textClass">
            {{text}}
            <font-awesome-icon
              v-if="link"
              class="link-icon"
              :icon="['fas', 'external-link-alt']"
              @click="goTo"
            />
          </span>
        </template>
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
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { beautifyCashValue } from '@/assets/js/helpers.js';

library.add(faExternalLinkAlt)
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
    hideLabel: {
      type: Boolean,
      default: false
    },
    link: {
      type: Boolean,
      default: false
    },
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
      let classes = [];
      if (this.money) {
        classes.push('money');
      }
      if (this.link) {
        classes.push('url');
      }
      return classes.join(' ');
    },
  },
  methods: {
    goTo () {
      if (this.text) {
        window.open(this.text, "_blank");
      }
    },
    getPlainInitialValue () {
      return this.initialValue && typeof this.initialValue === 'object' ?
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
      const itemId = typeof this.initialValue === 'object' && this.initialValue ?
        this.initialValue.id :
        null;

      this.$emit('change', {
        field: this.field,
        value: this.value,
        itemId,
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
.url {
  font-size: 0.8em;
  display: block;
}
.money {
  font-size: 1.4em;
  margin-bottom: 5px;
  margin-top: -5px;
}
svg.link-icon {
  color: blue;
  font-size: 0.9em;
}
</style>