import React, { useReducer } from 'react';
import { Input, Button } from '@teamfabric/copilot-ui';
import * as Helpers from '../../../../utils/helpers/scripts';
import * as AuthApiUtil from '../../../../utils/api/auth-api-utils';
import Constants from '../../../../utils/constants/constants';
import { saveDataIntoLocalStorage } from '../../../../utils/local-storage/local-store-utils';
import { useHistory } from 'react-router-dom';
function Login() {
  const history = useHistory();

  const initialFormValues = {
    email: '',
    password: '',
  };
  const initialFormErrorsValues = {
    emailError: false,
    emailErrorMessage: '',
    passwordError: false,
    passwordErrorMessage: '',
  };
  const formReducer = (state, event) => {
    return { ...state, ...event };
  };
  const formErrorsReducer = (state, event) => {
    return { ...state, ...event };
  };
  const [formData, setFormData] = useReducer(formReducer, initialFormValues);
  const [formErrorsData, setFormErrorsData] = useReducer(
    formErrorsReducer,
    initialFormErrorsValues
  );
  const { email, password } = formData;
  const { emailError, emailErrorMessage, passwordError, passwordErrorMessage } =
    formErrorsData;
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({ [name]: value });
    let inputErrorKey = `${name}Error`;
    setFormErrorsData({
      [inputErrorKey]: false,
    });
  };
  const validateEmailInput = (emailText) => {
    let validEmailCheck = Helpers.validateEmail(emailText);
    console.log(validEmailCheck); //imp
    if (!validEmailCheck && emailText) {
      //imp
      setFormErrorsData({
        emailError: true,
        emailErrorMessage: 'Please enter valid email',
      });
      return false;
    } else {
      setFormErrorsData({
        emailError: false,
        emailErrorMessage: '',
      });
      return true;
    }
  };
  const showAlertUi = (show, errorText) => {
    Helpers.showAppAlertUiContent(show, errorText);
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    let validationsPassedCheck = false;
    Object.entries(formData).forEach(([key, val]) => {
      if (key === 'email' && val) {
        const validated = validateEmailInput(val);
        if (validated) {
          validationsPassedCheck = true;
        }
      }
      if (!val) {
        let inputErrorKey = `${key}Error`;
        let inputErrorMessage = `${key}ErrorMessage`;
        setFormErrorsData({
          [inputErrorKey]: true,
          [inputErrorMessage]: 'Field is required',
        });
        validationsPassedCheck = false;
      }
    });
    if (validationsPassedCheck) {
      document.getElementById('app-loader-container').style.display = 'block';
      const loginResponse = await AuthApiUtil.login(email, password);
      console.log('loginResponse', loginResponse.hasError);
      if (loginResponse.hasError) {
        const errorMessage = loginResponse.errorMessage;
        document.getElementById('app-loader-container').style.display = 'none';
        showAlertUi(true, errorMessage); //imp
      } else {
        delete loginResponse['hasError']; //imp
        let loggedInUserDetails = loginResponse; //imp
        saveDataIntoLocalStorage(
          Constants.USER_DETAILS_KEY,
          loggedInUserDetails
        );
        document.getElementById('app-loader-container').style.display = 'none';
        window.open('/pos/brands', '_self');
        // history.push('/pos/brands');
      }
    }
  };
  return (
    <div className='wrapper'>
      <div className="banner">
        <h1>MLS</h1>
      </div>

      <div className="content">
        <form onSubmit={handleLogin} className="login">

          <div className='header'>
            <h1>MLS Login</h1>
          </div>

          <div className='body'>
            <Input
              className='primary required'
              inputProps={{
                name: 'email',
                value: email,
                onChange: handleChange,
              }}
              label='*Email'
              width='100%'
              error={emailError}
              errorMessage={emailErrorMessage}
            />

            <Input
              className='password required'
              inputProps={{
                name: 'password',
                type: 'password',
                value: password,
                onChange: handleChange,
              }}
              label='*Password'
              width='100%'
              error={passwordError}
              errorMessage={passwordErrorMessage}
            />

            {/* <div className="reset_password">
            <Link href="/" text="Reset Password" />
          </div> */}
          </div>

          <div className='footer'>
            <Button
              type='submit'
              // onClick={handleLogin}
              size='small'
              text='Login'
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
