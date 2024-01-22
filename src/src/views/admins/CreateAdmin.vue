<template>
    <v-sheet max-width="700" class="mx-auto">
      <v-form v-on:submit.prevent="submitform">
        <v-text-field
            v-model="userName"
            :rules="rules"
            label="Username"
        ></v-text-field>
        <v-text-field
            v-model="password"
            :rules="passwordRules"
            label="Password"
            type="password"
        ></v-text-field>
        <v-text-field
            v-model="passwordRepeat"
            :rules="passwordRules"
            label="Repeat Password"
            type="password"
        ></v-text-field>
        <v-btn type="submit" block class="mt-2">Submit</v-btn>
      </v-form>
    </v-sheet>
  </template>
  
  <script>
  export default {
    data: () => ({
      userName: '',
      password: '',
      passwordRepeat: '',
      rules: [
        value => value!== '' ? true : 'Field is required.',
      ],
      passwordRules: [
        value => value.length >= 8 || 'Password must be at least 8 characters long.',
      ],
    }),
    methods: {
      submitform() {
        if (this.password !== this.passwordRepeat) {
          alert('Passwords do not match');
          return;
        }

        const formData = new URLSearchParams();
        formData.append('username', this.userName);
        formData.append('password', this.email);
  
        fetch('http://localhost:3000/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formData,
        })
        .then(response => response.json())
        .then(data => {
          this.$router.push('/admins');
        })
        .catch((error) => {
          console.error('Error:', error);
        });
      },
    },
  }
  </script>