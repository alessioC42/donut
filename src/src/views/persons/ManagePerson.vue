<template>
  <v-sheet max-width="700" class="mx-auto">
    <v-form v-on:submit.prevent="submitForm">
      <v-text-field
          v-model="userName"
          :rules="rules"
          disabled="true"
          label="Username"
      ></v-text-field>
      <v-text-field
          v-model="firstName"
          :rules="rules"
          label="First name"
      ></v-text-field>
      <v-text-field
          v-model="secondName"
          :rules="rules"
          label="Second name"
      ></v-text-field>
      <v-text-field
          v-model="email"
          :rules="rules"
          label="E-Mail"
      ></v-text-field>
      <v-divider></v-divider>
      <v-row style="padding-top: 20px">
        <v-col cols="12" sm="6" md="4" v-for="workspace in workspaces" :key="workspace.id">
          <v-card>
            <v-card-title>{{ workspace.name }}</v-card-title>
            <v-switch
                style="margin-left: 10px;"
                v-model="(workspace.is_member)"
                label="Is Member"
                color="primary"
                hide-details></v-switch>
            <v-switch
                style="margin-left: 10px;"
                v-model="(workspace.is_paused)"
                :disabled="!workspace.is_member"
                label="Is Paused"
                color="primary"
                hide-details></v-switch>
            <v-card-text>
              <p>{{ workspace.created_at }}</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-btn type="submit" block class="mt-2">update</v-btn>
    </v-form>
  </v-sheet>
</template>

<script>
export default {
  data: () => ({
    userName: '',
    firstName: '',
    secondName: '',
    email: '',
    workspaces: [],
    rules: [
      value => value!== '' ? true : 'Field is required.',
    ],
  }),
  mounted() {
    this.loadData();
  },
  methods: {
    loadData(){
      fetch(`http://localhost:3000/api/person/${ this.$route.params.id }`).then((response) => {
        response.json().then((data) => {
          this.userName = data.person.username;
          this.firstName = data.person.first_name;
          this.secondName = data.person.second_name;
          this.email = data.person.email;

          data.workspaces.forEach((workspace) => {
            workspace.is_member = workspace.is_member === 1;
            workspace.is_paused = workspace.is_paused ? workspace.is_paused === 1 : false;
          });
          this.workspaces = data.workspaces;
        })
      })
    },
    submitForm() {
      let workspaces = [];
      this.workspaces.forEach((workspace) => {
        workspaces.push({
          id: workspace.id,
          is_member: workspace.is_member,
          is_paused: workspace.is_paused,
        });
      });

      const formData = new URLSearchParams();
      formData.append('username', this.userName);
      formData.append('first_name', this.firstName);
      formData.append('second_name', this.secondName);
      formData.append('email', this.email);
      formData.append('workspaces', JSON.stringify(workspaces));
      fetch(`http://localhost:3000/api/person/update/${this.$route.params.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      })
      .then(response => response.json())
      .then(data => {
        this.$router.push('/persons');
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    },
  },
}
</script>