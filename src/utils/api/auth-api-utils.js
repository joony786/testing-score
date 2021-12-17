import GenericConstants from '../constants/constants';
import UrlConstants from '../constants/url-configs';
import * as ApiCallUtil from './generic-api-utils';
import Constants from '../constants/constants';
import axios from 'axios';


export const login = async (email, passsword) => {
  const formDataPair = {
    email: email,
    password: passsword
  };

  const url = UrlConstants.AUTH.LOGIN;
  const callType = GenericConstants.API_CALL_TYPE.POST;
  return await axios.post(url, formDataPair).then(async (res) => {
    let responseData = res?.data;
    console.log('success-> ', responseData);
    if(responseData?.status) {
      return { hasError: false, ...responseData };
    }
    else {
      return { hasError: true, errorMessage: responseData.message, ...responseData  };
    }

  })
  .catch((error) => {
    console.log("AXIOS ERROR: ", error);
    return { hasError: true, errorMessage: error };

  });
};



export const authCoPilotLogin = async (token) => {

  /*const url = UrlConstants.AUTH.CO_PILOT_LOGIN;
  const callType = GenericConstants.API_CALL_TYPE.GET;
  //const headers = {'Content-Type': 'application/json'};

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
  );*/

  const url = UrlConstants.AUTH.CO_PILOT_LOGIN;
  const headers = {
    "Authorization": Constants.CO_PILOT_LIFE_TIME_TOKEN,
  };

  return await axios.post(url, {}, {
    headers: headers
  })
    .then(async (res) => {
      let responseData = res?.data;
      console.log('success-> ', responseData);
      if(responseData?.status) {
        return { hasError: false, ...responseData };
      }
      else {
        return { hasError: true, errorMessage: responseData.message, ...responseData  };
      }

    })
    .catch((error) => {
      console.log("AXIOS ERROR: ", error);
      return { hasError: true, errorMessage: error };

    })

};



export const signUp = async (
  firstName,
  email,
  password,
  confirmPassword,
  phone,
  businessName,
  businessPassword
) => {
  const formDataPair = {
    fname: firstName,
    email: email,
    password: password,
    repassword: confirmPassword,
    phone: phone,
    businessName: businessName,
    businessAddress: businessPassword
  };

  const signUpFormData = ApiCallUtil.constructFormData(formDataPair);
  const url = UrlConstants.AUTH.SIGNUP;
  const callType = GenericConstants.API_CALL_TYPE.POST;

  return await ApiCallUtil.http(
    url, //api url
    callType, //calltype
    signUpFormData //body
  );
};

// const login = async (userNameOrEmail, passsword) => {
//   const loginFormData = new FormData();
//   loginFormData.append('username', userNameOrEmail);
//   loginFormData.append('password', passsword);

//   try {
//     const loginCall = await axios({
//       method: 'post',
//       url: UrlConstants.AUTH.LOGIN,
//       data: loginFormData
//     });

//     const loginResponse = loginCall.data;
//     console.log('login response is: ', loginResponse);

//     if (loginResponse && loginResponse.status) {
//       return {
//         hasError: false,
//         data: loginResponse
//       };
//     }
//     return {
//       hasError: true,
//       errorMessage: loginResponse.messsage || 'Invalid Credentials'
//     };
//   } catch (err) {
//     console.log('unable to login due to ', err);
//     return {
//       hasError: true,
//       errorMessage: 'Invalid Credentials'
//     };
//   }
// };
