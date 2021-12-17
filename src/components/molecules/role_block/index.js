import React from 'react'
import {  Checkbox,Radio, Switch, Dropdown } from "@teamfabric/copilot-ui";

function RoleBlock() {
  return (
    <div className="form__input">
      <h2 className="heading">Configuration</h2>

      <div className="checkbox_list">
        <Checkbox
          label="Quantity Metric"
          value="Quantity Metric"
        />
        
        <div className="select_unit">
          <div className="units">
            <Radio
              label="Gram"
              tabIndex={0}
              value="cash"
            />
            <Radio
              label="Kilogram"
              tabIndex={0}
              value="cash"
            />
          </div>

          <div>
            <p>This will allow products to be sold in grams</p>
          </div>
        </div>

        <Checkbox
          label="Wastage Calculation"
          value="Wastage Calculation"
        />

        <div className="sellable_switch">
          <Switch initialState={false} />
          <span>Sellable</span>
        </div>

        <div className="decimal_select">
          <Dropdown
            className="form-dropdown-required"
            titleLabel="Select Price Decimal"
            width="100%"
            errorMessage="Field Is Required"
          />
        </div>

      </div>
    </div>
  )
}

export default RoleBlock
