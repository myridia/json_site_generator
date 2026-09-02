<template>
  <div>
    <DocRenderer v-if="activeSite && doc" :type="type" :doc="doc" />
    <p v-else-if="!activeSite" class="doc-missing">No site is selected.</p>
    <p v-else class="doc-missing">Document not found.</p>
  </div>
</template>

<script setup>
import DocRenderer from "~/components/DocRenderer.vue";
import { useActiveSite, getSiteDoc } from "~/utils/site";

const route = useRoute();
const activeSite = useActiveSite();
const type = computed(() => String(route.params.type));
const slug = computed(() => String(route.params.slug));

const doc = computed(() => (activeSite.value ? getSiteDoc(activeSite.value, type.value, slug.value) : null));
</script>