import React from "react";
import { Checkbox, Dropdown, Icon } from "@teamfabric/copilot-ui";

const BarcodeForm = (props) => {
  const { outletId, formData, setFormData } = props;
  const {
    barcode_scanning,
    two_d_barcode_mode,
    three_d_barcode_mode,
    barcode_generations,
    barcode_for_str,
    barcode_str_scanning_compulsory,
    barcode_str_hybrid,
    barcode_str_scan_by_carton,
    barcode_str_without_scanning,
    barcode_for_purchase_order,
    barcode_scan_one_by_one,
    barcode_purchase_order_scanning_compulsory,
    barcode_purchase_order_hybrid,
    barcode_purchase_order_scan_by_carton,
    barcode_purchase_order_without_scanning,
  } = formData;
  const onToggleCheckboxes = (e) => {
    const { name, value } = e.target;
    setFormData({ [name]: Boolean(value) });
  };
  return (
    <section className="page__content barcode_form margin-top config">
      <form className={`form ${outletId && "section"}`}>
        <fieldset className="form__fieldset">
          <div className="form__row">
            <Checkbox
              label="Barcode Scanning"
              name="barcode_scanning"
              onChange={onToggleCheckboxes}
              value={barcode_scanning}
              checked={barcode_scanning}
              className="form_checkbox"
            />
          </div>

          {/* <div className="form__row">
            <ul>
              <li>
                Barcode Mode{" "}
                <div>
                  <Checkbox
                    label="2D"
                    onChange={onToggleCheckboxes}
                    value={two_d_barcode_mode}
                    checked={two_d_barcode_mode}
                    name="two_d_barcode_mode"
                  />
                  <Checkbox
                    label="3D"
                    onChange={onToggleCheckboxes}
                    value={three_d_barcode_mode}
                    checked={three_d_barcode_mode}
                    name="three_d_barcode_mode"
                  />
                </div>
              </li>
              <li>
                Barcode Generations
                <div>
                  <Dropdown
                    onSelect={function noRefCheck() {}}
                    options={[
                      {
                        id: 1,
                        name: "List Item 1",
                      },
                      {
                        id: 2,
                        name: "List Item 2",
                      },
                    ]}
                    titleLabel="Select"
                    value={{
                      id: 0,
                      name: "Menu Title",
                    }}
                  />
                </div>
              </li>
            </ul>
          </div> */}

          {/* Barcodes for STR */}
          <div className="block">
            <h2 className="heading__secondary">Barcodes for STR</h2>

            <div className="form__row">
              <Checkbox
                label="Barcode for STR"
                onChange={onToggleCheckboxes}
                value={barcode_for_str}
                checked={barcode_for_str}
                name="barcode_for_str"
              />
            </div>

            <div className="form__row">
              <ul>
                <li>
                  <span className="parent_item">
                    <Icon iconName="Add" size={12} fill="#121213" />
                    Barcode for STR
                  </span>

                  <ul>
                    <li>
                      <Checkbox
                        label="Scanning Compulsory"
                        onChange={onToggleCheckboxes}
                        value={barcode_str_scanning_compulsory}
                        checked={barcode_str_scanning_compulsory}
                        name="barcode_str_scanning_compulsory"
                      />

                      <Checkbox
                        label="Hybrid"
                        onChange={onToggleCheckboxes}
                        value={barcode_str_hybrid}
                        checked={barcode_str_hybrid}
                        name="barcode_str_hybrid"
                      />
                    </li>
                  </ul>

                  <li>
                    <Checkbox
                      label="Barcode Scan By Carton"
                      onChange={onToggleCheckboxes}
                      value={barcode_str_scan_by_carton}
                      checked={barcode_str_scan_by_carton}
                      name="barcode_str_scan_by_carton"
                    />
                  </li>

                  <li>
                    <Checkbox
                      label="Without Scanning"
                      onChange={onToggleCheckboxes}
                      value={barcode_str_without_scanning}
                      checked={barcode_str_without_scanning}
                      name="barcode_str_without_scanning"
                    />
                  </li>
                </li>
              </ul>
            </div>
          </div>

          <div className="block">
            <h2 className="heading__secondary">Barcodes for Purchase Order</h2>

            <div className="form__row">
              <Checkbox
                label="Barcode for Purchase Order"
                onChange={onToggleCheckboxes}
                value={barcode_for_purchase_order}
                checked={barcode_for_purchase_order}
                name="barcode_for_purchase_order"
              />
            </div>

            <div className="form__row">
              <ul>
                <li>
                  <span className="parent_item">
                    <Checkbox
                      label="Barcode Scan One by One"
                      onChange={onToggleCheckboxes}
                      value={barcode_scan_one_by_one}
                      checked={barcode_scan_one_by_one}
                      name="barcode_scan_one_by_one"
                    />
                  </span>

                  <ul>
                    <li>
                      <Checkbox
                        label="Scanning Compulsory"
                        onChange={onToggleCheckboxes}
                        value={barcode_purchase_order_scanning_compulsory}
                        checked={barcode_purchase_order_scanning_compulsory}
                        name="barcode_purchase_order_scanning_compulsory"
                      />

                      <Checkbox
                        label="Hybrid"
                        onChange={onToggleCheckboxes}
                        value={barcode_purchase_order_hybrid}
                        checked={barcode_purchase_order_hybrid}
                        name="barcode_purchase_order_hybrid"
                      />
                    </li>
                  </ul>

                  <li>
                    <Checkbox
                      label="Barcode Scan By Carton"
                      onChange={onToggleCheckboxes}
                      value={barcode_purchase_order_scan_by_carton}
                      checked={barcode_purchase_order_scan_by_carton}
                      name="barcode_purchase_order_scan_by_carton"
                    />
                  </li>

                  <li>
                    <Checkbox
                      label="Without Scanning"
                      onChange={onToggleCheckboxes}
                      value={barcode_purchase_order_without_scanning}
                      checked={barcode_purchase_order_without_scanning}
                      name="barcode_purchase_order_without_scanning"
                    />
                  </li>
                </li>
              </ul>
            </div>
          </div>
          {/* <div className="form__row">
            <Switch
              label="PO Threshold"
              initialState={po_threshold}
              ontoggle={onTogglePoThreshold}
            />
          </div> */}
          {/* <div className="form__row">
            <div className="form__input">
              <Input
                className="primary required"
                inputProps={{
                  onChange: handleFormChange,
                  name: "total_quantities",
                  value: total_quantities,
                }}
                errorMessage="Field Is Required"
                label="Total Quantities"
              />
            </div>
            <div className="form__input">
              <Input
                className="primary required"
                inputProps={{
                  onChange: handleFormChange,
                  name: "total_value",
                  value: total_value,
                }}
                errorMessage="Field Is Required"
                label="Total Value"
              />
            </div>
          </div> */}
          {/* <div className="form__row">
            <Switch
              label="STR Threshold"
              initialState={str_threshold}
              ontoggle={onToggleStrThreshold}
            />
          </div> */}
        </fieldset>
      </form>
    </section>
  );
};

export default BarcodeForm;
