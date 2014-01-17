build: browserify uglify demoify

browserify:
	@echo browserifying
	@browserify -s TextAreaRecorder ./src/textarearecorder.js -o ./dist/textarearecorder.js
	@browserify -s CodeMirrorRecorder ./src/codemirrorrecorder.js -o ./dist/codemirrorrecorder.js

uglify:
	@echo uglifying
	@uglifyjs ./dist/textarearecorder.js -o ./dist/textarearecorder.min.js
	@uglifyjs ./dist/codemirrorrecorder.js -o ./dist/codemirrorrecorder.min.js

demoify:
	@echo demoifying
	@browserify ./demo/js/demo.js > ./demo/js/demo.bundle.js