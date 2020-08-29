import * as React from 'react'
import { SentenceToken } from '../lib/annotator'

interface Props {
  token: SentenceToken
  index: number
  onSelect: (token: SentenceToken, index: number, start: number, end: number) => void
  onClick: () => void
}
interface State {
  startOffset?: number
  endOffset?: number
}

export default class UnlabeledToken extends React.Component<Props, State> {
  span = React.createRef<HTMLSpanElement>()

  state = {
    startOffset: undefined,
    endOffset: undefined
  } as State

  selectionChange = () => {
    const node = this.span.current
    const selection = window.getSelection()

    if (
      selection?.anchorNode?.parentElement === node &&
      selection?.focusNode?.parentElement === node
    ) {
      const { startOffset, endOffset } = selection.getRangeAt(0)
      if (endOffset > startOffset) {
        this.setState({ startOffset, endOffset })
      }
    }
  }

  setSelection() {
    const { startOffset, endOffset } = this.state
    if (startOffset === undefined || endOffset === undefined) {
      return
    }

    this.props.onSelect(this.props.token, this.props.index, startOffset, endOffset)
    this.setState({ startOffset: undefined, endOffset: undefined })
  }

  mouseUp = () => {
    document.body.removeEventListener('mouseup', this.mouseUp)
    this.setSelection()
  }

  onMouseDown = () => {
    document.body.addEventListener('mouseup', this.mouseUp)
  }

  render() {
    const { token, onClick } = this.props
    return (
      <span ref={this.span} onMouseDown={this.onMouseDown} onClick={onClick}>
        <span></span>
        {token.text}
        <span></span>
      </span>
    )
  }

  componentDidMount() {
    document.addEventListener('selectionchange', this.selectionChange)
  }

  componentWillUnmount() {
    document.removeEventListener('selectionchange', this.selectionChange)
  }
}
