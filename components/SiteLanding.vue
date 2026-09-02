<template>
  <section>
    <div v-if="home.columns && home.columns.length" class="mb-8 rounded-xl border border-[#e3e5e0] bg-white p-6 shadow-sm dark:border-[#2f3338] dark:bg-[#1f2226] md:p-10">
      <p v-if="home.columns.some((c) => c.heading)" class="mb-2 text-[0.72em] font-semibold uppercase tracking-[0.12em] text-myridia-green">
        Manifesto
      </p>
      <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div v-for="(col, i) in home.columns" :key="i">
          <h2 v-if="col.heading" class="mb-3 text-[1.35em] font-bold text-myridia-ink dark:text-[#f2f3f0]">{{ col.heading }}</h2>
          <p v-for="(para, j) in col.paragraphs" :key="j" class="mb-4 leading-7 text-[#3c3d40] dark:text-[#cfd3d8]">{{ para }}</p>
        </div>
      </div>
    </div>

    <section
      id="projects"
      v-if="home.repos && home.repos.length"
      class="mt-8 rounded-xl border border-[#e3e5e0] bg-white p-6 shadow-sm dark:border-[#2f3338] dark:bg-[#1f2226] md:p-10"
    >
      <h2 class="mb-6 text-[1.35em] font-bold text-myridia-ink dark:text-[#f2f3f0]">Projects</h2>
      <ul class="grid list-none grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4 p-0">
        <li v-for="repo in home.repos" :key="repo.name">
          <NuxtLink
            :to="repo.url"
            class="flex flex-col items-center gap-3 rounded-lg border border-[#e9eae6] bg-[#fafbfa] p-4 no-underline transition hover:border-myridia-green hover:shadow-md dark:border-[#3a3f45] dark:bg-[#262a2e]"
          >
            <img v-if="repo.logo" :src="repo.logo" :alt="repo.name" class="h-24 w-auto" />
            <span class="text-center font-body text-[0.85em] leading-tight text-myridia-ink dark:text-[#d8dad6]">
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