import * as React from "react"
import { Sentence, SentenceToken } from '../lib/annotator'

import LabeledToken, { DragMode } from './LabeledToken'
import UnlabeledToken from './UnlabeledToken'
import { TokenPopover } from './LabeledToken'

export interface ExternalProps {
  value: Sentence
  onChange: (s: Sentence) => void
  tokenPopover?: TokenPopover
  autoFocus?: boolean
};

interface Props extends ExternalProps {
  onChange: (s: Sentence) => void
  onReload: (s: Sentence) => void
};

interface State {
  selectedToken?: null | number;
  contentDirty: boolean
  dragMode: DragMode
}

export default class SentenceEditor extends React.Component<Props, State> {
  state: State = {
    selectedToken: null,
    contentDirty: false,
    dragMode: DragMode.NONE
  }

  onTokenNeutralize = (_t: SentenceToken, index: number) => {
    const value = Sentence.neutralizeToken(this.props.value, index)
    this.props.onChange(value)
    this.setState({ selectedToken: null })
  }

  onTokenClick = (t: SentenceToken, index: number) => {
    this.syncEditableContent()

    if (t.entity !== undefined) {
      this.setState({ selectedToken: index })
    } else {
      this.setState({ selectedToken: null })
    }
  }

  onTokenExtendRight = (_t: SentenceToken, index: number, delta: number) => {
    if (typeof this.state.selectedToken !== 'number') return

    const sentence = this.props.value
    const value = Sentence.extendRight(this.props.value, index, delta)

    if (value.data.length > sentence.data.length && delta > 0) {
      this.setState({ selectedToken: this.state.selectedToken + 1 })
    }
    if (value.data.length < sentence.data.length && delta < 0) {
      this.setState({ selectedToken: this.state.selectedToken - 1 })
    }

    this.props.onChange(value)
  }

  onTokenExtendLeft = (_t: SentenceToken, index: number, delta: number) => {
    if (typeof this.state.selectedToken !== 'number') return

    const sentence = this.props.value
    const value = Sentence.extendLeft(sentence, index, delta)

    if (value.data.length > sentence.data.length && delta < 0) {
      this.setState({ selectedToken: this.state.selectedToken + 1 })
    }
    if (value.data.length < sentence.data.length && delta > 0) {
      this.setState({ selectedToken: this.state.selectedToken - 1 })
    }

    this.props.onChange(value)
  }

  onTokenChange = (token: SentenceToken, index: number) => {
    const value = Sentence.changeToken(this.props.value, index, token)
    this.props.onChange(value)
  }

  onUnlabeledTextSelect = (_t: SentenceToken, index: number, start: number, end: number) => {
    const { sentence, newToken } = Sentence.splitSelectToken(this.props.value, index, start, end, { name: "", entity: "" })
    this.props.onChange(sentence)
    setTimeout(() => this.setState({ selectedToken: newToken }), 100)
  }

  div = React.createRef<HTMLDivElement>()

  syncEditableContent = () => {
    if (!this.div.current || !this.state.contentDirty) return

    let spans = Array.prototype.slice.call(this.div.current.children) as HTMLSpanElement[]
    spans = spans.filter(s => s.innerText.length > 0)

    const text = this.div.current.innerText
    if (!spans.length) {
      let sentence = { ...this.props.value, data: [{ text }] }
      this.props.onReload(sentence)
      return
    }

    let sentence = this.props.value
    spans.forEach((span, index) => {
      sentence = Sentence.setTokenText(sentence, index, span.innerText)
    })
    if (spans.length !== sentence.data.length) {
      sentence = { ...sentence, data: sentence.data.slice(0, spans.length) }
      this.props.onReload(sentence)
      return
    }

    this.setState({ contentDirty: false })
    this.props.onChange(sentence)
  }

  render() {
    const { tokenPopover } = this.props

    return (
      <div className="sentence-editor--wrapper"
        contentEditable
        spellCheck={false}
        suppressContentEditableWarning
        onKeyDown={e => {
          if (e.keyCode === 13) {
            e.preventDefault()
          }
        }}
        onInput={() => this.setState({ contentDirty: true })}
        onBlur={this.syncEditableContent}
        onClick={() => this.div.current?.innerText ? this.syncEditableContent() : null}
        ref={this.div}>
        {this.props.value.data.map((value, index) =>
          value.entity !== undefined
            ? <LabeledToken
              key={index === this.state.selectedToken && this.state.dragMode !== DragMode.NONE ? `${value.name}${value.entity}` : index}
              index={index}
              token={value}
              selected={index === this.state.selectedToken}
              onTokenExtendRight={this.onTokenExtendRight}
              onTokenExtendLeft={this.onTokenExtendLeft}
              onDeSelect={() => {
                this.setState({ selectedToken: null })
              }}
              onSelect={this.onTokenClick}
              onChange={this.onTokenChange}
              onRemove={this.onTokenNeutralize}
              dragMode={index === this.state.selectedToken ? this.state.dragMode : DragMode.NONE}
              setDragMode={dragMode => this.setState({ dragMode })}
              tokenPopover={tokenPopover}
            />
            : <UnlabeledToken
              key={index}
              index={index}
              token={value}
              onClick={() => { this.setState({ selectedToken: null }); this.syncEditableContent() }}
              onSelect={this.onUnlabeledTextSelect} />
        )}
      </div>
    )
  }

  componentDidMount() {
    const { autoFocus } = this.props
    if (autoFocus) {
      this.div.current?.focus()
    }
  }
}
