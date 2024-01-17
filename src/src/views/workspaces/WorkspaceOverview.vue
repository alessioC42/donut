<template>
    
    <h2>{{ workspaceName }}</h2>
    <p>{{ workspaceDescription }}</p>
    <v-divider style="margin: 5px;"></v-divider>
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
    workspaceName: '',
    workspaceDescription: '',
    itemsPerPage: 10,
    headers: [
        { title: "paused", key: "is_paused", align: "start", sortable: false, },
        { title: 'username', align: 'start', key: 'username', sortable: false, },
        { title: 'First Name', key: 'first_name', align: 'end', sortable: false },
        { title: 'Second Name', key: 'second_name', align: 'end', sortable: false },
        { title: 'E-Mail', key: 'email', align: 'end', sortable: false },
        { title: 'Created', key: 'created_at', align: 'end', sortable: false, },
    ],
    search: '',
    serverItems: [],
    loading: true,
    totalItems: 0,
    }),
    mounted() {
        this.loadWorkspaceName();
    },
    methods: {
        loadItems ({ page, itemsPerPage, _sortBy }) {
            this.loading = true
            fetch(`http://localhost:3000/api/workspaces/members/${ this.$route.params.id }?page=${page}&itemsPerPage=${itemsPerPage}`).then((response) => {
            response.json().then((data) => {
              for (let i = 0; i < data.results.length; i++) {
                data.results[i].is_paused = data.results[i].is_paused ? 'Yes' : 'No';
              }
                this.serverItems = data.results
                this.totalItems = data.count
                this.loading = false
            })
            })
        },
        loadWorkspaceName() {
            fetch(`http://localhost:3000/api/workspaces/${ this.$route.params.id }`).then((response) => {
                response.json().then((data) => {
                    this.workspaceName = data.name;
                    this.workspaceDescription = data.description;
                })
            })
        }
    },
}

</script>