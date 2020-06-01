<template>
  <div class="assoc-table-container">
    <div class="add" @click="addRow">Add</div>
    <b-table :items="items" :fields="fields" tbody-tr-class="assoc-table-row" class="assoc-table">
      <template v-slot:cell(name)="row">
        <b-dropdown
          v-if="row.item.new"
          :text="row.item.name || 'Choose...'"
          dropup
          variant="bg-transparent"
          class="dropdown"
        >
          <b-dropdown-item
            v-for="ditem of dropdownItems"
            :key="ditem.id"
            href="#"
            @click="select(row.index, ditem)"
          >{{ditem.name}}</b-dropdown-item>
        </b-dropdown>
        <span v-else>{{row.item.name}}</span>
      </template>
      <template v-slot:cell(primary)="row">
        <input
          class="primary-checkbox"
          type="radio"
          :name="`${field}-primary`"
          :id="`${field}-primary`"
          :checked="row.item.id === primary"
          @change="primaryChanged(row.item.id, row.item)"
        />
      </template>
      <template v-slot:cell(country)="row">
        <autocomplete-detail
          v-if="!row.item.country"
          :label="false"
          field="country"
          :initial-value="row.item.country"
          @change="(e) => countryChanged(e, row.item)"
          :hide-reset="true"
          dropdown-url="production_countries"
        />
        <template>{{row.item.country ? row.item.country: ''}}</template>

      </template>
      <template v-slot:cell(id)="row">
        <font-awesome-icon class="trash" :icon="['fas', 'trash']" @click="deleteItem(row.item)" />
      </template>
    </b-table>
    <font-awesome-icon v-if="showReset" class="reset" :icon="['fa', 'undo']" @click="reset" />
  </div>
</template>

<script>
import Vue from "vue";
import InputDetail from "@/components/MovieDetails/Form/InputDetail.vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faUndo, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import AutocompleteDetail from "@/components/MovieDetails/Form/AutocompleteDetail";

library.add(faTrash);
library.add(faUndo);
Vue.component("font-awesome-icon", FontAwesomeIcon);

export default {
  components: {
    InputDetail,
    AutocompleteDetail
  },
  data() {
    return {
      items: [],
      primary: null,
      showReset: false,
      dropdownItems: []
    };
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
      default: () => ["name", "primary", { key: "id", label: "" }]
    },
    field: {
      type: String,
      required: true
    },
    dropdownUrl: {
      type: String,
      required: true
    }
  },
  beforeMount() {
    this.items = JSON.parse(JSON.stringify(this.initialItems)); //deep copy
    if (this.items.length) {
      this.primary = this.initialPrimary;
    }
  },
  mounted() {
    this.$axios(this.dropdownUrl).then(({ data }) => {
      this.dropdownItems = data.sort((a, b) => {
        if (a.name > b.name) {
          return 1;
        }
        if (b.name > a.name) {
          return -1;
        }
        return 0;
      });
    });
  },
  computed: {
    initialPrimary() {
      if (!this.initialItems.length) return null;

      return (
        this.initialItems.find(
          item => item[this.associativeTableName].primary
        ) || {}
      ).id;
    }
  },
  methods: {
    select(assocIndex, dropdownItem) {
      this.items = this.items.map((it, index) => {
        if (index === assocIndex) {
          it.name = dropdownItem.name;
          it.country = dropdownItem.country;
          it.id = dropdownItem.id;
        }
        return it;
      });
      this.showReset = true;
      this.$emit("change", {
        field: this.field,
        subfield: this.associativeTableName,
        list: this.items,
        reset: this.asInitial()
      });
    },
    addRow() {
      let itemToBePushed = {
        new: true,
        name: ""
      };
      itemToBePushed[this.associativeTableName] = { primary: false };
      this.items.push(itemToBePushed);
    },
    reset() {
      this.items = JSON.parse(JSON.stringify(this.initialItems)); //deep copy
      this.primary = this.initialPrimary;
      this.$emit("change", {
        field: this.field,
        reset: true
      });
      this.showReset = false;
    },
    deleteItem(item) {
      this.items = this.items.filter(item2 => item2.name != item.name);

      //deleting a persisted one
      if (!item.new) {
        this.showReset = true;
      }
      this.$emit("change", {
        field: this.field,
        subfield: this.associativeTableName,
        list: this.items,
        reset: this.asInitial()
      });
    },
    countryChanged({ value }, item) {
      const newCountry = value ? value.name : null;
      this.showReset = (event.value != item.country) != newCountry;

      this.items = this.items.map(it => {
        if (it.id === item.id) {
          it.country = newCountry;
        }
        return it;
      });
      this.$emit("change", {
        field: this.field,
        subfield: this.associativeTableName,
        list: this.items,
        reset: this.asInitial()
      });
    },
    primaryChanged(newPrimary, item) {
      this.items = this.items.map(item => {
        item[this.associativeTableName].primary = newPrimary === item.id;
        return item;
      });
      this.primary = newPrimary;
      this.showReset = newPrimary != this.initialPrimary;
      this.$emit("change", {
        field: this.field,
        subfield: this.associativeTableName,
        list: this.items,
        reset: this.asInitial()
      });
    },
    asInitial() {
      let equal = true;
      if (this.items.length != this.initialItems.length) {
        equal = false;
      } else {
        const newPrimary = this.items.find(
          item => item[this.associativeTableName].primary
        );
        const newPrimaryID = newPrimary ? newPrimary.id : null;
        if (newPrimaryID != this.initialPrimary) {
          equal = false;
        }

        //check if the elements are all the same
        const newIds = this.items
          .map(it1 => it1.id)
          .sort((a, b) => a - b)
          .join("");
        const oldIds = this.initialItems
          .map(it1 => it1.id)
          .sort((a, b) => a - b)
          .join("");
        if (newIds != oldIds) {
          equal = false;
        } else {
          const equality = this.items.map(it => {
            const initialIt = this.initialItems.find(iit => iit.id === it.id);
            if (initialIt) {
              return (
                it.name === initialIt.name && it.country === initialIt.country
              );
            }
            return false;
          });
          equal = equality.reduce((curr, next) => curr && next, true);
        }
      }

      return equal;
    }
  }
};
</script>

<style lang="scss" scoped>
.assoc-table-container {
  margin-bottom: 2rem;
  position: relative;

  .add {
    background: gray;
    color: white;
    border-radius: 20px;
    font-size: 0.6em;
    margin-bottom: 0.5rem;
    cursor: pointer;
    display: flex;
    width: 30px;
    height: 15px;
    justify-content: center;
  }
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

    .dropdown-toggle {
      padding: 0;
      font-size: 1em;
      font-style: italic;
      box-shadow: none;
    }
    .dropdown-menu.show {
      max-height: 200px;
      overflow: auto;
    }
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
  top: 0;
  right: -10px;
}
</style>