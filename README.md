# Sentence Annotator component

[![Build Status](https://travis-ci.com/botsquad/sentence-annotator.svg?branch=master)](https://travis-ci.com/botsquad/sentence-annotator)
[![npm (scoped)](https://img.shields.io/npm/v/@botsquad/sentence-annotator)](https://www.npmjs.com/package/@botsquad/sentence-annotator)

This is a React component for creating a text input box which understands Dialogflow's *user
utterance* JSON format, and allows one to use an interface similar to Dialogflow's utterance editor
as a React component.

## Example code

```javascript
import React, { useState } from "react";
import ReactDOM from "react-dom";

import SentenceEditor from '@botsquad/sentence-annotator';

const initial = {
  data: [
    {
      text: 'whatever you do, please please do remember that my ',
    },
    {
      text: 'nickname',
      name: 'type',
      entity: '@name-type',
    },
    {
      text: ' is ',
    },
    {
      text: 'pete',
      name: 'nick-name',
      entity: '@nick-name',
    }
  ],
};

const Example = () => {
  const [sentence, setSentence] = useState<Sentence>(initial)

  return (
    <div>
      <h1>SentenceEditor component</h1>
      <SentenceAnnotator value={sentence} onChange={setSentence} autoFocus />
    </div>
  )
}

ReactDOM.render(<Example />,  document.getElementById("root"))
);
```
