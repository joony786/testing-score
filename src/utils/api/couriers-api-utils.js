import UrlConstants from '../constants/url-configs';
import GenericConstants from '../constants/constants';
import * as ApiCallUtil from './generic-api-utils';


export const addCourier = async (courierName, courierCode) => {
    const formDataPair = {
        name: courierName,
        code: courierCode,
    };
    const addCourierFormDataBody = ApiCallUtil.constructFormData(formDataPair);
    const url = UrlConstants.COURIERS.ADD_COURIER;
    const callType = GenericConstants.API_CALL_TYPE.POST;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        addCourierFormDataBody //body
    );
};


export const getCourier = async (courierId) => {
    const formDataPair = {
        id: courierId,
    };
    const getCourierFormDataBody = ApiCallUtil.constructFormData(formDataPair);
    const url = UrlConstants.COURIERS.GET_COURIER;
    const callType = GenericConstants.API_CALL_TYPE.POST;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        getCourierFormDataBody //body
    );
};



export const searchCouriers = async (limit, PageNumber, searchvalue) => {

    const url = UrlConstants.COURIERS.SEARCH + `?name=${searchvalue}&limit=${limit}&page=${PageNumber}`;
    const callType = GenericConstants.API_CALL_TYPE.GET;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
    );
};



export const viewCouriers = async (limit, PageNumber) => {
    const formDataPair = {
        limit: limit,
        page: PageNumber,
    };
    const viewCouriersFormDataBody = ApiCallUtil.constructFormData(formDataPair);
    const url = UrlConstants.COURIERS.VIEW;
    const callType = GenericConstants.API_CALL_TYPE.POST;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        viewCouriersFormDataBody,
    );
};


export const viewAllCouriers = async () => {
    const url = UrlConstants.COURIERS.VIEW_ALL;
    const callType = GenericConstants.API_CALL_TYPE.POST;
  
    return await ApiCallUtil.http(
        url, //api url
        callType //calltype
    );
};


export const deleteCourier = async (courierId) => {
    const formDataPair = {
        id: courierId
    };
    const deleteCourierFormDataBody = ApiCallUtil.constructFormData(formDataPair);
    const url = UrlConstants.COURIERS.DELETE_COURIER;
    const callType = GenericConstants.API_CALL_TYPE.POST;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        deleteCourierFormDataBody //body
    );
};


export const editCourier = async (courierId, courierName, courierCode) => {
    const formDataPair = {
        id: courierId,
        name: courierName,
        code: courierCode,
    };
    const editCourierFormDataBody = ApiCallUtil.constructFormData(formDataPair);
    const url = UrlConstants.COURIERS.EDIT_COURIER;
    const callType = GenericConstants.API_CALL_TYPE.POST;

    return await ApiCallUtil.http(
        url, //api url
        callType, //calltype
        editCourierFormDataBody //body
    );
};
