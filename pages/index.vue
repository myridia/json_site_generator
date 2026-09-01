<template>
  <section>
    <h1 class="text-[1.4em] font-bold italic">Sites</h1>

    <div v-if="sites.length" class="mt-4">
      <section v-for="site in sites" :key="site.name" class="mb-5">
        <h2 class="mb-2 border-b-2 border-dotted border-[#a8a8a8] pb-1 font-heading text-[1.6em] italic">
          <NuxtLink :to="`/s/${site.name}`" class="text-myridia-green no-underline hover:text-myridia-ink">
            {{ site.config.title }}
          </NuxtLink>
        </h2>
        <p v-if="site.config.tagline" class="mb-2 text-myridia-muted">{{ site.config.tagline }}</p>
        <ul class="list-none pl-4 font-heading text-[1.3em] italic leading-relaxed">
          <li v-for="doc in site.docs" :key="doc.slug">
            <NuxtLink :to="`/s/${site.name}/docs/${doc.type}/${doc.slug}`" class="text-myridia-green no-underline hover:text-myridia-ink">
              {{ doc.title }}
            </NuxtLink>
          </li>
        </ul>
      </section>
    </div>

    <p v-else class="mt-4 rounded border bg-white p-4">
      No sites yet. Add a folder to <code>content/sites/</code> and rebuild.
    </p>
  </section>
</template>

<script setup>
import { sites } from "~/utils/sites";
</script>