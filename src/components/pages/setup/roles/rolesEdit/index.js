import React, { useState, useEffect, useReducer } from "react";
import RolesForm from '../common/roles-form';
import * as SetupApiUtil from '../../../../../utils/api/setup-api-utils';
import * as Helpers from "../../../../../utils/helpers/scripts";
import { useHistory } from "react-router-dom";

function EditRoles(props) {
    const { match = {} } = props;
    const { role_id = {} } = match !== undefined && match.params;
    const [roleData, setRoleData] = useState([])
    const history = useHistory();
    let mounted = true;

    useEffect(() => {
        window.scrollTo(0, 0);
        if (role_id !== undefined) {
            fetchUserRoleData(role_id);
        }
        else {
            return popPage();
        }

        return () => {
            mounted = false;
        }

    }, []);

    const fetchUserRoleData = async (roleId) => {
        document.getElementById('app-loader-container').style.display = "block";
        const getRoleResponse = await SetupApiUtil.getUserRoleById(roleId);
        if (getRoleResponse.hasError) {
            console.log('Cant fetch Outlets Data -> ', getRoleResponse.errorMessage);
            document.getElementById('app-loader-container').style.display = "none";
            showAlertUi(true, getRoleResponse.errorMessage);
        }
        else {
            setRoleData(getRoleResponse.data);
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
        <RolesForm
            roleId={role_id}
            heading="Edit Roles"
            initialData={roleData}
            buttonText="Update"
        />
    );
}

export default EditRoles;
