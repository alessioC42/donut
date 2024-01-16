<template>
  <v-sheet max-width="700" class="mx-auto">
    <v-form @submit.prevent>
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
}
</script>