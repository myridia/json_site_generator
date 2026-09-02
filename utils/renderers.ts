export const DOC_RENDERERS: Record<string, string> = {
  thread: "Thread",
  post: "Post",
};

export function rendererName(type: string): string {
  return DOC_RENDERERS[type] || "FallbackDoc";
}