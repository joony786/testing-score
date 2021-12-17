import React from "react";
import { Checkbox, Dropdown } from "@teamfabric/copilot-ui";
import constants from '../../../../../utils/constants/constants';

const ProductForm = (props) => {
  const { outletId, formData, setFormData, handleFormChange } = props;
  const { quantity_metric, decimal_point } = formData;
  const onToggleQuantity = () => {
    setFormData({ quantity_metric: !quantity_metric });
  };
  const handleSelect = value => {
      setFormData({ decimal_point: value.name });
  }
  const findValue = constants.DECIMAL_POINTS.find(i => i.name === decimal_point);
  //   const unit = quantity_metric_unit === "g" ? 'garam' : 'kilogaram'k
  return (
    <section className="page__content margin-top">
      <form className={`form ${outletId && "section"}`}>
        <fieldset className="form__fieldset">
          <div className="form__row">
            <Checkbox
              label="Quantity Metric"
              onChange={onToggleQuantity}
              value={quantity_metric}
              checked={quantity_metric}
              className="form__checkbox"
            />
          </div>
        </fieldset>
        {/* <fieldset className="form__fieldset">
          <div className="form__row">
            <Radio
              label="Gram"
              tabIndex={0}
              value="g"
              disabled={!quantity_metric}
              checked={quantity_metric_unit === "g"}
              name="quantity_metric_unit"
              onChange={handleFormChange}
            />
            <Radio
              label="Kilogram"
              tabIndex={0}
              value="kg"
              disabled={!quantity_metric}
              checked={quantity_metric_unit === "kg"}
              name="quantity_metric_unit"
              onChange={handleFormChange}
            />
          </div>
          <div>
            <p>This will allow products to be sold in grams</p>
          </div>
        </fieldset> */}
        <fieldset className="form__fieldset">
          <div className="form__row">
            <Dropdown
             onSelect={handleSelect}
             options={constants.DECIMAL_POINTS}
             value={findValue}
              className="form-dropdown-required"
              titleLabel="Select Price Decimal Point"
              width="100%"
              errorMessage="Field Is Required"
            />
          </div>
        </fieldset>
      </form>
    </section>
  );
};

export default ProductForm;
