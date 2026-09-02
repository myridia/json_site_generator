<template>
  <article>
    <header class="mb-4">
      <h1 class="mb-1 text-[1.8em] font-bold">{{ doc.title }}</h1>
      <p v-if="doc.created_at" class="mb-3 text-[0.85em] text-[#777]">
        <time :datetime="doc.created_at">{{ formatDate(doc.created_at) }}</time>
      </p>
      <ul v-if="doc.tags && doc.tags.length" class="m-0 flex list-none gap-2 p-0">
        <li
          v-for="tag in doc.tags"
          :key="tag"
          class="border border-[#999] bg-[#eee] px-2 py-0.5 text-[1em] text-myridia-green"
        >
          {{ tag }}
        </li>
      </ul>
    </header>

    <div v-if="doc.content" class="whitespace-pre-wrap leading-5">{{ doc.content }}</div>

    <div v-else-if="doc.body && doc.body.length">
      <section v-for="(block, i) in doc.body" :key="i" class="mb-4">
        <h2 v-if="block.heading" class="mb-2 text-[1.4em] font-bold">{{ block.heading }}</h2>
        <p v-for="(para, j) in block.paragraphs" :key="j" class="mb-3 leading-6">{{ para }}</p>
      </section>
    </div>
  </article>
</template>

<script setup>
defineProps({
  doc: { type: Object, required: true },
});

function formatDate(value) {
  return new Date(value).toLocaleDateString();
}
</script>