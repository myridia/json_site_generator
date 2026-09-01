<template>
  <div>
    <DocRenderer v-if="doc" :site="site" :type="type" :doc="doc" />
    <p v-else class="doc-missing">Document not found.</p>
  </div>
</template>

<script setup>
import DocRenderer from "~/components/DocRenderer.vue";
import { getSiteDoc } from "~/utils/sites";

const route = useRoute();
const site = computed(() => String(route.params.site));
const type = computed(() => String(route.params.type));
const slug = computed(() => String(route.params.slug));

const doc = getSiteDoc(site.value, type.value, slug.value);
</script>