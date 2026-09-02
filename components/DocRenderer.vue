<template>
  <component :is="Renderer" :doc="doc" v-if="Renderer" />
  <FallbackDoc v-else :doc="doc" />
</template>

<script setup>
import { rendererName } from "~/utils/renderers";
import FallbackDoc from "~/components/FallbackDoc.vue";

const props = defineProps({
  type: { type: String, required: true },
  doc: { type: Object, required: true },
});

const Renderer = useSiteComponent(rendererName(props.type));
</script>