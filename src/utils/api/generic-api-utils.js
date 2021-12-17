import axios from "axios";
import {
  getDataFromLocalStorage,
  clearLocalUserData,
} from "../local-storage/local-store-utils";
import Constants from "../constants/constants";
import UrlConstants from "../constants/url-configs";
import { isArray } from "lodash";

export const getUserAuthToken = () => {
  try {
    const localDataResponse = getDataFromLocalStorage(
      Constants.USER_DETAILS_KEY
    );
    return localDataResponse.data.auth_token;
  } catch (err) {
    return ""; //returning empty token in case not found
  }
};

export const getUserAuth = () => {
  try {
    const localDataResponse = getDataFromLocalStorage(
      Constants.USER_DETAILS_KEY
    );
    return localDataResponse.data;
  } catch (err) {
    return ""; //returning empty token in case not found
  }
};

export const http = async (
  apiUrl,
  callType, //POST or GET
  data,
  headers = {}
) => {
  try {
    const authToken = getUserAuthToken();
    const userAuth = getUserAuth();

    if(userAuth?.brand_id){
      headers["Brand_id"] = userAuth?.brand_id;
    }
    
    if(userAuth?.store_id){
      headers["Store_id"] = userAuth?.store_id;
    }
    
    if (
      apiUrl.includes(UrlConstants.CHECK_FABRIC_BASE_URL) ||
      apiUrl.includes(UrlConstants.CHECK_REPORTS_BASE_URL)
    ) {
      headers["Authorization"] = `Bearer ` + authToken;
    } else {
      headers["Authorization"] = authToken; //imp prev ver
    }
    
    const axiosCallObject = {
      method: callType,
      url: apiUrl,
      data: data,
      headers,
    };

    const axiosCallResponse = await axios(axiosCallObject);

    if (
      axiosCallResponse &&
      axiosCallResponse.data &&
      axiosCallResponse.data.status
    ) {
      return {
        hasError: false,
        authenticated: true,
        ...axiosCallResponse.data,
      };
    }

    let isUserAuthenticated = true;
    const errorMessageResponse =
      axiosCallResponse.data && axiosCallResponse.data.message;
    if (
      errorMessageResponse &&
      errorMessageResponse === "Authentication Failed"
    ) {
      isUserAuthenticated = false;
    }

    if (!isUserAuthenticated) {
      clearLocalUserData();
      window.location.href = "/pos/login";
    }

    return {
      hasError: true,
      errorMessage:
        (axiosCallResponse.data && axiosCallResponse.data.message) ||
        "Unable to complete the request",
      authenticated: isUserAuthenticated,
    };
  } catch (err) {
    console.log("error while calling api", err);
    const errorMessage =
      err?.response?.data?.data ||
      err?.response?.data?.message ||
      err?.response?.data?.data?.message ||
      "Unable to complete the request";
    //as we are not sure here that cause of API failure is due to authentication
    //or something else
    //that is why we are assuming user is currently authenticated

    //Currently in api endpoints all requests are returned with 200 status
    //irrespective of their state (unauthentication or error)
    return {
      hasError: true,
      errorMessage: errorMessage,
      authenticated: true,
    };
  }
};

