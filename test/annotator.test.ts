import { Sentence } from '../src/lib/annotator'

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
const userDefineds = (s: Sentence) => s.data.map(({ userDefined }) => userDefined);

let s: Sentence

describe('Sentence', () => {
  it('sentence toString', () => {
    expect(Sentence.toString(sentence)).toEqual('remember that my nickname is Boss')
  });

  it('token extendRight', () => {

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

    // move nevative
    //s = Sentence.extendRight(sentence, 0, -2);
    //expect(texts(s)).toEqual(['remember that m', 'y nickname', ' is ', 'Boss']);

    // move negative on last token creates new token
    s = Sentence.extendRight(sentence, 3, -2);
    expect(texts(s)).toEqual(['remember that my ', 'nickname', ' is ', 'Bo', 'ss']);

    // empty tokens are removed
    s = Sentence.extendRight(sentence, 0, 7);
    expect(texts(s)).toEqual(['remember that my nicknam', 'e', ' is ', 'Boss']);

    // empty tokens are removed
    s = Sentence.extendRight(sentence, 0, 8);
    expect(texts(s)).toEqual(['remember that my nickname', ' is ', 'Boss']);

  });

  it('token extendLeft', () => {
    // move
    s = Sentence.extendLeft(sentence, 1, 2);
    expect(texts(s)).toEqual(['remember that m', 'y nickname', ' is ', 'Boss']);

    // eat tokens left
    s = Sentence.extendLeft(sentence, 1, 1000);
    expect(texts(s)).toEqual(['remember that my nickname', ' is ', 'Boss']);

    // move nevative
    s = Sentence.extendLeft(sentence, 1, -2);
    expect(texts(s)).toEqual(['remember that my ni', 'ckname', ' is ', 'Boss']);

    // move negative on last token creates new token
    s = Sentence.extendLeft(sentence, 0, -2);
    expect(texts(s)).toEqual(['re', 'member that my ', 'nickname', ' is ', 'Boss']);
  });

  it('token split', () => {
    s = Sentence.splitToken(sentence, 0, 2);
    expect(texts(s)).toEqual(['re', 'member that my ', 'nickname', ' is ', 'Boss']);

    s = Sentence.splitToken(sentence, 1, 2);
    expect(texts(s)).toEqual(['remember that my ', 'ni', 'ckname', ' is ', 'Boss']);
  });

  it('token update', () => {
    s = Sentence.updateToken(sentence, 3, { text: 'Johnny' });
    expect(texts(s)).toEqual(['remember that my ', 'nickname', ' is ', 'Johnny']);
  });

  it('token insert', () => {
    s = Sentence.insertToken(sentence, 3, { text: 'Johnny' });
    expect(texts(s)).toEqual(['remember that my ', 'nickname', ' is ', 'Johnny', 'Boss']);
  });

  it('token delete', () => {
    s = Sentence.deleteToken(sentence, 3);
    expect(texts(s)).toEqual(['remember that my ', 'nickname', ' is ']);
  });

  it('token neutralize', () => {
    s = Sentence.neutralizeToken(sentence, 3);
    expect(texts(s)).toEqual(['remember that my ', 'nickname', ' is Boss']);
  });

  it('token select split', () => {
    let s: { sentence: Sentence, newToken: number }
    s = Sentence.splitSelectToken(sentence, 0, 9, 13);
    expect(texts(s.sentence)).toEqual(['remember ', 'that', ' my ', 'nickname', ' is ', 'Boss']);
    expect(s.newToken).toEqual(1)

    s = Sentence.splitSelectToken(sentence, 0, 0, 2);
    expect(texts(s.sentence)).toEqual(['re', 'member that my ', 'nickname', ' is ', 'Boss']);
    expect(s.newToken).toEqual(0)

    s = Sentence.splitSelectToken(sentence, 1, 4, 8);
    expect(texts(s.sentence)).toEqual(['remember that my ', 'nick', 'name', ' is ', 'Boss']);
    expect(s.newToken).toEqual(2)
  });

  it('makes new text node when moving two labeled nodes away from each other', () => {

    const sentence = {
      id: 'f9b44dee-1562-448c-8b37-1cd3b2399160',
      data: [
        {
          alias: 'first',
          text: 'Aap',
          userDefined: true
        },
        {
          alias: 'first',
          text: ' Noot',
          userDefined: true
        },
      ],
      isTemplate: false,
      count: 1,
      updated: 0
    };

    s = Sentence.extendLeft(sentence, 1, -1);
    expect(texts(s)).toEqual(['Aap', ' ', 'Noot']);
    expect(userDefineds(s)).toEqual([true, false, true]);
  });

});
