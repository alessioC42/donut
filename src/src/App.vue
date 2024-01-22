<template>
  <v-card>
    <v-layout>
      <v-navigation-drawer
          v-if="showNavigation"
          v-model="drawer"
          theme="dark"
          :rail="rail"
          expand-on-hover="true"
          @click="rail = false"
      >
        <v-list-item
            prepend-avatar="/images/donut_image.png"
            title="Donut"
            nav
        >
          <template v-slot:append>
            <v-btn
                variant="text"
                icon="mdi-chevron-left"
                @click.stop="rail = !rail"
            ></v-btn>
          </template>
        </v-list-item>
        <v-divider></v-divider>
        <v-list density="compact" nav>
          <v-list-item prepend-icon="mdi-home-city" title="Home" value="home" to="/"></v-list-item>
          <v-list-item prepend-icon="mdi-account-group-outline" title="Persons" value="account" to="/persons"></v-list-item>
          <v-list-item prepend-icon="mdi-sitemap-outline" title="Workspaces" value="workspaces" to="/workspaces"></v-list-item>
          <v-list-item prepend-icon="mdi-security" title="Admins" value="admins" to="/admins"></v-list-item>
          <v-list-item prepend-icon="mdi-timer-settings" title="Schleude" value="schleude" to="/cron"></v-list-item>
          <v-list-item prepend-icon="mdi-logout" title="Logout" value="logout" color="red" @click="logout"></v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-main style="padding-bottom: 20px; padding-top: 20px">
        <div style="margin: 30px">
          <router-view></router-view>
        </div>
      </v-main>

    </v-layout>
  </v-card>
</template>
<script>
export default {
  data () {
    return {
      drawer: true,
      rail: true,
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('token');
      this.$router.push('/login');
    }
  },
  computed: {
    showNavigation() {
      return this.$route.path !== '/login';
    }
  }
}
</script>