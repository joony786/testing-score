import React, { useState, useEffect } from "react";


// components
import ButtonBack from "../../../atoms/button_back";
import CustomButtonWithIcon from "../../../atoms/button_with_icon";
import SwitchOutlet from "../../../atoms/switch_outlet";
import ButtonUpload from "../../../atoms/button_upload";
import * as StockAPIUtils from '../../../../utils/api/stock-api-utils';
import * as Helpers from "../../../../utils/helpers/scripts";
import UrlConstants from '../../../../utils/constants/url-configs';





const BulkUploadPurchaseOrder = () => {

  const [selectedFile, setSelectedFile] = useState(null);
  const [isFilePicked, setIsFilePicked] = useState(false);


  const onBulkFileUpload = (event) => {
    setSelectedFile(event.target.files[0]);
    setIsFilePicked(true);

    console.log(event.target.files[0]); //imp
    const file = event.target.files[0];
      console.log( fileExtention(file.name));
    
  };


  async function onFormSubmit(e) {
    e.preventDefault();
    if (!selectedFile) {
      showAlertUi(true, "No File Selected");
      return;
    }
    if (selectedFile && fileExtention(selectedFile.name) === "csv") {
      const productsBulkUploadResponse = await StockAPIUtils.bulkUploadPurchaseOrder(
        selectedFile
      );
      console.log("productsBulkUploadResponse:", productsBulkUploadResponse);
  
      if (productsBulkUploadResponse.hasError) {
        console.log(
          "Cant Upload Bulk products -> ",
          productsBulkUploadResponse.errorMessage
        );
  
        document.getElementById('app-loader-container').style.display = "none";
        showAlertUi(true, productsBulkUploadResponse.errorMessage);
      } else {
        document.getElementById('app-loader-container').style.display = "none";
      }
    } 
    else {
      showAlertUi(true, "Not an csv file");
    }

  }


  function fileExtention(filename) {
    const parts = filename.split(".");
    return parts[parts.length - 1];
  }


  const showAlertUi = (show, errorText) => {
    Helpers.showAppAlertUiContent(show, errorText);
  };













 const ProductBulkTemplateManualSrc = `${UrlConstants.BASE_URL}/template-files/shopdesk-bulk-upload-instruction-manual.pdf`;   //imp




  return (
    <div className="page">
      <div className="page__top">
        <SwitchOutlet />
        <ButtonBack text="Back to purchase order" link="/stock-control/purchase-orders/add" />
      </div>

      <div className="page__body">
        <section className="page__header">
          <h1 className="heading heading--primary">Bulk Upload</h1>

          <CustomButtonWithIcon
            size="small"
            isPrimary="true"
            text="Upload"
            onClick={onFormSubmit}
          />
        </section>

        <section className="page__content">
          <form className="form">
            <div className="form__row">
              <ButtonUpload text="Click to Upload"
                uploadHandler={onBulkFileUpload} />
            </div>

            {isFilePicked ? (
              <div>
                <p>Filename: {selectedFile.name}</p>
              </div>
            ) : (
              <p>Select a file to show details</p>
            )}

            <div className="form__row">
              <p>Download template file from here.
                <span>
                  <a href={ProductBulkTemplateManualSrc} download target="_blank" rel="noreferrer">
                    &nbsp;here.
                  </a>
                </span>
              </p>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

export default BulkUploadPurchaseOrder;
