import type { Component } from "vue";
import Thread from "~/components/Thread.vue";
import FallbackDoc from "~/components/FallbackDoc.vue";

type Registry = Record<string, Component>;

const registries: Record<string, Registry> = {
  myridia: {
    thread: Thread,
  },
};

export function resolveRenderer(site: string, type: string): Component {
  const reg = registries[site] || {};
  return reg[type] || FallbackDoc;
}

export function registerSiteRenderers(site: string, registry: Registry) {
  registries[site] = registry;
}