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
          class="border border-[#999] bg-white px-2 py-0.5 text-[1em] text-myridia-green"
        >
          {{ tag }}
        </li>
      </ul>
    </header>

    <div class="whitespace-pre-wrap leading-5">{{ doc.content }}</div>

    <section v-if="doc.replies && doc.replies.length" class="mt-6">
      <h2 class="mb-2 text-[1.6em] font-bold">Replies</h2>
      <ThreadReply v-for="reply in doc.replies" :key="reply.reply_id" :reply="reply" />
    </section>
  </article>
</template>

<script setup>
import ThreadReply from "~/components/ThreadReply.vue";

defineProps({
  doc: { type: Object, required: true },
});

function formatDate(value) {
  return new Date(value).toLocaleDateString();
}
</script>