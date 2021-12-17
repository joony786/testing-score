
import UrlConstants from '../constants/url-configs';
import GenericConstants from '../constants/constants';
import * as ApiCallUtil from './generic-api-utils';

export const addTax = async (taxName, taxValue) => {
  
  const formDataPair = {
    name: taxName,
    value: taxValue
  };
  const url = UrlConstants.TAX.ADD_TAX;
  const callType = GenericConstants.API_CALL_TYPE.POST;

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
    formDataPair //body
  );
};

export const deleteTax = async (taxId) => {
  const url = UrlConstants.TAX.DELETE_TAX + `/${taxId}`;
  const callType = GenericConstants.API_CALL_TYPE.DELETE;

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
  );
};

export const editTax = async (taxId, newTaxName, newTaxValue) => {
  const formDataPair = {
    name: newTaxName,
    value: newTaxValue
  };
  const url = UrlConstants.TAX.EDIT_TAX + `/${taxId}`;
  const callType = GenericConstants.API_CALL_TYPE.PUT;

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
    formDataPair //body
  );
};

export const viewTaxes = async (limit, PageNumber) => {
  const url = UrlConstants.TAX.VIEW + `?limit=${limit}&page=${PageNumber}`;
  const callType = GenericConstants.API_CALL_TYPE.GET;

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
  );
};


export const viewAllTaxes = async () => {
  const url = UrlConstants.TAX.VIEW_ALL;
  const callType = GenericConstants.API_CALL_TYPE.POST;

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
  );
};



export const searchTaxes = async (limit, PageNumber, searchvalue) => {

  //Pagination is not running in Revamp API
  const url = UrlConstants.TAX.SEARCH + `?name=${searchvalue}&limit=${limit}&page=${PageNumber}`;
  const callType = GenericConstants.API_CALL_TYPE.GET;

  return await ApiCallUtil.http(
      url, //api url
      callType, //calltype
  );
};



export const getTax = async (taxId) => {
  const url = UrlConstants.TAX.GET_TAX + `?id=${taxId}`;
  const callType = GenericConstants.API_CALL_TYPE.GET;

  return await ApiCallUtil.http(
      url, //api url
      callType, //calltype
  );
};
