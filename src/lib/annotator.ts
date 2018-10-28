import cloneDeep from 'lodash/cloneDeep';

interface Token {
  text: string;
  userDefined: boolean;
}

export interface Sentence {
  id: string;
  data: Token[];
}

export class Sentence {
  static toString(s: Sentence): string {
    return s.data.map(({ text }) => text).join('');
  }
  static extendRight(s: Sentence, token: number, delta: number): Sentence {
    s = cloneDeep(s);

    // "eat" tokens while delta > next token text length
    let curToken = token + 1
    let curDelta = delta
    while (true) {
      if (curToken == s.data.length) {
      // cannot extend further
        break
      }
      if (curDelta < s.data[curToken].text.length) {
        // last; add substr of token to current
        s.data[token].text += s.data[curToken].text.substr(0, curDelta)
        s.data[curToken].text = s.data[curToken].text.substr(curDelta)
        break
      } else {
        // add token entirely
        s.data[token].text += s.data[curToken].text
        curDelta -= s.data[curToken].text.length
        // remove cur token
        s.data.splice(curToken, 1)
      }
    }
    return s;
  }
  static extendLeft(s: Sentence, token: number, delta: number): Sentence {
    s = cloneDeep(s);

    // "eat" tokens while delta > next token text length
    let curToken = token - 1
    let curDelta = delta
    while (true) {
      if (curToken < 0) {
      // cannot extend further
        break
      }
      if (curDelta < s.data[curToken].text.length) {
        // last; add substr of token to current
        let t = s.data[curToken].text
        s.data[token].text = t.substr(t.length - curDelta, curDelta) + s.data[token].text
        s.data[curToken].text = s.data[curToken].text.substr(0, t.length - curDelta)
        break
      } else {
        // add token entirely
        s.data[token].text = s.data[curToken].text + s.data[token].text
        curDelta -= s.data[curToken].text.length
        // remove cur token
        s.data.splice(curToken, 1)
        curToken -= 1
        token -= 1
      }
    }
    return s
  }
}
