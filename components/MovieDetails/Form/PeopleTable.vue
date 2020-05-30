<template>
  <div class="assoc-table-container">
    <div class="add" @click="addRow">Add</div>
    <b-table
      hover
      :items="items"
      :fields="fields"
      tbody-tr-class="assoc-table-row"
      class="assoc-table"
      @row-clicked="onRowClick"
    >
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
            @click="selectNewArtist(row.index, ditem)"
          >{{ditem.name}}</b-dropdown-item>
        </b-dropdown>
        <span v-else>{{row.item.name}}</span>
      </template>
      <template v-slot:cell(date_of_birth)="row">{{calculateAge(row.item.date_of_birth)}}</template>
      <template v-slot:cell(main)="row">
        <input
          class="main-checkbox"
          type="radio"
          name="main"
          id="main"
          :checked="row.item.id === main"
          @change="mainChanged(row.item.id, row.item)"
        />
        </template>
        <template v-slot:cell(primary)="row">
        <input
          class="main-checkbox"
          type="radio"
          name="main"
          id="main"
          :checked="row.item.id === main"
          @change="mainChanged(row.item.id, row.item)"
        />
      </template>
      <template v-slot:cell(id)="row">
        <font-awesome-icon class="trash" :icon="['fas', 'trash']" @click="deleteItem(row.item)" />
      </template>

      <template v-slot:row-details="row">
        <div class="spotted-details">
          <input-detail
            v-if="associativeTableName==='movies_characters'"
            label="Character name"
            field="character_name"
            @change="characterNameChanged"
            :initial-value="row.item"
          />
          <dropdown-detail
            v-if="associativeTableName==='movies_characters'"
            label="Type"
            field="type"
            url="character_types"
            @change="characterTypeChanged"
            :initial-value="row.item"
          />
          <dropdown-detail
            label="Gender"
            field="gender"
            :list="genderList"
            @change="genderChanged"
            :initial-value="row.item"
          />
          <date-detail
            label="Birthdate"
            field="date_of_birth"
            :customValidation="validateAge"
            @change="birthDateChanged"
            :initial-value="row.item"
          />
        </div>
      </template>
    </b-table>
    <font-awesome-icon v-if="showReset" class="reset" :icon="['fa', 'undo']" @click="reset" />
  </div>
</template>

<script>
import { isValid, format } from "date-fns";
import Vue from "vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faUndo, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import InputDetail from "@/components/MovieDetails/Form/InputDetail";
import DropdownDetail from "@/components/MovieDetails/Form/DropdownDetail";
import DateDetail from "@/components/MovieDetails/Form/DateDetail";

library.add(faTrash);
library.add(faUndo);
Vue.component("font-awesome-icon", FontAwesomeIcon);

