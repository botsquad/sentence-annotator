import * as React from 'react'
import { Sentence, SentenceToken } from '../lib/annotator'
import debounce from 'lodash/debounce'

import LabeledToken, { DragMode } from './LabeledToken'
import UnlabeledToken from './UnlabeledToken'
import { TokenPopover } from './LabeledToken'

export interface ExternalProps {
  value: Sentence
  onChange: (s: Sentence) => void
  tokenPopover?: TokenPopover
  autoFocus?: boolean
}

interface Props extends ExternalProps {
  onChange: (s: Sentence) => void
  onReload: (s: Sentence) => void
}

interface State {
  selectedToken?: null | number
  contentDirty: boolean
  dragMode: DragMode
}

export default class SentenceEditor extends React.Component<Props, State> {
  state: State = {
    selectedToken: null,
    contentDirty: false,
    dragMode: DragMode.NONE
  }

  onPaste = (e: any) => {
    const event = e as ClipboardEvent

    const selection = window.getSelection()
    if (!selection || !selection.rangeCount) {
      return
    }

    if (!this.div.current) {
      return
    }
    let span = selection.anchorNode?.parentElement

    while (span && span.parentElement !== this.div.current) {
      span = span.parentElement
    }
    if (!span) return
    let spans = Array.prototype.slice.call(this.div.current.children) as HTMLSpanElement[]
    const tokenIndex = spans.indexOf(span)
    const stringIndex = selection.getRangeAt(0).startOffset

    this.syncEditableContent()

    event.stopPropagation()
    event.preventDefault()
    const clipboardData = event.clipboardData || (window as any).clipboardData
    const text = clipboardData.getData('Text').trim()

    const value = Sentence.pasteTokenText(this.props.value, tokenIndex, stringIndex, text)
    this.props.onChange(value)
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
    const { sentence, newToken } = Sentence.splitSelectToken(this.props.value, index, start, end, {
      name: '',
      entity: ''
    })
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

  inputDelayedChange = debounce(() => {
    this.syncEditableContent()
    setTimeout(() => {
      const range = window.getSelection()?.getRangeAt(0)
      if (!range) return

      if (this.savedRange !== null && range) {
        range.setStart(this.savedRange.node, this.savedRange.startOffset)
        range.setEnd(this.savedRange.node, this.savedRange.endOffset)

        window.getSelection()?.removeAllRanges()
        window.getSelection()?.addRange(range)

        this.savedRange = null
      }
    }, 10)
  }, 200)

  savedRange: { node: Node; startOffset: number; endOffset: number } | null = null

  onInput = () => {
    const range = window.getSelection()?.getRangeAt(0)
    if (!range) return

    const { startOffset, endOffset, startContainer } = range
    this.savedRange = { startOffset, endOffset, node: startContainer }
    this.setState({ contentDirty: true }, this.inputDelayedChange)
  }

  render() {
    const { tokenPopover } = this.props

    return (
      <div
        className="sentence-editor--wrapper"
        contentEditable
        spellCheck={false}
        suppressContentEditableWarning
        onKeyDown={e => {
          if (e.keyCode === 13) {
            e.preventDefault()
          }
        }}
        onInput={this.onInput}
        onPaste={this.onPaste}
        onBlur={this.syncEditableContent}
        onClick={() => (this.div.current?.innerText ? this.syncEditableContent() : null)}
        ref={this.div}
      >
        {this.props.value.data.map((value, index) =>
          value.entity !== undefined ? (
            <LabeledToken
              key={
                index === this.state.selectedToken && this.state.dragMode !== DragMode.NONE
                  ? `${value.name}${value.entity}`
                  : index
              }
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
          ) : (
              <UnlabeledToken
                key={index}
                index={index}
                token={value}
                onClick={() => {
                  this.setState({ selectedToken: null })
                  this.syncEditableContent()
                }}
                onSelect={this.onUnlabeledTextSelect}
              />
            )
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
