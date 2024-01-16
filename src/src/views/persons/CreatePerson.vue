<template>
  <v-sheet max-width="700" class="mx-auto">
    <v-form v-on:submit.prevent="submitform">
      <v-text-field
          v-model="userName"
          :rules="rules"
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
          v-model="slackUsername"
          :rules="rules"
          label="Slack Username"
      ></v-text-field>
      <v-btn type="submit" block class="mt-2">Submit</v-btn>
    </v-form>
  </v-sheet>
</template>

<script>
export default {
  data: () => ({
    userName: '',
    firstName: '',
    secondName: '',
    slackUsername: '',
    rules: [
      value => value!== '' ? true : 'Field is required.',
    ],
  }),
  methods: {
    submitform() {
      const formData = new URLSearchParams();
      formData.append('username', this.userName);
      formData.append('first_name', this.firstName);
      formData.append('second_name', this.secondName);
      formData.append('slack_username', this.slackUsername);

      fetch('http://localhost:3000/api/person/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      })
      .then(response => response.json())
      .then(data => {console.log(data); alert(data)})
      .catch((error) => {
        console.error('Error:', error);
      });
    },
  },
}
</script>