ci: setup
  yarn run tsc
  yarn run jest --forceExit

setup:
  yarn

bundle: setup
  rm public -rf
  yarn run parcel \
    build src/index.html \
    --no-source-maps \
    --dist-dir public \
    --public-url https://soenkehahn.github.io/tree-game/

serve:
  yarn run parcel src/index.html

watch-tsc:
  yarn run tsc --watch

test *args:
  #!/usr/bin/env bash

  str src/*.test.tsx src/*.test.ts {{ args }}

render-graph:
  dot -Tpdf graph.dot > graph.pdf

lint:
  yarn eslint src --max-warnings=0
  cd tests && yarn prettier src --check

lint-fix:
  yarn eslint src --fix --max-warnings=0
  yarn prettier src --write
