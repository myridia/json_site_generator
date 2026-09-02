<template>
  <component :is="renderer" :doc="doc" />
</template>

<script setup>
import { computed } from "vue";
import { resolveRenderer } from "~/utils/renderers";

const props = defineProps({
  type: { type: String, required: true },
  doc: { type: Object, required: true },
});

const renderer = computed(() => resolveRenderer(props.type));
</script>