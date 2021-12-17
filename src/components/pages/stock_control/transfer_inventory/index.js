import React from "react";
import { Input, Switch } from "@teamfabric/copilot-ui";

// components
import ButtonBack from "../../../atoms/button_back";
import CustomButtonWithIcon from "../../../atoms/button_with_icon";
import SwitchOutlet from "../../../atoms/switch_outlet";

function TransferInventory() {
  return (
    <div className="page">
      <div className="page__top">
        <SwitchOutlet />
        <ButtonBack text="Back to Stock Control" link="/stock-control/purchase-orders" />
      </div>

      <div className="page__body">
        <section className="page__header">
          <h1 className="heading heading--primary">Transfer Out</h1>
          <CustomButtonWithIcon size="small" isPrimary="true" text="Save" />
        </section>

        <section className="page__content">
          <form className="form">
            <fieldset className="form__fieldset">
              <div className="fieldset_switch">
                <h2 className="heading heading--secondary">Details</h2>
              </div>

              <div className="form__row">
                <div className="form__input">
                  <Input
                    className="primary"
                    inputProps={{
                      disabled: false,
                    }}
                    label="Name / Reference"
                  />
                </div>

                <div className="form__input">
                  <Input
                    className="primary"
                    inputProps={{
                      disabled: false,
                    }}
                    label="Destination Outlet"
                  />
                </div>
              </div>
            </fieldset>

            <fieldset className="form__fieldset">
              <div className="fieldset_switch">
                <h2 className="heading heading--secondary">Bulk Order</h2>
                <Switch />
              </div>
            </fieldset>

            <fieldset className="form__fieldset">
              <div className="fieldset_switch">
                <h2 className="heading heading--secondary">Products</h2>
              </div>

              <div className="form__row">
                <Input
                  className="primary"
                  inputProps={{
                    disabled: false,
                  }}
                  label="Search Product"
                />

                <Input
                  className="primary"
                  inputProps={{
                    disabled: false,
                  }}
                  label="Quantity"
                />

                <CustomButtonWithIcon
                  text="Add"
                  iconName="Add"
                  theme="dark"
                  isPrimary={false}
                />
              </div>
            </fieldset>
          </form>
        </section>
      </div>
    </div>
  );
}

export default TransferInventory;
