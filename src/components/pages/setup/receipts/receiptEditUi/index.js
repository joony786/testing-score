import React, { useState, useEffect, useReducer } from "react";
import TemplateForm from '../common/templateForm';
import * as SetupApiUtil from '../../../../../utils/api/setup-api-utils';
import * as Helpers from "../../../../../utils/helpers/scripts";
import { useHistory } from "react-router-dom";

function EditTemplate(props) {
  const { match = {} } = props;
  const { template_id = {} } = match !== undefined && match.params;
  const [templateData, setTemplateData] = useState([])
  const history = useHistory();
  let mounted = true;

  useEffect(() => {
    window.scrollTo(0, 0);
    if (template_id !== undefined) {
      fetchtemplateData(template_id);
    }
    else {
      return popPage();
    }

    return () => {
      mounted = false;
    }

  }, []);

  const fetchtemplateData = async (templateId) => {
    document.getElementById('app-loader-container').style.display = "block";
    const getTemplateResponse = await SetupApiUtil.getTemplateById(templateId);
    if (getTemplateResponse.hasError) {
      console.log('Cant fetch Outlets Data -> ', getTemplateResponse.errorMessage);
      document.getElementById('app-loader-container').style.display = "none";
      showAlertUi(true, getTemplateResponse.errorMessage);
    }
    else {
      setTemplateData(getTemplateResponse.template);
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
    <TemplateForm
      heading="Edit Template"
      buttonText="Update"
      templateId={template_id}
      initialData={templateData}
    />
  );
}

export default EditTemplate;
