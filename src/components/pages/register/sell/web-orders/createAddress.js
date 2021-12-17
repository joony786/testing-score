import React, { useState, useReducer, useRef } from "react";
import { Input, Snackbar, AutoComplete } from "@teamfabric/copilot-ui";
import * as WebOrdersApiUtil from "../../../../../utils/api/web-orders-api-utils";
import * as Helpers from "../../../../../utils/helpers/scripts";
import DynamicModal from "../../../../atoms/modal";
import statesData from "./us-states.json";
import { useOutsideAlerter } from "../../../../../utils/helpers/web-orders";

const CreateAddressModal = (props) => {
  const stateRef = useRef(null);
  const {
    handleCreateAddress,
    setAddressSearchValue,
    setAddressDropDown,
    setCreateAddressModal,
    setSelectedAddressData,
    selectedCustomerData,
    setAddressesDataToMap,
  } = props;
  const initialCustomerFormValues = {
    address1: "",
    city: "",
    state: "",
    country: "US",
    zipCode: "",
  };
  const initialCustomerFormErrorsValues = {
    address1Error: false,
    cityError: false,
    stateError: false,
    countryError: false,
    zipCodeError: false,
  };
  const formReducer = (state, event) => {
    return { ...state, ...event };
  };
  const formErrorsReducer = (state, event) => {
    return { ...state, ...event };
  };
  const [formData, setFormData] = useReducer(
    formReducer,
    initialCustomerFormValues
  );
  const [formErrorsData, setFormErrorsData] = useReducer(
    formErrorsReducer,
    initialCustomerFormErrorsValues
  );
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [statesDropDown, setStatesDropDown] = useState(false);
  const closeStateDropDown = () => setStatesDropDown(false);
  const [stateSearchValue, setStateSearchValue] = useState("");
  const [statesDataToMap, setStatesDataToMap] = useState(statesData);
  const { address1, city, state, country, zipCode } = formData;
  const { address1Error, cityError, stateError, countryError, zipCodeError } =
    formErrorsData;
  // Web Orders Component Work //
  const handleChangeCreateAddress = (event) => {
    const { name, value } = event.target;
    if (name == "country" || (name == "state" && value.length <= 2)) {
      setFormData({ [name]: value });
    } else if (name != "country" && name != "state") {
      setFormData({ [name]: value });
    }
    let inputErrorKey = `${name}Error`;
    setFormErrorsData({
      [inputErrorKey]: false,
    });
  };

  const onCreateAddress = async (event) => {
    event.preventDefault(); //imp
    let formValidationsPassedCheck = true;
    Object.entries(formData).forEach(([key, val]) => {
      if (!val) {
        let inputErrorKey = `${key}Error`;
        setFormErrorsData({
          [inputErrorKey]: true,
        });
        formValidationsPassedCheck = false;
      }
    });

    if (formValidationsPassedCheck) {
      if (buttonDisabled === false) {
        setButtonDisabled(true);
      }
      const nameSplit = selectedCustomerData?.fullName.split(" ");
      console.log("nameSplit", nameSplit);
      let addAddressPostData = {
        address1: address1,
        city: city,
        state: state,
        country: country,
        zipCode: zipCode,
        kind: "shipping",
        name: {
          first: nameSplit[0] || "",
          last: nameSplit[2] || "",
        },
        isVerified: false,
      };
      document.getElementById("app-loader-container").style.display = "block";
      let addAddressResponse = await WebOrdersApiUtil.createAddress(
        addAddressPostData,
        selectedCustomerData._id
      );
      if (!addAddressResponse.success) {
        const errorMessage =
          addAddressResponse?.errorMessage || addAddressResponse?.data?.message;
        console.log("Cant Add Address -> ", errorMessage);
        setButtonDisabled(false);
        document.getElementById("app-loader-container").style.display = "none";
        showAlertUi(true, errorMessage);
        setShowError(true);
        setErrorMessage(errorMessage);
        setTimeout(() => {
          setShowError(false);
          setErrorMessage("");
        }, 2000);
      } else {
        const dataToSeach = {
          search: selectedCustomerData?.email,
          limit: 10,
          offset: 0,
        };
        const customersSearchResponse = await WebOrdersApiUtil.searchCustomer(
          dataToSeach
        );
        if (customersSearchResponse.status === 200) {
          const findCustomer = customersSearchResponse?.data.find(
            (cus) => cus._id === selectedCustomerData._id
          );
          if (findCustomer) {
            setAddressesDataToMap(findCustomer?.address);
            const addressDataToSelect =
              findCustomer?.address[findCustomer?.address.length - 1];
            setAddressSearchValue(addressDataToSelect?.address1);
            setSelectedAddressData(addressDataToSelect);
          }
        }
        document.getElementById("app-loader-container").style.display = "none";
        setAddressDropDown(false);
        setCreateAddressModal(false);
      }
    }
  };
  const showAlertUi = (show, errorText) => {
    Helpers.showAppAlertUiContent(show, errorText);
  };

  const handleStateSearch = (e) => {
    const { value } = e.target;
    setStateSearchValue(value);
    if (value.length > 0) {
      const searchStates = statesData.filter((state) =>
        state.name.toLowerCase().includes(value.toLowerCase())
      );
      setStatesDataToMap(searchStates);
    } else {
      setStatesDataToMap(statesData);
    }
  };
  const handleSelectState = (state) => {
    setStateSearchValue(state.name);
    setFormData({ state: state.code });
    setStatesDropDown(false);
  };
  useOutsideAlerter(stateRef, closeStateDropDown);
  const CreateAddressForm = () => {
    return (
      <div className='page sell'>
        <h2 style={{ marginBottom: "3rem" }}>Create New Address</h2>
        <section className='customer'>
          <Snackbar
            dismissable
            height='60px'
            kind='alert'
            label={errorMessage}
            onDismiss={() => {
              setErrorMessage("");
              setShowError(false);
            }}
            show={showError}
            width='600px'
            withIcon
          />
          <div className='form'>
            <div className='form__row'>
              <div className='form__input'>
                <Input
                  className='primary'
                  inputProps={{
                    disabled: true,
                    value: country,
                    name: "country",
                    onChange: handleChangeCreateAddress,
                  }}
                  label='*Country'
                  errorMessage={"Field Is Required"}
                  error={countryError}
                />
              </div>
              <div className='form__input'>
                <div ref={stateRef} id='state-div'>
                  <AutoComplete
                    inputProps={{
                      icon: "Search",
                      className: "search-autocomplete primary",
                      isFloatedLabel: false,
                      boxed: false,
                      kind: "sm",
                      inputProps: {
                        placeholder: "Select State",
                        onChange: (e) => handleStateSearch(e),
                        value: stateSearchValue,
                        boxed: true,
                        //onKeyDown: SelectProductOnEnter,
                        onFocus: (event) => {
                          console.log(event);
                          setStatesDropDown(
                            statesDataToMap?.length > 0 ? true : false
                          );
                        },
                      },
                    }}
                    autoCompleteProps={{
                      data: {},
                      isLoading: true,
                      show: statesDropDown,
                      toggleSearchAll: true,
                      className: "search-autocomplete-popup",
                      onSearchAll: (event) => console.log(event),
                      onSelect: (data) => console.log(data, "data..."),
                      onClearSearch: (event, iconState) => {
                        setStatesDropDown(false);
                        setStateSearchValue("");
                        setFormData({
                          state: "",
                        });
                      },
                      onEscPress: closeStateDropDown,
                      onBodyClick: closeStateDropDown,
                    }}
                    children={
                      <div>
                        <ul>
                          {statesDataToMap &&
                            statesDataToMap.map((item) => (
                              <li
                                key={item.code}
                                value={item.code}
                                onClick={() => handleSelectState(item)}
                                className='products-search-list-item'
                              >
                                {item.name}
                              </li>
                            ))}
                        </ul>
                      </div>
                    }
                  />
                </div>
              </div>
            </div>
            <div className='form__row'>
              <Input
                className='primary'
                inputProps={{
                  disabled: false,
                  value: city,
                  name: "city",
                  onChange: handleChangeCreateAddress,
                }}
                label='*City'
                errorMessage='Field Is Required'
                error={cityError}
              />
              <Input
                className='primary'
                inputProps={{
                  disabled: false,
                  name: "zipCode",
                  value: zipCode,
                  onChange: handleChangeCreateAddress,
                }}
                label='*Zip Code'
                errorMessage='Field Is Required'
                error={address1Error}
              />
            </div>
            <Input
              className='primary'
              inputProps={{
                disabled: false,
                name: "address1",
                value: address1,
                onChange: handleChangeCreateAddress,
              }}
              label='*Address'
              errorMessage='Field Is Required'
              error={address1Error}
            />
          </div>
        </section>
      </div>
    );
  };
  return (
    <DynamicModal
      heading='Create New Address'
      size='medium'
      isCancelButton={true}
      isConfirmButton={true}
      onCancel={handleCreateAddress}
      renderModalContent={CreateAddressForm}
      onConfirm={onCreateAddress}
    />
  );
};

export default CreateAddressModal;
