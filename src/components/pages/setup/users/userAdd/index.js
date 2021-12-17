import React, { useState, useEffect, useReducer } from "react";
import { Input, Checkbox, Dropdown, } from "@teamfabric/copilot-ui";
import { useHistory } from "react-router-dom";

// components
import ButtonBack from "../../../../atoms/button_back";
import CustomButtonWithIcon from "../../../../atoms/button_with_icon";
import * as SetupApiUtil from '../../../../../utils/api/setup-api-utils';
import * as Helpers from "../../../../../utils/helpers/scripts";
import SwitchOutlet from "../../../../atoms/switch_outlet";



function NewUser() {

  const initialFormValues = {
    name: "",
    userName: "",
    userPhone: "",
    userPassword: "",
    userReTypePassword: "",
    userRole: null,

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
  const { name, userName, userPhone, userPassword, userReTypePassword, userRole } = formData;
  const { nameError, userNameError, userPhoneError, userPasswordError, userReTypePasswordError, userRoleError } = formErrorsData;
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [brandsStoresData, setBrandsStoresData] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedStores, setSelectedStores] = useState([]);
  const [userRolesName, setUserRolesName] = useState({});
  // const [isActive, setIsActive] = useState(true);
  const history = useHistory();


  let mounted = true;
  let userRolesOptions = [];
  let outletResponse = [];

  useEffect(() => {
    getUserRolesData();
    getAllBrandsStoresData();
    return () => {
      mounted = false;
    }
  }, []);



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
      if (mounted) {     //imp if unmounted
        let userRoles = getUserRolesResponse?.data?.data;
        userRoles && userRoles.length > 0 && Object.entries(userRoles).forEach(([key, val]) => {
          userRolesOptions.push({ id: parseInt(val.id), name: val.name });
        });
        setUserRolesName(userRolesOptions);
        document.getElementById('app-loader-container').style.display = "none";
      }
    }
  }


  const onFormSubmit = async (event) => {
    event.preventDefault();  //imp
    let formValidationsPassedCheck = true;
    if (userPassword !== userReTypePassword) {
      Helpers.showAppAlertUiContent(true, "Passwords does not match");
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

    if (formValidationsPassedCheck) {
      if (buttonDisabled === false) {
        setButtonDisabled(true);
      }
      selectedBrands.forEach((item_brand) => {
        const brandResponse = brandsStoresData && brandsStoresData.length > 0 && brandsStoresData.find(i => i.brand_id === item_brand);
        if(brandResponse){
          selectedStores.forEach((item_store) => {
            const storeResponse = brandResponse.stores.find(i => i.id === item_store);
            if(storeResponse){
              outletResponse.push({
                store_id: storeResponse.id,
                brand_id: storeResponse.brand_id
              });
            }
          });
        }
      });
      let addUserPostData = {
        name: name,
        email: userName,
        password: userPassword,
        phone: userPhone,
        user_role_id: userRole.id,
        outlets: outletResponse
      };
      document.getElementById('app-loader-container').style.display = "block";
      const addUserResponse = await SetupApiUtil.addUser(addUserPostData);
      if (addUserResponse.hasError) {
        setButtonDisabled(false);
        document.getElementById('app-loader-container').style.display = "none";
        showAlertUi(true, addUserResponse.errorMessage);
      }
      else {
        document.getElementById('app-loader-container').style.display = "none";
        setTimeout(() => {
          history.push({
            pathname: '/setup/users',
            activeKey: 'users'
          });
        }, 500);
      }
    }

  };


  const handleBrandChecked = (e) => {
    let brandId = e.target.value;
    let brandData = [...selectedBrands];
    const index = brandData.indexOf(brandId);
    if (index > -1) {
      brandData.splice(index, 1);
      setSelectedBrands(brandData);
    }
    else {
      brandData.push(brandId);  /*imp convert to string[]*/
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
      storeData.push(storeId);  /*imp convert to string[]*/
      setSelectedStores(storeData);
    }

  }

  // const handleIsActiveChecked = (e) => {
  //   if (!!+isActive) {
  //     setIsActive(false);
  //   } else {
  //     setIsActive(true);
  //   }
  // };


  const showAlertUi = (show, errorText) => {
    Helpers.showAppAlertUiContent(show, errorText);
  }

  const handleUserRoleChange = (listItem) => {
    setFormData({ userRole: { ...listItem } });
    setFormErrorsData({
      userRoleError: false,
    });
  }


  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData({ [name]: value });

    let inputErrorKey = `${name}Error`;
    setFormErrorsData({
      [inputErrorKey]: false,
    });

  }

  return (
    <div className="page">
      <div className="page__top">
        <SwitchOutlet />
        <ButtonBack text="Back to Setup" link="/setup/users" />
      </div>

      <div className="page__body">
        <section className="page__header">
          <h1 className="heading heading--primary">New User</h1>
          <CustomButtonWithIcon
            size="small"
            isPrimary={true}
            text="Add"
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

              <div className="form__row">
                <div className="form__input">
                  <Input
                    className="primary required password"
                    inputProps={{
                      onChange: handleFormChange,
                      name: "userPassword",
                      value: userPassword,
                      type: 'password'
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
                      type: 'password'

                    }}
                    label="*Re-Type Password"
                    errorMessage="Field Is Required"
                    error={userReTypePasswordError}
                  />
                </div>
              </div>

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
                </div>
              </div>

              <h2>Brands and Stores</h2><br />
              <div className="form__row">
                <div className="form__input">
                  <ul>
                    {brandsStoresData && brandsStoresData.length > 0 && brandsStoresData.map((obj, index) => {
                      return (
                        <li key={obj.brand_id}>
                          <Checkbox
                            className="form__checkbox"
                            label={obj.brand_name}
                            onChange={handleBrandChecked}
                            value={obj.brand_id}
                          />
                          <br />
                          <ul>
                            {obj.stores && obj.stores.length > 0 && obj.stores.map((obj, index) => {
                              return (
                                <li className="listing-ml-40" key={obj.id}>
                                  <Checkbox
                                    className="form__checkbox"
                                    //disabled={!!+isActive}
                                    label={obj.name}
                                    onChange={handleStoreChecked}
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

export default NewUser;
