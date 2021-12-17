import React from "react";
import { Switch, Dropdown, Checkbox, Icon } from "@teamfabric/copilot-ui";

function Barcode() {
  return (
    <section className="super_admin section">
      <div className="section__heading">
        <h1 className="heading heading--primary">Barcode Scanning</h1>
      </div>

      <div className="section__body">
        <div className="block">
          <div className="row">
            <Switch label="Barcode Scanning" />
          </div>

          <div className="row">
            <ul>
              <li className="u-mb-20">
                Barcode Mode{" "}
                <div>
                  <Checkbox
                    label="2D"
                    onChange={function noRefCheck() {}}
                    value="John Doe"
                  />
                  <Checkbox
                    label="3D"
                    onChange={function noRefCheck() {}}
                    value="John Doe"
                  />
                </div>
              </li>
              <li>
                Barcode Generations
                <div>
                  <Dropdown
                    onSelect={function noRefCheck() {}}
                    width="100%"
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
          </div>
        </div>

        {/* Barcodes for STR */}
        <div className="block">
          <h2 className="heading__secondary">Barcodes for STR</h2>

          <div className="row">
            <Switch label="Barcode for STR" />
          </div>

          <div className="row">
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
                      onChange={function noRefCheck() {}}
                      value="John Doe"
                    />

                    <Checkbox
                      label="Hybrid"
                      onChange={function noRefCheck() {}}
                      value="John Doe"
                    />
                  </li>
                </ul>

                <li>
                  <Checkbox
                    label="Barcode Scan By Carton"
                    onChange={function noRefCheck() {}}
                    value="John Doe"
                  />
                </li>

                <li>
                  <Checkbox
                    label="Without Scanning"
                    onChange={function noRefCheck() {}}
                    value="John Doe"
                  />
                </li>
              </li>
            </ul>
          </div>
        </div>

        {/* Barcodes for Purchase Orders */}
        <div className="block">
          <h2 className="heading__secondary">Barcodes for Purchase Orders</h2>

          <div className="row">
            <Switch label="Barcode for Purchase Orders" />
          </div>

          <div className="row">
            <ul>
              <li>
                <Checkbox
                  label="Barcode Scan One-by-One"
                  onChange={function noRefCheck() {}}
                  value="John Doe"
                />

                <ul>
                  <li>
                    <Checkbox
                      label="Scanning Compulsory"
                      onChange={function noRefCheck() {}}
                      value="John Doe"
                    />

                    <Checkbox
                      label="Hybrid"
                      onChange={function noRefCheck() {}}
                      value="John Doe"
                    />
                  </li>
                </ul>

                <li>
                  <Checkbox
                    label="Barcode Scan By Carton"
                    onChange={function noRefCheck() {}}
                    value="John Doe"
                  />
                </li>

                <li>
                  <Checkbox
                    label="Without Scanning"
                    onChange={function noRefCheck() {}}
                    value="John Doe"
                  />
                </li>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Barcode;
