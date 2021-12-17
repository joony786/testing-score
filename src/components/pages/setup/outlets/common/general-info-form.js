import React, { useState, useEffect } from "react";
import { Input, Switch, AutoComplete } from "@teamfabric/copilot-ui";
import CustomCurrencyOptions from "./customCurrencyOptions";
import CustomTemplatesOptions from "./customTemplatesOptions";
import currencyData from "../currencyData.json";
import * as SetupApiUtil from "../../../../../utils/api/setup-api-utils";
import { Country, State, City } from "country-state-city";
const GeneralInfoForm = (props) => {
  const {
    outletId,
    formData,
    formErrorsData,
    handleFormChange,
    setFormData,
    setFormErrorsData,
    initialData,
    isAuth,
    isEdit,
  } = props;
  const {
    name,
    currency,
    template,
    state,
    city,
    country,
    business_address,
    zip_code,
    external_code,
  } = formData;
  const {
    nameError,
    business_addressError,
    currencyError,
    //templateError,
    stateError,
    cityError,
    countryError,
    zip_codeError,
    external_codeError,
  } = formErrorsData;
  const [currencySearch, setCurrencySearch] = useState("");
  const [currencyDataToMap, setCurrencyDataToMap] = useState(currencyData);
  const [currencyDropDown, setCurrencyDropDown] = useState(false);
  const [templateSearch, setTemplateSearch] = useState("");
  const [templatesDataToMap, setTemplatesDataToMap] = useState([]);
  const [templateDropDown, setTemplateDropDown] = useState(false);
  const [countryDropDown, setCountryDropDown] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const [countriesDataToMap, setCountriesDataToMap] = useState([]);
  const [countrySelected, setCountrySelected] = useState({});

  const [statesDropDown, setStatesDropDown] = useState(false);
  const [statesSearch, setStatesSearch] = useState("");
  const [statesDataToMap, setStatesDataToMap] = useState([]);
  const [stateSelected, setStateSelected] = useState({});

  const [citiesDropDown, setCitiesDropDown] = useState(false);
  const [citiesSearch, setCitiesSearch] = useState("");
  const [citiesDataToMap, setCitiesDataToMap] = useState([]);
  const [citySelected, setCitySelected] = useState({});

  const onSelectCurrency = (value) => {
    setFormData({ currency: value });
    setCurrencySearch(value.name);
    setCurrencyDropDown(false);
    setFormErrorsData({
      currencyError: false,
    });
  };

  const onSelectTemplate = (value) => {
    setFormData({ template: value });
    setTemplateSearch(value.name);
    setTemplateDropDown(false);
    // setFormErrorsData({
    //   templateError: false,
    // });
  };
  const onTemplateSearch = (e) => {
    setTemplateSearch(e.target.value);
    if (e.target.value.length > 0) {
      fetchUsersTemplatesData(e.target.value);
      setTemplateDropDown(true);
    }
  };

  const fetchUsersTemplatesData = async (searchValue) => {
    document.getElementById("app-loader-container").style.display = "block";
    const dataToFind = {
      name: searchValue,
    };
    const templatesViewResponse = await SetupApiUtil.searchTemplates(
      dataToFind
    );
    if (templatesViewResponse.hasError) {
      document.getElementById("app-loader-container").style.display = "none";
    } else {
      setTemplatesDataToMap(templatesViewResponse?.data?.data);
      document.getElementById("app-loader-container").style.display = "none";
    }
  };
  const handleSearchCurrency = (searchValue) => {
    const currValue = searchValue.toLowerCase();
    if (currValue === "") {
      setCurrencyDataToMap(currencyData);
    } else {
      const filteredData = currencyData.filter((entry) => {
        let searchValue = entry.name;
        searchValue = searchValue.toLowerCase();

        return searchValue.includes(currValue);
      });
      setCurrencyDataToMap(filteredData);
    }
  };
  const onCurrecnySearch = (e) => {
    setCurrencySearch(e.target.value);
    handleSearchCurrency(e.target.value);
    if (e.target.value.length > 0) setCurrencyDropDown(true);
  };
  const clearSearch = (e) => {
    e?.preventDefault();
    setCurrencySearch("");
    setCurrencyDropDown(false);
    setFormData({ currency: {} });
  };
  const clearTemplatesSearch = (e) => {
    e?.preventDefault();
    setTemplateSearch("");
    setTemplateDropDown(false);
    setFormData({ template: {} });
  };
  const fetchTemplateByIdData = async (templateId) => {
    document.getElementById("app-loader-container").style.display = "block";
    const templatesResponse = await SetupApiUtil.getTemplateById(templateId);
    if (templatesResponse.hasError) {
      document.getElementById("app-loader-container").style.display = "none";
    } else {
      setFormData({
        template: templatesResponse?.template,
      });
      setTemplateSearch(templatesResponse?.template?.name);
      document.getElementById("app-loader-container").style.display = "none";
    }
  };
  useEffect(() => {
    if (outletId && initialData) {
      setFormData({
        currency: {
          name: initialData?.currency_name,
          code: initialData?.currency_code,
          symbol: initialData?.currency_symbol,
        },
      });
      setCurrencySearch(`${initialData?.currency_name}`);
      if (initialData?.template_id) {
        fetchTemplateByIdData(initialData?.template_id);
      }
    }
  }, [outletId, initialData]);
  const countries = Country.getCountryByCode("US");
  const states = State.getStatesOfCountry(countrySelected?.isoCode);
  const cities = City.getCitiesOfState(
    countrySelected?.isoCode,
    stateSelected?.isoCode
  );
  useEffect(() => {
    if (countries) {
      setCountriesDataToMap([countries]);
    }
  }, []);
  useEffect(() => {
    if (country !== "") {
      const filterStates = states.filter((state) => state.isoCode.length <= 2);
      setStatesDataToMap(filterStates);
    }
  }, [country]);
  useEffect(() => {
    if (state !== "") {
      setCitiesDataToMap(cities);
    }
  }, [state]);
  const onCountrySearch = (e) => {
    const { value } = e.target;
    setCountrySearch(e.target.value);
    const newCountryArray = [countries];
    if (value.length > 0) {
      const findCountry = newCountryArray.filter((country) =>
        country.name.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setCountriesDataToMap(findCountry);
    } else {
      setCountriesDataToMap(newCountryArray);
    }
  };
  const onSelectCountry = (value) => {
    setFormData({
      country: value.isoCode,
      state: "",
      city: "",
    });
    setFormErrorsData({
      countryError: false,
    });
    setStatesSearch("");
    setCitiesSearch("");
    setCountrySelected(value);
    setCountrySearch(value.name);
    setCountryDropDown(false);
    setStateSelected({});
    setCitySelected({});
  };
  const onStateSearch = (e) => {
    const { value } = e.target;
    setStatesSearch(e.target.value);
    if (value.length > 0) {
      const findState = states.filter((state) =>
        state.name.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setStatesDataToMap(findState);
    } else {
      setStatesDataToMap(states);
    }
  };
  const onSelectState = (value) => {
    setFormData({
      state: value.isoCode,
      city: "",
    });
    setFormErrorsData({
      stateError: false,
    });
    setCitySelected({});
    setCitiesSearch("");
    setStateSelected(value);
    setStatesSearch(value.name);
    setStatesDropDown(false);
  };

  const onCitySearch = (e) => {
    const { value } = e.target;
    setCitiesSearch(e.target.value);
    if (value.length > 0) {
      const findCity = cities.filter((city) =>
        city.name.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setCitiesDataToMap(findCity);
    } else {
      setCitiesDataToMap(cities);
    }
  };
  const onSelectCity = (value) => {
    setFormData({
      city: value.name,
    });
    setFormErrorsData({
      cityError: false,
    });
    setCitySelected(value);
    setCitiesSearch(value.name);
    setCitiesDropDown(false);
  };
  useEffect(() => {
    if (formData) {
      setCurrencySearch(currency?.name || "");
      setTemplateSearch(template?.name || "");
      if (country !== "") {
        const findCountry = Country.getCountryByCode(country);
        console.log("findCountry", findCountry);
        setCountrySearch(findCountry?.name || "");
        setCountrySelected(findCountry || {});
      }
    }
    if (state !== "" && country !== "") {
      const findState = State.getStateByCodeAndCountry(state, country);
      setStatesSearch(findState?.name || "");
      setStateSelected(findState || {});
    }
    if (city !== "" && state !== "" && country !== "") {
      const citiesFound = City.getCitiesOfState(country, state);
      const findCity = citiesFound.find((c) => c.name == city);
      if (findCity) {
        setCitySelected(findCity || {});
        setCitiesSearch(findCity?.name || "");
      }
    }
  }, [formData]);
  const handleEnter = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  };
  const handleClear = (event, type) => {
    if (!isEdit) {
      if (type === "country") {
        setCountryDropDown(false);
        setCountrySearch("");
        setCountrySelected({});
        setFormData({
          country: "",
        });
        setStatesSearch("");
        setStateSelected({});
        setFormData({
          state: "",
        });
      }
      if (type === "state") {
        setStatesDropDown(false);
        setStatesSearch("");
        setStateSelected({});
        setFormData({
          state: "",
        });
      }
    } else {
      event.preventDefault();
    }
  };
  return (
    <section className="page__content margin-top">
      <form className={`form ${outletId && "section"}`}>
        <fieldset className="form__fieldset">
          <div className="form__row">
            <div className="form__input">
              <Input
                className="primary required"
                inputProps={{
                  onChange: handleFormChange,
                  name: "name",
                  value: name,
                }}
                errorMessage="Field Is Required"
                error={nameError}
                label="*Outlet Name"
              />
            </div>
          </div>

          <div className="form__row">
            <div className="form__input search">
              <AutoComplete
                inputProps={{
                  icon: "Search",
                  className: "search-autocomplete",
                  isFloatedLabel: false,
                  boxed: false,
                  errorMessage: "Field Is Required",
                  error: currencyError,
                  inputProps: {
                    placeholder: "*Select Currency",
                    onChange: (e) => onCurrecnySearch(e),
                    value: currencySearch,
                    onKeyDown: (e) => handleEnter(e),
                    boxed: true,
                    onFocus: (event) => {
                      console.log(event);
                      setCurrencyDropDown(true);
                    },
                  },
                }}
                autoCompleteProps={{
                  data: {},
                  isLoading: false,
                  show: currencyDropDown,
                  toggleSearchAll: true,
                  className: "search-autocomplete-popup",
                  onSearchAll: (event) => console.log(event),
                  onSelect: (data) => console.log(data, "data..."),
                  onClearSearch: (event, iconState) => {
                    clearSearch(event);
                  },
                  onEscPress: (e) => setCurrencyDropDown(false),
                  onBodyClick: (e) => setCurrencyDropDown(false),
                }}
                children={
                  <CustomCurrencyOptions
                    onSelectCurrency={onSelectCurrency}
                    currencyData={currencyDataToMap}
                  />
                }
              />
            </div>
            <div className="form__input search">
              {isAuth &&
                <AutoComplete
                  inputProps={{
                    icon: "Search",
                    className: "search-autocomplete",
                    isFloatedLabel: false,
                    boxed: false,
                    // errorMessage: "Field Is Required",
                    // error: templateError,
                    inputProps: {
                      placeholder: "Receipt Template",
                      onChange: (e) => onTemplateSearch(e),
                      onKeyDown: (e) => handleEnter(e),
                      value: templateSearch,
                      boxed: true,
                      //onKeyDown: SelectProductOnEnter,   //no need now
                      onFocus: (event) => {
                        console.log(event);
                        setTemplateDropDown(
                          templatesDataToMap?.length > 0 ? true : false
                        );
                      },
                    },
                  }}
                  autoCompleteProps={{
                    data: {},
                    isLoading: false,
                    show: templateDropDown,
                    toggleSearchAll: true,
                    className: "search-autocomplete-popup",
                    onSearchAll: (event) => console.log(event),
                    onSelect: (data) => console.log(data, "data..."),
                    onClearSearch: (event, iconState) => {
                      console.log(event, iconState, "event");
                      clearTemplatesSearch(event);
                    },
                    onEscPress: (e) => setTemplateDropDown(false),
                    onBodyClick: (e) => setTemplateDropDown(false),
                  }}
                  children={
                    <CustomTemplatesOptions
                      onSelectTemplate={onSelectTemplate}
                      templatesData={templatesDataToMap}
                    />
                  }
                />
              }
            </div>
          </div>
          <div className="form__row">
            <div className="form__input search">
              <AutoComplete
                inputProps={{
                  icon: "Search",
                  className: "search-autocomplete",
                  isFloatedLabel: false,
                  boxed: false,
                  errorMessage: "Field Is Required",
                  error: countryError,
                  inputProps: {
                    placeholder: "*Country",
                    disabled: isEdit,
                    onChange: (e) => onCountrySearch(e),
                    value: countrySearch,
                    onKeyDown: (e) => handleEnter(e),
                    boxed: true,
                    //onKeyDown: SelectProductOnEnter,   //no need now
                    onFocus: (event) => {
                      console.log(event);
                      if (countriesDataToMap.length > 0) {
                        setCountryDropDown(true);
                      }
                    },
                  },
                }}
                autoCompleteProps={{
                  data: {},
                  isLoading: false,
                  show: countryDropDown,
                  toggleSearchAll: true,
                  className: "search-autocomplete-popup",
                  onSearchAll: (event) => console.log(event),
                  onSelect: (data) => console.log(data, "data..."),
                  onClearSearch: (event, iconState) => {
                    handleClear(event, "country");
                  },
                  onEscPress: (e) => setCountryDropDown(false),
                  onBodyClick: (e) => setCountryDropDown(false),
                }}
                children={
                  <div>
                    {countriesDataToMap.map((country, i) => (
                      <li
                        onClick={() => onSelectCountry(country)}
                        className="currency_li"
                        key={i}
                      >
                        {country.name}
                      </li>
                    ))}
                  </div>
                }
              />
            </div>
            <div className="form__input search">
              <AutoComplete
                inputProps={{
                  icon: "Search",
                  className: "search-autocomplete",
                  isFloatedLabel: false,
                  boxed: false,
                  errorMessage: "Field Is Required",
                  error: stateError,
                  inputProps: {
                    placeholder: "*State",
                    onChange: (e) => onStateSearch(e),
                    value: statesSearch,
                    onKeyDown: (e) => handleEnter(e),
                    boxed: true,
                    disabled: country === "" || isEdit,
                    //onKeyDown: SelectProductOnEnter,   //no need now
                    onFocus: (event) => {
                      console.log(event);
                      if (statesDataToMap.length > 0) {
                        setStatesDropDown(true);
                      }
                    },
                  },
                }}
                autoCompleteProps={{
                  data: {},
                  isLoading: false,
                  show: statesDropDown,
                  toggleSearchAll: true,
                  className: "search-autocomplete-popup",
                  onSearchAll: (event) => console.log(event),
                  onSelect: (data) => console.log(data, "data..."),
                  onClearSearch: (event, iconState) => {
                    handleClear(event, "state");
                  },
                  onEscPress: (e) => setStatesDropDown(false),
                  onBodyClick: (e) => setStatesDropDown(false),
                }}
                children={
                  <div>
                    {statesDataToMap.map((state, i) => (
                      <li
                        onClick={() => onSelectState(state)}
                        className="currency_li"
                        key={i}
                      >
                        {state.name}
                      </li>
                    ))}
                  </div>
                }
              />
            </div>
          </div>
          <div className="form__row">
            <div className="form__input search">
              <AutoComplete
                inputProps={{
                  icon: "Search",
                  className: "search-autocomplete",
                  isFloatedLabel: false,
                  boxed: false,
                  errorMessage: "Field Is Required",
                  error: cityError,
                  inputProps: {
                    placeholder: "*City",
                    onChange: (e) => onCitySearch(e),
                    value: citiesSearch,
                    onKeyDown: (e) => handleEnter(e),
                    boxed: true,
                    disabled: country === "" || state === "",
                    //onKeyDown: SelectProductOnEnter,   //no need now
                    onFocus: (event) => {
                      console.log(event);
                      if (citiesDataToMap.length > 0) {
                        setCitiesDropDown(true);
                      }
                    },
                  },
                }}
                autoCompleteProps={{
                  data: {},
                  isLoading: false,
                  show: citiesDropDown,
                  toggleSearchAll: true,
                  className: "search-autocomplete-popup",
                  onSearchAll: (event) => console.log(event),
                  onSelect: (data) => console.log(data, "data..."),
                  onClearSearch: (event, iconState) => {
                    console.log(event, iconState, "event");
                    setCitiesDropDown(false);
                    setCitiesSearch("");
                    setCitySelected({});
                    setFormData({
                      city: "",
                    });
                  },
                  onEscPress: (e) => setCitiesDropDown(false),
                  onBodyClick: (e) => setCitiesDropDown(false),
                }}
                children={
                  <div>
                    {citiesDataToMap.map((city, i) => (
                      <li
                        onClick={() => onSelectCity(city)}
                        className="currency_li"
                        key={i}
                      >
                        {city.name}
                      </li>
                    ))}
                  </div>
                }
              />
            </div>
            <div className="form__input">
              <Input
                className="primary required"
                inputProps={{
                  onChange: handleFormChange,
                  name: "zip_code",
                  value: zip_code,
                }}
                label="*Zip Code"
                errorMessage="Field Is Required"
                error={zip_codeError}
              />
            </div>
          </div>

          <div className="form__row">
            <div className="form__input">
              <Input
                className="primary required"
                inputProps={{
                  onChange: handleFormChange,
                  name: "external_code",
                  value: external_code,
                }}
                label="External Code"
                errorMessage="Field Is Required"
                error={external_codeError}
              />
            </div>
            <div className="form__input">
              <Input
                className="primary required"
                inputProps={{
                  onChange: handleFormChange,
                  name: "business_address",
                  value: business_address,
                }}
                label="Business Address"
                errorMessage="Field Is Required"
                error={business_addressError}
              />
            </div>
          </div>
          {/* {outletId ? (
                <div className="form__buttons">
                  <CustomButtonWithIcon
                    size="small"
                    isPrimary={false}
                    text="Cancel"
                    onClick={onCancel}
                  />
                  <CustomButtonWithIcon
                    size="small"
                    isPrimary="true"
                    text={buttonText}
                    disabled={buttonDisabled}
                    onClick={onFormSubmit}
                  />
                </div>
              ) : null} */}
        </fieldset>
      </form>
      {/* {outletId ? <WebHooksForm /> : null} */}
    </section>
  );
};

export default GeneralInfoForm;
