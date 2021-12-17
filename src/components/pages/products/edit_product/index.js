import React from "react";
import {
  Input,
  Textarea,
  Dropdown,
  Checkbox,
  Switch,
} from "@teamfabric/copilot-ui";

// components
import ButtonBack from "../../../atoms/button_back";
import CustomButtonWithIcon from "../../../atoms/button_with_icon";
import ButtonUpload from "../../../atoms/button_upload";
import SwitchOutlet from "../../../atoms/switch_outlet";

function EditProduct() {
  return (
    <div className="page add_product">
      <div className="page__top">
        <SwitchOutlet />
        <ButtonBack text="Back to Products" link="/products" />
      </div>

      <div className="page__body">
        <section className="page__header">
          <h1 className="heading heading--primary">Edit Product</h1>

          <CustomButtonWithIcon size="small" isPrimary="true" text="Save" />
        </section>

        <section className="page__content">
          <form className="form">
            <fieldset className="form__fieldset">
              <div className="form__row">
                <Input
                  className="primary form__input"
                  inputProps={{
                    disabled: false,
                  }}
                  label="SKU"
                />

                <Input
                  className="primary form__input"
                  inputProps={{
                    disabled: false,
                  }}
                  label="Product Name"
                />
              </div>

              <div className="form__row">
                <Textarea
                  className="multiline"
                  label="Product Description"
                  onEditButtonClick={function noRefCheck() {}}
                  textareaProps={{
                    limit: 300,
                  }}
                  width="100%"
                />
              </div>

              <div className="form__row u_flex_start">
                <div className="form__input">
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
                      {
                        id: 3,
                        name: "List Item 3",
                      },
                    ]}
                    titleLabel="Tax"
                    value={{
                      id: 0,
                      name: "Tax",
                    }}
                    width="100%"
                  />
                </div>

                <div className="form__input">
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
                      {
                        id: 3,
                        name: "List Item 3",
                      },
                    ]}
                    titleLabel="Select Category"
                    value={{
                      id: 0,
                      name: "Select Category",
                    }}
                    width="100%"
                  />

                  <Checkbox
                    label="Sale price inclusive of tax"
                    onChange={function noRefCheck() {}}
                    value="John Doe"
                    className="checkbox--small"
                  />
                </div>
              </div>

              <div className="form__row">
                <Input
                  className="primary form__input"
                  inputProps={{
                    disabled: false,
                  }}
                  label="Purchase Price"
                />

                <Input
                  className="primary form__input"
                  inputProps={{
                    disabled: false,
                  }}
                  label="Sale Price"
                />
              </div>

              <div className="form__row">
                <div className="form__input">
                  <ButtonUpload text="Upload Products File" />
                </div>

                <div className="form__input">
                  <CustomButtonWithIcon
                    size="small"
                    isPrimary={true}
                    text="Upload"
                  />
                </div>
              </div>
            </fieldset>

            <fieldset className="form__fieldset">
              <div className="fieldset_switch">
                <h2 className="heading heading--secondary">
                  Inventory Tracking
                </h2>
              </div>
              <p>
                Leave this on if you want to keep track of your inventory
                quantities. You'll be able to report on cost of goods sold,
                product performance, and projected weeks cover, as well as
                manage your store using inventory orders, transfers and rolling
                inventory counts.
              </p>

              <div className="form__row">
                <Input
                  className="primary form__input"
                  inputProps={{
                    disabled: false,
                  }}
                  label="Outlet One"
                />

                <Input
                  className="primary form__input"
                  inputProps={{
                    disabled: false,
                  }}
                  label="Outlet Two"
                />
              </div>
            </fieldset>

            <fieldset className="form__fieldset">
              <div className="fieldset_switch">
                <h2 className="heading heading--secondary">Variant Products</h2>
              </div>
              <p>
                These are products that have different versions, like size or
                color. Turn this on to specify up to two attributes (like
                color), and unlimited values for each attribute (like green,
                blue, black).
              </p>

              <div className="form__row">
                <Input
                  className="primary form__input"
                  inputProps={{
                    disabled: false,
                  }}
                  label="Attribute(e.g color, size)"
                />

                <Input
                  className="primary form__input"
                  inputProps={{
                    disabled: false,
                  }}
                  label="Value(e.g green, blue, red)"
                />
              </div>
            </fieldset>
          </form>
        </section>
      </div>
    </div>
  );
}

export default EditProduct;
