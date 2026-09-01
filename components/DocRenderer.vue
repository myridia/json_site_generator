<template>
  <component :is="renderer" :doc="doc" />
</template>

<script setup>
import { computed } from "vue";
import { resolveRenderer } from "~/utils/renderers";

const props = defineProps({
  site: { type: String, required: true },
  type: { type: String, required: true },
  doc: { type: Object, required: true },
});

const renderer = computed(() => resolveRenderer(props.site, props.type));
</script>