import React, { useState, useEffect } from "react";
import { Button } from "@teamfabric/copilot-ui";

// components
import ButtonBack from "../../../../atoms/button_back";
import * as SetupApiUtil from "../../../../../utils/api/setup-api-utils";
import * as Helpers from "../../../../../utils/helpers/scripts";
import PageTitle from "../../../../organism/header";
import SwitchOutlet from "../../../../atoms/switch_outlet";
import { useHistory } from "react-router-dom";

function DeleteTemplate(props) {
  const history = useHistory();
  const [selectedTemplateName, setSelectedTemplateName] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const { match = {} } = props;
  const { template_id = {} } = match !== undefined && match.params;

  let mounted = true;

  useEffect(() => {
    window.scrollTo(0, 0);
    if (template_id !== undefined) {
      getTemplateData(template_id);
    } else {
      return popPage();
    }

    return () => {
      mounted = false;
    };
  }, []);

  const getTemplateData = async (templateId) => {
    document.getElementById("app-loader-container").style.display = "block";
    const getTemplateResponse = await SetupApiUtil.getTemplateById(templateId);
    console.log("getRoleResponse:", getTemplateResponse);
    if (getTemplateResponse.hasError) {
      console.log(
        "getCategory Cant Fetched -> ",
        getTemplateResponse.errorMessage
      );
      document.getElementById("app-loader-container").style.display = "none";
      showAlertUi(true, getTemplateResponse.errorMessage); //imp
      return delayPopPage();
    } else {
      if (mounted) {
        //imp if unmounted
        let brandName = getTemplateResponse?.template?.name; //vvimp
        setSelectedTemplateName(brandName);
        document.getElementById("app-loader-container").style.display = "none";
      }
    }
  };

  const onFormSubmit = async (event) => {
    event.preventDefault(); //imp to use here
    let formValidationsPassedCheck = true;

    if (!selectedTemplateName) {
      formValidationsPassedCheck = false;
    }

    if (formValidationsPassedCheck) {
      if (buttonDisabled === false) {
        setButtonDisabled(true);
      }

      document.getElementById("app-loader-container").style.display = "block";
      const templateDeleteResponse = await SetupApiUtil.deleteTemplate(
        template_id
      );
      console.log("templateDeleteResponse:", templateDeleteResponse);

      if (templateDeleteResponse.hasError) {
        console.log(
          "Cant delete a User Role -> ",
          templateDeleteResponse.errorMessage
        );
        setButtonDisabled(false);
        document.getElementById("app-loader-container").style.display = "none";
        showAlertUi(true, templateDeleteResponse.errorMessage); //imp
      } else {
        if (mounted) {
          //imp if unmounted
          document.getElementById("app-loader-container").style.display =
            "none";
          setTimeout(() => {
            history.push({
              pathname: "/setup/receipts-templates",
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
      pathname: "/setup/receipts-templates",
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
        <ButtonBack text="Back to Templates" link="/setup/receipts-templates" />
      </div>

      <PageTitle title="Delete Template" />
      <div className="page__body">
        <section className="page__content">
          <form className="form" onSubmit={onFormSubmit}>
            <fieldset className="form__fieldset">
              <div className="form__row">
                <div className="item-delete-content">
                  Do you really want to delete '
                  {selectedTemplateName && selectedTemplateName}'?
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

export default DeleteTemplate;
