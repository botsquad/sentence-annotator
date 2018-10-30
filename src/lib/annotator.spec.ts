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
const texts = (s: Sentence) => s.data.map(({ text }) => text);

describe('Sentence', () => {
  it('sentence toString', () => {
    expect(Sentence.toString(sentence)).toEqual('remember that my nickname is Boss')
  });

  it('token extendRight', () => {
    let s
    // move
    s = Sentence.extendRight(sentence, 0, 2);
    expect(texts(s)).toEqual(['remember that my ni', 'ckname', ' is ', 'Boss']);

    // eat tokens
    s = Sentence.extendRight(sentence, 0, 10);
    expect(texts(s)).toEqual(['remember that my nickname i', 's ', 'Boss']);

    // eat tokens
    s = Sentence.extendRight(sentence, 0, 12);
    expect(texts(s)).toEqual(['remember that my nickname is ', 'Boss']);

    // eat tokens
    s = Sentence.extendRight(sentence, 0, 100000);
    expect(texts(s)).toEqual(['remember that my nickname is Boss']);

  });

  it('token extendLeft', () => {
    let s
    // move
    s = Sentence.extendLeft(sentence, 1, 2);
    expect(texts(s)).toEqual(['remember that m', 'y nickname', ' is ', 'Boss']);

    // eat tokens left
    s = Sentence.extendLeft(sentence, 1, 1000);
    expect(texts(s)).toEqual(['remember that my nickname', ' is ', 'Boss']);
  });

  it('token split', () => {
    let s
    s = Sentence.splitToken(sentence, 0, 2);
    expect(texts(s)).toEqual(['re', 'member that my ', 'nickname', ' is ', 'Boss']);

    s = Sentence.splitToken(sentence, 1, 2);
    expect(texts(s)).toEqual(['remember that my ', 'ni', 'ckname', ' is ', 'Boss']);
  });

  it('token update', () => {
    let s
    s = Sentence.updateToken(sentence, 3, { text: 'Johnny' });
    expect(texts(s)).toEqual(['remember that my ', 'nickname', ' is ', 'Johnny']);
  });

  it('token insert', () => {
    let s
    s = Sentence.insertToken(sentence, 3, { text: 'Johnny' });
    expect(texts(s)).toEqual(['remember that my ', 'nickname', ' is ', 'Johnny', 'Boss']);
  });

  it('token delete', () => {
    let s
    s = Sentence.deleteToken(sentence, 3);
    expect(texts(s)).toEqual(['remember that my ', 'nickname', ' is ']);
  });

});
