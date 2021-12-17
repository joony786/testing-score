import Constants from "../../utils/constants/constants";
import Permissions from "../../utils/constants/user-permissions";
import {
  getDataFromLocalStorage,
} from "../../utils/local-storage/local-store-utils";




export function checkUserModuleRolePermission(userPermissionReadKey) {

  let readFromLocalStorage = getDataFromLocalStorage(Constants.USER_DETAILS_KEY);
  readFromLocalStorage = readFromLocalStorage.data
    ? readFromLocalStorage.data
    : null;
  let permissionsScopes = readFromLocalStorage?.user_info?.permissions || {};

  return (userPermissionReadKey in permissionsScopes);
  
}



export function checkUserModuleRoutePermission() {
  let pathName = window.location.pathname;
  let pathNameArr = pathName.split("/");

  let addCheckValue = "add";
  let updateCheckValue = "edit";
  let deleteCheckValue = "delete";
  let viewCheckValue = "view";
  let receiveCheckValue = "receive";
  let grnViewCheckValue = "grn-view";
  //let writeSellCheckValue = "sell";


  let modulePathName = pathNameArr[2]; //imp to split path to check main root path of any module


  if (modulePathName === Constants.ALL_MODULE_NAMES.CATEGORIES) {  //categories module

    if (pathNameArr.includes(addCheckValue)) {  //if write
      return checkUserModuleRolePermission(Permissions.USER_PERMISSIONS.WRITE.CATEGORIES);
    }
    else if (pathNameArr.includes(updateCheckValue)) {  //if update
      return checkUserModuleRolePermission(Permissions.USER_PERMISSIONS.UPDATE.CATEGORIES);
    }
    else if (pathNameArr.includes(deleteCheckValue)) {  //if delete
      return checkUserModuleRolePermission(Permissions.USER_PERMISSIONS.DELETE.CATEGORIES);
    }
    else {  // read
      return checkUserModuleRolePermission(Permissions.USER_PERMISSIONS.READ.CATEGORIES);
    }

  } //categories module

  else if (modulePathName === Constants.ALL_MODULE_NAMES.TAXES) {  //taxes module

    if (pathNameArr.includes(addCheckValue)) {  //if write
      return checkUserModuleRolePermission(Permissions.USER_PERMISSIONS.WRITE.TAXES);
    }
    else if (pathNameArr.includes(updateCheckValue)) {  //if update
      return checkUserModuleRolePermission(Permissions.USER_PERMISSIONS.UPDATE.TAXES);
    }
    else if (pathNameArr.includes(deleteCheckValue)) {  //if delete
      return checkUserModuleRolePermission(Permissions.USER_PERMISSIONS.DELETE.TAXES);
    }
    else {  // read
      return checkUserModuleRolePermission(Permissions.USER_PERMISSIONS.READ.TAXES);
    }

  } //taxes module

  else if (modulePathName === Constants.ALL_MODULE_NAMES.SUPPLIERS) {  //suppliers module

    if (pathNameArr.includes(addCheckValue)) {  //if write
      return checkUserModuleRolePermission(Permissions.USER_PERMISSIONS.WRITE.SUPPLIERS);
    }
    else if (pathNameArr.includes(updateCheckValue)) {  //if update
      return checkUserModuleRolePermission(Permissions.USER_PERMISSIONS.UPDATE.SUPPLIERS);
    }
    else if (pathNameArr.includes(deleteCheckValue)) {  //if delete
      return checkUserModuleRolePermission(Permissions.USER_PERMISSIONS.DELETE.SUPPLIERS);
    }
    else {  // read
      return checkUserModuleRolePermission(Permissions.USER_PERMISSIONS.READ.SUPPLIERS);
    }

  } //suppliers module

  else if (modulePathName === Constants.ALL_MODULE_NAMES.CUSTOMERS) {  //customers module

    if (pathNameArr.includes(addCheckValue)) {  //if write
      return checkUserModuleRolePermission(Permissions.USER_PERMISSIONS.WRITE.CUSTOMERS);
    }
    else if (pathNameArr.includes(updateCheckValue)) {  //if update
      return checkUserModuleRolePermission(Permissions.USER_PERMISSIONS.UPDATE.CUSTOMERS);
    }
    else if (pathNameArr.includes(deleteCheckValue)) {  //if delete
      return checkUserModuleRolePermission(Permissions.USER_PERMISSIONS.DELETE.CUSTOMERS);
    }
    else {  // read
      return checkUserModuleRolePermission(Permissions.USER_PERMISSIONS.READ.CUSTOMERS);
    }

  } //customers module

  else if (modulePathName === Constants.ALL_MODULE_NAMES.PRODUCTS) {  //products module

    if (pathNameArr.includes(addCheckValue)) {  //if write
      return checkUserModuleRolePermission(Permissions.USER_PERMISSIONS.WRITE.PRODUCTS);
    }
    else if (pathNameArr.includes(updateCheckValue)) {  //if update
      return checkUserModuleRolePermission(Permissions.USER_PERMISSIONS.UPDATE.PRODUCTS);
    }
    else if (pathNameArr.includes(deleteCheckValue)) {  //if delete
      return checkUserModuleRolePermission(Permissions.USER_PERMISSIONS.DELETE.PRODUCTS);
    }
    else {  // read
      return checkUserModuleRolePermission(Permissions.USER_PERMISSIONS.READ.PRODUCTS);
    }

  } //products module

  else if (modulePathName === Constants.ALL_MODULE_NAMES.REGISTER) {  //register module

    if (pathNameArr[3] === Constants.ALL_MODULE_NAMES.SUB_LEVEL_MODULES.SELL) {  //if sell

      return (checkUserModuleRolePermission(Permissions.USER_PERMISSIONS.WRITE.INVOICES) ||
        checkUserModuleRolePermission(Permissions.USER_PERMISSIONS.UPDATE.INVOICES));
    }

    if (pathNameArr[3] === Constants.ALL_MODULE_NAMES.SUB_LEVEL_MODULES.SALE_HISTORY) {  //sales history
      return checkUserModuleRolePermission(Permissions.USER_PERMISSIONS.READ.INVOICES);
    }

    if (pathNameArr[3] === Constants.ALL_MODULE_NAMES.SUB_LEVEL_MODULES.SINGLE_INVOICE_VIEW &&
      pathNameArr.includes(viewCheckValue)) {  //get specific invoice view
      return checkUserModuleRolePermission(Permissions.USER_PERMISSIONS.READ.INVOICES);
    }

  } //register module

  else if (modulePathName === Constants.ALL_MODULE_NAMES.STOCK) {  //stock module

    if (pathNameArr[3] === Constants.ALL_MODULE_NAMES.SUB_LEVEL_MODULES.PURCHASE_ORDERS) {  //if PO

      if (pathNameArr.includes(addCheckValue)) {  //if write
        return checkUserModuleRolePermission(Permissions.USER_PERMISSIONS.WRITE.PURCHASE_ORDERS);
      }
      else if (pathNameArr.includes(receiveCheckValue)) {  //if update
        return checkUserModuleRolePermission(Permissions.USER_PERMISSIONS.UPDATE.PURCHASE_ORDERS);
      }
      else if (pathNameArr.includes(grnViewCheckValue)) {  //if grn read
        return checkUserModuleRolePermission(Permissions.USER_PERMISSIONS.READ.PO_GOOD_RECEIVE_NOTES);
      }
      else {  // read
        return checkUserModuleRolePermission(Permissions.USER_PERMISSIONS.READ.PURCHASE_ORDERS);
      }

    }   //if PO

    if (pathNameArr[3] === Constants.ALL_MODULE_NAMES.SUB_LEVEL_MODULES.STOCK_ADJUSTMENTS) {  //if SADJ

        if (pathNameArr.includes(addCheckValue)) {  //if write
            return checkUserModuleRolePermission(Permissions.USER_PERMISSIONS.WRITE.STOCK_ADJUSTMENTS);
        }
        else if (pathNameArr.includes(viewCheckValue)) {  //if update
            return checkUserModuleRolePermission(Permissions.USER_PERMISSIONS.READ.STOCK_ADJUSTMENTS);
        }
        else {  // read
            return checkUserModuleRolePermission(Permissions.USER_PERMISSIONS.READ.STOCK_ADJUSTMENTS);
        }
    }   //if SADJ

    if (pathNameArr[3] === Constants.ALL_MODULE_NAMES.SUB_LEVEL_MODULES.TRANSFERS) {  //if STR

        if (pathNameArr.includes(addCheckValue)) {  //if write
            return checkUserModuleRolePermission(Permissions.USER_PERMISSIONS.WRITE.TRANSFERS);
        }
        else if (pathNameArr.includes(receiveCheckValue)) {  //if update
            return checkUserModuleRolePermission(Permissions.USER_PERMISSIONS.UPDATE.TRANSFERS);
        }
        else {  // read
            return checkUserModuleRolePermission(Permissions.USER_PERMISSIONS.READ.TRANSFERS);
        }
    }   //if STR

    if (pathNameArr[3] === Constants.ALL_MODULE_NAMES.SUB_LEVEL_MODULES.STOCK_RETURNS) {  //if stock returns

        if (pathNameArr.includes(addCheckValue)) {  //if write
            return checkUserModuleRolePermission(Permissions.USER_PERMISSIONS.WRITE.STOCK_RETURNS);
        }
        else if (pathNameArr.includes(viewCheckValue)) {  //if update
            return checkUserModuleRolePermission(Permissions.USER_PERMISSIONS.READ.STOCK_RETURNS);
        }
        else {  // read
            return checkUserModuleRolePermission(Permissions.USER_PERMISSIONS.READ.STOCK_RETURNS);
        }
    }  //stock returns


  } //stock module


  else if (modulePathName === Constants.ALL_MODULE_NAMES.SETUP) {  //setup module

    if (pathNameArr[3] === Constants.ALL_MODULE_NAMES.SUB_LEVEL_MODULES.STORES) {  //if outlets

      if (pathNameArr.includes(addCheckValue)) {  //if write
        return checkUserModuleRolePermission(Permissions.USER_PERMISSIONS.WRITE.STORES);
      }
      else if (pathNameArr.includes(updateCheckValue)) {  //if update
        return checkUserModuleRolePermission(Permissions.USER_PERMISSIONS.UPDATE.STORES);
      }
      else if (pathNameArr.includes(deleteCheckValue)) {  //if delete
        return checkUserModuleRolePermission(Permissions.USER_PERMISSIONS.DELETE.STORES);
      }
      else {  // read
        return checkUserModuleRolePermission(Permissions.USER_PERMISSIONS.READ.STORES);
      }

    }
    if (pathNameArr[3] === Constants.ALL_MODULE_NAMES.SUB_LEVEL_MODULES.BRANDS) {  //if brands

      if (pathNameArr.includes(addCheckValue)) {  //if write
        return checkUserModuleRolePermission(Permissions.USER_PERMISSIONS.WRITE.BRANDS);
      }
      else if (pathNameArr.includes(updateCheckValue)) {  //if update
        return checkUserModuleRolePermission(Permissions.USER_PERMISSIONS.UPDATE.BRANDS);
      }
      else if (pathNameArr.includes(deleteCheckValue)) {  //if delete
        return checkUserModuleRolePermission(Permissions.USER_PERMISSIONS.DELETE.BRANDS);
      }
      else {  // read
        return checkUserModuleRolePermission(Permissions.USER_PERMISSIONS.READ.BRANDS);
      }

    }
    if (pathNameArr[3] === Constants.ALL_MODULE_NAMES.SUB_LEVEL_MODULES.TEMPLATES) {  //if templates

      if (pathNameArr.includes(addCheckValue)) {  //if write
        return checkUserModuleRolePermission(Permissions.USER_PERMISSIONS.WRITE.TEMPLATES);
      }
      else if (pathNameArr.includes(updateCheckValue)) {  //if update
        return checkUserModuleRolePermission(Permissions.USER_PERMISSIONS.UPDATE.TEMPLATES);
      }
      else if (pathNameArr.includes(deleteCheckValue)) {  //if delete
        return checkUserModuleRolePermission(Permissions.USER_PERMISSIONS.DELETE.TEMPLATES);
      }
      else {  // read
        return checkUserModuleRolePermission(Permissions.USER_PERMISSIONS.READ.TEMPLATES);
      }

    }
    if (pathNameArr[3] === Constants.ALL_MODULE_NAMES.SUB_LEVEL_MODULES.USERS) {  //if users

      if (pathNameArr.includes(addCheckValue)) {  //if write
        return checkUserModuleRolePermission(Permissions.USER_PERMISSIONS.WRITE.USERS);
      }
      else if (pathNameArr.includes(updateCheckValue)) {  //if update
        return checkUserModuleRolePermission(Permissions.USER_PERMISSIONS.UPDATE.USERS);
      }
      else if (pathNameArr.includes(deleteCheckValue)) {  //if delete
        return checkUserModuleRolePermission(Permissions.USER_PERMISSIONS.DELETE.USERS);
      }
      else {  // read
        return checkUserModuleRolePermission(Permissions.USER_PERMISSIONS.READ.USERS);
      }

    }
    if (pathNameArr[3] === Constants.ALL_MODULE_NAMES.SUB_LEVEL_MODULES.USER_ROLES){  //if users

      if (pathNameArr.includes(addCheckValue)) {  //if write
        return checkUserModuleRolePermission(Permissions.USER_PERMISSIONS.WRITE.USER_ROLES);
      }
      else if (pathNameArr.includes(updateCheckValue)) {  //if update
        return checkUserModuleRolePermission(Permissions.USER_PERMISSIONS.UPDATE.USER_ROLES);
      }
      else if (pathNameArr.includes(deleteCheckValue)) {  //if delete
        return checkUserModuleRolePermission(Permissions.USER_PERMISSIONS.DELETE.USER_ROLES);
      }
      else {  // read
        return checkUserModuleRolePermission(Permissions.USER_PERMISSIONS.READ.USER_ROLES);
      }

    }
    else {  //if configurations
      return true; 
    }

  } //setup module

  else if (modulePathName === Constants.ALL_MODULE_NAMES.REPORTS) { //reports module
    return true;
  }  //reports module
  else if (modulePathName === Constants.ALL_MODULE_NAMES.ECOMMERCE) {  //ecommerce module
    return true;
  } //ecommerce module
  else if (modulePathName === Constants.ALL_MODULE_NAMES.ACTIONS_HISTORY) {  //actions history module
    return true;
  } //actions history module
  else {  //otherwise true
    return true;
  }


  
}




