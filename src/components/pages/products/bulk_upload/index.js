import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Icon } from "@teamfabric/copilot-ui";

// components
import ButtonBack from "../../../atoms/button_back";
import CustomButtonWithIcon from "../../../atoms/button_with_icon";
import SwitchOutlet from "../../../atoms/switch_outlet";
import ButtonUpload from "../../../atoms/button_upload";
import * as ProductsApiUtil from '../../../../utils/api/products-api-utils';
import * as Helpers from "../../../../utils/helpers/scripts";
import UrlConstants from '../../../../utils/constants/url-configs';


var bulkProcess = {
  process: 'Started',
  totalCount: 0,
  doneCount: 0,
  chunk: 50,
};


function BulkUpload() {
  const history = useHistory();
  //const [fileList, setFileList] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isFilePicked, setIsFilePicked] = useState(false);


  const onBulkFileUpload = (event) => {
    
    let file = event.target.files[0];
    if (file && fileExtention(file.name) == "csv") {
      setSelectedFile(file);
      setIsFilePicked(true);
      event.target.value = "";
    } else {
      event.target.value = "";
      showAlertUi(true, "Not a csv file");
    }
  };


  async function onFormSubmit(e) {
    //console.log(products);
    e.preventDefault();
    if (!selectedFile) {
      showAlertUi(true, "No File Selected");
      return;
    }
    const productsBulkUploadResponse = await ProductsApiUtil.productsBulkUpload(
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
      /*setTimeout(() => {
        history.push({
          pathname: '/products',
        });
      }, 500);*/



    }

  }


  function fileExtention(filename) {
    var parts = filename.split(".");
    return parts[parts.length - 1];
  }


  const showAlertUi = (show, errorText) => {
    Helpers.showAppAlertUiContent(show, errorText);
  };


  const handleSelectedProductDelete = () => {
    setIsFilePicked(false);
    setSelectedFile(null);
  };



  let ProductBulkTemplateManualSrc = `${UrlConstants.BASE_URL}/template-files/bulk-products.csv`;   //imp




  return (
    <div className="page">
      <div className="page__top">
        <SwitchOutlet />
        <ButtonBack text="Back to Products" link="/products" />
      </div>

      <div className="page__body">
        <section className="page__header">
          <h1 className="heading heading--primary">Bulk Upload</h1>

          <CustomButtonWithIcon
            size="small"
            isPrimary={true}
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
                <p>Filename: {selectedFile?.name}
                  <span >
                    <Icon
                      iconName="Delete"
                      size={20}
                      className="products-bulk-delete-btn"
                      onClick={handleSelectedProductDelete}
                    />
                  </span>
                </p>
                
              </div>
            ) : (
              <p>Select a file to show details</p>
            )}

            <div className="form__row">
              <p>Download template file from here.
                <span>
                  <a href={ProductBulkTemplateManualSrc} download target="_blank">
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

export default BulkUpload;
