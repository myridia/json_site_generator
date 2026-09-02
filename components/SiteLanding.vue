<template>
  <section>
    <div v-if="home.columns && home.columns.length" class="flex flex-wrap items-start gap-8">
      <div v-for="(col, i) in home.columns" :key="i" :class="home.columns.length > 1 ? 'flex-1' : 'w-full'">
        <h3 v-if="col.heading" class="mb-2 text-[1.5em] font-bold">{{ col.heading }}</h3>
        <p v-for="(para, j) in col.paragraphs" :key="j" class="mb-4 leading-6">{{ para }}</p>
      </div>
    </div>

    <section id="projects" v-if="home.repos && home.repos.length" class="mt-8">
      <h2 class="mb-3 border-b-2 border-dotted border-[#a8a8a8] pb-1 text-[1.6em] font-bold">
        Projects
      </h2>
      <ul class="flex list-none flex-wrap items-center gap-3 p-0">
        <li v-for="repo in home.repos" :key="repo.name">
          <NuxtLink :to="repo.url" class="flex flex-col items-center gap-1 no-underline">
            <img v-if="repo.logo" :src="repo.logo" :alt="repo.name" class="h-24 w-auto" />
            <span class="font-body text-[0.9em] text-myridia-ink hover:text-myridia-green">
              {{ repo.label || niceName(repo.name) }}
            </span>
          </NuxtLink>
        </li>
      </ul>
    </section>
  </section>
</template>

<script setup>
import { useActiveSite } from "~/utils/site";

const activeSite = useActiveSite();

const home = computed(() => activeSite.value?.config.home || { hero: [], columns: [] });

function niceName(name) {
  if (!/[-_.]/.test(name) && /^[A-Za-z0-9]{2,8}$/.test(name)) return name;
  let label = name
    .toLowerCase()
    .replace(/^hello[_-]+/, "")
    .replace(/^wp[_-]+/, "")
    .replace(/[._-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!label) return name;
  label = label
    .replace(/ (.)/g, (_, c) => ` ${c.toUpperCase()}`)
    .replace(/^./, (c) => c.toUpperCase());
  return label;
}
</script>