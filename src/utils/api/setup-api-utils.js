import UrlConstants from "../constants/url-configs";
import GenericConstants from "../constants/constants";
import * as ApiCallUtil from "./generic-api-utils";

export const viewOutlets = async (limit, PageNumber) => {
  const url =
    UrlConstants.SETUP.VIEW_OUTLETS + `?limit=${limit}&page=${PageNumber}`;
  const callType = GenericConstants.API_CALL_TYPE.GET;

  return await ApiCallUtil.http(
    url, //api url
    callType //calltype
  );
};

export const viewAllOutlets = async () => {
  const url = UrlConstants.SETUP.VIEW_ALL;
  const callType = GenericConstants.API_CALL_TYPE.POST;

  return await ApiCallUtil.http(
    url, //api url
    callType //calltype
  );
};

export const viewAllBrandsStores = async () => {
  const url = UrlConstants.SETUP.VIEW_BRANDS_STORES;
  const callType = GenericConstants.API_CALL_TYPE.GET;

  return await ApiCallUtil.http(
    url, //api url
    callType //calltype
  );
};

export const addOutlet = async (addOutletData) => {
  const url = UrlConstants.SETUP.ADD_OUTLET;
  const callType = GenericConstants.API_CALL_TYPE.POST;
  const headers = { "Content-Type": "application/json" };

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
    addOutletData, //body
    headers
  );
};

export const editOutlet = async (outletId, editOutletData) => {
  const url = UrlConstants.SETUP.EDIT_OUTLET + `/${outletId}`;
  const callType = GenericConstants.API_CALL_TYPE.PUT;
  const headers = { "Content-Type": "application/json" };

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
    editOutletData, //body
    headers
  );
};

export const getOutlet = async (storeId) => {
  const formDataPair = {
    store_id: storeId,
  };

  const getOutletFormDataBody = ApiCallUtil.constructFormData(formDataPair);
  const url = UrlConstants.SETUP.GET_OUTLET;
  const callType = GenericConstants.API_CALL_TYPE.POST;

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
    getOutletFormDataBody //body
  );
};

export const getOutletById = async (storeId) => {
  const url = UrlConstants.SETUP.GET_OUTLET + `?id=${storeId}`;
  const callType = GenericConstants.API_CALL_TYPE.GET;

  return await ApiCallUtil.http(
    url, //api url
    callType //calltype
  );
};

export const deleteOutlet = async (outletId) => {
  const url = UrlConstants.SETUP.DELETE_OUTLET + `/${outletId}`;
  const callType = GenericConstants.API_CALL_TYPE.DELETE;
  const headers = { "Content-Type": "application/json" };

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
    headers
  );
};

export const userLoginForNewApiKey = async (refreshToken, neverExpire) => {
  const formDataPair = {
    refresh: refreshToken,
    never_expire: neverExpire,
  };

  const LoginForNewApiKeyFormDataBody =
    ApiCallUtil.constructFormData(formDataPair);
  const url = UrlConstants.AUTH.LOGIN;
  const callType = GenericConstants.API_CALL_TYPE.POST;

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
    LoginForNewApiKeyFormDataBody //body
  );
};

export const selectOutletForNewApiKey = async (storeRandomId) => {
  const formDataPair = {
    store_random: storeRandomId,
    type: GenericConstants.X_API_KEY,
  };

  const selectOutletFormDataBody = ApiCallUtil.constructFormData(formDataPair);
  const url = UrlConstants.OULETS.SELECT_OUTLET;
  const callType = GenericConstants.API_CALL_TYPE.POST;

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
    selectOutletFormDataBody //body
  );
};

export const viewAllUsers = async (limit, PageNumber) => {
  const url =
    UrlConstants.SETUP.VIEW_USERS + `?limit=${limit}&page=${PageNumber}`;
  const callType = GenericConstants.API_CALL_TYPE.GET;
  return await ApiCallUtil.http(
    url, //api url
    callType //calltype
  );
};

export const viewUserById = async (userId) => {
  const url = UrlConstants.SETUP.VIEW_USERS + `?id=${userId}`;
  const callType = GenericConstants.API_CALL_TYPE.GET;
  return await ApiCallUtil.http(
    url, //api url
    callType //calltype
  );
};

export const addUser = async (addUserData) => {
  const url = UrlConstants.SETUP.ADD_USER;
  const callType = GenericConstants.API_CALL_TYPE.POST;

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
    addUserData //body
  );
};

