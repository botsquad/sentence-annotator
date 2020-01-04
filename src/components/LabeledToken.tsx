import * as React from "react"
import classNames from 'classnames'

import { SentenceToken } from '../lib/annotator'
import { Popover, Position } from '@blueprintjs/core'
import LabeledTokenPopover from './LabeledTokenPopover'

interface Props {
  token: SentenceToken
  selected: boolean
  index: number
  onTokenExtendRight: (token: SentenceToken, index: number, delta: number) => void
  onTokenExtendLeft: (token: SentenceToken, index: number, delta: number) => void
  onSelect: (token: SentenceToken, index: number) => void
  onRemove: (token: SentenceToken, index: number) => void
  onChange: (token: SentenceToken, index: number) => void
  onDeSelect: () => void
  dragMode: DragMode
  setDragMode: (dragMode: DragMode) => void
}

export enum DragMode { NONE, LEFT, RIGHT, MOVE }

interface State {
  originX: number | null
}

function metaClass(meta: string) {
  let sum = 0
  for (let i=0; i<meta.length; i++) {
    sum += meta.charCodeAt(i);
  }
  return 'm' + (sum % 10)
}


export default class Token extends React.Component<Props, State> {

  state: State = {
    originX: null,
  }

  mouseMove = (e: Event) => {
    const x = (e as MouseEvent).clientX
    const ox = this.state.originX

    if (ox === null) {
      this.setState({ originX: x })
      return
    }

    switch (this.props.dragMode) {
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
    this.props.setDragMode(DragMode.NONE)
  }

  componentWillMount() {
    if (this.props.dragMode !== DragMode.NONE) {
      document.body.addEventListener("mousemove", this.mouseMove)
      document.body.addEventListener("mouseup", this.mouseUp)
    }
  }

  componentWillUnmount() {
    if (this.props.dragMode !== DragMode.NONE) {
      document.body.removeEventListener("mousemove", this.mouseMove)
      document.body.removeEventListener("mouseup", this.mouseUp)
    }
  }

  dragStart(e: React.MouseEvent, dragMode: DragMode) {
    e.preventDefault()
    this.props.setDragMode(dragMode)
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
    if (this.props.dragMode === DragMode.NONE && state === false) {
      this.props.onDeSelect()
    }
  }

  render() {
    const { token, index, selected, onSelect, onRemove, onChange } = this.props
    return (
      <Popover isOpen={this.props.dragMode === DragMode.NONE && selected} position={Position.BOTTOM} onInteraction={this.onPopoverInteraction}>
        <span
          className={classNames('meta', { selected }, metaClass(token.alias || 'alias'))}
          onClick={() => onSelect(token, index)}>
          {selected ? this.renderHandle(true) : null}
          {selected ? this.renderHandle(false) : null}
          <span></span>
          {token.text}
          <span></span>
        </span>
        <LabeledTokenPopover onTokenRemove={() => onRemove(token, index)} token={token} onChange={token => onChange(token, index)} />
      </Popover>
    )
  }
}
