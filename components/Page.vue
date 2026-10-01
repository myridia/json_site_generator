<template>
  <article>
    <h1 class="mb-4 text-[2em] font-bold">{{ doc.title }}</h1>

    <div v-if="doc.content" class="whitespace-pre-wrap leading-6">{{ doc.content }}</div>

    <div v-else-if="doc.body && doc.body.length">
      <section v-for="(block, i) in doc.body" :key="i" class="mb-5">
        <h2 class="mb-2 text-[1.4em] font-bold">{{ block.heading }}</h2>
        <p v-for="(para, j) in block.paragraphs" :key="j" class="mb-3 leading-6">{{ para }}</p>
      </section>
    </div>
  </article>
</template>

<script setup>
defineProps({
  doc: { type: Object, required: true },
});
</script>