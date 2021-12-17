import UrlConstants from "../constants/url-configs";
import GenericConstants from "../constants/constants";
import * as ApiCallUtil from "./generic-api-utils";
import axios, {AxiosError} from "axios";

export const viewSalesSummery = async (
  startDate,
  endDate,
  pageNumber,
  genericSearchPageLimit
) => {
  const url =
    UrlConstants.REPORTS.SALES_SUMMARY +
    `?startDate=${startDate}&endDate=${endDate}&page=${pageNumber}&size=${genericSearchPageLimit}`;
  // const callType = GenericConstants.API_CALL_TYPE.GET;
  const userAuth = ApiCallUtil.getUserAuth();

  let headers = {
    Authorization: `Bearer ${ApiCallUtil.getUserAuthToken()}`,
  };

  if(userAuth?.brand_id){
    headers["Brand_id"] = userAuth?.brand_id;
  }
  
  if(userAuth?.store_id){
    headers["Store_id"] = userAuth?.store_id;
  }

  return await axios
  .get(url, {
    headers: headers,
  })
  .then(async (res) => {
    let responseData = res?.data;
    if (responseData?.success) {
      console.log("Inventory Dump Import Data Response-> ", responseData);
      return {
        hasError: false,
        message: "Inventory Succesfully Exported",
        ...responseData,
      };
    } else {
      console.log("Cannot get viewSales -> ", responseData);
      return {
        hasError: true,
        errorMessage: responseData.message,
      };
    }
  })
  .catch((error) => {
    console.log("AXIOS ERROR: ", error?.response?.status);
    if(error?.response?.status === 404){
      return { hasError: true, errorMessage: 'No Invoice found' };

    }
   else return { hasError: true, errorMessage: error };


  });
};

  // return await ApiCallUtil.http(url, callType);
// };

export const downloadCsvFile = async (startDate, endDate) => {
  const url =
    UrlConstants.REPORTS.DOWNLOAD_SALES_SUMMARY +
    `?startDate=${startDate}&endDate=${endDate}`;

    const userAuth = ApiCallUtil.getUserAuth();
    let headers = {
      Authorization: `Bearer ${ApiCallUtil.getUserAuthToken()}`,
    };

    if(userAuth?.brand_id){
      headers["Brand_id"] = userAuth?.brand_id;
    }
    
    if(userAuth?.store_id){
      headers["Store_id"] = userAuth?.store_id;
    }

  
    return await axios
    .get(url, {
      headers: headers,
    })
    .then(async (res) => {
      let responseData = res?.data;
      if (responseData?.success) {
        console.log("sales summary download data response ", responseData);
        return {
          hasError: false,
          message: "Inventory downloaded",
          ...responseData,
        };
      } else {
        console.log("Cannot get sales  -> ", responseData);
        return {
          hasError: true,
          errorMessage: responseData.message,
        };
      }
    })
    .catch((error) => {
      if(error.response.status === 404){
        return { hasError: true, errorMessage: 'No Invoice found' };
  
      }
     else return { hasError: true, errorMessage: error };
  
  
    });
};

// categories

export const getAllCategories = async (all,limit,PageNumber) => {
  let url;
   if(all === 'all'){
     url = UrlConstants.CATEGORIES.SEARCH + `?limit=${limit}&page=${PageNumber}`;
   }
   else url = UrlConstants.CATEGORIES.SEARCH;
   const callType = GenericConstants.API_CALL_TYPE.GET;
 
   return await ApiCallUtil.http(
     url,
     callType,
   );
 };

 export const fetchCategoriesById = async (id) => {
  const  url = UrlConstants.REPORTS.GET_CATEGORY_BY_ID + `/${id}`;
    const callType = GenericConstants.API_CALL_TYPE.GET;
  
    return await ApiCallUtil.http(
      url,
      callType,
    );
  };

  export const downloadCategory = async (id)=> {
    const  url = UrlConstants.REPORTS.DOWNLOAD_CATEGORY + `/${id}`;
    const callType = GenericConstants.API_CALL_TYPE.GET;
  
    return await ApiCallUtil.http(
      url,
      callType,
    );
  }

export const viewCategoryWiseSalesSummery = async (startDate, endDate) => {
  const formDataPair = {
    startDate: startDate,
    finishDate: endDate,
  };
  const categoryWiseSalesSummeryFormDataBody =
    ApiCallUtil.constructFormData(formDataPair);
  const url = UrlConstants.REPORTS.CATEGORY_SALES_SUMMARY;
  const callType = GenericConstants.API_CALL_TYPE.POST;

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
    categoryWiseSalesSummeryFormDataBody //body
  );
};

