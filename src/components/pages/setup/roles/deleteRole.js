import React, { useState, useEffect } from "react";
import { Button } from "@teamfabric/copilot-ui";

// components
import ButtonBack from "../../../atoms/button_back";
import * as SetupApiUtil from "../../../../utils/api/setup-api-utils";
import * as Helpers from "../../../../utils/helpers/scripts";
import PageTitle from "../../../organism/header";
import SwitchOutlet from "../../../atoms/switch_outlet";
import { useHistory } from "react-router-dom";

function DeleteRole(props) {
  const history = useHistory();
  const [selectedRoleName, setSelectedRoleName] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const { match = {} } = props;
  const { role_id = {} } = match !== undefined && match.params;

  let mounted = true;

  useEffect(() => {
    window.scrollTo(0, 0);
    if (role_id !== undefined) {
      getRoleData(role_id);
    } else {
      return popPage();
    }

    return () => {
      mounted = false;
    };
  }, []);

  const getRoleData = async (roleId) => {
    document.getElementById("app-loader-container").style.display = "block";
    const getRoleResponse = await SetupApiUtil.getUserRoleById(roleId);
    console.log("getRoleResponse:", getRoleResponse);
    if (getRoleResponse.hasError) {
      console.log("getCategory Cant Fetched -> ", getRoleResponse.errorMessage);
      document.getElementById("app-loader-container").style.display = "none";
      showAlertUi(true, getRoleResponse.errorMessage); //imp
      return delayPopPage();
    } else {
      if (mounted) {
        //imp if unmounted
        let roleName = getRoleResponse?.data?.name; //vvimp
        setSelectedRoleName(roleName);
        document.getElementById("app-loader-container").style.display = "none";
      }
    }
  };

  const onFormSubmit = async (event) => {
    event.preventDefault(); //imp to use here
    let formValidationsPassedCheck = true;

    if (!selectedRoleName) {
      formValidationsPassedCheck = false;
    }

    if (formValidationsPassedCheck) {
      if (buttonDisabled === false) {
        setButtonDisabled(true);
      }

      document.getElementById("app-loader-container").style.display = "block";
      const roleDeleteResponse = await SetupApiUtil.deleteRole(role_id);
      console.log("roleDeleteResponse:", roleDeleteResponse);

      if (roleDeleteResponse.hasError) {
        console.log(
          "Cant delete a User Role -> ",
          roleDeleteResponse.errorMessage
        );
        setButtonDisabled(false);
        document.getElementById("app-loader-container").style.display = "none";
        showAlertUi(true, roleDeleteResponse.errorMessage); //imp
      } else {
        if (mounted) {
          //imp if unmounted
          document.getElementById("app-loader-container").style.display =
            "none";
          setTimeout(() => {
            history.push({
              pathname: "/setup/user-roles",
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
      pathname: "/setup/user-roles",
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
        <ButtonBack text="Back to User Roles" link="/setup/user-roles" />
      </div>

      <PageTitle title="Delete User Role" />
      <div className="page__body">
        <section className="page__content">
          <form className="form" onSubmit={onFormSubmit}>
            <fieldset className="form__fieldset">
              <div className="form__row">
                <div className="item-delete-content">
                  Do you really want to delete '
                  {selectedRoleName && selectedRoleName}'?
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

export default DeleteRole;
