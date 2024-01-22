import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import '@mdi/font/css/materialdesignicons.css';

//vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import Home from './views/Home.vue';
import App from './App.vue';
import CreateUser from './views/persons/CreatePerson.vue';
import PersonsOverview from './views/persons/PersonsOverview.vue';
import AllWorkspacesOverview from './views/workspaces/AllWorkspacesOverview.vue';
import CreateWorkspace from './views/workspaces/CreateworkSpace.vue';
import WorkspaceOverview from './views/workspaces/WorkspaceOverview.vue';
import ManagePerson from "./views/persons/ManagePerson.vue";
import Login from "./views/login/Login.vue";
import AdminsOverview from "./views/admins/AdminsOverview.vue";
import CreateAdmin from "./views/admins/CreateAdmin.vue";

import '@vue-js-cron/vuetify/dist/vuetify.css'
import CronVuetifyPlugin from '@vue-js-cron/vuetify'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: "/",  component: Home },
        { path: "/login",  component: Login},
        { path: "/home",  component: Home },
        { path: "/persons", component: PersonsOverview},
        { path: "/persons/new", component: CreateUser },
        { path: "/persons/manage/:id", component: ManagePerson },
        { path: "/workspaces", component: AllWorkspacesOverview},
        { path: "/workspaces/:id", component: WorkspaceOverview},
        { path: "/workspaces/new", component: CreateWorkspace},
        { path: "/admins", component: AdminsOverview },
        { path: "/admins/new", component: CreateAdmin },
    ]
});

const vuetify = createVuetify({
    defaultTheme: 'light',
    components,
    directives,
});

// Save the original fetch function
const originalFetch = window.fetch;

window.fetch = async (url, options = {}) => {
    const token = localStorage.getItem("token");

    // Add the authorization header
    options.headers = {
        ...options.headers,
        'Authorization': 'Bearer ' + token,
        'Cache-Control': 'no-cache', // Disable caching
    };

    // Call the original fetch function with the modified options
    const response = await originalFetch(url, options);

    if (response.status === 401) {
        // Unauthorized, so redirect to the login page
        router.push('/login');
    }

    return response;
};

const app = createApp(App);
app.use(router);
app.use(vuetify);
app.use(CronVuetifyPlugin);
app.mount('#app');