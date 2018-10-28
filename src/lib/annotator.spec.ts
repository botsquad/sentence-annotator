// tslint:disable:no-expression-statement
import test from 'ava';

import { Sentence } from './annotator';

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

test('sentence toString', t => {
  t.is(Sentence.toString(sentence), 'remember that my nickname is Boss');
});

const texts = (s: Sentence) => s.data.map(({ text }) => text);

test('token extendRight', t => {
  let s
  // move
  s = Sentence.extendRight(sentence, 0, 2);
  t.deepEqual(texts(s), ['remember that my ni', 'ckname', ' is ', 'Boss']);

  // eat tokens
  s = Sentence.extendRight(sentence, 0, 10);
  t.deepEqual(texts(s), ['remember that my nickname i', 's ', 'Boss']);

  // eat tokens
  s = Sentence.extendRight(sentence, 0, 12);
  t.deepEqual(texts(s), ['remember that my nickname is ', 'Boss']);

  // eat tokens
  s = Sentence.extendRight(sentence, 0, 100000);
  t.deepEqual(texts(s), ['remember that my nickname is Boss']);

});

test('token extendLeft', t => {
  let s
  // move
  s = Sentence.extendLeft(sentence, 1, 2);
  t.deepEqual(texts(s), ['remember that m', 'y nickname', ' is ', 'Boss']);

  // eat tokens left
  s = Sentence.extendLeft(sentence, 1, 1000);
  t.deepEqual(texts(s), ['remember that my nickname', ' is ', 'Boss']);
});
