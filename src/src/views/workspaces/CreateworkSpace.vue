<template>
    <v-sheet max-width="700" class="mx-auto">
      <v-form v-on:submit.prevent="submitform">
        <v-text-field
            v-model="workSpaceName"
            :rules="rules"
            label="Workspace name"
        ></v-text-field>
        <v-textarea
            v-model="description"
            :rules="rules"
            label="Description"
        ></v-textarea>
        <v-btn type="submit" block class="mt-2">Submit</v-btn>
      </v-form>
    </v-sheet>
  </template>
  
  <script>
  export default {
    data: () => ({
      workSpaceName: '',
      description: '',
      rules: [
         (value) => {
          if (value.length > 500) {
            return 'Woahhh. Thats to much!';
          } else return value!== '' ? true : 'Field is required.';
        },
      ],
    }),
    mounted() {
      this.loadRandomName();
    },
    methods: {
      submitform() {
        const formData = new URLSearchParams();
        formData.append('name', this.workSpaceName);
        formData.append('description', this.description);
  
        fetch('http://localhost:3000/api/workspaces/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formData,
        })
        .then(response => {console.log(response);response.json()})
        .then(data => {
          console.log(data);
          this.$router.push('/workspaces');
        })
        .catch((error) => {
          console.error('Error:', error);
        });
      },
      async loadRandomName() {
        const response = await fetch("http://localhost:3000/api/workspace/random");
        this.workSpaceName = await response.text();
      }
    },
  }
  </script>