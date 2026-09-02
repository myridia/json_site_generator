<template>
  <div class="site-shell">
    <header class="site-header">
      <div class="site-topbar">
        <NuxtLink to="/" class="site-brand">
          <img v-if="site.config.logo" :src="site.config.logo" alt="Logo" class="site-logo" />
          <span class="site-title">{{ site.config.tagline || site.config.title || "Home" }}</span>
        </NuxtLink>

        <button
          class="site-menu-toggle"
          :class="{ open: menuOpen }"
          :aria-expanded="menuOpen ? 'true' : 'false'"
          aria-label="Menu"
          @click="menuOpen = !menuOpen"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav class="site-menu" :class="{ open: menuOpen }">
          <ul class="site-menu-list">
            <li v-for="item in site.config.nav" :key="item.label">
              <NuxtLink :to="item.url" @click="menuOpen = false">{{ item.label }}</NuxtLink>
            </li>
          </ul>
        </nav>
      </div>

      <form @submit.prevent="onHeaderSearch" class="site-search">
        <input v-model="headerQuery" type="text" name="q" placeholder="Search" class="site-search-input" />
        <button type="submit" class="site-search-btn">Go</button>
      </form>
    </header>

    <div class="site-body">
      <main class="site-main">
        <slot />
      </main>
    </div>

    <footer class="site-footer">
      <div class="site-footer-col">
        <p class="site-footer-title">{{ site.config.title }}</p>
        <p class="site-footer-tag">{{ site.config.tagline }}</p>
      </div>

      <nav class="site-footer-col site-footer-nav">
        <p class="site-footer-heading">Explore</p>
        <ul>
          <li v-for="item in site.config.nav" :key="item.label">
            <NuxtLink :to="item.url">{{ item.label }}</NuxtLink>
          </li>
          <li><NuxtLink to="/search">Search</NuxtLink></li>
          <li><NuxtLink to="/#projects">Projects</NuxtLink></li>
        </ul>
      </nav>

      <nav class="site-footer-col site-footer-nav">
        <p class="site-footer-heading">Pages</p>
        <ul>
          <li><NuxtLink to="/docs/page/about">About us</NuxtLink></li>
          <li><NuxtLink to="/docs/page/manifesto">Manifesto</NuxtLink></li>
          <li><NuxtLink to="/docs/page/contact">Contact us</NuxtLink></li>
        </ul>
      </nav>

      <div class="site-footer-col">
        <p class="site-footer-copy">{{ site.config.footer || "" }}</p>
        <img src="/imgs/anarchy.png" alt="Copyleft" class="site-footer-anarchy" />
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useActiveSite } from "~/utils/site";

const site = useActiveSite();
const router = useRouter();
const headerQuery = ref("");
const menuOpen = ref(false);

function onHeaderSearch() {
  const q = headerQuery.value.trim();
  router.push({ path: "/search", query: q ? { q } : {} });
}
</script>

<style src="./style.css"></style>