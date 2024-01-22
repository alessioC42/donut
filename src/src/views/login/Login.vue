<template>
    <v-sheet max-width="700" class="mx-auto">
        <div style="align-items: center;">

        </div>
        <v-form @submit.prevent="login">
            <v-text-field v-model="username" label="username"></v-text-field>
            <v-text-field v-model="password" label="password" type="password"></v-text-field>
            <v-btn type="submit" :disabled="loginButtonDisabled" color="primary">Login</v-btn>

        </v-form>
    </v-sheet>
</template>

<script>
export default {
    data() {
        return {
            username: '',
            password: '',
            loginButtonDisabled: false
        }
    },
    methods: {
        async login() {
            this.loginButtonDisabled = true;
            const response = await fetch(`http://localhost:3000/api/login?username=${this.username}&password=${this.password}`, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `username=${this.username}&password=${this.password}`,
                method: "POST"
            });
            const data = await response.json()
            console.log(data);

            if (data.token) {
                localStorage.setItem('token', data.token);
                this.$router.push("/");
            } else {
                this.loginButtonDisabled = false;
                this.password = '';
                this.username = '';
            }

        }
    }
}
</script>
