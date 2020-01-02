import * as React from "react"
import { SentenceToken } from '../lib/annotator'

interface Props {
  token: SentenceToken
  index: number
  onSelect: (token: SentenceToken, index: number, start: number, end: number) => void
  onClick: () => void
}

export default class UnlabeledToken extends React.Component<Props, {}> {

  span = React.createRef<HTMLSpanElement>()

  state = {
    selectedText: ''
  }

  selectionChange = () => {
    const node = this.span.current
    const selection = window.getSelection()

    if (selection?.anchorNode?.parentElement === node && selection?.focusNode?.parentElement === node) {
      const selectedText = selection.toString()
      this.setState({ selectedText })
    }
  }

  setSelection() {
    if (!this.state.selectedText.length) {
      return
    }
    const pos = this.props.token.text.search(new RegExp(this.state.selectedText))
    if (pos >= 0) {
      this.props.onSelect(this.props.token, this.props.index, pos, pos + this.state.selectedText.length)
    }
  }

  mouseUp = () => {
    document.body.removeEventListener("mouseup", this.mouseUp)
    this.setSelection()
  }

  onMouseDown = () => {
    document.body.addEventListener("mouseup", this.mouseUp)
  }

  render() {
    const { token, onClick } = this.props
    return (
      <span
        ref={this.span}
        onMouseDown={this.onMouseDown}
        onClick={onClick}>
        <span></span>
        {token.text}
        <span></span>
      </span>
    )
  }

  componentDidMount() {
    document.addEventListener("selectionchange", this.selectionChange)
  }

  componentWillUnmount() {
    document.removeEventListener("selectionchange", this.selectionChange)
  }
}
