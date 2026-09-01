<template>
  <SiteLanding v-if="site" :site="site" />
</template>

<script setup>
import { getSite } from "~/utils/sites";

const route = useRoute();
const site = computed(() => getSite(String(route.params.site)));
</script>