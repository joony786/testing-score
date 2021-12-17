import React, { useState, useEffect, useReducer } from "react";
import { Input, Textarea } from "@teamfabric/copilot-ui";
import { useHistory } from "react-router-dom";
// components
import ButtonBack from "../../../../atoms/button_back";
import CustomButtonWithIcon from "../../../../atoms/button_with_icon";
import SwitchOutlet from "../../../../atoms/switch_outlet";
import ButtonUpload from "../../../../atoms/button_upload";
import * as SetupApiUtil from "../../../../../utils/api/setup-api-utils";
import * as PorductApiUtl from "../../../../../utils/api/products-api-utils";
import * as Helpers from "../../../../../utils/helpers/scripts";
import constants from "../../../../../utils/constants/constants";

function TemplateForm(props) {
  const {
    heading,
    buttonText,
    templateId,
    initialData = {
      name: "",
      image: "",
      header: "",
      footer: "",
    },
  } = props;
  const initialFormValues = {
    name: "",
    image: "",
    header: "",
    footer: "",
  };
  const initialFormErrorsValues = {
    nameError: false,
    imageError: false,
    headerError: false,
    footerError: false,
  };
  const formReducer = (state, event) => {
    return { ...state, ...event };
  };
  const formErrorsReducer = (state, event) => {
    return { ...state, ...event };
  };
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [formData, setFormData] = useReducer(formReducer, initialFormValues);
  const [formErrorsData, setFormErrorsData] = useReducer(
    formErrorsReducer,
    initialFormErrorsValues
  );
  const { name, image, header, footer } = formData;
  const { nameError, imageError, headerError, footerError } = formErrorsData;
  const history = useHistory();

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData({ [name]: value });

    let inputErrorKey = `${name}Error`;
    setFormErrorsData({
      [inputErrorKey]: false,
    });
  };

  const showAlertUi = (show, errorText) => {
    Helpers.showAppAlertUiContent(show, errorText);
  };
  const onFormSubmit = async (event) => {
    event.preventDefault(); //imp
    let formValidationsPassedCheck = true;
    if (!name) {
      formValidationsPassedCheck = false;
      Object.entries(formData).forEach(([key, val]) => {
        //console.log(key, val);
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

      let addTemplatePostData = {};
      addTemplatePostData.name = name;
      addTemplatePostData.image = image;
      addTemplatePostData.header = header;
      addTemplatePostData.footer = footer;

      document.getElementById("app-loader-container").style.display = "block";
      let addTemplateResponse;
      if (templateId) {
        const updateTemplatePutData = {
          ...addTemplatePostData,
        };
        addTemplateResponse = await SetupApiUtil.editTemplate(
          templateId,
          updateTemplatePutData
        );
      } else {
        addTemplateResponse = await SetupApiUtil.addTemplate(
          addTemplatePostData
        );
      }

      if (addTemplateResponse.hasError) {
        console.log("Cant Add User Role -> ", addTemplateResponse.errorMessage);
        setButtonDisabled(false);
        document.getElementById("app-loader-container").style.display = "none";
        showAlertUi(true, addTemplateResponse.errorMessage);
      } else {
        document.getElementById("app-loader-container").style.display = "none";
        setTimeout(() => {
          history.push({
            pathname: "/setup/receipts-templates",
            activeKey: "Receipts Template",
          });
        }, 500);
      }
    }
  };

  const onCancel = (event) => {
    event.preventDefault();
    history.push({
      pathname: "/setup/receipts-templates",
      activeKey: "Receipts Template",
    });
  };

  const fileTypeCheck = async (fileType) => {
    const isTypeAllowed =
      constants.FILE_TYPES.IMAGES_FILE_TYPES.includes(fileType);
    return isTypeAllowed;
  };
  const uploadHandler = async (event) => {
    event.preventDefault();
    const fileList = event.target.files[0];
    console.log("fileList", fileList);
    if (fileList) {
      const isTypeAllowed = await fileTypeCheck(fileList.type);
      if (!isTypeAllowed) {
        return showAlertUi(true, "Select Only Image File Type");
      }
      document.getElementById("app-loader-container").style.display = "block";
      const uploadImageResponse = await PorductApiUtl.imageUpload(fileList);
      console.log("uploadImageResponse", uploadImageResponse);
      if (uploadImageResponse.hasError) {
        console.log("Cant Add Image -> ", uploadImageResponse.errorMessage);
        setButtonDisabled(false);
        document.getElementById("app-loader-container").style.display = "none";
        showAlertUi(true, uploadImageResponse.errorMessage);
      } else {
        document.getElementById("app-loader-container").style.display = "none";
        setFormData({
          image: uploadImageResponse?.upload_data,
        });
      }
    }
    event.target.value = "";
    console.log(fileList);
  };
  useEffect(() => {
    console.log("initialData", initialData);
    if (templateId && Object.keys(initialData)?.length > 0) {
      setFormData({
        name: initialData?.name,
        image: initialData?.image,
        header: initialData?.header,
        footer: initialData?.footer,
      });
    }
  }, [templateId, initialData]);
  return (
    <div className="page edit_outlet">
      <div className="page__top">
        <SwitchOutlet />
        <ButtonBack
          text="Back to Receipt Templates"
          link="/setup/receipts-templates"
        />
      </div>

      <div className="page__body">
        <section className="page__header">
          <h1 className="heading heading--primary">{heading}</h1>
        </section>

        <section className="page__content">
          {/* Form */}
          <form className="form section">
            <fieldset className="form__fieldset">
              <div className="form__row">
                <div className="form__input">
                  <Input
                    className="primary"
                    inputProps={{
                      disabled: false,
                    }}
                    label="*Template Name"
                    inputProps={{
                      onChange: handleFormChange,
                      name: "name",
                      value: name,
                    }}
                    errorMessage="Field Is Required"
                    error={nameError}
                  />
                </div>

                {!image && (
                  <div className="form__input">
                    <ButtonUpload
                      acceptType="image/*"
                      text="Upload Image"
                      disabled={buttonDisabled}
                      uploadHandler={uploadHandler}
                    />
                  </div>
                )}
                {image && (
                  <div className="form__input">
                    <CustomButtonWithIcon
                      text="Remove Image"
                      onClick={() => setFormData({ image: "" })}
                    />
                  </div>
                )}
              </div>

              {image && (
                <div className="form__row image">
                  <img src={image || ""} alt="test"></img>
                </div>
              )}

              <div className="form__row">
                <Textarea
                  className="multiline"
                  label="*Template Header"
                  onEditButtonClick={function noRefCheck() {}}
                  textareaProps={{
                    limit: 100,
                    name: "header",
                    onChange: handleFormChange,
                    value: header,
                  }}
                  width="100%"
                  errorMessage="Field Is Required"
                  error={footerError}
                />
              </div>

              <div className="form__row">
                <Textarea
                  className="multiline"
                  label="*Template Footer"
                  onEditButtonClick={function noRefCheck() {}}
                  textareaProps={{
                    limit: 100,
                    name: "footer",
                    onChange: handleFormChange,
                    value: footer,
                  }}
                  width="100%"
                  errorMessage="Field Is Required"
                  error={footerError}
                />
              </div>

              <div className="form__buttons">
                <CustomButtonWithIcon
                  size="small"
                  isPrimary={false}
                  text="Cancel"
                  onClick={onCancel}
                />
                <CustomButtonWithIcon
                  size="small"
                  isPrimary={true}
                  text={buttonText}
                  disabled={buttonDisabled}
                  onClick={onFormSubmit}
                />
              </div>
            </fieldset>
          </form>
          {/* Form */}
        </section>
      </div>
    </div>
  );
}

export default TemplateForm;
