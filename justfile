ci: setup && test lint
  yarn run tsc

setup:
  yarn

bundle: setup
  rm public -rf
  yarn run parcel \
    build src/index.html \
    --no-source-maps \
    --dist-dir public \
    --public-url https://soenkehahn.github.io/curves/

serve: setup
  yarn run parcel src/index.html

watch-tsc:
  yarn run tsc --watch

test *args:
  #!/usr/bin/env bash

  str src/*.test.tsx src/*.test.ts {{ args }}

lint:
  yarn eslint src --max-warnings=0
  yarn prettier src --check

lint-fix:
  yarn eslint src --fix --max-warnings=0
  yarn prettier src --write
