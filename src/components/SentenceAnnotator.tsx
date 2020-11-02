import React from 'react'
import { Sentence } from '../lib/annotator'
import { SentenceEditor, ExternalProps } from './SentenceEditor'

type State = { count: number; shouldFocus: boolean }

export class SentenceAnnotator extends React.Component<ExternalProps, State> {
  state = { count: 0, shouldFocus: false }

  onReload = (s: Sentence, shouldFocus: boolean) => {
    const { count } = this.state
    this.setState({ shouldFocus, count: count + 1 }, () => this.props.onChange(s))
  }

  render() {
    const { count } = this.state

    return (
      <SentenceEditor
        key={count}
        onReload={this.onReload}
        {...this.props}
        autoFocus={this.props.autoFocus || this.state.shouldFocus}
      />
    )
  }
}
