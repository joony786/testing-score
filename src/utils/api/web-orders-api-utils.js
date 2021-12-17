import UrlConstants from "../constants/url-configs";
import GenericConstants from "../constants/constants";
import * as ApiCallUtil from "./generic-api-utils";
import axios from "axios";
import Constants from "../constants/constants";

export const searchCustomer = async (data) => {
  const url = UrlConstants.WEB_ORDERS.SEARCH_CUSTOMERS;
  const callType = GenericConstants.API_CALL_TYPE.POST;
  const token = UrlConstants.TOKEN.FABRIC_ACCESS_TOKEN;

  return await ApiCallUtil.http_sandbox(
    url, //api url
    callType, //calltype
    data, //body
    {},
    token
  );
};

export const createCustomer = async (data) => {
  const url = UrlConstants.WEB_ORDERS.CREATE_CUSTOMER;
  const callType = GenericConstants.API_CALL_TYPE.POST;
  const token = UrlConstants.TOKEN.FABRIC_TOKEN;
  return await ApiCallUtil.http_sandbox(
    url, //api url
    callType, //calltype
    data, //body
    {},
    token
  );
};

export const createAddress = async (data, customerId) => {
  const url = UrlConstants.WEB_ORDERS.CREATE_ADDRESS + `/${customerId}`;
  const callType = GenericConstants.API_CALL_TYPE.POST;
  const token = UrlConstants.TOKEN.FABRIC_TOKEN;
  return await ApiCallUtil.http_sandbox(
    url, //api url
    callType, //calltype
    data, //body
    {},
    token
  );
};

export const getShippingMethods = async (data) => {
  const url = UrlConstants.WEB_ORDERS.GET_SHIPPING_METHODS;
  const callType = GenericConstants.API_CALL_TYPE.GET;
  const token = UrlConstants.TOKEN.FABRIC_TOKEN;
  return await ApiCallUtil.http_sandbox(
    url, //api url
    callType, //calltype
    data, //body
    {},
    token
  );
};

export const getProductDiscount = async (data) => {
  const url = UrlConstants.WEB_ORDERS.GET_PRODUCT_DISCOUNT;
  const callType = GenericConstants.API_CALL_TYPE.GET;
  const token = UrlConstants.TOKEN.FABRIC_TOKEN;
  return await ApiCallUtil.http_sandbox(
    url, //api url
    callType, //calltype
    data, //body
    {},
    token
  );
};

export const createWebOrder = async (data) => {
  const url = UrlConstants.WEB_ORDERS.CREATE_WEB_ORDER;
  const callType = GenericConstants.API_CALL_TYPE.POST;
  const token = UrlConstants.TOKEN.FABRIC_TOKEN;
  return await ApiCallUtil.http_sandbox(
    url, //api url
    callType, //calltype
    data, //body
    {},
    token
  );
};

export const getPromotions = async (data) => {
  const url = UrlConstants.WEB_ORDERS.GET_PROMOTIONS;
  const callType = GenericConstants.API_CALL_TYPE.POST;
  const token = UrlConstants.TOKEN.FABRIC_TOKEN;
  return await ApiCallUtil.http_sandbox(
    url, //api url
    callType, //calltype
    data, //body
    {},
    token
  );
};

export const getCouponDiscount = async (data) => {
  const url = UrlConstants.WEB_ORDERS.GET_COUPONS_DISCOUNT;
  const callType = GenericConstants.API_CALL_TYPE.POST;
  const token = UrlConstants.TOKEN.FABRIC_TOKEN;
  return await ApiCallUtil.http_sandbox(
    url, //api url
    callType, //calltype
    data, //body
    {},
    token
  );
};

export const getOfferPrice = async (data) => {
  const url = UrlConstants.WEB_ORDERS.GET_SALE_OFFER;
  const callType = GenericConstants.API_CALL_TYPE.POST;
  const token = UrlConstants.TOKEN.FABRIC_TOKEN;
  return await ApiCallUtil.http_sandbox(
    url, //api url
    callType, //calltype
    data, //body
    {},
    token
  );
};

export const getWebOrderById = async (dataToFind) => {
  const webOrderFormDataBody = ApiCallUtil.constructParamsData(dataToFind);
  const url = UrlConstants.WEB_ORDERS.WMS_GET_WEB_ORDER + `?${webOrderFormDataBody}`;
  const callType = GenericConstants.API_CALL_TYPE.GET;
  const token = UrlConstants.TOKEN.FABRIC_TOKEN;
  return await ApiCallUtil.http_sandbox(
    url, //api url
    callType, //calltype
    {}, //body
    {},
    token
  );
};

export const returnWebOrder = async (data) => {
  const url = UrlConstants.WEB_ORDERS.RETURN_WEB_ORDER;
  const callType = GenericConstants.API_CALL_TYPE.PUT;
  const token = UrlConstants.TOKEN.FABRIC_TOKEN;
  return await ApiCallUtil.http_sandbox(
    url, //api url
    callType, //calltype
    data, //body
    {},
    token
  );
};

export const manualReturnWebOrder = async (orderData) => {
  const url = UrlConstants.WEB_ORDERS.MANUAL_RETURN_WEB_ORDER;
  const callType = GenericConstants.API_CALL_TYPE.POST;
  return await ApiCallUtil.http_order(url, callType, orderData);
};