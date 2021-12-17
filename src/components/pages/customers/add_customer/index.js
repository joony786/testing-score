import React, { useState, useEffect, useReducer } from 'react';
import { Input, Dropdown } from '@teamfabric/copilot-ui';
import { useHistory } from 'react-router-dom';

// components
import ButtonBack from '../../../atoms/button_back';
import CustomButtonWithIcon from '../../../atoms/button_with_icon';
import SwitchOutlet from '../../../atoms/switch_outlet';
import * as Helpers from '../../../../utils/helpers/scripts';
import * as CustomersApiUtil from '../../../../utils/api/customer-api-utils';

function AddCustomer(props) {
  const initialFormValues = {
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    customerGender: null, //imp
    customerOpeningBalance: '',
    customerCode: '',
  };
  const initialFormErrorsValues = {
    customerNameError: false,
    customerPhoneError: false,
    customerEmailError: false,
    customerGenderError: false,
    customerOpeningBalanceError: false,
    customerCodeError: false,
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
  const {
    customerName,
    customerPhone,
    customerEmail,
    customerGender,
    customerOpeningBalance,
    customerCode,
  } = formData;
  const {
    customerNameError,
    customerPhoneError,
    customerEmailError,
    customerGenderError,
    customerOpeningBalanceError,
    customerCodeError,
  } = formErrorsData;
  const history = useHistory();
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [validEmail, setValidEmail] = useState(true);
  const [customerData, setCustomerData] = useState({});
  const { match = {}, isCustomerEditMode = false } = props;
  const { customer_id = {} } = match !== undefined && match.params;

  let mounted = true;

  useEffect(() => {
    window.scrollTo(0, 0);
    if (customer_id !== undefined && isCustomerEditMode) {
      fetchSingleCustomerData(customer_id);
    }

    return () => {
      mounted = false;
    };
  }, []);

  const fetchSingleCustomerData = async (customerId) => {
    if (!customerId) {
      return popPage();
    }

    console.log('inside');
    document.getElementById('app-loader-container').style.display = 'block';
    const singleCustomerDataResponse = await CustomersApiUtil.getSingleCustomer(
      customerId
    );

    if (singleCustomerDataResponse.hasError) {
      document.getElementById('app-loader-container').style.display = 'none';
      showAlertUi(true, singleCustomerDataResponse.errorMessage);
      //return delayPopPage();
    }
    const customerData = singleCustomerDataResponse.customer[0];
    const mappedCustomerResponse = {
      balance: customerData.balance,
      email: customerData.email,
      name: customerData.name,
      phone: customerData.phone.replace('+', ''),
      gender: customerData.gender || '',
      id: customerData.id,
    };
    setCustomerData(mappedCustomerResponse);

    let genderId =
      mappedCustomerResponse.gender === 'male'
        ? 1
        : mappedCustomerResponse.gender === 'female'
        ? 2
        : mappedCustomerResponse.gender === 'other'
        ? 3
        : '';

    setFormData({
      customerName: mappedCustomerResponse.name,
      customerPhone: mappedCustomerResponse.phone,
      customerEmail: mappedCustomerResponse.email,
      customerGender: { id: genderId, name: mappedCustomerResponse.gender },
      customerOpeningBalance: mappedCustomerResponse.balance,
    });
    document.getElementById('app-loader-container').style.display = 'none';
  };

  const onFormSubmit = async (event) => {
    event.preventDefault(); //imp
    let formValidationsPassedCheck = true;

    if (customerEmail) {
      let valid = Helpers.validateEmail(customerEmail);
      if (!valid) {
        formValidationsPassedCheck = false;
      }
    }

    if (!customerGender || customerGender.id === '') {
      setFormErrorsData({
        customerGenderError: true,
      });
    }

    //for add customer, balance is not compulsary field
    /*if (!isCustomerEditMode && !customerOpeningBalance) { 
      setFormErrorsData({
        customerOpeningBalanceError: true,
      });
    }*/

    /*------------------compulsary fields below---------------*/
    if (!customerName || !customerPhone || !customerEmail) {
      formValidationsPassedCheck = false;
      Object.entries(formData).forEach(([key, val]) => {
        console.log(key, val);
        if (
          key === 'customerName' ||
          key === 'customerPhone' ||
          key === 'customerEmail'
        ) {
          if (!val) {
            let inputErrorKey = `${key}Error`;
            setFormErrorsData({
              [inputErrorKey]: true,
            });
          }
        }
      });
    }
    /*------------------compulsary fields below---------------*/

    if (formValidationsPassedCheck) {
      if (buttonDisabled === false) {
        setButtonDisabled(true);
      }

      const updatedCustomerData = {
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
        gender: customerGender.name,
        id: customerData.id,
      };
      try {
        if (isCustomerEditMode) {
          document.getElementById('app-loader-container').style.display =
            'block';
          const userDataUpdateResponse =
            await CustomersApiUtil.updateUserDetails(updatedCustomerData);
          console.log(userDataUpdateResponse);
          if (userDataUpdateResponse.hasError) {
            console.log(
              'Cant Edit Customer -> ',
              userDataUpdateResponse.errorMessage
            );
            setButtonDisabled(false);
            document.getElementById('app-loader-container').style.display =
              'none';
            showAlertUi(true, userDataUpdateResponse.errorMessage);
          } else {
            console.log('res -> ', userDataUpdateResponse);
            document.getElementById('app-loader-container').style.display =
              'none';
            setTimeout(() => {
              history.push({
                //pathname: `/customers/${customer_id}/view`,
                pathname: `/customers`,
              });
            }, 500);
          }
        } /*---end of if---*/ else {
          const addCustomerData = {
            name: customerName,
            email: customerEmail,
            phone: customerPhone,
            gender: customerGender.name,
          };
          if (customerOpeningBalance) {
            addCustomerData.balance = customerOpeningBalance;
          }
          document.getElementById('app-loader-container').style.display =
            'block';
          const userDataAddResponse = await CustomersApiUtil.addCustomer(
            addCustomerData
          );
          console.log(userDataAddResponse);
          if (userDataAddResponse.hasError) {
            console.log(
              'Cant Edit Customer -> ',
              userDataAddResponse.errorMessage
            );
            setButtonDisabled(false);
            document.getElementById('app-loader-container').style.display =
              'none';
            showAlertUi(true, userDataAddResponse.errorMessage);
          } else {
            document.getElementById('app-loader-container').style.display =
              'none';
            setTimeout(() => {
              history.push({
                pathname: '/customers',
              });
            }, 500);
          }
        } /*---end of else---*/
      } catch (err) {
        showAlertUi(true, 'Unable to update user');
      }
    }
  };

  const showAlertUi = (show, errorText) => {
    Helpers.showAppAlertUiContent(show, errorText);
  };

  const validateEmailInput = (email) => {
    let validEmailCheck = Helpers.validateEmail(email);
    //console.log(validEmailCheck);  //imp
    if (validEmailCheck || !email) {
      //imp
      setValidEmail(true);
    } else {
      setValidEmail(false);
    }
  };

  const handleFormChange = ({ target: { value, name } }) => {
    if (name === 'customerPhone') {
      const allowedNumbers = /^[0-9\b]+$/;
      if (value === '' || allowedNumbers.test(value)) {
        setFormData({ [name]: value });
      }
    } else {
      setFormData({ [name]: value });
      let inputErrorKey = `${name}Error`;
      setFormErrorsData({
        [inputErrorKey]: false,
      });

      if (name === 'customerEmail') {
        validateEmailInput(value);
      }
    }
  };

  const handleCategorySelectChange = (listItem) => {
    //console.log(listItem);  //imp
    setFormData({ customerGender: { ...listItem } });
    setFormErrorsData({
      customerGenderError: false,
    });
  };

  const popPage = () => {
    history.goBack();
  };

  const delayPopPage = () => {
    setTimeout(() => {
      history.goBack();
    }, 2000);
  };

  return (
    <div className='page'>
      <div className='page__top'>
        <SwitchOutlet />
        <ButtonBack text='Back to Customers' link='/customers' />
      </div>

      <div className='page__body'>
        <section className='page__header'>
          <h1 className='heading heading--primary'>
            {isCustomerEditMode ? 'Edit Customer' : 'Add Customer'}
          </h1>

          <CustomButtonWithIcon
            size='small'
            isPrimary={true}
            text='Save'
            disabled={buttonDisabled}
            onClick={onFormSubmit}
          />
        </section>

        <section className='page__content'>
          <form className='form'>
            <div className='form__row'>
              <div className='form__input'>
                <Input
                  className='primary required'
                  inputProps={{
                    onChange: handleFormChange,
                    name: 'customerName',
                    value: customerName,
                  }}
                  label='*Customer Name'
                  errorMessage='Field Is Required'
                  error={customerNameError}
                />
              </div>

              <div className='form__input'>
                <Input
                  className='primary required'
                  inputProps={{
                    onChange: handleFormChange,
                    name: 'customerPhone',
                    value: customerPhone,
                    type: 'tel',
                    pattern: '[0-9]*',
                  }}
                  label='*Phone Number'
                  errorMessage='Field Is Required'
                  error={customerPhoneError}
                />
              </div>
            </div>

            <div className='form__row'>
              <div className='form__input'>
                <Input
                  className='primary required'
                  inputProps={{
                    onChange: handleFormChange,
                    name: 'customerEmail',
                    value: customerEmail,
                  }}
                  label='*Email Address'
                  errorMessage={
                    customerEmailError
                      ? 'Field Is Required'
                      : !validEmail
                      ? 'Please Input Valid Email'
                      : ''
                  }
                  error={customerEmailError || !validEmail ? true : false}
                />
              </div>

              <div className='form__input'>
                <Dropdown
                  className='form-dropdown-required'
                  onSelect={handleCategorySelectChange}
                  options={[
                    {
                      id: 1,
                      name: 'male',
                    },
                    {
                      id: 2,
                      name: 'female',
                    },
                    {
                      id: 3,
                      name: 'other',
                    },
                  ]}
                  titleLabel='*Select Gender'
                  name='gender' //not working
                  value={customerGender} //accepts null or {} not ""
                  width='100%'
                  errorMessage='Field Is Required'
                  errorState={customerGenderError}
                />
              </div>
            </div>

            <div className='form__row'>
              {!isCustomerEditMode && (
                <div className='form__input'>
                  <Input
                    className='primary'
                    inputProps={{
                      onChange: handleFormChange,
                      name: 'customerOpeningBalance',
                      value: customerOpeningBalance,
                      type: 'number',
                    }}
                    label='Opening Balance'
                    errorMessage='Field Is Required'
                    error={customerOpeningBalanceError}
                  />
                </div>
              )}
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

export default AddCustomer;
