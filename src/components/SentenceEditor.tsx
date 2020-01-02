import * as React from "react"
import { Sentence, SentenceToken } from '../lib/annotator'

import LabeledToken from './LabeledToken'
import UnlabeledToken from './UnlabeledToken'

interface Props {
  value: Sentence
  onChange: (s: Sentence) => void
};

interface State {
  selectedToken?: null | number;
  contentDirty: boolean
}

export default class SentenceEditor extends React.Component<Props, State> {
  state: State = {
    selectedToken: null,
    contentDirty: false,
  }

  onTokenNeutralize = (t: SentenceToken, index: number) => {
    const value = Sentence.neutralizeToken(this.props.value, index)
    this.props.onChange(value)
    this.setState({ selectedToken: null  })
  }

  onTokenClick = (t: SentenceToken, index: number) => {
    if (this.state.contentDirty) {
      this.syncEditableContent()
    }

    if (t.userDefined) {
      this.setState({ selectedToken: index })
    } else {
      this.setState({ selectedToken: null  })
    }
  }

  onTokenExtendRight = (_t: SentenceToken, index: number, delta: number) => {
    const value = Sentence.extendRight(this.props.value, index, delta)
    this.props.onChange(value)
  }

  onTokenExtendLeft = (_t: SentenceToken, index: number, delta: number) => {
    const sentence = this.props.value
    const value = Sentence.extendLeft(sentence, index, delta)
    if (typeof this.state.selectedToken === 'number' && this.state.selectedToken >= sentence.data.length) {
      this.setState({ selectedToken: sentence.data.length - 1 })
    }
    this.props.onChange(value)
  }

  onUnlabeledTextSelect = (_t: SentenceToken, index: number, start: number, end: number) => {
    const { sentence, newToken } = Sentence.splitSelectToken(this.props.value, index, start, end, { alias: "", meta: "" })
    this.props.onChange(sentence)
    setTimeout(() => this.setState({ selectedToken: newToken }), 100)
  }

  div = React.createRef<HTMLDivElement>()

  syncEditableContent = () => {
    if (!this.div.current) return
    const spans = Array.prototype.slice.call(this.div.current.children) as HTMLSpanElement[]
    let sentence = this.props.value
    spans.forEach((span, index) => {
      sentence = Sentence.setTokenText(sentence, index, span.innerText)
    })
    this.setState({ contentDirty: false })
    this.props.onChange(sentence)
  }

  render() {
    return (
      <div className="sentence-editor--wrapper"
        contentEditable
        spellCheck={false}
        suppressContentEditableWarning
        onInput={() => this.setState({ contentDirty: true })}
        onBlur={this.syncEditableContent}
        ref={this.div}>
        {this.props.value.data.map((value, index) =>
          value.userDefined
          ? <LabeledToken
              key={index}
              index={index}
              token={value}
              selected={index === this.state.selectedToken}
              onTokenExtendRight={this.onTokenExtendRight}
              onTokenExtendLeft={this.onTokenExtendLeft}
              onDeSelect={() => this.setState({ selectedToken: null })}
              onSelect={this.onTokenClick}
              onRemove={this.onTokenNeutralize}
          />
          : <UnlabeledToken
              key={index}
              index={index}
              token={value}
              onClick={() => { this.setState({ selectedToken: null }); this.syncEditableContent(); }}
              onSelect={this.onUnlabeledTextSelect} />
        )}
      </div>
    )
  }
}
