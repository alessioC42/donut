<template>
  <div>
    <v-progress-linear v-if="loading" indeterminate></v-progress-linear>
    <v-row v-else>
      <v-col cols="12" sm="6" md="4" v-for="donut in donuts" :key="donut.id">
        <v-card>
          <v-card-title>{{ donut.person0_username }} - {{ donut.person1_username }}</v-card-title>
          <v-card-text>
              <v-table>
                  <tbody style="align: center;">
                      <tr>
                          <td>{{ donut.person0_username }}</td>
                          <td><b>Username</b></td>
                          <td>{{ donut.person1_username }}</td>
                      </tr>
                  </tbody>
              </v-table>
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
        fetch(`http://localhost:3000/api/donut/${ this.$route.params.id }`)
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