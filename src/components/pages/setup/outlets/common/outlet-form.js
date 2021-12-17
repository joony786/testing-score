import React, { useState, useEffect, useReducer } from "react";
import { Tab, TabItem } from "@teamfabric/copilot-ui";
import { useHistory } from "react-router-dom";
// components
import ButtonBack from "../../../../atoms/button_back";
import CustomButtonWithIcon from "../../../../atoms/button_with_icon";
import SwitchOutlet from "../../../../atoms/switch_outlet";
import * as SetupApiUtil from "../../../../../utils/api/setup-api-utils";
import * as Helpers from "../../../../../utils/helpers/scripts";
import GeneralInfoForm from "./general-info-form";
import SuperAdminForm from "./super-admin-form";
import TaxForm from "./tax-form";
import BarcodeForm from "./barcode-form";
import ProductForm from './product-form';

import { getDataFromLocalStorage, saveDataIntoLocalStorage } from "../../../../../utils/local-storage/local-store-utils";
import Constants from "../../../../../utils/constants/constants";
import RoleBlock from '../../../../molecules/role_block';
let loginCacheData = null;

function OutletForm(props) {
  const {
    heading,
    buttonText,
    outletId,
    isAuth,
    initialData = {
      is_super_admin: false,
      po_threshold: false,
      str_threshold: false,
      po_threshold_value: 0,
      str_threshold_value: 0,
      name: "",
      business_address: "",
      currency: {},
      country: "",
      template_id: "",
      state: "",
      city: "",
    },
    isEdit = false,
  } = props;
  const initialFormValues = {
    is_super_admin: false,
    po_threshold: false,
    str_threshold: false,
    fabric_taxation: false,
    po_threshold_value: 0,
    po_threshold_quantity: 0,
    str_threshold_quantity: 0,
    barcode_scanning: false,
    two_d_barcode_mode: false,
    three_d_barcode_mode: false,
    barcode_generations: "-",
    barcode_for_str: false,
    barcode_str_scanning_compulsory: false,
    barcode_str_hybrid: false,
    barcode_str_scan_by_carton: false,
    barcode_str_without_scanning: false,
    barcode_for_purchase_order: false,
    barcode_scan_one_by_one: false,
    barcode_purchase_order_scanning_compulsory: false,
    barcode_purchase_order_hybrid: false,
    barcode_purchase_order_scan_by_carton: false,
    barcode_purchase_order_without_scanning: false,
    quantity_metric: false,
    decimal_point: Constants.DECIMAL_POINTS[0],
    name: "",
    business_address: "",
    currency: {},
    template: {},
    zip_code: "",
    state: "",
    city: "",
    country: "",
    external_code: "",
  };
  const initialFormErrorsValues = {
    nameError: false,
    business_addressError: false,
    currencyError: false,
    //templateError: false,
    stateError: false,
    cityError: false,
    countryError: false,
    zip_codeError: false,
    external_codeError: false,
  };
  const fieldsToValidate = [
    "name",
    "country",
    "zip_code",
    "state",
    "city",
   // "template",
    "currency",
    "external_code",
  ];
  const formReducer = (state, event) => {
    return { ...state, ...event };
  };
  const formErrorsReducer = (state, event) => {
    return { ...state, ...event };
  };
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [formData, setFormData] = useReducer(formReducer, initialFormValues);
  const [formErrorsData, setFormErrorsData] = useReducer(
    formErrorsReducer,
    initialFormErrorsValues
  );
  const { name, currency, template } = formData;
  const history = useHistory();
  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData({ [name]: value });
    setButtonDisabled(false);
    let inputErrorKey = `${name}Error`;
    setFormErrorsData({
      [inputErrorKey]: false,
    });
  };

  const showAlertUi = (show, errorText) => {
    Helpers.showAppAlertUiContent(show, errorText);
  };

  const onFormSubmit = async (event) => {
    event.preventDefault(); //imp
    let formValidationsPassedCheck = true;
    Object.entries(formData).forEach(([key, val]) => {
      if (
        (!val || Object.keys(val).length === 0) &&
        fieldsToValidate.includes(key)
      ) {
        let inputErrorKey = `${key}Error`;
        setFormErrorsData({
          [inputErrorKey]: true,
        });
        formValidationsPassedCheck = false;
        showAlertUi(true, "Please fill the required fields");
      }
    });

    if (formValidationsPassedCheck) {
      if (buttonDisabled === false) {
        setButtonDisabled(true);
      }
      // const addressValidateBody = {
      //   line1: formData.business_address,
      //   city: formData.city,
      //   region: formData.state,
      //   country: formData.country,
      //   postalCode: formData.zip_code,
      // };
      document.getElementById("app-loader-container").style.display = "block";
      // const validateAddress = await SetupApiUtil.validateAddress(
      //   addressValidateBody
      // );
      // if (validateAddress.hasError) {
      //   document.getElementById("app-loader-container").style.display = "none";
      //   setButtonDisabled(false);
      //   return showAlertUi(true, validateAddress.errorMessage.message);
      // }
      let addOutletPostData = {};
      addOutletPostData.name = name;
      addOutletPostData.location = "US";
      addOutletPostData.currency_name = currency.name;
      addOutletPostData.currency_code = currency.code;
      addOutletPostData.currency_symbol = currency.symbol;
      addOutletPostData.template_id = template?.id;
      addOutletPostData.external_code = formData.external_code;
      addOutletPostData.configurations = [
        {
          is_super_admin: formData.is_super_admin,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          zip_code: formData.zip_code,
          business_address: formData.business_address,
          po_threshold: formData.po_threshold,
          str_threshold: formData.str_threshold,
          fabric_taxation: formData.fabric_taxation,
          po_threshold_value: formData.po_threshold_value,
          po_threshold_quantity: formData.po_threshold_quantity,
          str_threshold_quantity: formData.str_threshold_quantity,
          barcode_scanning: formData.barcode_scanning,
          barcode_for_str: formData.barcode_for_str,
          barcode_str_scanning_compulsory:
            formData.barcode_str_scanning_compulsory,
          barcode_str_hybrid: formData.barcode_str_hybrid,
          barcode_str_scan_by_carton: formData.barcode_str_scan_by_carton,
          barcode_str_without_scanning: formData.barcode_str_without_scanning,
          barcode_for_purchase_order: formData.barcode_for_purchase_order,
          barcode_scan_one_by_one: formData.barcode_scan_one_by_one,
          barcode_purchase_order_scanning_compulsory:
            formData.barcode_purchase_order_scanning_compulsory,
          barcode_purchase_order_hybrid: formData.barcode_purchase_order_hybrid,
          barcode_purchase_order_scan_by_carton:
            formData.barcode_purchase_order_scan_by_carton,
          barcode_purchase_order_without_scanning:
            formData.barcode_purchase_order_without_scanning,
            quantity_metric: formData.quantity_metric ? "yes" : 'no',
            decimal_point: formData.decimal_point,
        },
      ];

      document.getElementById("app-loader-container").style.display = "block";
      let addOutletResponse;
      if (outletId) {
        const updateBrandPutData = {
          ...addOutletPostData,
        };
        addOutletResponse = await SetupApiUtil.editOutlet(
          outletId,
          updateBrandPutData
        );
      } else {
        addOutletResponse = await SetupApiUtil.addOutlet(addOutletPostData);
      }

      if (addOutletResponse.hasError) {
        setButtonDisabled(false);
        document.getElementById("app-loader-container").style.display = "none";
        showAlertUi(true, addOutletResponse.errorMessage);
      } else {
        
        if(!isAuth && loginCacheData ) {
          loginCacheData.store_id = addOutletResponse?.store_id;
          saveDataIntoLocalStorage(Constants.USER_DETAILS_KEY, loginCacheData);
          const getOutletApiResponse =  await fetchOutletData(loginCacheData?.store_id);
          document.getElementById("app-loader-container").style.display = "none";
          loginCacheData.store_name = getOutletApiResponse?.name;
          loginCacheData.store_location = getOutletApiResponse?.location;
          loginCacheData.store_random = getOutletApiResponse?.store_random;
          loginCacheData.external_code = getOutletApiResponse?.external_code;
          if(loginCacheData?.brand_onboarding) {
            delete loginCacheData['brand_onboarding'];
          }
          if(loginCacheData?.outlet_onboarding) {
            delete loginCacheData['outlet_onboarding'];
          }
          saveDataIntoLocalStorage(Constants.USER_DETAILS_KEY, loginCacheData);
          setTimeout(() => {
            history.push({
              pathname: '/dashboard',
            });
          }, 500);
        }
        else {
          setTimeout(() => {
            history.push({
              pathname: "/setup/outlets",
              activeKey: "outlets",
            });
          }, 500);
        }
      }
    }
  };


  const fetchOutletData = async (outletId) => {
    //document.getElementById('app-loader-container').style.display = "block";
    const getOutletResponse = await SetupApiUtil.getOutletById(outletId);
    console.log('getOutletResponse', getOutletResponse)
    if (getOutletResponse.hasError) {
      console.log('Cant fetch Outlets Data -> ', getOutletResponse.errorMessage);
      document.getElementById('app-loader-container').style.display = "none";
      showAlertUi(true, getOutletResponse.errorMessage);
    }
    else {
      return getOutletResponse?.store;
      //document.getElementById('app-loader-container').style.display = "none";

    }
  }


  useEffect(() => {
    let readFromLocalStorage = getDataFromLocalStorage(Constants.USER_DETAILS_KEY);
    readFromLocalStorage = readFromLocalStorage.data ? readFromLocalStorage.data : null;
    loginCacheData = readFromLocalStorage;

    if (outletId && Object.keys(initialData)?.length > 0) {
      const config =
        initialData?.configuration?.length > 0
          ? initialData?.configuration[0]
          : {};
      setFormData({
        name: initialData?.name || "",
        currency: {
          name: initialData?.currency_name || "",
          code: initialData?.currency_code || "",
          symbol: initialData?.currency_symbol || "",
        },
        external_code: initialData?.external_code || "",
        country: config?.country || "",
        template: {},
        city: config?.city || "",
        state: config?.state || "",
        is_super_admin: config?.is_super_admin || false,
        zip_code: config?.zip_code || "",
        business_address: config?.business_address || "",
        po_threshold: config?.po_threshold || false,
        str_threshold: config?.str_threshold || false,
        fabric_taxation: config?.fabric_taxation || false,
        po_threshold_value: config?.po_threshold_value || 0,
        po_threshold_quantity: config?.po_threshold_quantity || 0,
        str_threshold_quantity: config?.str_threshold_quantity || 0,
        barcode_scanning: config?.barcode_scanning || false,
        barcode_for_str: config?.barcode_for_str || false,
        barcode_str_scanning_compulsory:
          config?.barcode_str_scanning_compulsory || false,
        barcode_str_hybrid: config?.barcode_str_hybrid || false,
        barcode_str_scan_by_carton: config?.barcode_str_scan_by_carton || false,
        barcode_str_without_scanning:
          config?.barcode_str_without_scanning || false,
        barcode_for_purchase_order: config?.barcode_for_purchase_order || false,
        barcode_scan_one_by_one: config?.barcode_scan_one_by_one || false,
        barcode_purchase_order_scanning_compulsory:
          config?.barcode_purchase_order_scanning_compulsory || false,
        barcode_purchase_order_hybrid:
          config?.barcode_purchase_order_hybrid || false,
        barcode_purchase_order_scan_by_carton:
          config?.barcode_purchase_order_scan_by_carton || false,
        barcode_purchase_order_without_scanning:
          config?.barcode_purchase_order_without_scanning || false,
          quantity_metric: config?.quantity_metric === "yes" ? true : false || false,
          decimal_point: config?.decimal_point || Constants.DECIMAL_POINTS[0],
      });
    }
  }, [outletId, initialData]);
  const handletabChange = () => {};
  return (
    <div className={`page  ${outletId && "edit_outlet"}`}>
      <div className="page__top">
        <SwitchOutlet />
        {isAuth && <ButtonBack text="Back to Outlets" link="/setup/outlets" />}
        {!isAuth && <ButtonBack text="Back to Outlets" link="/brands" />}
        
      </div>

      <div class="page__body">
        <section className="page__header">
          <h1 className="heading heading--primary">{heading}</h1>
          {/* {!outletId ? ( */}
          <CustomButtonWithIcon
            size="small"
            isPrimary={true}
            text={buttonText}
            disabled={buttonDisabled}
            onClick={onFormSubmit}
          />
          {/* ) : null} */}
        </section>
        <section className="page__tabs">
          <Tab
            {...props}
            variant="horizontal"
            heading=""
            navClassName="tabitem-space"
            tabChangeHandler={handletabChange}
          >
            <TabItem
              title="General Information"
              // active={activeKey && activeKey === Constants.SETUP.OUTLETS_TAB_KEY}
            >
              <GeneralInfoForm
                outletId={outletId}
                formData={formData}
                formErrorsData={formErrorsData}
                handleFormChange={handleFormChange}
                setFormData={setFormData}
                setFormErrorsData={setFormErrorsData}
                initialData={initialData}
                isAuth={isAuth}
                isEdit={isEdit}
              />
            </TabItem>
            <TabItem
              title="Super Admin Config"
              // active={activeKey && activeKey === Constants.SETUP.OUTLETS_TAB_KEY}
            >
              <SuperAdminForm
                outletId={outletId}
                formData={formData}
                formErrorsData={formErrorsData}
                handleFormChange={handleFormChange}
                setFormData={setFormData}
                setFormErrorsData={setFormErrorsData}
                initialData={initialData}
              />
            </TabItem>
            {/* <TabItem
              title="Bar-code Config"
              // active={activeKey && activeKey === Constants.SETUP.OUTLETS_TAB_KEY}
            >
              <BarcodeForm
                outletId={outletId}
                formData={formData}
                formErrorsData={formErrorsData}
                handleFormChange={handleFormChange}
                setFormData={setFormData}
                setFormErrorsData={setFormErrorsData}
                initialData={initialData}
              />
            </TabItem> */}
            <TabItem
              title="Tax Config"
              // active={activeKey && activeKey === Constants.SETUP.OUTLETS_TAB_KEY}
            >
              <TaxForm
                outletId={outletId}
                formData={formData}
                formErrorsData={formErrorsData}
                handleFormChange={handleFormChange}
                setFormData={setFormData}
                setFormErrorsData={setFormErrorsData}
                initialData={initialData}
              />
            </TabItem>
            <TabItem
              title="Product Config"
              // active={activeKey && activeKey === Constants.SETUP.OUTLETS_TAB_KEY}
            >
              <ProductForm 
                outletId={outletId}
                formData={formData}
                formErrorsData={formErrorsData}
                handleFormChange={handleFormChange}
                setFormData={setFormData}
                setFormErrorsData={setFormErrorsData}
                initialData={initialData}
              />
              </TabItem>
          </Tab>
        </section>
      </div>
    </div>
  );
}

export default OutletForm;
