#!/bin/sh
# json_site_generator — Task Runner
# Usage: ./ask.sh [site]   (empty site = all-sites listing)

cd "$(dirname "$0")" || exit 1

SITE="${1:-}"

if [ -z "$SITE" ]; then
  printf "\n  Site name (Enter for all-sites listing): "
  read -r SITE
fi

printf "\n  json_site_generator — Task Runner\n"
printf "  Active site: %s\n\n" "${SITE:-<none — all-sites listing>}"

while :; do
  printf "  ┌─────┬──────────────────────────────────────────────────┐\n"
  printf "  │  ID │ Description                                      │\n"
  printf "  ├─────┼──────────────────────────────────────────────────┤\n"
  printf "  │  1  │ Install — npm install                            │\n"
  printf "  │  2  │ Dev — live dev server (site / listing)           │\n"
  printf "  │  3  │ Generate — static build for the active site      │\n"
  printf "  │  4  │ Build — nuxt build (server bundle)               │\n"
  printf "  │  5  │ Generate + Preview — build then serve             │\n"
  printf "  │  6  │ Preview — serve .output/public (port 5000)       │\n"
  printf "  │  7  │ Clean — remove .nuxt/.output/vite cache          │\n"
  printf "  │  8  │ Fix ownership — sudo chown veto:veto .           │\n"
  printf "  │  0  │ Exit                                              │\n"
  printf "  └─────┴──────────────────────────────────────────────────┘\n\n"

  printf "  Enter Task ID: "
  read -r task || exit 0

  case "$task" in
    1)
      printf "...npm install\n\n"
      npm install
      ;;
    2)
      printf "...npm run dev %s\n\n" "$SITE"
      printf "  Open these in your browser:\n"
      printf "    http://localhost:3000/                          # landing (or site listing)\n"
      if [ -n "$SITE" ]; then
        printf "    http://localhost:3000/docs/<type>/<slug>        # a doc\n"
      fi
      printf "    http://localhost:3000/search                      # search\n"
      printf "  Tip: edit any .vue file or doc JSON and it hot-reloads live.\n"
      printf "  Vue Devtools widget sits in the bottom corner (http://localhost:3000/_nuxt).\n\n"
      npm run dev "$SITE"
      ;;
    3)
      printf "...npm run generate %s\n\n" "$SITE"
      npm run generate "$SITE"
      ;;
    4)
      printf "...npm run build\n\n"
      npm run build
      ;;
    5)
      printf "...npm run generate %s\n\n" "$SITE"
      npm run generate "$SITE"
      printf "\n...serving .output/public on http://localhost:5000\n\n"
      npx serve .output/public -l 5000
      ;;
    6)
      printf "...npx serve .output/public -l 5000\n\n"
      npx serve .output/public -l 5000
      ;;
    7)
      printf "...removing .nuxt .output node_modules/.vite\n\n"
      rm -rf .nuxt .output node_modules/.vite
      printf "  Cleaned. Run task 2 (dev) or 3 (generate) again — this fixes stale-build\n"
      printf "  errors like 'Failed to resolve import #app-manifest'.\n"
      ;;
    8)
      printf "...sudo chown veto:veto . -Rf\n\n"
      sudo chown veto:veto . -Rf
      ;;
    0)
      printf "Goodbye!\n"
      exit 0
      ;;
    *)
      printf "  Unknown task: %s\n" "$task"
      ;;
  esac

  printf "\n  Press Enter to return to the menu..."
  read -r _ || exit 0
  printf "\n"
done