<template>
  <AllSites v-if="!activeSite" />
  <SiteLanding v-else :site="activeSite" />
</template>

<script setup>
import { useActiveSite } from "~/utils/sites";

const activeSite = useActiveSite();
</script>