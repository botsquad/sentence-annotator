import * as React from "react";
import * as ReactDOM from "react-dom";

import SentenceEditor from './components/SentenceEditor';

// import { Hello } from "./components/Hello";

console.log(document.getElementById("root"))

const sentence = {
  id: 'f9b44dee-1562-448c-8b37-1cd3b2399160',
  data: [
    {
      text: 'remember that my ',
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
      text: 'Boss',
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
    <SentenceEditor sentence={sentence} />
  </div>,
  document.getElementById("root")
);