export const http_sandbox = async (
  apiUrl,
  callType, //POST or GET
  data,
  headers = {},
  token = ""
) => {
  try {
    const authToken = getUserAuthToken();
    const userAuth = getUserAuth();

    if (userAuth?.brand_id) {
      headers["Brand_id"] = userAuth?.brand_id;
    }
    
    if(userAuth?.store_id){
      headers["Store_id"] = userAuth?.store_id;
    }

    if (token === UrlConstants.TOKEN.FABRIC_TOKEN) {
      headers["Authorization"] = `Bearer ${authToken}`;
    } else if (token === UrlConstants.TOKEN.FABRIC_ACCESS_TOKEN) {
      headers["Authorization"] = `Bearer ${localStorage.accessToken}`;
    } else if (apiUrl.includes(UrlConstants.CHECK_FABRIC_BASE_URL)) {
      headers["Authorization"] = `Bearer ` + authToken;
    }

    const axiosCallObject = {
      method: callType,
      url: apiUrl,
      data: data,
      headers,
    };

    const axiosCallResponse = await axios(axiosCallObject);
    if (
      axiosCallResponse &&
      axiosCallResponse.data &&
      axiosCallResponse.data.success
    ) {
      return {
        hasError: false,
        authenticated: true,
        ...axiosCallResponse.data,
      };
    }
    let isUserAuthenticated = true;
    const isAxiosData = axiosCallResponse.data.data;
    const errorMessageResponse =
      isAxiosData &&
      (isAxiosData ||
        isAxiosData.detail ||
        isAxiosData.message ||
        isAxiosData?.data?.message);
    if (
      errorMessageResponse &&
      errorMessageResponse === "Authentication Failed"
    ) {
      isUserAuthenticated = false;
    }

    if (!isUserAuthenticated) {
      clearLocalUserData();
      window.location.href = "/pos/login";
    }
    const errorMessage =
      isAxiosData &&
      (isAxiosData.detail ||
        isAxiosData.message ||
        "Unable to complete the request");
    return {
      hasError: true,
      errorMessage: errorMessage,
      authenticated: isUserAuthenticated,
    };
  } catch (err) {
    const isArrayData = isArray(err?.response?.data?.data);
    const errorMessage = isArrayData && err?.response?.data?.data.length > 0
      ? err?.response?.data?.data[0]?.message
      : Object.keys(!isArrayData ? err?.response?.data?.data || {} : {}).length > 0 ? 
        err?.response?.data?.data?.message : 
        err?.response?.data?.detail ||
        err?.response?.data?.message?.message ||
        err?.response?.data?.message ||
        "Unable to complete the request";
    //as we are not sure here that cause of API failure is due to authentication
    //or something else
    //that is why we are assuming user is currently authenticated

    //Currently in api endpoints all requests are returned with 200 status
    //irrespective of their state (unauthentication or error)
    return {
      hasError: true,
      errorMessage: errorMessage,
      authenticated: true,
    };
  }
};

export const http_order = async (
  apiUrl,
  callType, //POST or GET
  data,
  headers = {}
) => {
  try {
    let readFromLocalStorage = getDataFromLocalStorage(
      Constants.USER_DETAILS_KEY
    );
    readFromLocalStorage = readFromLocalStorage?.data || null;
    const storeId = readFromLocalStorage?.auth?.Store_info?.external_code;
    const brandId = readFromLocalStorage?.brand_id;
    const authToken = getUserAuthToken();
    headers = {
      ...headers,
      Authorization: `${authToken}`,
      client_type: "shopdesk",
      brand_id: brandId,
      store_id: storeId,
    };

    const axiosCallObject = {
      method: callType,
      url: apiUrl,
      data: data,
      headers,
    };

    const axiosCallResponse = await axios(axiosCallObject);
    console.log("axiosCallResponse", axiosCallResponse)
    if (
      axiosCallResponse &&
      (axiosCallResponse.status === 200 ||
      axiosCallResponse.status === 201)
    ) {
      return {
        hasError: false,
        authenticated: true,
        ...axiosCallResponse.data,
      };
    }
    let isUserAuthenticated = true;
    const isAxiosData = axiosCallResponse.data.data;
    const errorMessageResponse =
      isAxiosData &&
      (isAxiosData ||
        isAxiosData.detail ||
        isAxiosData.message ||
        isAxiosData?.data?.message);
    if (
      errorMessageResponse &&
      errorMessageResponse === "Authentication Failed"
    ) {
      isUserAuthenticated = false;
    }

    if (!isUserAuthenticated) {
      clearLocalUserData();
      window.location.href = "/pos/login";
    }
    const errorMessage =
      isAxiosData && (isAxiosData.message || "Unable to complete the request");
    return {
      hasError: true,
      errorMessage: errorMessage,
      authenticated: isUserAuthenticated,
    };
  } catch (err) {
    const errorMessage =
      err?.response?.data?.messages[0]?.message ||
      err?.response?.data?.data?.message ||
      "Unable to complete the request";
    //as we are not sure here that cause of API failure is due to authentication
    //or something else
    //that is why we are assuming user is currently authenticated

    //Currently in api endpoints all requests are returned with 200 status
    //irrespective of their state (unauthentication or error)
    return {
      hasError: true,
      errorMessage: errorMessage,
      authenticated: true,
    };
  }
};

export const constructFormData = (objectWithKeyValuePairs) => {
  const formData = new FormData();

  Object.entries(objectWithKeyValuePairs).forEach(
    ([formDataKey, formDataValue]) => {
      formData.append(formDataKey, formDataValue);
    }
  );

  return formData;
};

export const constructParamsData = (objectWithKeyValuePairs) => {
  let params;
  Object.entries(objectWithKeyValuePairs).forEach(
    ([paramsKey, paramsValue]) => {
      if (params) {
        params = params + `&${paramsKey}=${paramsValue}`;
      } else {
        params = `${paramsKey}=${paramsValue}`;
      }
    }
  );
  return params;
};
