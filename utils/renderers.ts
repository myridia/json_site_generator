import type { Component } from "vue";
import Thread from "~/components/Thread.vue";
import Post from "~/components/Post.vue";
import FallbackDoc from "~/components/FallbackDoc.vue";

const renderers: Record<string, Component> = {
  thread: Thread,
  post: Post,
};

export function resolveRenderer(type: string): Component {
  return renderers[type] || FallbackDoc;
}