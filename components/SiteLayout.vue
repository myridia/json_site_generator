<template>
  <component :is="Layout" v-if="Layout">
    <slot />
  </component>
  <slot v-else />
</template>

<script setup>
import { siteLayouts } from "~/utils/site";

const activeSite = useActiveSite();

const Layout = computed(() => {
  const name = activeSite.value?.name;
  return name ? siteLayouts[`/content/${name}/layout.vue`]?.default ?? null : null;
});
</script>