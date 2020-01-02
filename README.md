# Sentence Annotator component

This is a component for creating a text input box which understands Dialogflow's *user utterance*
JSON format, and allows one to use an interface similar to Dialogflow's utterance editor as a React
component.

## Example code

```javascript
import * as React from "react";
import * as ReactDOM from "react-dom";

import SentenceEditor from '@botsquad/sentence-editor;

const sentence = {
  id: 'f9b44dee-1562-448c-8b37-1cd3b2399160',
  data: [
    {
      text: 'whatever you do, please please do remember that my ',
      userDefined: false
    },
    {
      text: 'nickname',
      alias: 'type',
      meta: '@name-type',
      userDefined: true
    },
    {
      text: ' is ',
      userDefined: false
    },
    {
      text: 'pete',
      alias: 'nick-name',
      meta: '@nick-name',
      userDefined: true
    }
  ],
  isTemplate: false,
  count: 1,
  updated: 0
};


ReactDOM.render(
  <div>
    <h1>SentenceEditor component</h1>
    <SentenceEditor sentence={sentence} />
  </div>,
  document.getElementById("root")
);
```
