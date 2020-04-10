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
      <template v-slot:cell(main)="row">
        <input
          class="primary-checkbox"
          type="radio"
          name="primary"
          id="primary"
          :checked="row.item.id === primary"
          @change="primaryChanged(row.item.id, row.item)"
        />
      </template>
      <template v-slot:cell(id)="row">
        <font-awesome-icon class="trash" :icon="['fas', 'trash']" @click="deleteItem(row.item)" />
      </template>
    </b-table>
    <font-awesome-icon v-if="showReset" class="reset" :icon="['fa', 'undo']" @click="reset" />
    <div class="spotted-details" v-if="spotted">
      <span class="artist-name">{{spotted.name}}</span>
      <input-detail
        label="Character name"
        field="character_name"
        @change="characterNameChanged"
        :initial-value="spotted"
      />
      <!-- <dropdown-detail
        label="Type"
        field="type"
        @change="characterTypeChanged"
        :initial-value="spotted.type"
        :rows="1"
      />-->
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUndo, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import InputDetail from '@/components/MovieDetails/Form/InputDetail';
import DropdownDetail from '@/components/MovieDetails/Form/DropdownDetail';

library.add(faTrash)
library.add(faUndo)
Vue.component('font-awesome-icon', FontAwesomeIcon)

export default {
  data () {
    return {
      items: [],
      primary: null,
      showReset: false,
      spotted: null,
      dropdownItems: []
    }
  },
  components: { InputDetail, DropdownDetail },
  props: {
    initialItems: {
      type: Array,
      required: true
    },
    fields: {
      type: Array,
      default: () => [
        { key: 'name', label: "Actor/Actress" },
        { key: 'gender', label: 'Gender' },
        { key: 'date_of_birth', label: 'Age' },
        { key: 'main', label: 'Lead' },
        { key: 'id', label: '' }]
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
    this.items = JSON.parse(JSON.stringify(this.initialItems)); //deep copy
    this.primary = this.initialPrimary;
    
    this.spotted = this.items
      .filter(a => a.movies_characters.main)
      .map(b => {
        return {
          id: b.id,
          name: b.name,
          ...b.movies_characters
        };
      })[0];
  },
  computed: {
    initialPrimary () {
      return this.initialItems
        .find(item => item.movies_characters.main).id;
    }
  },
  methods: {
    emitChange (reset = null) {
      this.$emit('change', {
        field: this.field,
        subfield: 'movies_characters',
        list: this.items,
        reset: reset != null ? reset : this.asInitial()
      })
    },
    onRowClick (record, index) {
      console.log('change spotted!');
      this.spotted = {
        id: record.id,
        name: record.name,
        ...record.movies_characters
      }
    },
    selectNewArtist (assocIndex, dropdownItem) {
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
    addRow () {
      this.items.push({
        new: true,
        name: '',
        movies_characters: {
          main: false,
          character_name: null,
          type: null
        }
      });
    },
    reset () {
      this.items = JSON.parse(JSON.stringify(this.initialItems)); //deep copy
      this.primary = this.initialPrimary;
      this.emitChange(true);
      // this.$emit('change', {
      //   field: this.field,
      //   reset: true
      // })
      this.showReset = false;
    },
    deleteItem (item) {
      this.items = this.items.filter(item2 => item2.name != item.name);

      //deleting a persisted one
      if (!item.new) {
        this.showReset = true;
      }
      this.emitChange();
    },
    primaryChanged (newMain, item) {
      this.items = this.items.map(item => {
        item.movies_characters.main = newMain === item.id;
        return item;
      });
      this.primary = newMain;
      this.showReset = newMain != this.initialPrimary;
      this.emitChange();
    },
    asInitial () {
      let equal = true;
      if (this.items.length != this.initialItems.length) {
        equal = false;
      } else {
        // const newPrimary = this.items.find(item => item.movies_characters.main).id;
        // if (newPrimary != this.initialPrimary) {
        //   equal = false;
        // }

        // //check if the elements are all the same
        // const newIds = this.items.map(it1 => it1.id).sort((a, b) => a - b).join('');
        // const oldIds = this.initialItems.map(it1 => it1.id).sort((a, b) => a - b).join('');
        // if (newIds != oldIds) {
        //   equal = false;
        // }

        //compare item by item
        this.items.map((newItem, index) => {
          if (JSON.stringify(newItem) != JSON.stringify(this.initialItems[index])) {
            equal = false;
          }
        });
      }

      return equal;
    },
    characterNameChanged (data) {
      this.items = this.items.map(item => {
        if (item.id === this.spotted.id) {
          item.movies_characters.character_name = data.value;
        }
        return item;
      });
      this.emitChange();
    },
    characterTypeChanged () {
      console.log('character type changed!');
      this.items = this.items.map(item => {
        if (item.id === this.spotted.id) {
          item.movies_characters.type = data.value;
        }
        return item;
      });
      this.emitChange();
    }
  }
}
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
  right: 0;
}

.spotted-details {
  margin-left: 4rem;

  .detail-row {
    grid-template-columns: 120px auto 1px !important;
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