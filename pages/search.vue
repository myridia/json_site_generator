<template>
  <section>
    <form @submit.prevent="onSearch" class="mb-4">
      <input
        v-model="query"
        type="text"
        name="q"
        placeholder="Search all pages..."
        class="w-full max-w-md rounded-lg border border-[#d9dad6] bg-white px-3 py-2 text-[1em] text-[#2b2b2b] shadow-sm focus:border-myridia-green focus:outline-none focus:ring-2 focus:ring-myridia-green/25 dark:border-[#3a3f45] dark:bg-[#1f2226] dark:text-[#d8dad6]"
      />
      <button type="submit" class="ml-2 rounded-lg border-none bg-myridia-green px-4 py-2 font-semibold text-white">
        Search
      </button>
    </form>

    <p v-if="!query" class="text-myridia-muted">Type a query above to search every static page.</p>

    <template v-else>
      <h1 class="text-[1.4em] font-bold italic">Results for "{{ query }}"</h1>

      <p v-if="loading" class="mt-3 text-myridia-muted">Searching...</p>
      <p v-else-if="!results.length" class="mt-3 text-myridia-muted">No matches.</p>

      <ul v-else class="mt-4 list-none">
        <li v-for="r in results" :key="r.url" class="mb-3">
          <NuxtLink
            :to="r.url"
            class="font-body text-[1.15em] no-underline text-myridia-green hover:text-myridia-ink dark:hover:text-[#f2f3f0]"
          >
            {{ r.title }}
          </NuxtLink>
          <span class="ml-2 text-[0.8em] text-[#777] dark:text-[#9aa0a6]">{{ r.type }}</span>
          <p v-if="r.excerpt" class="mt-1 whitespace-pre-line text-[0.9em] text-[#555] dark:text-[#b0b6bd]" v-html="r.excerpt"></p>
        </li>
      </ul>
    </template>
  </section>
</template>

<script setup>
const route = useRoute();
const router = useRouter();

const pagefindPath = "/pagefind/pagefind.js";

const query = ref(route.query.q ? String(route.query.q) : "");
const results = ref([]);
const loading = ref(false);

let pagefindMod = null;
async function getPagefind() {
  if (!pagefindMod) {
    const mod = await import(pagefindPath);
    pagefindMod = mod.createInstance
      ? mod.createInstance({ noWorker: true, basePath: "/pagefind/" })
      : mod;
    if (pagefindMod.init) await pagefindMod.init();
  }
  return pagefindMod;
}

async function runSearch(q) {
  loading.value = true;
  try {
    const pagefind = await getPagefind();
    if (!pagefind) return;
    const res = await pagefind.search(q);
    const items = [];
    for (const hit of res.results || []) {
      const data = await hit.data();
      items.push({
        url: (data.meta && data.meta.url) || data.url,
        title: (data.meta && data.meta.title) || "Untitled",
        type: (data.meta && data.meta.type) || "",
        excerpt: data.excerpt || "",
      });
    }
    results.value = items;
  } catch (err) {
    console.error("Pagefind search failed:", err);
  } finally {
    loading.value = false;
  }
}

watch(
  () => route.query.q,
  (q) => {
    const val = q ? String(q) : "";
    query.value = val;
    if (val) runSearch(val);
  }
);

onMounted(() => {
  if (query.value) runSearch(query.value);
});

function onSearch() {
  const q = query.value.trim();
  router.push({ path: "/search", query: q ? { q } : {} });
}
</script>
