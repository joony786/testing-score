import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// components
import CustomButtonWithIcon from "../../../atoms/button_with_icon";
import SwitchOutlet from "../../../atoms/switch_outlet";
import PageTitle from "../../../organism/header";
import TableCategory from "../../../organism/table/reports/table_category";

import * as Helpers from "../../../../utils/helpers/scripts";
import { Checkbox, Accordion } from "@teamfabric/copilot-ui";
import { Button } from "@teamfabric/copilot-ui/dist/atoms/button/Button";
import * as ReportsApiUtils from "../../../../utils/api/reports-api-utils"

const CategoryWise = () => {
  const [loading, setLoading] = useState(false);
  const [categoriesData, setCategoriesData] = useState([]);
  const [allCategoriesData, setAllCategoriesData] = useState([]);
  const [uniqueId, setUniqueId] = useState("");
  const [parentId, setParentId] = useState("");
  const [data, setData] = useState([]);
  const [categoriesName, setCategoriesName] = useState("");
  const [categoryName, setCategoryName] = useState("");

  let mounted = false;
  useEffect(() => {
    fetchCategories();
    // fetchSearchCategories();
    return () => (mounted = false);
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    document.getElementById("app-loader-container").style.display = "block";
    const all = "all";
    const limit = 10;
    const PageNumber = 1;
    const categoriesSearchResponse = await ReportsApiUtils.getAllCategories(
      all,
      limit,
      PageNumber
    );
    if (categoriesSearchResponse.hasError) {
      setAllCategoriesData([]);
      setLoading(false);
      document.getElementById("app-loader-container").style.display = "none";
      //showAlertUi(true, categoriesSearchResponse.errorMessage); //imp
    } else {
      const {
        categories: {
          page: { totalElements, totalPages },
        },
      } = categoriesSearchResponse;
      setAllCategoriesData({ totalElements, totalPages });
      await fetchAllCategories(totalElements);
      setLoading(false);
      document.getElementById("app-loader-container").style.display = "none";
    }
  };
  const fetchAllCategories = async (totalElements) => {
    setLoading(true);
    let all = "new";
    const limit = totalElements;
    const PageNumber = 1;
    const categoriesSearchResponse = await ReportsApiUtils.getAllCategories(
      all,
      limit,
      PageNumber
    );
    if (categoriesSearchResponse.hasError) {
      setCategoriesData([]);
      setLoading(false);

      //showAlertUi(true, categoriesSearchResponse.errorMessage); //imp
    } else {
      const categoriesData = categoriesSearchResponse.categories;
      console.log(categoriesData);
      setCategoriesData(categoriesData);

      setLoading(false);
    }
  };

  const handleSelectChild = ({ target: { value } }, name) => {
    setUniqueId(value);
    setParentId(null);
    setCategoriesName(name);
  };

  const handleSelectParent = (value) => setParentId(value);

  const handleSelectParent2 = (value, name) => {
    handleSelectParent(value);
    setParentId(value);
    setCategoriesName(name);
    setUniqueId(null);
  };

  const showAlertUi = (show, errorText) => {
    return Helpers.showAppAlertUiContent(show, errorText);
  };
  const fetchCategoriesByID = async () => {
    let id;
    if (parentId) {
      id = parentId;
    } else id = uniqueId;
    if (id) {
      setData([]);
      document.getElementById("app-loader-container").style.display = "block";
      const categories = await ReportsApiUtils.fetchCategoriesById(id);
      setLoading(true);
      if (categories.hasError) {
        setData([]);
        setCategoryName("");
        setLoading(false);
        showAlertUi(true, categories.errorMessage); //imp
        document.getElementById("app-loader-container").style.display = "none";
      } else {
        const categoriesData = categories.data;
        console.log(categoriesData);
        setData(categoriesData);
        setCategoryName(categoriesName);
        setLoading(false);
        document.getElementById("app-loader-container").style.display = "none";
      }
    } else showAlertUi(true, "Select a category");
    document.getElementById("app-loader-container").style.display = "none";
  };

  const downloadCategory = async () => {
    let id;
    if (parentId) {
      id = parentId;
    } else id = uniqueId;
    if (id) {
      // document.getElementById("app-loader-container").style.display = "block";
      const downloadCategories = await ReportsApiUtils.downloadCategory(id);
      setLoading(true);
      if (downloadCategories.hasError) {
        setData([]);
        setCategoryName("");
        setLoading(false);
        showAlertUi(true, downloadCategories.errorMessage); //imp
        // document.getElementById("app-loader-container").style.display = "none";
      } else {
        const { data } = downloadCategories;
        let a = document.createElement("a");
        a.href = data;
        a.download =
          "category_wise_report_data" + new Date().toUTCString() + ".csv";
        document.body.appendChild(a);
        a.click();
        a.remove();
        setLoading(false);
        // document.getElementById("app-loader-container").style.display = "none";
      }
    } else showAlertUi(true, "Select a category");
    // document.getElementById("app-loader-container").style.display = "none";
  };

  const status = parentId || uniqueId ? false : true;
  return (
    <section className="page reports">
      <div className="page__top">
        <SwitchOutlet />
      </div>

      <PageTitle title="Category Wise" />

      <div className="page__buttons">
        <CustomButtonWithIcon
          text="Download"
          onClick={downloadCategory}
          iconName="Download"
          disabled={status}
        />
      </div>

      <section className="page__section">
        <div className="fetchCategories_Container">
          <h2 className="heading heading--primary">Category Wise Report</h2>
          <Button
            disabled={status}
            isPrimary={true}
            onClick={fetchCategoriesByID}
            size="small"
            text="Fetch"
          />
        </div>

        {categoriesData && categoriesData.length > 0 ? (
          <div className="category">
            {categoriesData.map(({ name, id, child_categories }, index) => {
              return (
                <div className="categories_report" key={id}>
                  {child_categories ? (
                    <div className="categories_parentContainer">
                      <Accordion
                        count={child_categories.length}
                        icon="DownCaret"
                        render={() => (
                          <div
                            onClick={(e) => handleSelectParent2(id, name)}
                            className="categories_checkbox"
                          >
                            <Checkbox
                              className="form__checkbox"
                              isPartial
                              onChange={handleSelectParent}
                              value={id}
                              checked={id === parentId}
                            />
                          </div>
                        )}
                        title={name}
                      >
                        <div className="dataset-wrapper">
                          {child_categories.map(({ name, id }) => {
                            return (
                              <ul key={id}>
                                <li key={index}>
                                  <Checkbox
                                    className="form__checkbox"
                                    label={name}
                                    onChange={(e) => handleSelectChild(e, name)}
                                    value={id}
                                    checked={id === uniqueId}
                                  />
                                  <br />
                                </li>
                              </ul>
                            );
                          })}
                        </div>
                      </Accordion>
                    </div>
                  ) : (
                    <Accordion
                      count={1}
                      icon="DownCaret"
                      render={() => (
                        <div
                          onClick={(e) => handleSelectParent2(id, name)}
                          className="categories_checkbox"
                        >
                          <Checkbox
                            className="form__checkbox"
                            isPartial
                            onChange={handleSelectParent}
                            value={id}
                            checked={id === parentId}
                          />
                        </div>
                      )}
                      title={name}
                    ></Accordion>
                  )}
                </div>
              );
            })}
          </div>
        ) : loading ? (
          ""
        ) : (
          <h2 className="heading heading--primary categories_noData">
            No categories found
          </h2>
        )}
        <div className="page__table">
          {data && data.length > 0 && (
            <TableCategory categoriesName={categoryName} Data={data} loading={loading} />
          )}
        </div>
      </section>
    </section>
  );
};

export default CategoryWise;
