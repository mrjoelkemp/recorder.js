recorder.js
===

A textual recorder for textareas

### Usage

`<script src="dist/recorder.min.js"></script>`

```javascript

// Set up the recorder to track text changes on an element
var recorder = new Recorder(HTMLTextAreaElement);

// Play the recording back into the supplied element
recorder.play(HTMLTextAreaElement);
```

**Additional commands**

```javascript

// Clear the last recording
recorder.clear()

// Get a JSON representation of the deltas
recorder.getRecording();
```

### License

MIT