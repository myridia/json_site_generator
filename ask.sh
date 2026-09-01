#!/bin/sh

printf "\n  json_site_generator — Task Runner\n\n"
printf "  ┌─────┬──────────────────────────────────────────────┐\n"
printf "  │  ID │ Description                                  │\n"
printf "  ├─────┼──────────────────────────────────────────────┤\n"
printf "  │  1  │ Run                                          │\n"
printf "  │  2  │ Install — npm install                        │\n"
printf "  │  3  │ Dev — npm run dev                            │\n"
printf "  │  4  │ Build — npm run build                        │\n"
printf "  │  5  │ Generate Static — npm run generate           │\n"
printf "  │  6  │ Preview — npx serve .output/public           │\n"
printf "  │  7  │ Generate + Preview (chown first)             │\n"
printf "  │  0  │ Exit                                         │\n"
printf "  └─────┴──────────────────────────────────────────────┘\n\n"

until [ "$task" = "0" ]; do
  printf "  Enter Task ID: "
  read task

  if [ "$task" = "1" ]; then
    printf "...Chowning project to veto:veto\n"
    sudo chown veto:veto . -Rf
    npm run generate
    npx serve .output/public

  elif [ "$task" = "2" ]; then
    printf "...npm install\n"
    npm install

  elif [ "$task" = "3" ]; then
    printf "...Starting live dev mode (HMR + Vue Devtools)\n"

    printf "  Open these in your browser:\n"
    printf "    http://localhost:3000/                                    # all sites\n"
    printf "    http://localhost:3000/s/myridia                          # landing (hero + recent)\n"
    printf "    http://localhost:3000/s/myridia/docs/post/<slug>         # a post\n"
    printf "    http://localhost:3000/s/myridia/docs/thread/<slug>       # a thread\n"
    printf "    http://localhost:3000/search                             # search\n"
    printf "  Tip: edit any .vue file or doc JSON and it hot-reloads live.\n"
    printf "  Vue Devtools widget sits in the bottom corner (http://localhost:3000/_nuxt).\n\n"
    sudo chown veto:veto . -Rf
    npm run dev myridia

  elif [ "$task" = "4" ]; then
    printf "...npm run build\n"
    npm run build

  elif [ "$task" = "5" ]; then
    printf "...npm run generate\n"
    npm run generate

  elif [ "$task" = "6" ]; then
    printf "...npx serve .output/public\n"
    npx serve .output/public

  elif [ "$task" = "7" ]; then
    printf "...Chown, generate and preview\n"
    sudo chown veto:veto . -Rf
    npm run generate
    npx serve .output/public

  else
    printf "Goodbye!\n"
  fi

  sleep 2
  printf "\n"
  ./ask.sh

done
