import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

//vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import CreateUser from './views/CreateUser.vue';
import Home from './views/Home.vue';
import App from './App.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            component: Home
        },
        {
            path: "/create-user",
            component: CreateUser
        }
    ]
});

const vuetify = createVuetify({
    components,
    directives,
  });

const app = createApp(App);
app.use(router);
app.use(vuetify);
app.mount('#app');