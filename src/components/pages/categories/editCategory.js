import React, { useState, useEffect, useReducer } from "react";
import { Input, Dropdown, AutoComplete, Loading } from "@teamfabric/copilot-ui";

// components
import ButtonBack from "../../atoms/button_back";
import * as CategoriesApiUtil from "../../../utils/api/categories-api-utils";
import * as Helpers from "../../../utils/helpers/scripts";
import CustomButtonWithIcon from "../../atoms/button_with_icon";
import SwitchOutlet from "../../atoms/switch_outlet";
import { useHistory } from "react-router-dom";

function EditCategory(props) {
  const initialFormValues = {
    categoryName: "",
    parentCategory: null,
  };
  const initialFormErrorsValues = {
    categoryNameError: false,
    parentCategoryError: false,
  };
  const formReducer = (state, event) => {
    return { ...state, ...event };
  };

  const formErrorsReducer = (state, event) => {
    return { ...state, ...event };
  };

  const [formData, setFormData] = useReducer(formReducer, initialFormValues);
  const [formErrorsData, setFormErrorsData] = useReducer(formErrorsReducer, initialFormErrorsValues);
  const { categoryName, parentCategory } = formData;
  const { categoryNameError, parentCategoryError } = formErrorsData;
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [data, setData] = useState([]);
  const [categoriesSearchResult, setCategoriesSearchResult] = useState([{ id: null, name: "No Parent" }]);
  const [selectedSearchValue, setSelectedSearchValue] = useState("");
  const [categoriesPopUpShow, setCategoriesPopUpShow] = useState(false);
  const [productsSearchLoading, setProductsSearchLoading] = useState(false);
  
  const history = useHistory();
  const { match = {} } = props;
  const { cat_id = {} } = match !== undefined && match.params;

  let mounted = true;

  useEffect(() => {
    window.scrollTo(0, 0);
    if (cat_id !== undefined) {
      fetchApisData(cat_id);
    } else {
      return popPage();
    }

    return () => {
      mounted = false;
    };
  }, []);

  const fetchApisData = async (cat_id) => {
    document.getElementById("app-loader-container").style.display = "block";
    await Promise.all([
      getCategory(cat_id),
      //fetchCategoriesData()
    ]);
    document.getElementById("app-loader-container").style.display = "none";
  };

  const getCategory = async (categoryId) => {
    const getCategoryResponse = await CategoriesApiUtil.getCategory(categoryId);
    if (getCategoryResponse.hasError) {
      showAlertUi(true, getCategoryResponse.errorMessage); //imp
      return delayPopPage();
    } else {
      if (mounted) {
        const categoryData = getCategoryResponse.categories[0]; //vvimp
        let childCategoryExist = categoryData.child_categories;
        if(typeof childCategoryExist === "undefined" || categoryData.id === categoryId){
          setFormData({
            categoryName: categoryData.name,
            parentCategory: { id: null, name: "No Parent" },
          });

          //setCategoriesSearchResult( [{ id: null, name: "No Parent" }] );
          setSelectedSearchValue("No Parent" );

        }else {
          setFormData({
            categoryName: categoryData.name,
            parentCategory: { id: categoryData.id, name: categoryData.name },
          });

          setSelectedSearchValue(categoryData.name);
          //setCategoriesSearchResult( [{ id: null, name: "No Parent" }] );
        }
      }
    }
  };

  
  const handleChange = (e) => {
    //console.log(e.target.value);
    let inputValue = e.target.value;
    setSelectedSearchValue(inputValue);
    if (inputValue.length === 0) {
      setCategoriesSearchResult([]);
      setSelectedSearchValue("");
    }
    if (inputValue.length > 1) {
      setCategoriesPopUpShow(true);
      fetchSearchCategories(inputValue);
    }
  };

  const handleSelect = (item) => {
    //console.log(item);
    //console.log(e.target.value);
    //let value = e.target.value;
    //let selectedVal = value.split('/');
    let selectedCategory = item.name; //imp
    selectedCategory = selectedCategory.toString();

    setSelectedSearchValue(item.name);           //passes name
    setCategoriesPopUpShow(false);
    setFormErrorsData({
      parentCategoryError: false,
    });
    setFormData({
      parentCategory: {...item},
    });
    setCategoriesSearchResult([]);
    setCategoriesSearchResult( [{ id: null, name: "No Parent" }] );

  };


  const fetchSearchCategories = async (searchValue) => {
    let pageLimit = Helpers.genericSearchPageLimit;
    let pageNumber = Helpers.genericSearchPageNumber;
    let searchByKeyword = 1;  //true
    setProductsSearchLoading(true);

    const categoriesSearchResponse = await CategoriesApiUtil.searchCategories(pageLimit, pageNumber, searchValue, searchByKeyword);
    if (categoriesSearchResponse.hasError) {
      setProductsSearchLoading(false);
      setCategoriesSearchResult([]);
      setCategoriesSearchResult( [{ id: null, name: "No Parent" }] );
      setFormData({
        parentCategory: null,
      });
      //showAlertUi(true, categoriesSearchResponse.errorMessage); //imp
    } else {
      let categoriesSearchData = categoriesSearchResponse.categories.data;
      setProductsSearchLoading(false);
      categoriesSearchData.push({ id: null, name: "No Parent" });
      setCategoriesSearchResult([]);
      setCategoriesSearchResult(categoriesSearchData);
    }
  };



  const onFormSubmit = async (event) => {
    event.preventDefault(); //imp to use here
    let formValidationsPassedCheck = true;

    if (!categoryName || !parentCategory) {
      formValidationsPassedCheck = false;
      Object.entries(formData).forEach(([key, val]) => {
        if (!val) {
          let inputErrorKey = `${key}Error`;
          setFormErrorsData({
            [inputErrorKey]: true,
          });
        }
      });
    }

    if (formValidationsPassedCheck) {
      if (buttonDisabled === false) {
        setButtonDisabled(true);
      }

      if (parentCategory.id === cat_id) {
        showAlertUi(true, "Self parent Category AssociationNot Allowed");
        setButtonDisabled(false);
        return;
      }

      document.getElementById("app-loader-container").style.display = "block";
      const categoryEditResponse = await CategoriesApiUtil.editCategory(
        cat_id,
        categoryName,
        parentCategory.id
      );
      if (categoryEditResponse.hasError) {
        setButtonDisabled(false);
        document.getElementById("app-loader-container").style.display = "none";
        showAlertUi(true, categoryEditResponse.errorMessage); //imp
      } else {
        if (mounted) {
          //imp if unmounted
          document.getElementById("app-loader-container").style.display =
            "none";
          setTimeout(() => {
            history.push({
              pathname: "/categories",
            });
          }, 500);
        }
      }
    }
  };



  /*const handleCategorySelectChange = (listItem) => {
    setFormData({ parentCategory: { ...listItem } });
    setFormErrorsData({
      parentCategoryError: false,
    });
  };*/

  const showAlertUi = (show, errorText) => {
    Helpers.showAppAlertUiContent(show, errorText);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData({ [name]: value });

    let inputErrorKey = `${name}Error`; //imp
    setFormErrorsData({
      [inputErrorKey]: false,
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
    <div className="page">
      <div className="page__top">
        <SwitchOutlet />
        <ButtonBack text="Back to Categories" link="/categories" />
      </div>

      <div className="page__body">
        <section className="page__header">
          <h1 className="heading heading--primary">Edit Category</h1>

          <CustomButtonWithIcon
            size="small"
            isPrimary={true}
            text="Save"
            disabled={buttonDisabled}
            onClick={onFormSubmit}
          />
        </section>

        <section className="page__content">
          <form className="form">
            <fieldset className="form__fieldset">
              <div className="form__row">
                <div className="form__input">
                  <Input
                    className="primary required"
                    inputProps={{
                      disabled: false,
                      onChange: handleFormChange,
                      name: "categoryName",
                      value: categoryName,
                    }}
                    label="*Category Name"
                    errorMessage="Field Is Required"
                    error={categoryNameError}
                  />
                </div>
                <div className="form__input">
                  <AutoComplete
                    inputProps={{
                      icon: "Search",
                      className: "search-autocomplete",
                      isFloatedLabel: false,
                      boxed: false,
                      errorMessage: "Field Is Required",
                      error: parentCategoryError,
                      inputProps: {
                        placeholder: "Select Parent Category",
                        onChange: (e) => handleChange(e),
                        value: selectedSearchValue,
                        //boxed: true,
                        //onKeyDown: SelectProductOnEnter,   //no need now
                        onFocus: (event) => {
                          console.log(event);
                          setCategoriesPopUpShow(
                            categoriesSearchResult.length > 0 ? true : false
                          );
                        },
                      },
                    }}
                    autoCompleteProps={{
                      data: {},
                      isLoading: false,
                      show: categoriesPopUpShow,
                      toggleSearchAll: true,
                      className: "search-autocomplete-popup",
                      onSearchAll: (event) => console.log(event),
                      onSelect: (data) => console.log(data, "data..."),
                      onClearSearch: (event, iconState) => {
                        console.log(event, iconState, "event");
                        setCategoriesPopUpShow(false);
                        setSelectedSearchValue("");
                        setCategoriesSearchResult([]);
                        setCategoriesSearchResult([{ id: null, name: "No Parent" }]);
                        setFormData({
                          parentCategory: null,
                        });
                      },
                      onEscPress: () => setCategoriesPopUpShow(false),
                      onBodyClick: () => setCategoriesPopUpShow(false),
                    }}
                    children={
                      <div>
                        <Loading
                          strokeColor="#0033B3"
                          strokeWidth={5}
                          size={20}
                          show={productsSearchLoading}
                        />
                        <ul>
                          {(categoriesSearchResult && categoriesSearchResult.length > 0) &&
                            categoriesSearchResult.map((item) => (
                              <li
                                key={item.id}
                                value={item.name}
                                onClick={(e) => handleSelect(item)}
                                className="products-search-list-item"
                              >
                                {item.name}
                              </li>
                            ))}
                        </ul>
                      </div>
                    }
                  />


                </div>
              </div>
            </fieldset>
          </form>
        </section>
      </div>
    </div>
  );
}

export default EditCategory;
