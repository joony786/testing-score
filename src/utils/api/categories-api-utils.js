
import UrlConstants from '../constants/url-configs';
import GenericConstants from '../constants/constants';
import * as ApiCallUtil from './generic-api-utils';


export const addCategory = async (addCategoryBody) => {

  const url = UrlConstants.CATEGORIES.ADD_CATEGORY;
  const callType = GenericConstants.API_CALL_TYPE.POST;

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
    addCategoryBody, //body
  );
};


export const searchCategories = async (limit, PageNumber, searchvalue, searchByKeyword) => {

  const url = UrlConstants.CATEGORIES.SEARCH + `?name=${searchvalue}&limit=${limit}&page=${PageNumber}&search=${searchByKeyword}`;
  const callType = GenericConstants.API_CALL_TYPE.GET;

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
  );
};








export const viewCategories = async (limit, PageNumber) => {
  
    const url = UrlConstants.CATEGORIES.VIEW + `?limit=${limit}&page=${PageNumber}`;
    const callType = GenericConstants.API_CALL_TYPE.GET;
  
    return await ApiCallUtil.http(
      url, //api url
      callType, //calltype
    );
};


export const viewAllCategories = async () => {

    const url = UrlConstants.CATEGORIES.VIEW_ALL;
    const callType = GenericConstants.API_CALL_TYPE.POST;
  
    return await ApiCallUtil.http(
      url, //api url
      callType, //calltype
    );
};


export const deleteCategory = async (categoryId) => {
  
  const url = UrlConstants.CATEGORIES.DELETE_CATEGORY  + `/${categoryId}`;
  const callType = GenericConstants.API_CALL_TYPE.DELETE;

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
  );
};

export const editCategory = async (categoryId, categoryName, parentCategoryId ) => {

  const editCategoryBody = {
    name: categoryName,
    parent_category_id: parentCategoryId,
  };

  const url = UrlConstants.CATEGORIES.EDIT_CATEGORY  + `/${categoryId}`;
  const callType = GenericConstants.API_CALL_TYPE.PUT;
  const headers = {'Content-Type': 'application/json'};

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
    editCategoryBody, //body
    headers
  );
};


export const getCategory = async (categoryId) => {
  
  const url = UrlConstants.CATEGORIES.GET_CATEGORY + `?id=${categoryId}`;
  const callType = GenericConstants.API_CALL_TYPE.GET;

  return await ApiCallUtil.http(
      url, //api url
      callType, //calltype
  );
};
