import * as React from "react"
import { SentenceToken } from '../lib/annotator'

interface Props {
  onClick: (e: React.MouseEvent) => void
  token: SentenceToken
  selected: boolean
}

export default class Token extends React.Component<Props, {}> {

  className() {
    const { token, selected } = this.props
    return (token.alias ? ' meta' : '') + (selected ? ' selected' : '')
  }

  renderHandle(first: boolean) {
    return (
      <span className={"handle " + (first ? "first" : "last")}>
        <div className="dot"></div>
        <div className="line"></div>
      </span>
    )
  }


  render() {
    const { token, selected, onClick } = this.props
    return (
      <span className={this.className()} onClick={onClick}>
      {selected ? this.renderHandle(true) : null}
        {token.text}
        <span></span>
        {selected ? this.renderHandle(false) : null}
      </span>
    )
  }
}
