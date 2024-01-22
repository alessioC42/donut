<template>
    <router-link to="/admins/new" tag="button">
        <v-btn color="primary" dark>
            New Admin
        </v-btn>
    </router-link>
  <v-divider></v-divider>

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
    >
        <template v-slot:[`item.actions`]="props">
            <v-btn style="margin: 3px;" color="error" @click="deleteItem(props.item)">
                <v-icon>mdi-delete</v-icon>
            </v-btn>
        </template>
    </v-data-table-server>
</template>
<script>
export default {
    data: () => ({
    itemsPerPage: 10,
    headers: [
        { title: 'ID', align: 'start', key: 'id', sortable: false },
        { title: "username", align: "start", key: "username", sortable: false },
        { title: "created at", align: "start", key: "created_at",sortable: false },
        { title: 'Actions', value: 'actions', sortable: false, align: 'end' },
    ],
    search: '',
    serverItems: [],
    loading: true,
    totalItems: 0,
    }),
    methods: {
        loadItems ({ page, itemsPerPage }) {
            this.loading = true
            fetch(`http://localhost:3000/api/accounts?page=${page}&itemsPerPage=${itemsPerPage}`).then((response) => {
                response.json().then((data) => {
                    this.serverItems = data.results
                    this.totalItems = data.count
                    this.loading = false
                });
            });
        },
        editItem(item) {
            this.$router.push('/persons/manage/' + item.id);
        },
        deleteItem(item) {
            console.log(item);
            if (window.confirm('Are you sure you want to delete this admin?\nThis action cannot be undone!')) {
                fetch("http://localhost:3000/api/account/delete/" + item.username, {
                    method: "DELETE",
                }).then(response => {
                    if (response.status === 200) {
                        this.loadItems({ page: 1, itemsPerPage: 10, _sortBy: null });
                    }
                });
            }
        },
    },
}
</script>