export const editUser = async (userId, editUserData) => {
  const url = UrlConstants.SETUP.EDIT_USER + `/${userId}`;
  const callType = GenericConstants.API_CALL_TYPE.PUT;

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
    editUserData //body
  );
};

export const getUser = async (userId) => {
  const formDataPair = {
    user_id: userId,
  };

  const getUserFormDataBody = ApiCallUtil.constructFormData(formDataPair);
  const url = UrlConstants.SETUP.GET_USER;
  const callType = GenericConstants.API_CALL_TYPE.POST;

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
    getUserFormDataBody //body
  );
};

export const getUsername = async () => {
  const url = UrlConstants.SETUP.GET_USERNAME;
  const callType = GenericConstants.API_CALL_TYPE.POST;

  return await ApiCallUtil.http(
    url, //api url
    callType //calltype
  );
};

export const viewTemplates = async (limit, PageNumber) => {
  const formDataPair = {
    limit: limit,
    page: PageNumber,
  };

  const viewTemplatesFormDataBody = ApiCallUtil.constructFormData(formDataPair);
  const url = UrlConstants.SETUP.VIEW_TEMPLATES;
  const callType = GenericConstants.API_CALL_TYPE.GET;

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
    viewTemplatesFormDataBody //body
  );
};

export const viewAllTemplates = async () => {
  const url = UrlConstants.SETUP.VIEW_ALL_TEMPLATES;
  const callType = GenericConstants.API_CALL_TYPE.POST;

  return await ApiCallUtil.http(
    url, //api url
    callType //calltype
  );
};

export const getTemplate = async (templateId) => {
  const formDataPair = {
    template_id: templateId,
  };

  const getTemplateFormDataBody = ApiCallUtil.constructFormData(formDataPair);
  const url = UrlConstants.SETUP.GET_TEMPLATE;
  const callType = GenericConstants.API_CALL_TYPE.POST;

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
    getTemplateFormDataBody //body
  );
};

export const getTemplateById = async (templateId) => {
  const url = UrlConstants.SETUP.GET_TEMPLATE + `?id=${templateId}`;
  const callType = GenericConstants.API_CALL_TYPE.GET;

  return await ApiCallUtil.http(
    url, //api url
    callType //calltype
  );
};

export const editTemplate = async (templateId, editTemplateData) => {
  const url = UrlConstants.SETUP.EDIT_TEMPLATE + `/${templateId}`;
  const callType = GenericConstants.API_CALL_TYPE.PUT;
  const headers = { "Content-Type": "application/json" };

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
    editTemplateData, //body
    headers
  );
};

export const deleteTemplate = async (TemplateId) => {
  const url = UrlConstants.SETUP.DELETE_TEMPLATE + `/${TemplateId}`;
  const callType = GenericConstants.API_CALL_TYPE.DELETE;

  return await ApiCallUtil.http(
    url, //api url
    callType //calltype
  );
};

export const addTemplate = async (addTemplateData) => {
  const url = UrlConstants.SETUP.ADD_TEMPLATE;
  const callType = GenericConstants.API_CALL_TYPE.POST;
  const headers = { "Content-Type": "application/json" };

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
    addTemplateData, //body
    headers
  );
};

export const searchTemplates = async (dataToFind) => {
  const templatesParams = ApiCallUtil.constructParamsData(dataToFind);
  const url = UrlConstants.SETUP.ADD_TEMPLATE + `?${templatesParams}`;
  const callType = GenericConstants.API_CALL_TYPE.GET;

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
  );
};

export const addWebHook = async (webHookName) => {
  const formDataPair = {
    url: webHookName,
  };

  const addWebHookFormDataBody = ApiCallUtil.constructFormData(formDataPair);
  const url = UrlConstants.SETUP.WEB_HOOKS.ADD;
  const callType = GenericConstants.API_CALL_TYPE.POST;

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
    addWebHookFormDataBody //body
  );
};

export const getWebHooks = async (limit, pageNumber) => {
  const formDataPair = {
    limit: limit,
    page: pageNumber,
  };
  const getWebHooksFormDataBody = ApiCallUtil.constructFormData(formDataPair);
  const url = UrlConstants.SETUP.WEB_HOOKS.GET;
  const callType = GenericConstants.API_CALL_TYPE.POST;

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
    getWebHooksFormDataBody //body
  );
};

