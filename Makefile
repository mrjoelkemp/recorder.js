build: browserify uglify demoify

clean:
	@echo cleaning
	@rm -r ./dist/*.js

browserify:
	@echo browserifying
	@node node_modules/browserify/bin/cmd.js -s Recorder ./src/index.js -o ./dist/recorder.js --list

watchify:
	@echo watchifying
	@node node_modules/watchify/bin/cmd.js -s Recorder ./src/index.js -o ./dist/recorder.js -v

uglify:
	@echo uglifying
	@node node_modules/uglify-js/bin/uglifyjs ./dist/recorder.js -o ./dist/recorder.min.js

demoify:
	@echo demoifying
	@node node_modules/browserify/bin/cmd.js ./demo/js/demo.js > ./demo/js/demo.bundle.js --list
