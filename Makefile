build: browserify uglify

browserify:
	@echo browserifying
	@browserify -s Recorder ./src/recorder.js > ./dist/recorder.js

uglify:
	@echo uglifying
	@uglifyjs ./dist/recorder.js -o ./dist/recorder.min.js
