import * as React from "react"
import { SentenceToken } from '../lib/annotator'

interface Props {
  onClick: (token: SentenceToken, index: number) => void
  token: SentenceToken
  selected: boolean
  index: number
  onTokenExtendRight: (token: SentenceToken, index: number, delta: number) => void
  onTokenExtendLeft: (token: SentenceToken, index: number, delta: number) => void
}

export default class Token extends React.Component<Props, {}> {

  originX = 0
  isFirst = false

  className() {
    const { token, selected } = this.props
    return 'meta' + (selected ? ' selected' : '')
  }

  mouseMove = (e: Event) => {
    const x = (e as MouseEvent).clientX
    const ox = this.originX

    if (this.isFirst) {
      // extend left
      if (x - ox > 4) {
        this.props.onTokenExtendLeft(this.props.token, this.props.index, -1)
        this.originX = x
      }
      if (x - ox < -4) {
        this.props.onTokenExtendLeft(this.props.token, this.props.index, 1)
        this.originX = x
      }
    } else {
      // extend right
      if (x - ox > 4) {
        this.props.onTokenExtendRight(this.props.token, this.props.index, 1)
        this.originX = x
      }
      if (x - ox < -4) {
        this.props.onTokenExtendRight(this.props.token, this.props.index, -1)
        this.originX = x
      }
    }
  }

  mouseUp = (e: Event) => {
    document.body.removeEventListener("mousemove", this.mouseMove)
    document.body.removeEventListener("mouseup", this.mouseUp)
  }

  dragStart(e: React.MouseEvent, first: boolean) {
    e.preventDefault()

    this.originX = e.clientX
    this.isFirst = first
    document.body.addEventListener("mousemove", this.mouseMove)
    document.body.addEventListener("mouseup", this.mouseUp)
  }

  renderHandle(first: boolean) {
    return (
      <span className={"handle " + (first ? "first" : "last")}>
        <div className="dot" onMouseDown={e => this.dragStart(e, first)}></div>
        <div className="line"></div>
      </span>
    )
  }

  render() {
    const { token, index, selected, onClick } = this.props
    return (
      <span className={this.className()} onClick={() => onClick(token, index)}>
        {selected ? this.renderHandle(true) : null}
        <span></span>
        {token.text}
        <span></span>
        {selected ? this.renderHandle(false) : null}
      </span>
    )
  }
}
