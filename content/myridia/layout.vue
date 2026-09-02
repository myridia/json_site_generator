<template>
  <div class="site-shell">
    <header class="site-header">
      <NuxtLink to="/" class="site-brand">
        <img v-if="site.config.logo" :src="site.config.logo" alt="Logo" class="site-logo" />
        <span class="site-title">{{ site.config.title || "Home" }}</span>
      </NuxtLink>
      <p v-if="site.config.slogan" class="site-slogan">{{ site.config.slogan }}</p>
      <form @submit.prevent="onHeaderSearch" class="site-search">
        <input v-model="headerQuery" type="text" name="q" placeholder="Search" class="site-search-input" />
        <button type="submit" class="site-search-btn">Go</button>
      </form>
    </header>

    <div class="site-body">
      <main class="site-main">
        <slot />
      </main>

      <aside class="site-nav">
        <ul>
          <li v-for="item in site.config.nav" :key="item.label">
            <NuxtLink :to="item.url">{{ item.label }}</NuxtLink>
          </li>
        </ul>
      </aside>
    </div>

    <footer class="site-footer">
      <span>{{ site.config.footer || "" }}</span>
      <img src="/imgs/anarchy.png" alt="Copyleft" class="site-footer-logo" />
    </footer>
  </div>
</template>

<script setup>
import { useActiveSite } from "~/utils/site";

const site = useActiveSite();
const router = useRouter();
const headerQuery = ref("");

function onHeaderSearch() {
  const q = headerQuery.value.trim();
  router.push({ path: "/search", query: q ? { q } : {} });
}
</script>

<style src="./style.css"></style>