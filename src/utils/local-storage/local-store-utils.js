import Constants from '../../utils/constants/constants';
import moment from 'moment';

export const clearLocalUserData = () => {
  clearKeyFromLocalStorage(Constants.USER_DETAILS_KEY);
  saveDataIntoLocalStorage(Constants.SELL_CURRENT_INVOICE_KEY, null);
};

export const saveDataIntoLocalStorage = (key, value) => {
  try {
    //window.localStorage.saveItem(key, JSON.stringify(value)); not working
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.log(
      'error while saving data with key',
      key,
      'and value',
      value,
      'into local storage'
    );
  }
};

export const getDataFromLocalStorage = (key) => {
  try {
    const dataFromLocalStorage = JSON.parse(window.localStorage.getItem(key));
    return {
      hasError: dataFromLocalStorage ? true : false,
      data: dataFromLocalStorage
    };
  } catch (err) {
    return {};
  }
};

export const clearDataFromLocalStorage = () => {
  localStorage.clear();
};


export const clearKeyFromLocalStorage = (key) => {
  localStorage.removeItem(key);
};


export const checkUserAuthFromLocalStorage = (key) => {
  const dataFromLocalStorage = JSON.parse(window.localStorage.getItem(key));
  return {
    authentication: (dataFromLocalStorage.hasOwnProperty(Constants.USER_BRAND_ID_KEY) &&
    dataFromLocalStorage.hasOwnProperty(Constants.USER_STORE_ID_KEY) )
     
  };
};

export const checkUserAuthBrandFromLocalStorage = (key) => {
  const dataFromLocalStorage = JSON.parse(window.localStorage.getItem(key));
  return {
    authentication: dataFromLocalStorage.hasOwnProperty('brand_onboarding')
  };
};

export const checkUserAuthOutletFromLocalStorage = (key) => {
  const dataFromLocalStorage = JSON.parse(window.localStorage.getItem(key));
  return {
    authentication: dataFromLocalStorage.hasOwnProperty('outlet_onboarding')
  };
};

/*export const updatedCheckUserAuthFromLocalStorage = (key) => {
  const dataFromLocalStorage = JSON.parse(window.localStorage.getItem(key));
  return {
    authentication: dataFromLocalStorage.hasOwnProperty(Constants.USER_AUTH_KEY)
  };
};*/

export const checkBrandAuthFromLocalStorage = (key) => {
  const dataFromLocalStorage = JSON.parse(window.localStorage.getItem(key));
  return {
    brandSelection: dataFromLocalStorage.hasOwnProperty(Constants.USER_BRAND_KEY)
  };
};

export const checkAuthTokenExpiration = (expirationDate) => {
  var currentDate = new Date();
  var authExpirationTokenDate;
  currentDate = moment(currentDate).format('yyyy-MM-DD HH:mm');
  authExpirationTokenDate = moment(expirationDate).format('yyyy-MM-DD HH:mm');
  if (currentDate > authExpirationTokenDate) {
    //clearDataFromLocalStorage();  //vimp previous version
    clearKeyFromLocalStorage(Constants.USER_DETAILS_KEY);
    return true;
  } else {
    return false;
  }
};

export const getSellInvoiceDataFromLocalStorage = (key) => {
  const dataFromLocalStorage = JSON.parse(window.localStorage.getItem(key));
  return {
    data: dataFromLocalStorage
  };
};
