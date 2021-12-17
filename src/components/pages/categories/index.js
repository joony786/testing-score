import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// components
import ButtonSearch from "../../atoms/button_search";
import CustomButtonWithIcon from "../../atoms/button_with_icon";
import CustomSearch from "../../atoms/search";
import SwitchOutlet from "../../atoms/switch_outlet";
import PageTitle from "../../organism/header";
import CategoriesTable from "../../organism/table/categories";
import CustomTableAtionMenuItem from "../../organism/table/table_helpers/tableActionMenu";
import * as CategoriesApiUtil from "../../../utils/api/categories-api-utils";
import * as Helpers from "../../../utils/helpers/scripts";
import * as PermissionsHelpers from "../../../utils/helpers/check-user-permission";
import Permissions from "../../../utils/constants/user-permissions";
import { useHistory } from "react-router-dom";



function Categories() {
  const [paginationLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [paginationData, setPaginationData] = useState({});
  const [searchedData, setSearchedData] = useState(null);
  const [currentPageSearched, setCurrentPageSearched] = useState(1);
  const [inputSearchValue, setInputSearchValue] = useState("");

  const moduleEditCheck = PermissionsHelpers.checkUserModuleRolePermission(Permissions.USER_PERMISSIONS.UPDATE.CATEGORIES);
  const moduleDeleteCheck = PermissionsHelpers.checkUserModuleRolePermission(Permissions.USER_PERMISSIONS.DELETE.CATEGORIES);
  const moduleAddCheck = PermissionsHelpers.checkUserModuleRolePermission(Permissions.USER_PERMISSIONS.WRITE.CATEGORIES);


  const history = useHistory();
  let mounted = true;

  const handleSearchInputChange = async (value) => {
    setInputSearchValue(value);
    let searchValue = value;
    if (searchValue === "") {
      setSearchedData(null);
      setLoading(true);
      fetchCategoriesData(paginationLimit, currentPage);
      return;
    }
  };

  const onSearch = async (inputValue) => {
    let searchValue = inputValue;
    if (searchValue === "") {
      setSearchedData(null);
      setLoading(true);
      fetchCategoriesData(paginationLimit, currentPage);
      return;
    }
    setSearchedData(searchValue);
    setLoading(true);
    setCurrentPageSearched(1); //imp
    fetchSearchCategories(paginationLimit, 1, searchValue);
  };

  const fetchSearchCategories = async (pageLimit = 10, pageNumber = 1,searchValue) => {
    let searchByKeyword = 1;  //true
    const categoriesSearchResponse = await CategoriesApiUtil.searchCategories(pageLimit, pageNumber, searchValue, searchByKeyword);
    if (categoriesSearchResponse.hasError) {
      setLoading(false);
      setData([]); //imp
      showAlertUi(true, categoriesSearchResponse.errorMessage); //imp
    } else {
      const categoriesSearchData = categoriesSearchResponse.categories.data;
      /*----------------------setting menu option-----------------------------*/
      /*if (moduleEditCheck || moduleDeleteCheck){
        for (let i = 0; i < categoriesSearchData.length; i++) {
          let item = categoriesSearchData[i];
          item.menu = (
            <CustomTableAtionMenuItem
              tableItem={item}
              tableItemId={item.id}
              tableItemMenuType="categories"
              handleTableMenuItemClick={handleTableMenuItemClick}
              moduleEditCheck={moduleEditCheck}
              moduleDeleteCheck={moduleDeleteCheck}
            />
          );
          if(item.child_categories && item.child_categories.length > 0){
            for(let j=0; j < item.child_categories.length; j++){
              let childItem = item.child_categories[j];
              childItem.parentId = item.id;
              childItem.child_menu = (
                <CustomTableAtionMenuItem
                  tableItem={childItem}
                  tableItemId={childItem.id}
                  tableItemMenuType="categories"
                  handleTableMenuItemClick={handleTableChildMenuItemClick}
                  moduleEditCheck={moduleEditCheck}
                  moduleDeleteCheck={moduleDeleteCheck}
                />
              );
            }
          }
        }
      }*/
      
      /*--------------------------setting menu option-------------------------*/
      setData(categoriesSearchData);
      setPaginationData(categoriesSearchResponse.categories.page || {});
      setLoading(false);
    }
  };

  const fetchCategoriesData = async (pageLimit = 10, pageNumber = 1) => {
    document.getElementById("app-loader-container").style.display = "block";
    const categoriesViewResponse = await CategoriesApiUtil.viewCategories(pageLimit, pageNumber);
    if (categoriesViewResponse.hasError) {
      setLoading(false);
      setData([]); //imp
      document.getElementById("app-loader-container").style.display = "none";
      showAlertUi(true, categoriesViewResponse.errorMessage); //imp
    } else {
      if (mounted) {
        const categoriesData = categoriesViewResponse.categories.data || categoriesViewResponse.categories;
        /*----------------------setting menu option-----------------------------*/
        /*if (moduleEditCheck || moduleDeleteCheck) {
          for (let i = 0; i < categoriesData.length; i++) {
            let item = categoriesData[i];
            item.menu = (
              <CustomTableAtionMenuItem
                tableItem={item}
                tableItemId={item.id}
                tableItemMenuType="categories"
                handleTableMenuItemClick={handleTableMenuItemClick}
                moduleEditCheck={moduleEditCheck}
                moduleDeleteCheck={moduleDeleteCheck}
              />
            );
            if(item.child_categories && item.child_categories.length > 0){
              for(let j=0; j < item.child_categories.length; j++){
                let childItem = item.child_categories[j];
                childItem.parentId = item.id;
                childItem.child_menu = (
                  <CustomTableAtionMenuItem
                    tableItem={childItem}
                    tableItemId={childItem.id}
                    tableItemMenuType="categories"
                    handleTableMenuItemClick={handleTableChildMenuItemClick}
                    moduleEditCheck={moduleEditCheck}
                    moduleDeleteCheck={moduleDeleteCheck}
                  />
                );
              }
            }
          }
        }*/
        /*--------------------------setting menu option-------------------------*/
        setData(categoriesData);
        setPaginationData(categoriesViewResponse.categories.page || {});
        setLoading(false);
        document.getElementById("app-loader-container").style.display = "none";
      }
    }
  };

  useEffect(() => {
    fetchCategoriesData();
    return () => {
      mounted = false;
    };
  }, []);

  function handlePageChange(currentPg) {
    setCurrentPage(currentPg);
    setLoading(true);
    fetchCategoriesData(paginationLimit, currentPg);
  }

  function handleSearchedDataPageChange(currentPg) {
    setCurrentPageSearched(currentPg);
    setLoading(true);
    fetchSearchCategories(paginationLimit, currentPg, searchedData);
  }

  const handleTableMenuItemClick = (categoryId, category, itemLabel) => {
    if (itemLabel === "Edit") {
      return history.push({
        pathname: `/categories/${categoryId}/edit`,
      });
    } else if (itemLabel === "Delete") {
      history.push({
        pathname: `/categories/${categoryId}/delete`,
      });
    }
  };
  
  const handleTableChildMenuItemClick = (categoryId, childCategory, itemLabel) => {
    if (itemLabel === "Edit") {
      return history.push({
        pathname: `/categories/${categoryId}/parent/${childCategory.parentId}/edit`,
      });
    } else if (itemLabel === "Delete") {
      history.push({
        pathname: `/categories/${categoryId}/delete`,
      });
    }
  };

  const showAlertUi = (show, errorText) => {
    Helpers.showAppAlertUiContent(show, errorText);
  };


  return (
    <section className="page category">
      <div className="page__top">
        <SwitchOutlet />
      </div>

      <PageTitle title="Categories" />

      <div className="page__buttons">
        {/* {<Link to="/categories/add" className={!moduleAddCheck && "button-disabled"}>
          <CustomButtonWithIcon
            text="Add Category"
            iconName="Add"
            isLoading={loading}
            disabled={!moduleAddCheck}
          />
        </Link>} */}
      </div>

      <div className="page__search">
        <CustomSearch
          onChange={handleSearchInputChange}
          handleEnterSearch={() => onSearch(inputSearchValue)}
          onClearSearch={onSearch}
          placeholder="Search by Category Name"
        />
        <ButtonSearch
          text="Search"
          clickHandler={() => onSearch(inputSearchValue)}
        />
      </div>

      <div className="page__table">
        <CategoriesTable
          tableData={data}
          paginationData={paginationData}
          tableDataLoading={loading}
          onClickPageChanger={searchedData ? handleSearchedDataPageChange : handlePageChange}
          tableType="categories"
          currentPageIndex={searchedData ? currentPageSearched : currentPage}
        />
      </div>
    </section>
  );
}

export default Categories;
