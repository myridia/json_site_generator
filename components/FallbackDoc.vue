<template>
  <article>
    <h1 class="text-[1.8em] font-bold">{{ doc.title || doc._id || "Untitled" }}</h1>
    <section v-if="doc.content" class="mt-3 leading-5">{{ doc.content }}</section>
    <pre class="mt-4 overflow-auto rounded border border-[#999] bg-white p-4">
      {{ JSON.stringify(doc, null, 2) }}
    </pre>
  </article>
</template>

<script setup>
defineProps({
  type: { type: String, required: true },
  doc: { type: Object, required: true },
});
</script>