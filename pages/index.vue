<template>
  <component :is="Landing" v-if="Landing" />
</template>

<script setup>
const Landing = useSiteComponent("SiteLanding");
</script>