<template>
  <component :is="renderer" :doc="doc" />
</template>

<script setup>
import { computed, resolveComponent } from "vue";
import Thread from "~/components/Thread.vue";

const props = defineProps({
  type: { type: String, required: true },
  doc: { type: Object, required: true },
});

const registry = {
  thread: Thread,
};

const renderer = computed(() => registry[props.type] || resolveComponent("FallbackDoc"));
</script>
