import * as React from "react"
import classNames from 'classnames'

import { SentenceToken } from '../lib/annotator'
import { Popover, Position } from '@blueprintjs/core'


interface Props {
  token: SentenceToken
  selected: boolean
  index: number
  onTokenExtendRight: (token: SentenceToken, index: number, delta: number) => void
  onTokenExtendLeft: (token: SentenceToken, index: number, delta: number) => void
  onSelect: (token: SentenceToken, index: number) => void
  onDeSelect: () => void
}

enum DragMode { NONE, LEFT, RIGHT, MOVE }

interface State {
  originX: number
  dragMode: DragMode
}

export default class Token extends React.Component<Props, State> {

  state: State = {
    originX: 0,
    dragMode: DragMode.NONE
  }

  mouseMove = (e: Event) => {
    const x = (e as MouseEvent).clientX
    const ox = this.state.originX

    switch (this.state.dragMode) {
      case DragMode.LEFT:
        // extend left
        if (x - ox > 4) {
          this.setState({ originX: x })
          this.props.onTokenExtendLeft(this.props.token, this.props.index, -1)
        }
        if (x - ox < -4) {
          this.setState({ originX: x })
          this.props.onTokenExtendLeft(this.props.token, this.props.index, 1)
        }
        break

      case DragMode.RIGHT:
        // extend right
        if (x - ox > 4) {
          this.setState({ originX: x })
          this.props.onTokenExtendRight(this.props.token, this.props.index, 1)
        }
        if (x - ox < -4) {
          this.setState({ originX: x })
          this.props.onTokenExtendRight(this.props.token, this.props.index, -1)
        }
        break
    }
  }

  mouseUp = (_e: Event) => {
    this.setState({ dragMode: DragMode.NONE })
    document.body.removeEventListener("mousemove", this.mouseMove)
    document.body.removeEventListener("mouseup", this.mouseUp)
  }

  dragStart(e: React.MouseEvent, dragMode: DragMode) {
    e.preventDefault()

    this.setState({
      originX: e.clientX,
      dragMode
    })

    document.body.addEventListener("mousemove", this.mouseMove)
    document.body.addEventListener("mouseup", this.mouseUp)
  }

  renderHandle(left: boolean) {
    return (
      <span className={"handle " + (left ? "left" : "right")} contentEditable={false}>
        <div className="dot" onMouseDown={e => this.dragStart(e, left ? DragMode.LEFT : DragMode.RIGHT)}></div>
        <div className="line"></div>
      </span>
    )
  }

  onPopoverInteraction = (state: boolean) => {
    if (state === false) {
      this.props.onDeSelect()
    }
  }

  render() {
    const { token, index, selected, onSelect } = this.props
    return (
      <Popover isOpen={selected} position={Position.BOTTOM} onInteraction={this.onPopoverInteraction}>
        <span
          className={classNames('meta', { selected })}
          onClick={() => onSelect(token, index)}>
          {selected ? this.renderHandle(true) : null}
          {selected ? this.renderHandle(false) : null}
          <span></span>
          {token.text}
          <span></span>
        </span>
        <div>Lalalal this is a div bla</div>
      </Popover>
    )
  }
}
