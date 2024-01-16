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
    >
        <template v-slot:[`item.actions`]="props">
            <v-btn style="margin: 3px;" color="primary" @click="editItem(props.item)">
                <v-icon>mdi-pencil</v-icon>
            </v-btn>
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
        { title: 'username', align: 'start', key: 'username', sortable: false },
        { title: 'First Name', key: 'first_name', align: 'end', sortable: false },
        { title: 'Second Name', key: 'second_name', align: 'end', sortable: false },
        { title: 'E-Mail', key: 'email', align: 'end', sortable: false },
        { title: 'Created', key: 'created_at', align: 'end', sortable: false },
        { title: 'Actions', value: 'actions', sortable: false, align: 'end' },
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
        editItem(item) {
            console.log(item);
        },
        deleteItem(item) {
        if (window.confirm('Are you sure you want to delete this user?')) {
            fetch("http://localhost:3000/api/person/" + item.id, {
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