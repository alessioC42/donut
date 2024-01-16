<template>
    <div>
      <v-progress-linear v-if="loading" indeterminate></v-progress-linear>
      <v-row v-else>
        <v-col cols="12" sm="6" md="4" v-for="donut in donuts" :key="donut.id">
          <v-card :to="'/donut/' + donut.id">
            <v-card-title>{{ donut.name }}</v-card-title>
            <v-card-text>
              <p>{{ donut.description }}</p>
              <p>Price: {{ donut.created_at }}</p>
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
        fetch('http://localhost:3000/api/donuts')
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