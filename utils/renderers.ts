import { markRaw, type Component } from "vue";
import Thread from "~/components/Thread.vue";
import FallbackDoc from "~/components/FallbackDoc.vue";

type Registry = Record<string, Component>;

const registries: Record<string, Registry> = {
  myridia: {
    thread: Thread,
  },
};

export function resolveRenderer(site: string, type: string): Component {
  const fallback: Registry = { _fallback: FallbackDoc };
  const reg = registries[site] || fallback;
  return reg[type] || FallbackDoc;
}

export function registerSiteRenderers(site: string, registry: Registry) {
  registries[site] = registry;
}

export { markRaw };