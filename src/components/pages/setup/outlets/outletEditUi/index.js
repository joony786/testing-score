import React, { useState, useEffect, useReducer } from "react";
import OutletForm from "../common/outlet-form";

import * as SetupApiUtil from '../../../../../utils/api/setup-api-utils';
import * as Helpers from "../../../../../utils/helpers/scripts";
import { useHistory } from "react-router-dom";


function EditOutlet(props) {
  const { match = {} } = props;
  const { outlet_id = {} } = match !== undefined && match.params;
  const [outletData, setOutletData] = useState([])
  const history = useHistory();
  let mounted = true;

  useEffect(() => {
    window.scrollTo(0, 0);
    if (outlet_id !== undefined) {
      fetchOutletData(outlet_id);
    }
    else {
      return popPage();
    }

    return () => {
      mounted = false;
    }

  }, []);

  const fetchOutletData = async (outletId) => {
    document.getElementById('app-loader-container').style.display = "block";
    const getOutletResponse = await SetupApiUtil.getOutletById(outletId);
    console.log('getOutletResponse', getOutletResponse)
    if (getOutletResponse.hasError) {
      console.log('Cant fetch Outlets Data -> ', getOutletResponse.errorMessage);
      document.getElementById('app-loader-container').style.display = "none";
      showAlertUi(true, getOutletResponse.errorMessage);
    }
    else {
      setOutletData(getOutletResponse.store || {});
      document.getElementById('app-loader-container').style.display = "none";

    }
  }
  const showAlertUi = (show, errorText) => {
    Helpers.showAppAlertUiContent(show, errorText);
  }

  const popPage = () => {
    history.goBack();
  };
  return (
    <OutletForm
      heading="Edit Outlet"
      buttonText="Update"
      outletId={outlet_id}
      initialData={outletData}
      isEdit={true}
    />
  );
}

export default EditOutlet;