export const deleteWebHook = async (webHookId) => {
  const url = UrlConstants.SETUP.WEB_HOOKS.DELETE + `/${webHookId}`;
  const callType = GenericConstants.API_CALL_TYPE.POST;

  return await ApiCallUtil.http(
    url, //api url
    callType //calltype
  );
};

export const addOeKey = async (omniSettingsData) => {
  const formDataPair = {
    "keys[brand]": omniSettingsData.brand,
    "keys[location]": omniSettingsData.location,
  };

  const addOeKeyFormDataBody = ApiCallUtil.constructFormData(formDataPair);
  const url = UrlConstants.SETUP.OMNI.ADD_OE_KEY;
  const callType = GenericConstants.API_CALL_TYPE.POST;

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
    addOeKeyFormDataBody //body
  );
};

export const viewUserRoles = async (limit, PageNumber) => {
  const url =
    UrlConstants.SETUP.VIEW_USER_ROLES + `?limit=${limit}&page=${PageNumber}`;
  const callType = GenericConstants.API_CALL_TYPE.GET;

  return await ApiCallUtil.http(
    url, //api url
    callType //calltype
  );
};

export const getUserRoleById = async (roleId) => {
  const url = UrlConstants.SETUP.VIEW_USER_ROLES + `?id=${roleId}`;
  const callType = GenericConstants.API_CALL_TYPE.GET;

  return await ApiCallUtil.http(
    url, //api url
    callType //calltype
  );
};

export const addUserRole = async (addUserRoleData) => {
  const url = UrlConstants.SETUP.ADD_USER_ROLE;
  const callType = GenericConstants.API_CALL_TYPE.POST;
  const headers = { "Content-Type": "application/json" };

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
    addUserRoleData, //body
    headers
  );
};

export const editUserRole = async (roleId, editUserRoleData) => {
  const url = UrlConstants.SETUP.EDIT_USER_ROLE + `/${roleId}`;
  const callType = GenericConstants.API_CALL_TYPE.PUT;
  const headers = { "Content-Type": "application/json" };

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
    editUserRoleData, //body
    headers
  );
};

export const deleteRole = async (roleId) => {
  const url = UrlConstants.SETUP.DELETE_USER_ROLE + `/${roleId}`;
  const callType = GenericConstants.API_CALL_TYPE.DELETE;

  return await ApiCallUtil.http(
    url, //api url
    callType //calltype
  );
};

export const viewBrands = async (limit, PageNumber) => {
  const url =
    UrlConstants.SETUP.VIEW_BRANDS + `?limit=${limit}&page=${PageNumber}`;
  const callType = GenericConstants.API_CALL_TYPE.GET;

  return await ApiCallUtil.http(
    url, //api url
    callType //calltype
  );
};

export const getBrandById = async (brandId) => {
  const url = UrlConstants.SETUP.VIEW_BRANDS + `?id=${brandId}`;
  const callType = GenericConstants.API_CALL_TYPE.GET;

  return await ApiCallUtil.http(
    url, //api url
    callType //calltype
  );
};

export const addBrand = async (addBrandData) => {
  const url = UrlConstants.SETUP.ADD_BRAND;
  const callType = GenericConstants.API_CALL_TYPE.POST;
  const headers = { "Content-Type": "application/json" };

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
    addBrandData, //body
    headers
  );
};

export const editBrand = async (brandId, editBrandData) => {
  const url = UrlConstants.SETUP.EDIT_BRAND + `/${brandId}`;
  const callType = GenericConstants.API_CALL_TYPE.PUT;
  const headers = { "Content-Type": "application/json" };

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
    editBrandData, //body
    headers
  );
};

export const deleteBrand = async (brandId) => {
  const url = UrlConstants.SETUP.DELETE_BRAND + `/${brandId}`;
  const callType = GenericConstants.API_CALL_TYPE.DELETE;

  return await ApiCallUtil.http(
    url, //api url
    callType //calltype
  );
};

export const selectBrand = async (brandId) => {
  const selectBrandDataBody = {
    brand_id: brandId,
  };

  const url = UrlConstants.SETUP.SELECT_BRAND;
  const callType = GenericConstants.API_CALL_TYPE.POST;
  const headers = { "Content-Type": "application/json" };

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
    selectBrandDataBody,
    headers
  );
};

export const validateAddress = async (data) => {
  console.log("data", data)
  const url = UrlConstants.SETUP.VALIDATE_ADDRESS;
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
