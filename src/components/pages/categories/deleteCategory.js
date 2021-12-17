import React, { useState, useEffect } from "react";
import { Button, Shimmer } from "@teamfabric/copilot-ui";

// components
import ButtonBack from "../../atoms/button_back";
import * as CategoriesApiUtil from "../../../utils/api/categories-api-utils";
import * as Helpers from "../../../utils/helpers/scripts";
import PageTitle from "../../organism/header";
import SwitchOutlet from "../../atoms/switch_outlet";
import { useHistory } from "react-router-dom";

function DeleteCategory(props) {
  const history = useHistory();
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const { match = {} } = props;
  const { cat_id = {} } = match !== undefined && match.params;
  let mounted = true;
  useEffect(() => {
    window.scrollTo(0, 0);
    if (cat_id !== undefined) {
      getCategory(cat_id);
    } else {
      return popPage();
    }
    return () => {
      mounted = false;
    };
  }, []);

  const getCategory = async (categoryId) => {
    document.getElementById("app-loader-container").style.display = "block";
    const getCategoryResponse = await CategoriesApiUtil.getCategory(categoryId);
    if (getCategoryResponse.hasError) {
      setLoading(false);
      document.getElementById("app-loader-container").style.display = "none";
      showAlertUi(true, getCategoryResponse.errorMessage); //imp
      return delayPopPage();
    } else {
      if (mounted) {
        //imp if unmounted
        let categoryData = getCategoryResponse.categories[0]; //vvimp
        setSelectedCategoryName(categoryData.name);
        setLoading(false);
        document.getElementById("app-loader-container").style.display = "none";
      }
    }
  };

  const onFormSubmit = async (event) => {
    event.preventDefault(); //imp to use here
    let formValidationsPassedCheck = true;

    if (!selectedCategoryName) {
      formValidationsPassedCheck = false;
    }

    if (formValidationsPassedCheck) {
      if (buttonDisabled === false) {
        setButtonDisabled(true);
      }

      document.getElementById("app-loader-container").style.display = "block";
      const categoryDeleteResponse = await CategoriesApiUtil.deleteCategory(
        cat_id
      );
      if (categoryDeleteResponse.hasError) {
        setButtonDisabled(false);
        document.getElementById("app-loader-container").style.display = "none";
        showAlertUi(true, categoryDeleteResponse.errorMessage); //imp
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

  const showAlertUi = (show, errorText) => {
    Helpers.showAppAlertUiContent(show, errorText);
  };

  const handleCancel = (event) => {
    event.preventDefault();
    history.push({
      pathname: "/categories",
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

      <PageTitle title="Delete Category" />
      <div className="page__body">
        {loading && <Shimmer className="primary" count={1} perRow={2} />}

        {!loading && (
          <section className="page__content">
            <form className="form" onSubmit={onFormSubmit}>
              <fieldset className="form__fieldset">
                <div className="form__row">
                  <div className="item-delete-content">
                    Do you really want to delete '
                    {selectedCategoryName && selectedCategoryName}'?
                  </div>
                </div>
                <div className="form__row footer-delete-btns">
                  <Button
                    className="delete-confirm-button"
                    size="small"
                    isPrimary={true}
                    text="Confirm"
                    disabled={buttonDisabled}
                  />
                  <Button
                    size="small"
                    isPrimary={true}
                    className="button button__white"
                    text="Cancel"
                    onClick={handleCancel}
                  />
                </div>
              </fieldset>
            </form>
          </section>
        )}
      </div>
    </div>
  );
}

export default DeleteCategory;
