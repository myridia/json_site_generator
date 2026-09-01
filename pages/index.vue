<template>
  <SiteLanding v-if="defaultSite" :site="defaultSite" />
  <section v-else>
    <h1 class="text-[1.4em] font-bold italic">Sites</h1>
    <p class="mt-4 rounded border bg-white p-4">
      No default site configured. Set <code>defaultSiteName</code> in
      <code>utils/sites.ts</code>, or view the listing at <NuxtLink to="/s" class="text-myridia-green no-underline">/s</NuxtLink>.
    </p>
  </section>
</template>

<script setup>
import { getDefaultSite } from "~/utils/sites";

const defaultSite = computed(() => getDefaultSite());
</script>