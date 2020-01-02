import * as React from "react"
import { Button, FormGroup } from '@blueprintjs/core'

interface Props {
  onTokenRemove: () => void
}

export default class extends React.Component<Props, {}> {
  render() {
    const { onTokenRemove } = this.props

    return (
      <div className="labeled-token--popover-wrapper">

        <FormGroup
          label="Alias"
          labelFor="text-input"
          labelInfo="(required)"
        >
          <input className="bp3-input" id="alias-input" placeholder="Alias name" />
        </FormGroup>

        <FormGroup
          label="Metadata"
          labelFor="text-input"
          labelInfo="(required)"
        >
          <input className="bp3-input" id="meta-input" placeholder="@sys.any" />
        </FormGroup>

        <Button icon="cross" text="Remove" onClick={onTokenRemove} />
      </div>
    )
  }
}
