<template>
  <section>
    <h1 class="text-[1.4em] font-bold italic">{{ site.config.tagline || "Documents" }}</h1>

    <div v-if="site.docs.length" class="mt-4">
      <section v-for="type in groupTypes" :key="type.name" class="mb-5">
        <h2 class="mb-2 border-b-2 border-dotted border-[#a8a8a8] pb-1 text-[1.6em] font-bold">
          {{ type.name }}
        </h2>
        <ul class="list-none pl-4 font-heading text-[1.3em] italic leading-relaxed">
          <li v-for="doc in type.items" :key="doc.slug">
            <NuxtLink :to="`/s/${site.name}/docs/${doc.type}/${doc.slug}`" class="text-myridia-green no-underline hover:text-myridia-ink">
              {{ doc.title }}
            </NuxtLink>
          </li>
        </ul>
      </section>
    </div>

    <p v-else class="mt-4 rounded border bg-white p-4">
      No documents yet. Add JSON files to <code>content/sites/{{ site.name }}/docs/</code> and rebuild.
    </p>
  </section>
</template>

<script setup>
import { getSite } from "~/utils/sites";

const route = useRoute();
const site = getSite(route.params.site);

const groupTypes = computed(() => {
  const groups = new Map();
  for (const doc of site.docs) {
    if (!groups.has(doc.type)) groups.set(doc.type, { name: doc.type, items: [] });
    groups.get(doc.type).items.push(doc);
  }
  return [...groups.values()];
});
</script>