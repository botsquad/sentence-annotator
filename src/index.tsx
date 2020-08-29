import * as React from 'react'
import SentenceEditor, { ExternalProps } from './components/SentenceEditor'
import { Sentence } from './lib/annotator'
import './css/main.css'

export default class Main extends React.Component<ExternalProps, { count: number }> {
  state = { count: 0 }

  onReload = (s: Sentence) => {
    const { count } = this.state
    this.setState({ count: count + 1 }, () => this.props.onChange(s))
  }

  render() {
    const { count } = this.state

    return <SentenceEditor key={count} onReload={this.onReload} {...this.props} />
  }
}
