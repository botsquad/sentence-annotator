import * as React from "react"
import { Sentence, SentenceToken } from '../lib/annotator'

import LabeledToken from './LabeledToken'
import UnlabeledToken from './UnlabeledToken'

interface Props {
  sentence: Sentence
};

interface State {
  selectedToken?: number;
  sentence: Sentence
  contentDirty: boolean
}

export default class SentenceEditor extends React.Component<Props, State> {
  state: State = {
    selectedToken: null,
    sentence: this.props.sentence,
    contentDirty: false,
  }

  onTokenClick = (t: SentenceToken, index: number) => {
    if (this.state.contentDirty) {
      this.syncEditableContent()
    }

    if (t.alias) {
      this.setState({ selectedToken: index })
    } else {
      this.setState({ selectedToken: null  })
    }
  }

  onTokenExtendRight = (_t: SentenceToken, index: number, delta: number) => {
    const sentence = Sentence.extendRight(this.state.sentence, index, delta)
    this.setState({ sentence })
  }

  onTokenExtendLeft = (_t: SentenceToken, index: number, delta: number) => {
    const sentence = Sentence.extendLeft(this.state.sentence, index, delta)
    if (this.state.selectedToken >= sentence.data.length) {
      this.setState({ sentence, selectedToken: sentence.data.length - 1 })
    } else {
      this.setState({ sentence })
    }
  }

  onUnlabeledTextSelect = (_t: SentenceToken, index: number, start: number, end: number) => {
    const { sentence, newToken } = Sentence.splitSelectToken(this.state.sentence, index, start, end, { alias: "test" })
    this.setState({ sentence, selectedToken: newToken })
  }

  div = React.createRef<HTMLDivElement>()

  syncEditableContent = () => {
    const spans = Array.prototype.slice.call(this.div.current.children) as HTMLSpanElement[]
    let sentence = this.state.sentence
    spans.forEach((span, index) => {
      sentence = Sentence.setTokenText(sentence, index, span.innerText)
    })
    this.setState({ sentence, contentDirty: false })
  }

  render() {
    const { sentence } = this.state

    return (
      <div className="sequence-editor"
        contentEditable
        suppressContentEditableWarning
        onInput={() => this.setState({ contentDirty: true })}
        ref={this.div}>
        {sentence.data.map((value, index) =>
          value.alias
          ? <LabeledToken
              key={index}
              index={index}
              token={value}
              selected={index === this.state.selectedToken}
              onTokenExtendRight={this.onTokenExtendRight}
              onTokenExtendLeft={this.onTokenExtendLeft}
              onDeSelect={() => this.setState({ selectedToken: null })}
              onSelect={this.onTokenClick} />
          : <UnlabeledToken
              key={index}
              index={index}
              token={value}
              onClick={() => this.setState({ selectedToken: null })}
              onSelect={this.onUnlabeledTextSelect} />
        )}
      </div>
    )
  }
}
