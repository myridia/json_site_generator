<template>
  <div class="mb-3 rounded-lg border border-[#e3e5e0] bg-white p-3 shadow-sm dark:border-[#2f3338] dark:bg-[#1f2226]" :class="{ 'ml-6': reply.parent_id }">
    <span class="font-heading text-[1.2em] italic">{{ reply.author?.name || reply.author?.user_id || "Anonymous" }}</span>
    <span v-if="reply.created_at" class="ml-2 text-[0.75em] text-[#777]">
      <time :datetime="reply.created_at">{{ formatDate(reply.created_at) }}</time>
    </span>
    <p class="mt-1 mb-0 whitespace-pre-wrap">{{ reply.content }}</p>

    <div v-if="reply.replies && reply.replies.length" class="mt-2">
      <ThreadReply v-for="child in reply.replies" :key="child.reply_id" :reply="child" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  reply: { type: Object, required: true },
});

function formatDate(value) {
  return new Date(value).toLocaleString();
}
</script>