import React, { useState } from "react";
import { Input, Switch, Checkbox } from "@teamfabric/copilot-ui";
const SuperAdminForm = (props) => {
  const {
    outletId,
    formData,
    formErrorsData,
    handleFormChange,
    setFormData,
    setFormErrorsData,
    initialData,
  } = props;
  const {
    is_super_admin,
    po_threshold,
    str_threshold,
    po_threshold_value,
    po_threshold_quantity,
    str_threshold_quantity,
  } = formData;
  const onToggleSuperAdmin = () => {
    setFormData({ is_super_admin: !is_super_admin });
  };
  const onTogglePoThreshold = () => {
    setFormData({ po_threshold: !po_threshold });
  };
  const onToggleStrThreshold = () => {
    setFormData({ str_threshold: !str_threshold });
  };
  console.log("is_super_admin", is_super_admin);
  return (
    <section className="page__content super_admin section margin-top">
      <form className={`form ${outletId && "section"}`}>
        <fieldset className="form__fieldset">
          <div className="form__row">
            <Checkbox
              label="Super Admin"
              onChange={onToggleSuperAdmin}
              value={is_super_admin}
              checked={is_super_admin}
              className="form__checkbox"
            />
          </div>
          {/* {is_super_admin && (
            <div className="form__row">
              <Checkbox
                label="PO Threshold"
                onChange={onTogglePoThreshold}
                value={po_threshold}
                checked={po_threshold}
                className="form__checkbox"
              />
            </div>
          )}
          {po_threshold && (
            <div className="form__row">
              <div className="form__input">
                <Input
                  className="primary required"
                  inputProps={{
                    type: "number",
                    min: 0,
                    value: po_threshold_value,
                    onChange: handleFormChange,
                    isFloatedLabel: false,
                    name: "po_threshold_value",
                  }}
                  isFloatedLabel={false}
                  errorMessage="Field Is Required"
                  label="PO Threshold Value"
                />
              </div>
            </div>
          )}
          {po_threshold && (
            <div className="form__row">
              <div className="form__input">
                <Input
                  className="primary required"
                  inputProps={{
                    type: "number",
                    min: 0,
                    onChange: handleFormChange,
                    name: "po_threshold_quantity",
                    value: po_threshold_quantity,
                  }}
                  isFloatedLabel={false}
                  errorMessage="Field Is Required"
                  label="PO Threshold Quantity"
                />
              </div>
            </div>
          )} */}
          {is_super_admin && (
            <div className="form__row">
              <Checkbox
                label="STR Threshold"
                onChange={onToggleStrThreshold}
                value={str_threshold}
                checked={str_threshold}
                className="form__checkbox"
              />
            </div>
          )}
          {str_threshold && (
            <div className="form__row">
              <div className="form__input">
                <Input
                  className="primary required"
                  inputProps={{
                    type: "number",
                    min: 0,
                    onChange: handleFormChange,
                    name: "str_threshold_quantity",
                    value: str_threshold_quantity,
                  }}
                  isFloatedLabel={false}
                  errorMessage="Field Is Required"
                  label="STR Threshold Quantity"
                />
              </div>
            </div>
          )}
        </fieldset>
      </form>
    </section>
  );
};

export default SuperAdminForm;
