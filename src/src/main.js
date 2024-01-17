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
import AllDonutsOverview from './views/donuts/AllDonutsOverview.vue';
import SingleDonut from './views/donuts/SingeDonut.vue';
import AllWorkspacesOverview from './views/workspaces/AllWorkspacesOverview.vue';
import CreateWorkspace from './views/workspaces/CreateWorkSpace.vue';
import WorkspaceOverview from './views/workspaces/WorkspaceOverview.vue';
import ManagePerson from "./views/persons/ManagePerson.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: "/",  component: Home },
        { path: "/home",  component: Home },
        { path: "/persons", component: PersonsOverview},
        { path: "/persons/new", component: CreateUser },
        { path: "/persons/manage/:id", component: ManagePerson },
        { path: "/donuts", component: AllDonutsOverview},
        { path: "/donut/:id", component: SingleDonut},
        { path: "/workspaces", component: AllWorkspacesOverview},
        { path: "/workspaces/:id", component: WorkspaceOverview},
        { path: "/workspaces/new", component: CreateWorkspace},
    ]
});

const vuetify = createVuetify({
    defaultTheme: 'light',
    components,
    directives,
});

const app = createApp(App);
app.use(router);
app.use(vuetify);
app.mount('#app');