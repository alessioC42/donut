<template>
  <router-link to="/workspaces/create">
    <v-btn color="primary" class="mb-2">Create Workspace</v-btn>
  </router-link>
  <v-divider style="margin: 10px;"></v-divider>
    <div>
      <v-progress-linear v-if="loading" indeterminate></v-progress-linear>
      <v-row v-else>
        <v-col cols="12" sm="6" md="4" v-for="workspace in donuts" :key="workspace.id">
          <v-card :to="'/workspaces/' + workspace.id">
            <v-card-title>{{ workspace.name }}</v-card-title>
            <v-card-text>
              <p>{{ workspace.description }}</p>
              <p>{{ workspace.created_at }}</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
</template>

<script>
export default {
    data() {
        return {
        donuts: [],
        loading: false,
        };
    },
    created() {
        this.fetchDonuts();
    },
    methods: {
        fetchDonuts() {
        this.loading = true;
        fetch('http://localhost:3000/api/workspaces')
            .then(response => response.json())
            .then(data => {
            this.donuts = data;
            this.loading = false;
            })
            .catch(() => {
            this.loading = false;
            });
        },
    },
};
</script>