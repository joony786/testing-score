import React from "react";
import { Checkbox } from "@teamfabric/copilot-ui";

const TaxForm = (props) => {
  const { outletId, formData, setFormData } = props;
  const { fabric_taxation } = formData;
  const onToggleFabricTaxation = () => {
    setFormData({ fabric_taxation: !fabric_taxation });
  };
  return (
    <section className="page__content margin-top">
      <form className={`form ${outletId && "section"}`}>
        <fieldset className="form__fieldset">
          <div className="form__row">
            <Checkbox
              label="Manual Taxation"
              onChange={onToggleFabricTaxation}
              value={fabric_taxation}
              checked={fabric_taxation}
              className="form__checkbox"
            />
          </div>
        </fieldset>
      </form>
    </section>
  );
};

export default TaxForm;
