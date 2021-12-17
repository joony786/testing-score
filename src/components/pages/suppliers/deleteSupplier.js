import React, { useState, useEffect } from "react";
import { Button } from "@teamfabric/copilot-ui";

// components
import ButtonBack from "../../atoms/button_back";
import * as SuppliersApiUtil from "../../../utils/api/suppliers-api-utils";
import * as Helpers from "../../../utils/helpers/scripts";
import PageTitle from "../../organism/header";
import SwitchOutlet from "../../atoms/switch_outlet";
import { useHistory } from "react-router-dom";

function DeleteSupplier(props) {
  const history = useHistory();
  const [supplierData, setSupplierData] = useState(null);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const { match = {} } = props;
  const { supplier_id = {} } = match !== undefined && match.params;

  let mounted = true;

  useEffect(() => {
    window.scrollTo(0, 0);
    if (supplier_id !== undefined) {
      getSupplier(supplier_id);
    } else {
      return popPage();
    }

    return () => {
      mounted = false;
    };
  }, []);

  const getSupplier = async (supplierId) => {
    document.getElementById("app-loader-container").style.display = "block";
    const getSupplierResponse = await SuppliersApiUtil.getSupplier(supplierId);
    console.log("getSupplierResponse:", getSupplierResponse);
    if (getSupplierResponse.hasError) {
      console.log(
        "Supplier Cant Fetched -> ",
        getSupplierResponse.errorMessage
      );
      document.getElementById("app-loader-container").style.display = "none";
      showAlertUi(true, getSupplierResponse.errorMessage); //imp
      return delayPopPage();
    } else {
      if (mounted) {
        //imp if unmounted
        const supplierData = getSupplierResponse.suppliers.data[0]; //vvimp
        setSupplierData(supplierData);
        document.getElementById("app-loader-container").style.display = "none";
      }
    }
  };

  const onFormSubmit = async (event) => {
    event.preventDefault();
    let formValidationsPassedCheck = true;

    if (!supplierData) {
      formValidationsPassedCheck = false;
    }

    if (formValidationsPassedCheck) {
      if (buttonDisabled === false) {
        setButtonDisabled(true);
      }

      document.getElementById("app-loader-container").style.display = "block";
      const supplierDeleteResponse = await SuppliersApiUtil.deleteSupplier(
        supplierData.id
      );
      console.log("supplierDeleteResponse:", supplierDeleteResponse);

      if (supplierDeleteResponse.hasError) {
        console.log(
          "Cant delete a Category -> ",
          supplierDeleteResponse.errorMessage
        );
        setButtonDisabled(false);
        document.getElementById("app-loader-container").style.display = "none";
        showAlertUi(true, supplierDeleteResponse.errorMessage);
      } else {
        if (mounted) {
          //imp if unmounted
          document.getElementById("app-loader-container").style.display =
            "none";
          setTimeout(() => {
            history.push({
              pathname: "/suppliers",
            });
          }, 500);
        }
      }
    }
  };

  const showAlertUi = (show, errorText) => {
    Helpers.showAppAlertUiContent(show, errorText);
  };

  const handleCancel = (event) => {
    event.preventDefault();
    history.push({
      pathname: "/suppliers",
    });
  };

  const popPage = () => {
    history.goBack();
  };

  const delayPopPage = () => {
    setTimeout(() => {
      history.goBack();
    }, 2000);
  };

  return (
    <div className="page">
      <div className="page__top">
        <SwitchOutlet />
        <ButtonBack text="Back to Suppliers" link="/suppliers" />
      </div>

      <PageTitle title="Delete Suppliers" />
      <div className="page__body">
        <section className="page__content">
          <form className="form" onSubmit={onFormSubmit}>
            <fieldset className="form__fieldset">
              <div className="form__row">
                <div className="item-delete-content">
                  Do you really want to delete '
                  {supplierData && supplierData.name}'?
                </div>
              </div>
              <div className="form__row footer-delete-btns">
                <Button
                  className="delete-confirm-button"
                  size="small"
                  isPrimary={true}
                  text="Confirm"
                  disabled={buttonDisabled}
                />
                <Button
                  size="small"
                  isPrimary={true}
                  className="button__white"
                  text="Cancel"
                  onClick={handleCancel}
                />
              </div>
            </fieldset>
          </form>
        </section>
      </div>
    </div>
  );
}

export default DeleteSupplier;
