import * as React from "react"
import { Sentence } from '../lib/annotator'

import Token from './Token'

interface Props {
  sentence: Sentence
};

interface State {
  selectedToken?: number;
}

export default class SentenceEditor extends React.Component<Props, State> {
  state: State = {
    selectedToken: 0
  }

  render() {
    const { sentence } = this.props
    console.log(this.state)

    return (
      <div className="sequence-editor">
        <h1>SentenceEditor component</h1>
        {sentence.data.map((value, index) => <Token key={index} token={value} selected={index === this.state.selectedToken} onClick={(e) => { console.log(e)
          this.setState({ selectedToken: index })}}/>)}
      </div>
    )
  }
}
