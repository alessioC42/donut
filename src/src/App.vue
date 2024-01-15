<script setup>
import "bootstrap/dist/css/bootstrap.min.css";

import Navbar from "./components/Navbar.vue";
</script>

<template>
  <Navbar></Navbar>
  <div class="container">
    <router-view />
  </div>
</template>
