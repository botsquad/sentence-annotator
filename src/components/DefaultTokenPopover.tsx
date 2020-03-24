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
      case 'name':
        token.name = e.target.value
        break
      case 'entity':
        token.entity = e.target.value
        break
    }
    this.props.onChange(token)
  }

  render() {
    const { token, onTokenRemove } = this.props

    return (
      <div className="labeled-token--popover-wrapper">

        <FormGroup label="Entity" labelFor="text-input">
          <input
            autoFocus
            className="bp3-input"
            id="meta-input"
            placeholder="sys.any"
            value={token.entity}
            onChange={e => this.onChange(e, 'entity')}
          />
        </FormGroup>

        <FormGroup label="Name" labelFor="text-input">
          <input
            className="bp3-input"
            id="name-input"
            placeholder="Name"
            value={token.name}
            onChange={e => this.onChange(e, 'name')}
          />
        </FormGroup>

        <Button icon="cross" text="Remove" onClick={onTokenRemove} />
      </div>
    )
  }
}
