# recorder.js [![npm](http://img.shields.io/npm/v/recorder.js.svg)](https://npmjs.org/package/recorder.js) [![npm](http://img.shields.io/npm/dm/recorder.js.svg)](https://npmjs.org/package/recorder.js)

A textual recorder for textareas and text editors

### Usage

`<script src="dist/recorder.min.js"></script>`

*Note: All recorder types are accessible via `window.Recorder`.*

**HTML Textarea**
```javascript

// Set up the recorder to track text changes
var recorder = new Recorder.TextAreaRecorder(HTMLTextAreaElement);

// Play the recording back into the supplied element (using 2x speed)
recorder.play(HTMLTextAreaElement, 2);
```

**[CodeMirror](http://codemirror.net/) Editor**

```javascript

// editorInstance = CodeMirror(yourElement);

var recorder = new Recorder.CodeMirrorRecorder(editorInstance);

// Playback via another Codemirror instance or a textarea if you prefer (at 1x speed, by default)
recorder.play(anotherEditorInstance);
```

**[Ace](http://ace.c9.io/) Editor**

```javascript

// editorInstance = ace.edit(yourElement);

var recorder = new Recorder.AceRecorder(editorInstance);

// Playback via another Ace instance or a textarea if you prefer
recorder.play(anotherEditorInstance);
```

**Additional commands**

```javascript

// Clear the last recording
recorder.clear()

// Get a JSON representation of the deltas
recorder.getRecording();
```

### Contributing

This lib uses browserify to generate the browser bundle.

To get the environment set up:

1. Fork this repo
1. Run `npm install` within the root
1. Run `make` to generate a distribution bundle and update the demo app `demo/`
1. Run `make watchify` to have watchify rebundle the app while you write code

### License

MIT
