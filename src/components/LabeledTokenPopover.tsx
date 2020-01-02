import * as React from "react"
import { Button, FormGroup } from '@blueprintjs/core'
import { SentenceToken } from '../lib/annotator'

interface Props {
  token: SentenceToken
  onTokenRemove: () => void
  onChange: (t: SentenceToken) => void
}

export default class extends React.Component<Props, {}> {
  onChange(e: React.ChangeEvent<HTMLInputElement>, target: string) {
    let token = { ...this.props.token }
    switch (target) {
      case 'alias':
        token.alias = e.target.value
        break
      case 'meta':
        token.meta = e.target.value
        break
    }
    this.props.onChange(token)
  }

  render() {
    const { token, onTokenRemove } = this.props

    return (
      <div className="labeled-token--popover-wrapper">

        <FormGroup
          label="Alias"
          labelFor="text-input"
          labelInfo="(required)"
        >
          <input
            className="bp3-input"
            id="alias-input"
            placeholder="Alias name"
            value={token.alias}
            onChange={e => this.onChange(e, 'alias')}
          />
        </FormGroup>

        <FormGroup
          label="Metadata"
          labelFor="text-input"
          labelInfo="(required)"
        >
          <input
            className="bp3-input"
            id="meta-input"
            placeholder="@sys.any"
            value={token.meta}
            onChange={e => this.onChange(e, 'meta')}
          />
        </FormGroup>

        <Button icon="cross" text="Remove" onClick={onTokenRemove} />
      </div>
    )
  }
}
