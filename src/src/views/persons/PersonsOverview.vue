<template>
    <router-link to="/persons/new" tag="button">
        <v-btn color="primary" dark>
            New Person
        </v-btn>
    </router-link>
    <v-data-table-server
      v-model:items-per-page="itemsPerPage"
      :headers="headers"
      :items-length="totalItems"
      :items="serverItems"
      :loading="loading"
      :search="search"
      :disable-sort="true"
      item-value="name"
      @update:options="loadItems"
    ></v-data-table-server>
  </template>
  <script>
    export default {
      data: () => ({
        itemsPerPage: 10,
        headers: [
          {
            title: 'username',
            align: 'start',
            key: 'username', 
        },
          { title: 'First Name', key: 'first_name', align: 'end', sortable: false },
          { title: 'Second Name', key: 'second_name', align: 'end', sortable: false },
          { title: 'Slack', key: 'slack_username', align: 'end', sortable: false },
          { title: 'Created', key: 'created_at', align: 'end', sortable: false, },
        ],
        search: '',
        serverItems: [],
        loading: true,
        totalItems: 0,
      }),
      methods: {
        loadItems ({ page, itemsPerPage, _sortBy }) {
          this.loading = true
          fetch(`http://localhost:3000/api/persons?page=${page}&itemsPerPage=${itemsPerPage}`).then((response) => {
            response.json().then((data) => {
              this.serverItems = data.results
              this.totalItems = data.count
              this.loading = false
            })
          })
        },
      },
    }
  </script>