export const viewPrductsInventory = async (
  startDate,
  endDate,
  currentPage,
  paginationLimit
) => {
  /*const url = UrlConstants.REPORTS.INVENTORY_DUMP + `?limit=${limit}&offset=${PageNumber}` ;
  const callType = GenericConstants.API_CALL_TYPE.GET;
 
  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
  );*/

  const userAuth = ApiCallUtil.getUserAuth();

  const url =
    UrlConstants.REPORTS.INVENTORY_DUMP;
    // `?startDate=${startDate}&endDate=${endDate}&page=${currentPage}&size=${100}`;
  let headers = {
    Authorization: `Bearer ${ApiCallUtil.getUserAuthToken()}`,
  };

  if (userAuth?.brand_id) {
    headers["brand_id"] = userAuth?.brand_id;
  }

  if (userAuth?.store_id) {
    headers["store_id"] = userAuth?.store_id;
  }


  return await axios
    .get(url, {
      headers: headers,
    })
    .then(async (res) => {
      console.log(res);
      let responseData = res?.data;
      if (responseData?.success) {
        //console.log('res -> ', responseData);
        return { hasError: false, ...responseData };
      } else {
        return {
          hasError: true,
          errorMessage: responseData.message,
          ...responseData,
        };
      }
    })
      .catch((err) => {
        console.log("AXIOS ERROR: ", err);
        const errorMessage =
            err?.response?.data?.detail ||
            err?.response?.data?.message ||
            err?.response?.data?.data?.message ||
            "Unable to complete the request";
        return { hasError: true, errorMessage: errorMessage };
    });
};

export const getStoreId = async () => {
  const url = UrlConstants.REPORTS.GET_STORE;
  const callType = GenericConstants.API_CALL_TYPE.GET;

  return await ApiCallUtil.http(
    url, //api url
    callType //calltype
  );
};

export const exportInventoryDumpData = async (startDate, endDate) => {

  const userAuth = ApiCallUtil.getUserAuth();

  const url =
    UrlConstants.REPORTS.EXPORT_INVENTORY_DUMP
    // `?startDate=${startDate}&endDate=${endDate}`;

  let headers = {
    Authorization: `Bearer ${ApiCallUtil.getUserAuthToken()}`,
  };

  if (userAuth?.brand_id) {
    headers["brand_id"] = userAuth?.brand_id;
  }

  if (userAuth?.store_id) {
    headers["store_id"] = userAuth?.store_id;
  }


  return await axios
    .get(url, {
      headers: headers,
    })
    .then(async (res) => {
      let responseData = res?.data;
      if (responseData?.success) {
        console.log("Inventory Dump Import Data Response-> ", responseData);
        return {
          hasError: false,
          message: "Inventory Succesfully Exported",
          ...responseData,
        };
      } else {
        console.log("Cannot Export Inventory Dump Data -> ", responseData);
        return {
          hasError: true,
          errorMessage: responseData.message,
        };
      }
    })
    .catch((error) => {
      console.log("AXIOS ERROR: ", error);
      return { hasError: true, errorMessage: error };
    });
};

export const importSalesSummayDumpReport = async (params) => {
  let query = Object.keys(params)
    .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
    .join("&");

  const url = UrlConstants.REPORTS.IMPORT_SALES_SUMMARY + "?" + query;
  const userAuth = ApiCallUtil.getUserAuth();
  let headers = {
    Authorization: ApiCallUtil.getUserAuthToken(),
  };

  if(userAuth?.brand_id){
    headers["Brand_id"] = userAuth?.brand_id;
  }
  
  if(userAuth?.store_id){
    headers["Store_id"] = userAuth?.store_id;
  }

  return await axios
    .get(url, {
      headers: headers,
    })
    .then(async (res) => {
      console.log("Sales Dump Export Data Response -> ", res);
      return {
        hasError: false,
        message: "Sales Report Succesfully Imported",
        data: res.data,
      };
    })
    .catch((error) => {
      console.log("AXIOS ERROR: ", error);
      return { hasError: true, errorMessage: error };
    });
};

export const importOmniSalesSummayDumpReport = async (params) => {
  let query = Object.keys(params)
    .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
    .join("&");

  const url = UrlConstants.REPORTS.IMPORT_SALES_OMNI_SUMMARY + "?" + query;
  const userAuth = ApiCallUtil.getUserAuth();
  let headers = {
    Authorization: ApiCallUtil.getUserAuthToken(),
  };

  if(userAuth?.brand_id){
    headers["Brand_id"] = userAuth?.brand_id;
  }
  
  if(userAuth?.store_id){
    headers["Store_id"] = userAuth?.store_id;
  }

  return await axios
    .get(url, {
      headers: headers,
    })
    .then(async (res) => {
      console.log("Sales Omni Dump Export Data Response -> ", res);
      return {
        hasError: false,
        message: "Sales Report Succesfully Imported",
        data: res.data,
      };
    })
    .catch((error) => {
      console.log("AXIOS ERROR: ", error);
      return { hasError: true, errorMessage: error };
    });
};
