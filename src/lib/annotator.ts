import cloneDeep from 'lodash/cloneDeep';
import defaults from 'lodash/defaults';

export interface SentenceToken {
  text: string;
  userDefined?: boolean;
  alias?: string;
}

export interface Sentence {
  id: string;
  data: SentenceToken[];
}

function strSplit(s: string, i: number) {
  const left = s.substr(0, i)
  const right = s.substr(i)
  return { left, right }
}

export class Sentence {
  static toString(s: Sentence): string {
    return s.data.map(({ text }) => text).join('');
  }
  static extendRight(s: Sentence, token: number, delta: number): Sentence {
    s = <Sentence>cloneDeep(s);

    if (delta < 0) {
      if (token == s.data.length -1) {
        const { left, right} = strSplit(s.data[token].text, s.data[token].text.length + delta)
        s.data[token].text = left
        s.data.push({ userDefined: false, text: right })
        return s
      }
      return this.extendLeft(s, token + 1, -delta)
    }

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
    s = <Sentence>cloneDeep(s);

    if (delta < 0) {
      if (token == 0) {
        const { left, right} = strSplit(s.data[token].text, - delta)
        s.data[token].text = right
        s.data.splice(0, 0, { userDefined: false, text: left })
        return s
      }
      return this.extendRight(s, token - 1, -delta)
    }

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

  static splitToken(s: Sentence, token: number, index: number): Sentence {
    s = <Sentence>cloneDeep(s);
    if (token < 0 || token > s.data.length - 1 || index >= s.data[token].text.length) {
      return s
    }

    const { left, right } = strSplit(s.data[token].text, index)
    s.data[token].text = left
    const newToken: SentenceToken = { text: right, userDefined: false }
    s.data.splice(token + 1, 0, newToken)
    return s
  }

  static updateToken(s: Sentence, token: number, data: SentenceToken): Sentence {
    s = <Sentence>cloneDeep(s);
    s.data[token] = defaults(data, s.data[token])
    return s
  }

  static insertToken(s: Sentence, token: number, data: SentenceToken): Sentence {
    s = <Sentence>cloneDeep(s);
    s.data.splice(token, 0, data);
    return s
  }

  static deleteToken(s: Sentence, token: number): Sentence {
    s = <Sentence>cloneDeep(s);
    s.data.splice(token, 1);
    return s
  }
}
