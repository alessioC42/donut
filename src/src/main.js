import {createRouter, createWebHistory} from 'vue-router';

import CreateUser from './views/CreateUser.vue';
import Home from './views/Home.vue';

import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

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

createApp(App).use(router).mount('#app')

export default router;