<template>
  <div id="app" class="app_bckgrnd">
    <LeadsList />
  </div>
</template>

<script lang="ts" setup>
import LeadsList from "./components/LeadsList.vue";
</script>
<style>
.app_bckgrnd {
  background: #ececec;
  padding: 30px;
  height: 100vh;
}
</style>
