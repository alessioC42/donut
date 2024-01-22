<template>
  <h2>{{ workspaceName }}</h2>
  <p>{{ workspaceDescription }}</p>
  <v-divider style="margin: 5px;"></v-divider>

  <v-row style="margin-bottom: 1px;margin-top: 1px;">
    <v-col :hidden="!buttonsEnabled">
      <v-btn color="primary" @click="generateDonuts">generate new donuts</v-btn>
      <v-btn style="margin-left: 4px;" color="primary" dark v-on:click="dialog = true">Schleude editor</v-btn>
      <v-btn style="margin-left: 4px;" color="error" @click="deleteDonuts">
        delete existing donuts
      </v-btn>
      <v-btn style="margin-left: 4px;" color="error" @click="deleteWorkspace">
        delete Workspace
      </v-btn>
    </v-col>
    <v-col :hidden="buttonsEnabled">
      <v-progress-circular size="50" color="primary" indeterminate></v-progress-circular>
    </v-col>
  </v-row>


  <template>
    <v-dialog v-model="dialog" max-width="80%">
      <v-card>
        <v-card-title class="headline">Schleude editor</v-card-title>
        <v-card-text>
          <v-switch v-model="useCron" color="primary" label="Fire automatic donuts"></v-switch>

          <cron-vuetify v-model="cron" @error="error = $event" />
          
          <v-btn color="primary" block class="mt-2" @click="updateCron">set</v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
  </template>


  <v-card>
    <v-tabs v-model="tab" bg-color="primary">
      <v-tab value="persons">persons</v-tab>
      <v-tab value="donuts">donuts</v-tab>
    </v-tabs>

    <v-card-text>
      <v-window v-model="tab">
        <v-window-item value="persons">
          <v-data-table-server v-model:items-per-page="personItemsPerPage" :headers="personHeaders"
            :items-length="personTotalItems" :items="personServerItems" :loading="loading" :disable-sort="true"
            item-value="name" @update:options="loadPersons"></v-data-table-server>
        </v-window-item>

        <v-window-item value="donuts">
          <v-data-table-server v-model:items-per-page="donutItemsPerPage" :headers="donutHeaders"
            :items-length="donutTotalItems" :items="donutServerItems" :loading="loading" :disable-sort="true"
            item-value="name" @update:options="loadDonuts"></v-data-table-server>
        </v-window-item>
      </v-window>
    </v-card-text>
  </v-card>
</template>
<script>
import { defaultItems, genItems, pad } from '@vue-js-cron/core';

export default {
  data() {
    const items = defaultItems('en');

    return {
      tab: "persons",
      loading: true,

      workspaceName: '',
      workspaceDescription: '',

      personItemsPerPage: 10,
      personHeaders: [
        { title: "paused", key: "is_paused", align: "start", sortable: false, },
        { title: 'username', align: 'start', key: 'username', sortable: false, },
        { title: 'First Name', key: 'first_name', align: 'end', sortable: false },
        { title: 'Second Name', key: 'second_name', align: 'end', sortable: false },
        { title: 'E-Mail', key: 'email', align: 'end', sortable: false },
        { title: 'Created', key: 'created_at', align: 'end', sortable: false, },
      ],
      personServerItems: [],
      personTotalItems: 0,


      donutItemsPerPage: 10,
      donutHeaders: [
        { title: "person 1", key: "person0_username", align: "start", sortable: false },
        { title: "person 2", key: "person1_username", align: "start", sortable: false },
        { title: "person 3", key: "person2_username", align: "start", sortable: false },
        { title: "created at", key: "created_at", align: "end", sortable: false }
      ],
      donutServerItems: [
      ],
      donutTotalItems: 0,

      buttonsEnabled: true,



      dialog: false,
      useCron: true,
      cronPeriods: [
        { id: 'month', value: ['day', 'hour', 'minute', 'second'] },
        { id: 'week', value: ['day', 'hour', 'minute', 'second']},
        { id: 'day', value: ['hour', 'minute', 'second']},
        { id: 'hour', value: ['minute', 'second'] },
        { id: 'minute', value: ['second'] },
        { id: 'second', value: [] }
      ],
      cronFields: [
        { id: 'second', items: genItems(0, 59, (value) => pad(value, 2)) },
        { id: 'minute', items: items.minuteItems },
        { id: 'hour', items: items.hourItems },
        { id: 'day', items: items.dayItems },
        { id: 'month', items: items.monthItems }
      ],
      error: null,
      cron: "0 10 * * 2"
    }
  },
  mounted() {
    this.loadWorkspaceData();
  },
  methods: {
    loadPersons({ page, itemsPerPage }) {
      this.loading = true
      fetch(`http://localhost:3000/api/workspaces/members/${this.$route.params.id}?page=${page}&itemsPerPage=${itemsPerPage}`).then((response) => {
        response.json().then((data) => {
          for (let i = 0; i < data.results.length; i++) {
            data.results[i].is_paused = data.results[i].is_paused ? 'Yes' : 'No';
          }
          this.personServerItems = data.results
          this.personTotalItems = data.count
          this.loading = false
        })
      })
    },
    loadDonuts({ page, itemsPerPage }) {
      this.loading = true
      fetch(`http://localhost:3000/api/workspace/matches/${this.$route.params.id}?page=${page}&itemsPerPage=${itemsPerPage}`).then((response) => {
        response.json().then((data) => {
          console.log(data)
          this.donutServerItems = data.results
          this.donutTotalItems = data.count
          this.loading = false
        })
      })
    },
    loadWorkspaceData() {
      fetch(`http://localhost:3000/api/workspaces/${this.$route.params.id}`).then((response) => {
        response.json().then((data) => {
          this.workspaceName = data.name;
          this.workspaceDescription = data.description;
          this.cron = data.cron;
          this.useCron = data.use_cron === 1;
        })
      })
    },
    generateDonuts() {
      this.buttonsEnabled = false;
      fetch(`http://localhost:3000/api/workspaces/match/${this.$route.params.id}`, {
        method: 'POST',
      }).then((response) => {
        response.json().then((data) => {
          console.log(data);
          this.tab = 'donuts';
          this.loadDonuts({ page: 1, itemsPerPage: 10 });
          this.buttonsEnabled = true;
        })
      })
    },
    deleteDonuts() {
      this.buttonsEnabled = false;
      fetch("http://localhost:3000/api/workspaces/donuts/delete/" + this.$route.params.id, {
        method: 'DELETE',
      }).then((response) => {
        response.json().then(() => {
          this.tab = 'donuts';
          this.loadDonuts({ page: 1, itemsPerPage: 10 });
          this.buttonsEnabled = true;
        });
      });
    },
    deleteWorkspace() {
      this.buttonsEnabled = false;
      fetch("http://localhost:3000/api/workspaces/delete/" + this.$route.params.id, {
        method: 'DELETE',
      }).then((response) => {
        response.json().then(() => {
          this.$router.push('/workspaces');
          this.buttonsEnabled = true;
        })
      });
    },
    updateCron() {
      this.dialog = false;
      fetch(`http://localhost:3000/api/workspaces/cron/update/${this.$route.params.id}?cron=${encodeURIComponent(this.cron)}&use_cron=${this.useCron ? 1:0}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `?cron=${this.cron}&use_cron=${this.useCron ? 1:0}`,
      }).then((response) => {
        response.json().then((data) => {
          console.log(data)
          console.log('cron updated');
          //this.loadWorkspaceData();
        })
      });
    }
  },
}

</script>