export default {
  data() {
    return {
      items: [],
      main: null,
      showReset: false,
      dropdownItems: [],
      genderList: [
        { id: 0, name: "Non-specified" },
        { id: 1, name: "Female" },
        { id: 2, name: "Male" }
      ]
    };
  },
  components: { InputDetail, DropdownDetail, DateDetail },
  props: {
    initialItems: {
      type: Array,
      required: true
    },
    release_date: String,
    fields: {
      type: Array,
      default: () => [
        { key: "name", label: "Actor/Actress" },
        { key: "gender", label: "Gender" },
        { key: "date_of_birth", label: "Age" }
      ]
    },
    field: {
      type: String,
      required: true
    },
    dropdownUrl: {
      type: String,
      required: true
    },
    associativeTableName: {
      type: String,
      require: true
    }
  },
  beforeMount() {
    if(this.associativeTableName==='movies_characters'){
      this.fields.push({ key: "main", label: "Lead" })
    } else {
      this.fields.push({ key: "primary", label: "Primary" })
    }
    this.fields.push({ key: "id", label: "" });

    this.items = JSON.parse(JSON.stringify(this.initialItems)) //deep copy
      .map(item => {
        item._showDetails = this.initialMain === item.id;
        if (this.associativeTableName === "movies_characters") {
          item.character_name = item.movies_characters.character_name;
          item.type = item.movies_characters.type;
        }
        return item;
      });

    this.main = this.initialMain;
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
    initialMain() {
      let main = this.initialItems.find(
        item => item[this.associativeTableName].main || item[this.associativeTableName].primary
      );
      return main ? main.id : null;
    }
  },
  methods: {
    validateAge(date) {
      const age = this.calculateAge(date);
      if (!!date && !age) {
        return false;
      }
      if (age < 0 || age > 120) {
        return false;
      }

      return true;
    },
    calculateAge(date) {
      if (!date || !this.release_date) {
        return "";
      }
      if (!isValid(new Date(date)) || !isValid(new Date(this.release_date))) {
        return "";
      }

      const diff_ms =
        new Date(this.release_date).getTime() - new Date(date).getTime();
      const age_dt = new Date(diff_ms);

      return Math.abs(age_dt.getUTCFullYear() - 1970);
    },
    emitChange(reset = null) {
      this.$emit("change", {
        field: this.field,
        subfield: this.associativeTableName,
        list: this.items,
        reset: reset != null ? reset : this.asInitial()
      });
    },
    onRowClick(record, index, la, b) {
      record._showDetails = !record._showDetails;
    },
    selectNewArtist(assocIndex, dropdownItem) {
      this.items = this.items.map((it, index) => {
        if (index === assocIndex) {
          it.name = dropdownItem.name;
          it.id = dropdownItem.id;
        }
        return it;
      });
      this.showReset = true;
      this.emitChange();
    },
    addRow() {
      let toPush = {
        new: true,
        name: ""
      };
      if (this.associativeTableName === "movies_characters") {
        toPush.movies_characters = {
          main: false,
          character_name: null,
          type: null
        };
      } else {
        //directors
        toPush.movies_directors = { primary: false };
      }

      this.items.push(toPush);
    },
    reset() {
      this.items = JSON.parse(JSON.stringify(this.initialItems)); //deep copy
      this.main = this.initialMain;
      this.emitChange(true);
      this.showReset = false;
    },
    deleteItem(item) {
      this.items = this.items.filter(item2 => item2.name != item.name);

      //deleting a persisted one
      if (!item.new) {
        this.showReset = true;
      }
      this.emitChange();
    },
    mainChanged(newMain, item) {
      this.items = this.items.map(item => {
        item[this.associativeTableName][
          this.associativeTableName === "movies_characters" ? "main" : "primary"
        ] = newMain === item.id;
        return item;
      });
      this.main = newMain;
      this.showReset = newMain != this.initialMain;
      this.emitChange();
    },
    asInitial() {
      let equal = true;
      if (this.items.length != this.initialItems.length) {
        equal = false;
      } else {
        //compare item by item
        this.items.map((newItem, index) => {
          if (
            JSON.stringify(newItem) != JSON.stringify(this.initialItems[index])
          ) {
            equal = false;
          }
        });
      }

      return equal;
    },
    characterNameChanged(data) {
      this.items = this.items.map(item => {
        if (item.id === data.itemId) {
          item.movies_characters.character_name = data.value;
          item.character_name = data.value;
        }
        return item;
      });
      this.emitChange();
    },
    characterTypeChanged(data) {
      this.items = this.items.map(item => {
        if (item.id === data.itemId) {
          const newType = data && data.value ? data.value.id : null;
          item.movies_characters.type = newType;
          item.type = newType;
        }
        return item;
      });
      this.emitChange();
    },
    genderChanged(data) {
      this.items = this.items.map(item => {
        if (item.id === data.itemId) {
          item.gender = data && data.value ? data.value.name : null;
        }
        return item;
      });
      this.emitChange();
    },
    birthDateChanged(data) {
      this.items = this.items.map(item => {
        if (item.id === data.itemId) {
          item.date_of_birth = data
            ? format(new Date(data.value), "MM/dd/yyyy")
            : null;
        }
        return item;
      });
      this.emitChange();
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~/assets/styles/common.scss";

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
    width: 97%;
    position: relative;

    /deep/ th {
      padding: 0.5em 0.75em;
      font-size: 0.8em;
      opacity: 0.8;
    }
  }
}
/deep/ .assoc-table-row {
  &.b-table-has-details {
    background: $selectedRow;
  }
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

    .trash {
      cursor: pointer;
    }
  }

  .main-checkbox {
    margin: auto;
  }
}
.reset {
  cursor: pointer;
  font-size: 0.7em;
  color: darkgray;
  position: absolute;
  top: 0;
  right: 0;
}

.spotted-details {
  padding: 1rem 0 0 1rem;

  .detail-row {
    grid-template-columns: 120px auto 1px !important;
    margin-bottom: 0 !important;
  }

  .artist-name {
    font-weight: bold;
    font-size: 0.9em;
    text-decoration: underline;
    margin-left: -2rem;
    margin-bottom: 0.5rem;
  }
}
</style>