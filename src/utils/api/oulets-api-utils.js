import axios from 'axios';
import UrlConstants from '../constants/url-configs';
import GenericConstants from '../constants/constants';
import Constants from '../constants/constants';
import * as ApiCallUtil from './generic-api-utils';


export const selectOutlet = async (storeRandomId) => {

  const url = UrlConstants.OULETS.SELECT_OUTLET + `?store_random=${storeRandomId}`;
  const callType = GenericConstants.API_CALL_TYPE.GET;

  return await ApiCallUtil.http(
      url, //api url
      callType //calltype
  );

};


export const viewAllOutlets = async () => {
  const url = UrlConstants.OULETS.VIEW_ALL;
  const callType = GenericConstants.API_CALL_TYPE.POST;

  return await ApiCallUtil.http(
      url, //api url
      callType //calltype
  );
};


export const viewAllOutletsForStoreSelection = async () => {
  const url = UrlConstants.OULETS.VIEW_ALL_OUTLETS;
  const callType = GenericConstants.API_CALL_TYPE.POST;

  return await ApiCallUtil.http(
      url, //api url
      callType //calltype
  );
};



