<template>
  <section>
    <ul v-if="home.hero && home.hero.length" class="m-0 mb-6 flex list-none flex-wrap gap-3 p-0">
      <li v-for="(tile, i) in home.hero" :key="tile.label || i" class="border-2 border-dotted border-[#a8a8a8] bg-white px-4 py-2">
        <NuxtLink :to="tile.url" class="font-heading text-[1.3em] italic no-underline text-myridia-green hover:text-myridia-ink">
          {{ tile.label }}
        </NuxtLink>
      </li>
    </ul>

    <section v-if="home.repos && home.repos.length" class="mt-8">
      <h2 class="mb-3 border-b-2 border-dotted border-[#a8a8a8] pb-1 text-[1.6em] font-bold">
        Projects
      </h2>
      <ul class="grid list-none grid-cols-2 gap-4 p-0 md:grid-cols-3">
        <li v-for="repo in home.repos" :key="repo.name">
          <NuxtLink :to="repo.url" class="flex items-center gap-2 no-underline">
            <img v-if="repo.logo" :src="repo.logo" :alt="repo.name" class="h-14 w-auto" />
            <span class="font-heading text-[1.1em] italic text-myridia-green hover:text-myridia-ink">
              {{ repo.name }}
            </span>
          </NuxtLink>
        </li>
      </ul>
    </section>

    <div v-if="home.columns && home.columns.length" class="flex flex-wrap items-start gap-8">
      <div v-for="(col, i) in home.columns" :key="i" :class="home.columns.length > 1 ? 'flex-1' : 'w-full'">
        <h3 v-if="col.heading" class="mb-2 text-[1.5em] font-bold">{{ col.heading }}</h3>
        <p v-for="(para, j) in col.paragraphs" :key="j" class="mb-4 leading-6">{{ para }}</p>
      </div>
    </div>

    <section v-if="recentPosts.length" class="mt-8">
      <h2 class="mb-3 border-b-2 border-dotted border-[#a8a8a8] pb-1 text-[1.6em] font-bold">
        Recent from the Notebook
      </h2>
      <ul class="list-none">
        <li v-for="post in recentPosts" :key="post.slug" class="mb-4">
          <NuxtLink
            :to="`/docs/post/${post.slug}`"
            class="font-heading text-[1.3em] italic no-underline text-myridia-green hover:text-myridia-ink"
          >
            {{ post.title }}
          </NuxtLink>
          <p v-if="post.doc.summary" class="mt-1 text-[0.95em] text-myridia-muted">{{ post.doc.summary }}</p>
          <p class="mt-0.5 text-[0.8em] text-[#777]">{{ formatDate(post.doc.created_at) }}</p>
        </li>
      </ul>
    </section>
  </section>
</template>

<script setup>
import { useActiveSite } from "~/utils/site";

const activeSite = useActiveSite();

const home = computed(() => activeSite.value?.config.home || { hero: [], columns: [] });

const recentPosts = computed(() =>
  (activeSite.value?.docs || [])
    .filter((d) => d.type === "post")
    .sort((a, b) => (b.doc.created_at || "").localeCompare(a.doc.created_at || ""))
    .slice(0, 5)
);

function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString();
}
</script>