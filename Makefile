build: browserify uglify demoify

clean:
	@echo cleaning
	@rm -r ./dist/*.js

browserify:
	@echo browserifying
	@browserify -s Recorder ./src/index.js -o ./dist/recorder.js

uglify:
	@echo uglifying
	@uglifyjs ./dist/recorder.js -o ./dist/recorder.min.js

demoify:
	@echo demoifying
	@browserify ./demo/js/demo.js > ./demo/js/demo.bundle.js