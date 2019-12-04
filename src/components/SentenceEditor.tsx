import * as React from "react"
import { Sentence } from '../lib/annotator'

import LabeledToken from './LabeledToken'
import UnlabeledToken from './UnlabeledToken'

interface Props {
  sentence: Sentence
};

interface State {
  selectedToken?: number;
  sentence: Sentence
}

export default class SentenceEditor extends React.Component<Props, State> {
  state: State = {
    selectedToken: null,
    sentence: this.props.sentence
  }

  onTokenClick = (t, index) => {
    if (t.alias) {
      this.setState({ selectedToken: index })
    } else {
      this.setState({ selectedToken: null  })
    }
  }

  onTokenExtendRight = (t, index, delta) => {
    const sentence = Sentence.extendRight(this.state.sentence, index, delta)
    this.setState({ sentence })
  }

  onTokenExtendLeft = (t, index, delta) => {
    const sentence = Sentence.extendLeft(this.state.sentence, index, delta)
    if (this.state.selectedToken >= sentence.data.length) {
      this.setState({ sentence, selectedToken: sentence.data.length - 1 })
    } else {
      this.setState({ sentence })
    }
  }

  onUnlabeledTextSelect = (t, index, start, end) => {
    const { sentence, newToken } = Sentence.splitSelectToken(this.state.sentence, index, start, end, { alias: "test" })
    this.setState({ sentence, selectedToken: newToken })
  }

  div = React.createRef<HTMLDivElement>()

  syncInput = () => {
    console.log('this.div.current', this.div.current)
  }

  render() {
    const { sentence } = this.state

    return (
      <div className="sequence-editor"
        contentEditable
        suppressContentEditableWarning
        onInput={this.syncInput}
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
