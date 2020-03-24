import * as React from "react"
import SentenceEditor from './components/SentenceEditor'
import { TokenPopover } from './components/LabeledToken'
import { Sentence } from './lib/annotator'
import './css/main.css'

interface Props {
  value: Sentence
  onChange: (s: Sentence) => void
  tokenPopover?: TokenPopover
};

export default class Main extends React.Component<Props, { count: number }> {
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
