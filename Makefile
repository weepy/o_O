TESTS = test/*.js
UGLIFY = $(shell find node_modules -name "uglifyjs" -type f)

all: o_O.min.js

test:
  @./node_modules/.bin/mocha \
    $(TESTS)

o_O.js: 
    @node bin/build.js $^

o_O.min.js: o_O.js
  @$(UGLIFY) $< > $@ \
    && du o_O.min.js \
    && du o_O.js

clean:
  rm -f o_O.js
  rm -f o_O.min.js

.PHONY: test clean