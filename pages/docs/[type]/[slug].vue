<template>
  <div>
    <DocRenderer v-if="site && doc" :site="site.name" :type="type" :doc="doc" />
    <p v-else class="doc-missing">Document not found.</p>
  </div>
</template>

<script setup>
import DocRenderer from "~/components/DocRenderer.vue";
import { getSiteDoc, useActiveSite } from "~/utils/sites";

const route = useRoute();
const type = computed(() => String(route.params.type));
const slug = computed(() => String(route.params.slug));

const site = useActiveSite();

const doc = computed(() => (site.value ? getSiteDoc(site.value.name, type.value, slug.value) : null));
</script>