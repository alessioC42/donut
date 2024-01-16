<template>
  <v-card>
    <v-layout>
      <v-navigation-drawer
          v-model="drawer"
          theme="dark"
          :rail="rail"
          expand-on-hover="true"
          permanent
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
          <v-list-item prepend-icon="mdi-home-city" title="Home" value="home"></v-list-item>
          <v-list-item prepend-icon="mdi-account-plus" title="New Account" value="account"></v-list-item>
          <v-list-item prepend-icon="mdi-account-group-outline" title="Users" value="users"></v-list-item>
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
}
</script>