import UrlConstants from '../constants/url-configs';
import GenericConstants from '../constants/constants';
import * as ApiCallUtil from './generic-api-utils';
import axios from 'axios';


export const viewCustomers = async (limit, page = 1) => {
 
  const url = UrlConstants.CUSTOMERS.VIEW + `?limit=${limit}&page=${page}`;
  const callType = GenericConstants.API_CALL_TYPE.GET;

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
  );
};

// api/customers/get
export const getSingleCustomer = async (customerId) => {

  const url = UrlConstants.CUSTOMERS.VIEW_SINGLE + `?id=${customerId}`;
  const callType = GenericConstants.API_CALL_TYPE.GET;

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
  );
};



export const searchCustomers = async (limit, PageNumber, searchvalue) => {

  const url = UrlConstants.CUSTOMERS.SEARCH + `?name=${searchvalue}&limit=${limit}&page=${PageNumber}`;
  const callType = GenericConstants.API_CALL_TYPE.GET;

  return await ApiCallUtil.http(
      url, //api url
      callType, //calltype
  );
};



export const updateUserDetails = async (newCustomerData) => {

  const updateCustomerBody = {
    name: newCustomerData.name,
    email: newCustomerData.email,
    phone: newCustomerData.phone,
    gender: newCustomerData.gender,
  };

  const url = UrlConstants.CUSTOMERS.EDIT_CUSTOMER + `/${newCustomerData.id}`;
  const callType = GenericConstants.API_CALL_TYPE.PUT;
  const headers = {'Content-Type': 'application/json'};

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
    updateCustomerBody, //body
    headers,
  );
};

export const rechargeCustomerAccount = async (customerData, paymetInfo) => {

  const updateCustomerBody = {
    customer_id: customerData.id,
    method: paymetInfo.type,
    balance: paymetInfo.amount,
  };

  const url = UrlConstants.CUSTOMERS.RECHARGE;
  const callType = GenericConstants.API_CALL_TYPE.POST;
  const headers = {'Content-Type': 'application/json'};

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
    updateCustomerBody, //body
    headers,
  );
};


export const customerCreditDetails = async (customerId) => {
 
  
  const url = UrlConstants.CUSTOMERS.CREDIT_HISTORY + `/${customerId}`;
  const callType = GenericConstants.API_CALL_TYPE.GET;

  return await ApiCallUtil.http(
    url,
    callType, 
  
  );
}



export const searchCustomer = async (searchValue) => {
  const url = UrlConstants.CUSTOMERS.SEARCH + `?name=${searchValue}`;
  const callType = GenericConstants.API_CALL_TYPE.GET;

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
  );
}


export const deleteCustomer = async (customerId) => {
  
  const url = UrlConstants.CUSTOMERS.DELETE +`/${customerId}`;
  const callType = GenericConstants.API_CALL_TYPE.DELETE;

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
  );
}


export const addCustomer = async (newCustomerData) => {

  const addNewCustomerBody = {
    name: newCustomerData.name,
    email: newCustomerData.email,
    phone: newCustomerData.phone,
    gender: newCustomerData.gender,
    balance: newCustomerData.balance
  };


  const url = UrlConstants.CUSTOMERS.ADD_CUSTOMER;
  const callType = GenericConstants.API_CALL_TYPE.POST;
  const headers = {'Content-Type': 'application/json'};

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
    addNewCustomerBody, //body
    headers,
  );
};


export const getUserId = async () => {
    
  const url = UrlConstants.CUSTOMERS.GET_USER;
  const callType = GenericConstants.API_CALL_TYPE.GET;

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
  );
};



export const exportCustomers = async () => {

  const userAuth = ApiCallUtil.getUserAuth();
  
  const url = UrlConstants.CUSTOMERS.EXPORT;
  let headers = {
      'Authorization': `Bearer ${ApiCallUtil.getUserAuthToken()}`,
  };

  if (userAuth?.brand_id) {
    headers["brand_id"] = userAuth?.brand_id;
  }
  
  if(userAuth?.store_id){
    headers["store_id"] = userAuth?.store_id;
  }


  return await axios.get(url, {
      headers: headers
  })
      .then(async (res) => {
        let responseData = res?.data;
        if(responseData?.success) {
          console.log('Customers Export Data Response -> ', responseData);
          return { hasError: false, message: "Customers Data Succesfully Exported", ...responseData };
        }
        else {
          console.log('Cannot Export Customers Data Response -> ', responseData);
          return { hasError: true, errorMessage: responseData.message };
        }

      })
      .catch((err) => {
          console.log("AXIOS ERROR: ", err);
          const errorMessage =
                err?.response?.data?.message ||
                err?.response?.data?.data?.message ||
                "Unable to complete the request";
          return { hasError: true, errorMessage: errorMessage };

      })

};


