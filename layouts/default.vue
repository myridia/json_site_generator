<template>
  <div class="min-h-screen flex flex-col">
    <header class="mx-auto w-full max-w-[1280px] px-[20px]">
      <div class="my-[18px]">
        <NuxtLink to="/" class="flex items-center gap-2 font-body no-underline">
          <img v-if="site.logo" :src="site.logo" alt="Logo" class="h-6 w-auto" />
          <span class="font-heading text-[1.6em] italic tracking-wide text-[#8a8a8a]">
            {{ site.title || "Home" }}
          </span>
        </NuxtLink>
        <p
          v-if="site.slogan"
          class="mt-1 block border-y-2 border-dotted border-[#8a8a8a] px-5 py-[3px] text-center font-heading text-[1.2em] italic tracking-wide text-[#4e4e4e]"
        >
          {{ site.slogan }}
        </p>
        <form @submit.prevent="onHeaderSearch" class="mt-3 flex max-w-xs items-center gap-1">
          <input
            v-model="headerQuery"
            type="text"
            name="q"
            placeholder="Search"
            class="w-full border-2 border-dotted border-[#a8a8a8] bg-white px-2 py-0.5 text-[0.9em]"
          />
          <button type="submit" class="border-2 border-dotted border-[#a8a8a8] bg-white px-2 py-0.5 text-[0.9em]">
            Go
          </button>
        </form>
      </div>
    </header>

    <div class="mx-auto w-full max-w-[1280px] flex-1 px-[20px]">
      <div class="flex items-start gap-8">
        <main class="flex-1">
          <slot />
        </main>

        <aside class="w-[250px] shrink-0">
          <ul class="list-none">
            <li v-for="item in site.nav" :key="item.label" class="my-[5px]">
              <NuxtLink
                :to="item.url"
                class="font-heading text-[1.4em] no-underline text-myridia-green hover:text-myridia-ink"
              >
                {{ item.label }}
              </NuxtLink>
            </li>
          </ul>
        </aside>
      </div>
    </div>

    <footer class="mx-auto my-[13px] flex w-full max-w-[1280px] items-center justify-between border-y-2 border-dotted border-[#a8a8a8] px-[20px] py-[3px] pb-8">
      <span class="font-body text-[1em] text-myridia-muted">{{ site.footer || "" }}</span>
      <img src="/imgs/anarchy.png" alt="Copyleft" class="h-6 w-auto" />
    </footer>
  </div>
</template>

<script setup>
import { site } from "~/utils/site";

const router = useRouter();
const headerQuery = ref("");

function onHeaderSearch() {
  const q = headerQuery.value.trim();
  router.push({ path: "/search", query: q ? { q } : {} });
}
</script>