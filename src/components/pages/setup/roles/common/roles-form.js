import React, { useState, useEffect, useReducer } from "react";
import { Checkbox, Input } from "@teamfabric/copilot-ui";
import { useHistory } from "react-router-dom";
// components
import ButtonBack from "../../../../atoms/button_back";
import CustomButtonWithIcon from "../../../../atoms/button_with_icon";
import SwitchOutlet from "../../../../atoms/switch_outlet";
import * as SetupApiUtil from "../../../../../utils/api/setup-api-utils";
import * as Helpers from "../../../../../utils/helpers/scripts";
import rolesData from "../rolesData.json";
import RoleBlock from "../../../../molecules/role_block";

function RolesForm(props) {
  const {
    roleId = "",
    buttonText,
    heading,
    initialData = {
      name: "",
      permissions: [],
    },
  } = props;

  const initialFormValues = {
    name: "",
  };
  const initialFormErrorsValues = {
    nameError: false,
  };
  const formReducer = (state, event) => {
    return { ...state, ...event };
  };
  const formErrorsReducer = (state, event) => {
    return { ...state, ...event };
  };
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [formData, setFormData] = useReducer(formReducer, initialFormValues);
  const [formErrorsData, setFormErrorsData] = useReducer(
    formErrorsReducer,
    initialFormErrorsValues
  );
  const [isActive, setIsActive] = useState("1");
  const [allPermissionsLength, setAllPermissionsLength] = useState(0);
  const { name } = formData;
  const { nameError } = formErrorsData;
  const history = useHistory();
  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData({ [name]: value });

    let inputErrorKey = `${name}Error`;
    setFormErrorsData({
      [inputErrorKey]: false,
    });
  };

  const handlePermissionChecked = (e) => {
    let permissionValue = e.target.value;
    var permissionsData = [...selectedPermissions];
    const index = permissionsData.indexOf(permissionValue);
    //console.log(index);
    if (index > -1) {
      permissionsData.splice(index, 1);
      setSelectedPermissions(permissionsData);
    } else {
      permissionsData.push(permissionValue); /*imp convert to string[]*/
      setSelectedPermissions(permissionsData);
    }
  };
  const handleIsActiveChecked = (e) => {
    if (!!+isActive) {
      setIsActive("0");
    } else {
      setIsActive("1");
    }
  };
  const showAlertUi = (show, errorText) => {
    Helpers.showAppAlertUiContent(show, errorText);
  };

  const onFormSubmit = async (event) => {
    event.preventDefault(); //imp
    let formValidationsPassedCheck = true;
    Object.entries(formData).forEach(([key, val]) => {
      //console.log(key, val);
      if (!val) {
        let inputErrorKey = `${key}Error`;
        setFormErrorsData({
          [inputErrorKey]: true,
        });
        formValidationsPassedCheck = false;
      }
    });

    if (selectedPermissions.length === 0) {
      showAlertUi(true, "Select At-least one permission");
      formValidationsPassedCheck = false;
    }
    if (formValidationsPassedCheck) {
      if (buttonDisabled === false) {
        setButtonDisabled(true);
      }

      let addUserRolePostData = {};
      addUserRolePostData.name = name;
      addUserRolePostData.permissions = selectedPermissions;

      document.getElementById("app-loader-container").style.display = "block";
      let addUserRoleResponse;
      if (roleId) {
        const updateRolePutData = {
          ...addUserRolePostData,
          is_active: isActive,
        };
        addUserRoleResponse = await SetupApiUtil.editUserRole(
          roleId,
          updateRolePutData
        );
      } else {
        addUserRoleResponse = await SetupApiUtil.addUserRole(
          addUserRolePostData
        );
      }

      if (addUserRoleResponse.hasError) {
        console.log("Cant Add User Role -> ", addUserRoleResponse.errorMessage);
        setButtonDisabled(false);
        document.getElementById("app-loader-container").style.display = "none";
        showAlertUi(true, addUserRoleResponse.errorMessage);
      } else {
        document.getElementById("app-loader-container").style.display = "none";
        setTimeout(() => {
          history.push({
            pathname: "/setup/user-roles",
            activeKey: "user-roles",
          });
        }, 500);
      }
    }
  };
  const handleSelectAllPermissions = (e) => {
    e.preventDefault();
    let allPermissions = [];
    for (const role of rolesData) {
      for (const d of role.data) {
        for (const per of d.permissions) {
          allPermissions.push(per.value);
        }
      }
    }
    setSelectedPermissions(allPermissions);
  };
  const handleUnSelectAllPermissions = () => {
    setSelectedPermissions([]);
  };
  useEffect(() => {
    if (roleId && initialData) {
      setFormData({
        name: initialData?.name,
      });
      if (initialData?.permissions) {
        const permissions = Object.keys(initialData.permissions);
        setSelectedPermissions(permissions);
      }
      setIsActive(initialData?.is_active);
    }
  }, [roleId, initialData]);
  useEffect(() => {
    let allPermissions = [];
    for (const role of rolesData) {
      for (const d of role.data) {
        for (const per of d.permissions) {
          allPermissions.push(per.value);
        }
      }
    }
    setAllPermissionsLength(allPermissions.length || 0);
  }, []);
  return (
    <div className="page">
      <div className="page__top">
        <SwitchOutlet />
        <ButtonBack text="Back to Setup Roles" link="/setup/user-roles" />
      </div>

      <div className="page__body">
        <section className="page__header">
          <h1 className="heading heading--primary">{heading}</h1>

          <CustomButtonWithIcon
            size="small"
            isPrimary={true}
            text={buttonText}
            disabled={buttonDisabled}
            onClick={onFormSubmit}
          />
        </section>
        <form className="form">
          <fieldset className="form__fieldset">
            <div className={roleId && "form__row"}>
              <div className="form__input">
                <Input
                  className="primary required"
                  inputProps={{
                    onChange: handleFormChange,
                    name: "name",
                    value: name,
                  }}
                  label="*Name"
                  errorMessage="Field Is Required"
                  error={nameError}
                />
              </div>
              {roleId && (
                <Checkbox
                  label="Is Active"
                  checked={!!+isActive}
                  onChange={handleIsActiveChecked}
                  value={!!+isActive}
                  className="custom_checkbox"
                />
              )}
            </div>
          </fieldset>
          <div className={"form__row"}>
            {selectedPermissions.length != allPermissionsLength && (
              <div className="form__input">
                <CustomButtonWithIcon
                  size="small"
                  text={"Select All Permission"}
                  isPrimary={true}
                  onClick={handleSelectAllPermissions}
                />
              </div>
            )}
            {selectedPermissions.length == allPermissionsLength && (
              <div className="form__input">
                <CustomButtonWithIcon
                  size="small"
                  text={"Unselect All Permission"}
                  onClick={handleUnSelectAllPermissions}
                />
              </div>
            )}
          </div>
          <section className="page__content roles">
            {rolesData.map((data, i) => (
              <div className="form__row" key={i}>
                {data.data.map((role, i) => (
                  <div className="form__input" key={i}>
                    <h2 className="heading">{role.name}</h2>
                    <div className="checkbox_list">
                      {role.permissions.map((permission, i) => (
                        <Checkbox
                          key={i}
                          checked={selectedPermissions.includes(
                            permission.value
                          )}
                          label={permission.name}
                          onChange={handlePermissionChecked}
                          value={permission.value}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}

            {/* <div className="form__row">
              <RoleBlock />
            </div> */}
          </section>
        </form>
      </div>
    </div>
  );
}

export default RolesForm;
