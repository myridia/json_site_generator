<template>
  <section>
    <form @submit.prevent="onSearch" class="mb-4">
      <input
        v-model="query"
        type="text"
        name="q"
        placeholder="Search all pages..."
        class="w-full max-w-md border-2 border-dotted border-[#a8a8a8] bg-white px-3 py-1 text-[1em]"
      />
      <button type="submit" class="ml-2 border-2 border-dotted border-[#a8a8a8] bg-white px-3 py-1 font-heading italic">
        Search
      </button>
    </form>

    <p v-if="!query" class="text-myridia-muted">Type a query above to search every static page.</p>

    <template v-else>
      <h1 class="text-[1.4em] font-bold italic">Results for "{{ query }}"</h1>

      <p v-if="!results.length" class="mt-3 text-myridia-muted">No matches.</p>

      <ul v-else class="mt-4 list-none">
        <li v-for="r in results" :key="`${r.type}-${r.slug}`" class="mb-3">
          <NuxtLink
            :to="`/docs/${r.type}/${r.slug}`"
            class="font-heading text-[1.2em] italic no-underline text-myridia-green hover:text-myridia-ink"
          >
            {{ r.title }}
          </NuxtLink>
          <span class="ml-2 text-[0.8em] text-[#777]">/docs/{{ r.type }}</span>
        </li>
      </ul>
    </template>
  </section>
</template>

<script setup>
import { searchDocs } from "~/utils/search";
import { useActiveSite } from "~/utils/site";

const route = useRoute();
const router = useRouter();
const activeSite = useActiveSite();

const query = ref(route.query.q ? String(route.query.q) : "");

const results = computed(() => (query.value ? searchDocs(activeSite.value, query.value) : []));

function onSearch() {
  const q = query.value.trim();
  router.push({ path: "/search", query: q ? { q } : {} });
}
</script>