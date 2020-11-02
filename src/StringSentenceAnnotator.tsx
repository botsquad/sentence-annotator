import React from 'react'
import marked from 'marked'
import { TokenPopover } from './components/LabeledToken'
import { SentenceAnnotator } from './components/SentenceAnnotator'
import { Sentence, SentenceToken } from './lib/annotator'

export interface StringProps {
  value: string
  onChange: (s: string) => void
  tokenPopover?: TokenPopover
  autoFocus?: boolean
  noEntities?: boolean
}

export class StringSentenceAnnotator extends React.Component<StringProps> {
  onChange = (s: Sentence) => {
    if (!s.data.length) return ''
    const str = s.data
      .map(value => {
        if (typeof value.entity !== 'string') return value.text
        if (typeof value.name !== 'string' || value.name === '')
          return `[${value.text}](${value.entity})`
        return `[${value.text}](${value.name}:${value.entity})`
      })
      .join('')

    this.props.onChange(str)
  }

  stringToSentence = (value: string): Sentence => {
    const [{ tokens }] = marked.lexer(value) as any
    if (!tokens || !tokens.length) return { data: [] }

    const data = tokens.map(
      (t: any): SentenceToken => {
        if (t.type === 'link') {
          const parts = t.href.split(':')
          if (parts.length == 1) {
            return { text: t.text, entity: t.href }
          }
          return { text: t.text, entity: parts[1], name: parts[0] }
        } else {
          return { text: t.raw }
        }
      }
    )
    return { data }
  }

  render() {
    const { value, onChange, ...props } = this.props
    return (
      <SentenceAnnotator value={this.stringToSentence(value)} onChange={this.onChange} {...props} />
    )
  }
}
