<template>
  <div>
    <DocRenderer v-if="doc" :type="type" :doc="doc" />
    <p v-else class="doc-missing">Document not found.</p>
  </div>
</template>

<script setup>
import DocRenderer from "~/components/DocRenderer.vue";
import { getDoc } from "~/utils/site";

const route = useRoute();
const type = computed(() => String(route.params.type));
const slug = computed(() => String(route.params.slug));

const doc = computed(() => getDoc(type.value, slug.value));
</script>