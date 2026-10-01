<template>
  <div class="site-shell" id="top">
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
      <div class="site-footer-inner">
      <div class="site-footer-col">
        <p class="site-footer-title">{{ site.config.title }}</p>
        <p class="site-footer-tag">{{ site.config.tagline }}</p>
        <p class="site-footer-slogan">{{ site.config.slogan }}</p>
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
        <a href="mailto:hello@myridia.com">hello@myridia.com</a>
        <img src="/imgs/anarchy.png" alt="Copyleft" class="site-footer-anarchy" />
      </div>

      <div class="site-footer-meta">
        <span>{{ site.config.footer || "" }} · {{ site.config.title }}</span>
        <div class="site-footer-meta-actions">
          <button type="button" class="site-theme-toggle" :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'" @click="toggleTheme">
            <svg v-if="isDark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </button>
          <a class="site-footer-toplink" href="#top">Back to top ↑</a>
        </div>
      </div>
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
const isDark = ref(false);

onMounted(() => {
  const saved = localStorage.getItem("myridia-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  isDark.value = saved ? saved === "dark" : prefersDark;
  document.documentElement.classList.toggle("dark", isDark.value);
});

function toggleTheme() {
  isDark.value = !isDark.value;
  document.documentElement.classList.toggle("dark", isDark.value);
  localStorage.setItem("myridia-theme", isDark.value ? "dark" : "light");
}

function onHeaderSearch() {
  const q = headerQuery.value.trim();
  router.push({ path: "/search", query: q ? { q } : {} });
}
</script>

<style src="./style.css"></style>