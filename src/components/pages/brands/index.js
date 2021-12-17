import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

// components
import PageTitle from '../../organism/header';
import {
  saveDataIntoLocalStorage,
  getDataFromLocalStorage,
  clearLocalUserData,
  checkUserAuthFromLocalStorage,
  clearKeyFromLocalStorage,
} from '../../../utils/local-storage/local-store-utils';
import { useHistory } from 'react-router-dom';
import * as SetupApiUtil from '../../../utils/api/setup-api-utils';
import * as Helpers from '../../../utils/helpers/scripts';
import Constants from '../../../utils/constants/constants';
import CustomButtonWithIcon from '../../atoms/button_with_icon';

let loginCacheData = null;

function Brands() {
  const myRef = useRef();
  const [brands, setBrands] = useState([]);
  const [stores, setStores] = useState([]);
  const [activeBrand, setActiveBrand] = useState(null);
  const [activeStore, setActiveStore] = useState(null);
  const [viewOutletsCheck, setViewOutletsCheck] = useState(false);
  const [loading, setLoading] = useState(true);
  const [scrollToView, setScrollToView] = useState('');
  const history = useHistory();

  const outletRef = useRef();

  var mounted = true;

  useEffect(() => {
    let readFromLocalStorage = getDataFromLocalStorage(
      Constants.USER_DETAILS_KEY
    );
    readFromLocalStorage = readFromLocalStorage.data
      ? readFromLocalStorage.data
      : null;
    loginCacheData = readFromLocalStorage;
    if (loginCacheData) {
      fetchAllBrandsData(loginCacheData); //imp
    }
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    outletRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [scrollToView]);

  const fetchAllBrandsData = async (localStorageData) => {
    document.getElementById('app-loader-container').style.display = 'block';
    const brandsViewResponse = await SetupApiUtil.viewUserById(
      localStorageData?.user_info?.user_id
    );
    if (brandsViewResponse.hasError) {
      setLoading(false);
      document.getElementById('app-loader-container').style.display = 'none';
      showAlertUi(true, brandsViewResponse.errorMessage);
    } else {
      if (mounted) {
        //imp if unmounted
        if (localStorageData) {
          let brandsList = brandsViewResponse && brandsViewResponse.data[0];
          brandsList = brandsList?.brand_info;
          /*brandsList = [];
          if(brandsList.length === 0) {
            clearKeyFromLocalStorage(Constants.USER_DETAILS_KEY);
          }*/
          setBrands(brandsList);
          if (brandsList.length > 0 && localStorageData.brand_id) {
            setActiveBrand(localStorageData.brand_id);
            let selectedBrand =
              brandsList.length > 0 &&
              brandsList.find((brand) => {
                return brand.id === localStorageData.brand_id;
              });
            setStores(selectedBrand?.stores);
          }
          if (brandsList.length > 0 && localStorageData.store_id) {
            setActiveStore(localStorageData.store_id);
            setViewOutletsCheck(true);
          }
          setLoading(false);
          document.getElementById('app-loader-container').style.display =
            'none';
        }
      }
    }
  };

  const onSelectBrand = (brandId, brandName) => {
    setActiveBrand(brandId);
    setViewOutletsCheck(true);
    setActiveStore(null);
    loginCacheData.brand_id = brandId;
    loginCacheData.brand_name = brandName;
    saveDataIntoLocalStorage(Constants.USER_DETAILS_KEY, loginCacheData);
    let selectedBrand = brands.find((brand) => {
      return brand.id === brandId;
    });
    setStores(selectedBrand?.stores);
    window.scrollTo({ behavior: 'smooth', top: myRef.current.offsetTop });
    setScrollToView(uuidv4());
  };

  const onSelectStore = (
    storeId,
    storeName,
    storeRandom,
    storeLocation,
    external_code
  ) => {
    setActiveStore(storeId);
    loginCacheData.store_id = storeId;
    loginCacheData.store_name = storeName;
    loginCacheData.store_location = storeLocation;
    loginCacheData.store_random = storeRandom;
    loginCacheData.external_code = external_code;
    saveDataIntoLocalStorage(Constants.USER_DETAILS_KEY, loginCacheData);
    window.open("/pos/dashboard", "_self");
    // history.push('/pos/dashboard');
  };

  const showAlertUi = (show, errorText) => {
    Helpers.showAppAlertUiContent(show, errorText);
  };

  const onAddOutlet = (event) => {
    event.preventDefault(); //imp
    loginCacheData.outlet_onboarding = true;
    delete loginCacheData['store_id'];
    saveDataIntoLocalStorage(Constants.USER_DETAILS_KEY, loginCacheData);
    history.push({
      pathname: '/unAuth/outlets/add',
    });
  };

  const onAddBrand = (event) => {
    event.preventDefault(); //imp
    loginCacheData.brand_onboarding = true;
    saveDataIntoLocalStorage(Constants.USER_DETAILS_KEY, loginCacheData);
    history.push({
      pathname: '/unAuth/brands/add',
    });
  };

  return (
    <div className='page select_store'>
      <PageTitle title='Select Brands' />

      <section className='outlets' style={{ marginBottom: '5rem' }}>
        <ul className='outlet__select outlets-list-container'>
          {brands.map((item) => {
            return (
              <li
                key={item.id}
                className={`outlet__link${
                  activeBrand === item.id ? ' brand__active' : ''
                }`}
                onClick={() => onSelectBrand(item.id, item.name)}
              >
                {item.name}
              </li>
            );
          })}
        </ul>

        {brands.length === 0 && !loading && (
          <section className='page__header'>
            <h3 className='heading heading--primary'>
              You don't have any brand to select, Please create a new one
            </h3>
            <CustomButtonWithIcon
              size='small'
              isPrimary={true}
              text='Create a New Brand'
              onClick={onAddBrand}
            />
          </section>
        )}
      </section>

      {viewOutletsCheck && stores.length === 0 && !loading && (
        <section className='page__header' ref={outletRef}>
          <h3 className='heading heading--primary'>
            You don't have any outlet to select, Please create a new one
          </h3>
          <CustomButtonWithIcon
            size='small'
            isPrimary={true}
            text='Create a New Outlet'
            onClick={onAddOutlet}
          />
        </section>
      )}

      {viewOutletsCheck && stores.length > 0 && (
        <>
          <PageTitle title='Select Outlets' />

          <section className='outlets' ref={outletRef}>
            <ul className='outlet__select outlets-list-container'>
              {stores.map((item) => {
                return (
                  <li
                    key={item.id}
                    className={`outlet__link${
                      activeStore === item.id ? ' outlet__active' : ''
                    }`}
                    onClick={() =>
                      onSelectStore(
                        item.id,
                        item.name,
                        item.store_random,
                        item.location,
                        item.external_code
                      )
                    }
                  >
                    {item.name}
                  </li>
                );
              })}
            </ul>
          </section>
        </>
      )}

      <span id='outlets-section' ref={myRef}></span>
    </div>
  );
}

export default Brands;
