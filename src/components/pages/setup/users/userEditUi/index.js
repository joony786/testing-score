import React, { useState, useEffect, useReducer } from "react";
import { Input, Checkbox, Switch, Dropdown, } from "@teamfabric/copilot-ui";
import { useHistory } from "react-router-dom";

// components
import ButtonBack from "../../../../atoms/button_back";
import CustomButtonWithIcon from "../../../../atoms/button_with_icon";
import SwitchOutlet from "../../../../atoms/switch_outlet";
import * as SetupApiUtil from '../../../../../utils/api/setup-api-utils';
import * as Helpers from "../../../../../utils/helpers/scripts";
import { getDataFromLocalStorage } from "../../../../../utils/local-storage/local-store-utils";

function EditUser(props) {

  const initialFormValues = {
    name: "",
    userName: "",
    userPhone: "",
    userPassword: "",
    userReTypePassword: "",
    userRole: null,
    status: "",

  }
  const initialFormErrorsValues = {
    nameError: false,
    userNameError: false,
    userPhoneError: false,
    userPasswordError: false,
    userReTypePasswordError: false,
    userRoleError: false,
  }
  const formReducer = (state, event) => {
    return { ...state, ...event };
  }
  const formErrorsReducer = (state, event) => {
    return { ...state, ...event };
  }

  const [formData, setFormData] = useReducer(formReducer, initialFormValues);
  const [formErrorsData, setFormErrorsData] = useReducer(formErrorsReducer, initialFormErrorsValues);
  const { name, userName, userPhone, userPassword, userReTypePassword, userRole, status } = formData;
  const { nameError, userNameError, userPhoneError, userPasswordError, userReTypePasswordError, userRoleError } = formErrorsData;
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedStores, setSelectedStores] = useState([]);
  const [userData, setUserData] = useState({});
  const [passwordChangeSwitch, setPasswordChangeSwitch] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [brandsStoresData, setBrandsStoresData] = useState([]);
  const [userRolesName, setUserRolesName] = useState({});
  const [checkIsSuperAdmin, setCheckIsSuperAdmin] = useState(false);
  const history = useHistory();
  const { match = {} } = props;
  const { user_id = {} } = match !== undefined && match.params;


  let mounted = true;
  let userRolesOptions = [];
  let userRolesResponse = [];
  let outletResponse = [];
  let selectedStoresData = [];
  let selectedBrandsData = [];

  useEffect(() => {
    window.scrollTo(0, 0);
    if (user_id !== undefined) {
      getUserRolesData();
      getAllBrandsStoresData();
      fetchUserData(user_id);
    }
    else {
      return popPage();
    }
    return () => {
      mounted = false;
    }
  }, []);

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData({ [name]: value });
    let inputErrorKey = `${name}Error`;
    setFormErrorsData({
      [inputErrorKey]: false,
    });
  }

  const getAllBrandsStoresData = async () => {
    document.getElementById('app-loader-container').style.display = "block";
    const viewBrandsStoresResponse = await SetupApiUtil.viewAllBrandsStores();
    if (viewBrandsStoresResponse.hasError) {
      document.getElementById('app-loader-container').style.display = "none";
      showAlertUi(true, viewBrandsStoresResponse.errorMessage);
    }
    else {
      if (mounted) {
        setBrandsStoresData(viewBrandsStoresResponse?.data);
        document.getElementById('app-loader-container').style.display = "none";
      }
    }
  }


  const getUserRolesData = async (pageNumber = 1, limit = 10) => {
    document.getElementById('app-loader-container').style.display = "block";
    const getUserRolesResponse = await SetupApiUtil.viewUserRoles(limit, pageNumber);
    if (getUserRolesResponse.hasError) {
      document.getElementById('app-loader-container').style.display = "none";
      showAlertUi(true, getUserRolesResponse.errorMessage);
    }
    else {
      if (mounted) {
        let userRoles = getUserRolesResponse?.data?.data;
        userRoles && userRoles.length > 0 && Object.entries(userRoles).forEach(([key, val]) => {
          userRolesOptions.push({ id: parseInt(val.id), name: val.name });
        });     //imp if unmounted
        setUserRolesName(userRolesOptions);
        userRolesResponse = userRolesOptions;
        document.getElementById('app-loader-container').style.display = "none";
      }
    }
  }

  const handleUserRoleChange = (listItem) => {
    setFormData({ userRole: { ...listItem } });
    setFormErrorsData({
      userRoleError: false,
    });
  }

  const fetchUserData = async (userId) => {
    document.getElementById('app-loader-container').style.display = "block";
    const getUserResponse = await SetupApiUtil.viewUserById(userId);
    if (getUserResponse.hasError) {
      document.getElementById('app-loader-container').style.display = "none";
      showAlertUi(true, getUserResponse.errorMessage);
    }
    else {
      let getUserFromLocalStorage = getDataFromLocalStorage("user-copilot");
      setCheckIsSuperAdmin(getUserFromLocalStorage.data.user_info.is_super === "1" ? true : false);
      let userRoleData = {};
      getUserResponse?.data?.[0].brand_info.forEach(element => {
        selectedBrandsData.push(element.id);
        element?.stores.forEach(item => {
          selectedStoresData.push(item.id);
        });
      });
      setSelectedBrands(selectedBrandsData);
      setSelectedStores(selectedStoresData);
      setUserData(getUserResponse?.data?.[0].user_info);
      userRolesResponse.forEach(item => {
        if (parseInt(getUserResponse?.data?.[0].user_info.user_role_id) === item.id) {
          userRoleData = {
            id: item.id,
            name: item.name
          };
        }
      });
      setFormData({
        name: getUserResponse?.data?.[0].user_info.name,
        userName: getUserResponse?.data?.[0].user_info.email,
        userPhone: getUserResponse?.data?.[0].user_info.phone,
        status: getUserResponse?.data?.[0].user_info.status,
        userRole: userRoleData,
      });
      document.getElementById('app-loader-container').style.display = "none";
    }
  }

  const onFormSubmit = async (event) => {
    event.preventDefault();  //imp
    let formValidationsPassedCheck = true;

    if (userPassword !== userReTypePassword) {
      Helpers.showWarningAppAlertUiContent(true, "Passwords does not match");
      return;
    }
    if (selectedBrands.length === 0) {
      Helpers.showAppAlertUiContent(true, "please select any brand");
      return;
    }
    if (selectedStores.length === 0) {
      Helpers.showAppAlertUiContent(true, "please select any store");
      return;
    }
    if (passwordChangeSwitch) {
      if (!name || !userName || !userPhone ||
        !userPassword || !userReTypePassword ||
        !userRole) {
        formValidationsPassedCheck = false;
        Object.entries(formData).forEach(([key, val]) => {
          if (!val) {
            let inputErrorKey = `${key}Error`;
            setFormErrorsData({
              [inputErrorKey]: true,
            });
          }
        });
      }
    } else {
      if (!name || !userName || !userPhone || !userRole) {
        formValidationsPassedCheck = false;
        Object.entries(formData).forEach(([key, val]) => {
          if (!val) {
            let inputErrorKey = `${key}Error`;
            setFormErrorsData({
              [inputErrorKey]: true,
            });
          }
        });
      }
    }
    if (formValidationsPassedCheck) {

      if (buttonDisabled === false) {
        setButtonDisabled(true);
      }
      selectedBrands.forEach((item_brand) => {
        const brandResponse = brandsStoresData && brandsStoresData.length > 0 && brandsStoresData.find(i => i.brand_id === item_brand);
        if (brandResponse) {
          selectedStores.forEach((item_store) => {
            const storeResponse = brandResponse.stores.find(i => i.id === item_store);
            if (storeResponse) {
              outletResponse.push({
                store_id: storeResponse.id,
                brand_id: storeResponse.brand_id
              });
            }
          });
        }
      });
      let editUserPostData = {};
      if (passwordChangeSwitch) {
        if (checkIsSuperAdmin) {
          editUserPostData = {
            name: name,
            email: userName,
            password: userPassword,
            phone: userPhone,
            user_role_id: userRole.id,
            outlets: outletResponse,
            status: status
          };
        } else {
          editUserPostData = {
            name: name,
            email: userName,
            password: userPassword,
            phone: userPhone,
            user_role_id: userRole.id,
            outlets: outletResponse
          };
        }
      } else {
        if (checkIsSuperAdmin) {
          editUserPostData = {
            name: name,
            email: userName,
            phone: userPhone,
            user_role_id: userRole.id,
            outlets: outletResponse,
            status: status
          };
        } else {
          editUserPostData = {
            name: name,
            email: userName,
            phone: userPhone,
            user_role_id: userRole.id,
            outlets: outletResponse
          };
        }
      }
      document.getElementById('app-loader-container').style.display = "block";
      const editUserResponse = await SetupApiUtil.editUser(userData.id, editUserPostData);
      if (editUserResponse.hasError) {
        setButtonDisabled(false);
        document.getElementById('app-loader-container').style.display = "none";
        showAlertUi(true, editUserResponse.errorMessage);
      }
      else {
        document.getElementById('app-loader-container').style.display = "none";
        setTimeout(() => {
          history.push({
            pathname: '/setup/users',
          });
        }, 500);
      }
    }
  };


  const checkStoreExistsInOutlets = (row) => {
    const index = selectedStores.indexOf(row.id);
    if (index > -1) { return true; }
    else { return false; }
  }

  const checkBrandExistsInOutlets = (row) => {
    const index = selectedBrands.indexOf(row.brand_id);
    if (index > -1) { return true; }
    else { return false; }
  }

  const handleBrandChecked = (e) => {
    let brandId = e.target.value;
    let brandData = [...selectedBrands];
    const index = brandData.indexOf(brandId);
    if (index > -1) {
      brandData.splice(index, 1);
      setSelectedBrands(brandData);
    }
    else {
      brandData.push(brandId);
      setSelectedBrands(brandData);
    }
  }

  const handleStoreChecked = (e) => {
    let storeId = e.target.value;
    let storeData = [...selectedStores];
    const index = storeData.indexOf(storeId);
    if (index > -1) {
      storeData.splice(index, 1);
      setSelectedStores(storeData);
    }
    else {
      storeData.push(storeId);
      setSelectedStores(storeData);
    }
  }

  const showAlertUi = (show, errorText) => {
    Helpers.showAppAlertUiContent(show, errorText);
  }

  const popPage = () => {
    history.goBack();
  };

  const handleChangePasswordSwitch = (value) => {
    setPasswordChangeSwitch(value);
  }

  const onToggleCheckbox = (event) => {
    if (event.target.checked) {
      setFormData({ status: "1" });
    } else {
      setFormData({ status: "0" });
    }
  }



  return (
    <div className="page">
      <div className="page__top">
        <SwitchOutlet />
        <ButtonBack text="Back to Setup" link="/setup/users" />
      </div>

      <div className="page__body">
        <section className="page__header">
          <h1 className="heading heading--primary">Edit User</h1>
          {checkIsSuperAdmin &&
            <Checkbox
              className="form__checkbox"
              label="Activate"
              onChange={onToggleCheckbox}
              checked={userData.status === "1"}
              value={"is_active"}
            />
          }
          <CustomButtonWithIcon
            size="small"
            isPrimary={true}
            text="Edit"
            disabled={buttonDisabled}
            onClick={onFormSubmit}
          />
        </section>

        <section className="page__content">
          <form className="form">
            <fieldset className="form__fieldset">
              <div className="form__row">
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

                <div className="form__input">
                  <Input
                    className="primary required"
                    inputProps={{
                      onChange: handleFormChange,
                      name: "userName",
                      value: userName,
                    }}
                    label="*Username"
                    errorMessage="Field Is Required"
                    error={userNameError}
                  />
                </div>
              </div>

              <fieldset className="form__fieldset">
                <div className="fieldset_switch">
                  <Switch initialState={false} ontoggle={handleChangePasswordSwitch} />
                  <h2 className="heading change-password-toggle">
                    Do you want to change password?
                  </h2>
                </div>

                {passwordChangeSwitch &&
                  <div className="form__row">
                    <div className="form__input">
                      <Input
                        className="primary required password"
                        inputProps={{
                          onChange: handleFormChange,
                          name: "userPassword",
                          value: userPassword,
                          type: "password",
                        }}
                        label="*Password"
                        errorMessage="Field Is Required"
                        error={userPasswordError}
                      />
                    </div>

                    <div className="form__input">
                      <Input
                        className="primary required password"
                        inputProps={{
                          onChange: handleFormChange,
                          name: "userReTypePassword",
                          value: userReTypePassword,
                          type: "password",
                        }}
                        label="*Re-Type Password"
                        errorMessage="Field Is Required"
                        error={userReTypePasswordError}
                      />
                    </div>
                  </div>}
              </fieldset>

              <div className="form__row">
                <div className="form__input">
                  <Input
                    className="primary required"
                    inputProps={{
                      onChange: handleFormChange,
                      name: "userPhone",
                      value: userPhone

                    }}
                    maskOptions={{
                      regex: '[0-9]*'
                    }}
                    label="*Phone"
                    errorMessage="Field Is Required"
                    error={userPhoneError}
                  />
                </div>

                {checkIsSuperAdmin &&
                  <div className="form__input">
                    <Dropdown
                      className="form-dropdown-required"
                      onSelect={handleUserRoleChange}
                      options={userRolesName}
                      titleLabel="*Select Role"
                      value={userRole}
                      width="100%"
                      errorMessage="Field Is Required"
                      errorState={userRoleError}
                    />
                  </div>}
              </div>
              <h2>Brands and Stores</h2><br />
              <div className="form__row">
                <div className="form__input">
                  <ul>
                    {brandsStoresData.map((obj, index) => {
                      return (
                        <li key={obj.brand_id}>
                          <Checkbox
                            className="form__checkbox"
                            label={obj.brand_name}
                            onChange={handleBrandChecked}
                            checked={checkBrandExistsInOutlets(obj)}
                            value={obj.brand_id}
                          />
                          <br />
                          <ul>
                            {obj.stores.map((obj, index) => {
                              return (
                                <li className="listing-ml-40" key={obj.id}>
                                  <Checkbox
                                    className="form__checkbox"
                                    //disabled={!!+isActive}
                                    label={obj.name}
                                    onChange={handleStoreChecked}
                                    checked={checkStoreExistsInOutlets(obj)}
                                    value={obj.id}
                                  />
                                </li>
                              )
                            })}
                          </ul>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </div>
            </fieldset>
          </form>
        </section>
      </div>
    </div>
  );
}

export default EditUser;
