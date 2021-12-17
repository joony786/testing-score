import Constants from "../../utils/constants/constants";
//import Permissions from "../../utils/constants/user-permissions";
/*import {
  getDataFromLocalStorage,
} from "../../utils/local-storage/local-store-utils";*/

// Array.prototype.remove = function(from, to) {
//     var rest = this.slice((to || from) + 1 || this.length);
//     this.length = from < 0 ? this.length + from : from;
//     return this.push.apply(this, rest);
// };

export function uniqid() {
  var ts = String(new Date().getTime()),
    i = 0,
    out = "";
  for (i = 0; i < ts.length; i += 3) {
    out += Number(ts.substr(i, 2)).toString(36);
  }
  return "d" + out;
}

export function makeUniqueReceiptId(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';  //62 length
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() *
      charactersLength));
  }
  return result;
}


function CSVToArray(strData, strDelimiter) {
  // Check to see if the delimiter is defined. If not,
  // then default to comma.
  strDelimiter = strDelimiter || ",";
  // Create a regular expression to parse the CSV values.
  var objPattern = new RegExp(
    // Delimiters.
    "(\\" +
    strDelimiter +
    "|\\r?\\n|\\r|^)" +
    // Quoted fields.
    '(?:"([^"]*(?:""[^"]*)*)"|' +
    // Standard fields.
    '([^"\\' +
    strDelimiter +
    "\\r\\n]*))",
    "gi"
  );
  // Create an array to hold our data. Give the array
  // a default empty first row.
  var arrData = [[]];
  // Create an array to hold our individual pattern
  // matching groups.
  var arrMatches = null;
  // Keep looping over the regular expression matches
  // until we can no longer find a match.
  while ((arrMatches = objPattern.exec(strData))) {
    // Get the delimiter that was found.
    var strMatchedDelimiter = arrMatches[1];
    // Check to see if the given delimiter has a length
    // (is not the start of string) and if it matches
    // field delimiter. If id does not, then we know
    // that this delimiter is a row delimiter.
    if (strMatchedDelimiter.length && strMatchedDelimiter != strDelimiter) {
      // Since we have reached a new row of data,
      // add an empty row to our data array.
      arrData.push([]);
    }
    // Now that we have our delimiter out of the way,
    // let's check to see which kind of value we
    // captured (quoted or unquoted).
    if (arrMatches[2]) {
      // We found a quoted value. When we capture
      // this value, unescape any double quotes.
      var strMatchedValue = arrMatches[2].replace(new RegExp('""', "g"), '"');
    } else {
      // We found a non-quoted value.
      var strMatchedValue = arrMatches[3];
    }
    // Now that we have our value string, let's add
    // it to the data array.
    arrData[arrData.length - 1].push(strMatchedValue);
  }
  // Return the parsed data.
  return arrData;
}

export function CSV2JSON(csv) {
  var array = CSVToArray(csv);
  var objArray = [];
  for (var i = 1; i < array.length; i++) {
    objArray[i - 1] = {};
    for (var k = 0; k < array[0].length && k < array[i].length; k++) {
      var key = array[0][k];
      objArray[i - 1][key] = array[i][k];
    }
  }

  var json = JSON.stringify(objArray);
  var str = json.replace(/},/g, "},\r\n");

  return str;
}


export function createCSV(fileName, data) {
  const hiddenElement = document.createElement("a");
  hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(data);
  hiddenElement.target = "_blank";
  hiddenElement.download = fileName + ".csv";
  hiddenElement.click();
}


export function CSV2JSONUpdated(csv) {
  var array = CSVToArray(csv);
  var objArray = [];
  for (var i = 1; i < array.length-1; i++) {
    objArray[i - 1] = {};
    for (var k = 0; k < array[0].length && k < array[i].length; k++) {
      var key = array[0][k];
      if (key == 'attributes') {
        array[i][k] = array[i][k].replace('[', '');
        array[i][k] = array[i][k].replace(']', '');
        var str = array[i][k];
        var indices = [];
        var indices1 = [];
        for (var j = 0; j < str.length; j++) {
          if (str[j] === "{") indices.push(j);
          if (str[j] === "}") indices1.push(j);
        }
        var arr = [];
        for (var v = 0; v < indices.length; v++) {
          arr.push(array[i][k].substring(indices[v], indices1[v] + 1));
        }
        array[i][k] = arr;
      }
      objArray[i - 1][key] = array[i][k];
    }
  }
  var json = JSON.stringify(objArray);
  var str = json.replace(/},/g, "},\r\n");
  return str;
}


/*

$(function() {
  $(document).on("input", "#loc", function() {
    var loc = $("#loc").val();
    $.ajax({
      type: "GET",
      url: "http://pagecabinet.com/locationapi.php",
      data: { q: loc },
      success: function(res) {
        var locarr = [];
        for (var i = 0; i < res.predictions.length; i++) {
          locarr[i] = res.predictions[i].description;
        }
        $("#loc").autocomplete({ source: locarr });
      }
    });
  });
  $(document).on("click", ".sub-menu", function() {
    $(this)
      .find(".arrow")
      .toggleClass("sub-open");
  });
  // Remove Nav
  $(document).on("click", "#toggleMenu", function() {
    $("#page-wrapper").toggleClass("toggleNav");
    $("#sd-navbar").toggleClass("toggleNav2");
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 500);
  });
});  */

export const registeredProductsPageLimit = 1000;
export const suppliersPageLimit = 100;
export const outletsPageLimit = 100;
export const couriersPageLimit = 100;
export const templatesPageLimit = 100;
export const productsSearchPageLimit = 100;
export const productsSearchPageNumber = 1;
export const genericSearchPageLimit = 100;
export const genericSearchPageNumber = 1;

export const WomensWearSuperUserAccountIds = ["377", "374"];


export function showAppAlertUiContent(show, errorText) {
  document.getElementById('app-alert-ui-container').style.display = "block";
  let el = document.querySelector("div#app-alert-ui-container .alert-content .label");  //imp
  //console.log(el);
  el.innerHTML = errorText;
  setTimeout(() => {
    document.getElementById('app-alert-ui-container').style.display = "none";
  }, 2000);

}

export function showWarningAppAlertUiContent(show, errorText) {
  document.getElementById('app-alert-ui-container').style.display = "block";
  let el = document.querySelector("div#app-alert-ui-container .alert-content .label");  //imp
  el.innerHTML = errorText;
  document.getElementsByClassName('alert-content')[0].style.backgroundColor = "#000";
  setTimeout(() => {
    document.getElementById('app-alert-ui-container').style.display = "none";
  }, 2000);

}

export function showSuccessAlertUiContent(show,successMsg){
  document.getElementById('app-alert-ui-container').style.display = "block";
  let el = document.querySelector("div#app-alert-ui-container .alert-content .label");  //imp
  el.innerHTML = successMsg;
  document.getElementsByClassName('alert-content')[0].style.backgroundColor = "#93EE44";
  setTimeout(() => {
    document.getElementById('app-alert-ui-container').style.display = "none";
  }, 2000);
}



export function getSalesInvoiceActiveStatus(invoiceStatus, invoiceDeadStatus) {

  if (invoiceStatus === Constants.REGISTER_SALES_HISTORY.INVOICE_STATUSES.PARKED.KEY_PARKED &&
    invoiceDeadStatus === Constants.REGISTER_SALES_HISTORY.INVOICE_STATUSES.PARKED.KEY_DEAD) {
    return Constants.REGISTER_SALES_HISTORY.INVOICE_STATUSES.PARKED.VALUE;
  }

  else if (invoiceStatus === Constants.REGISTER_SALES_HISTORY.INVOICE_STATUSES.DEAD.KEY_PARKED &&
    invoiceDeadStatus === Constants.REGISTER_SALES_HISTORY.INVOICE_STATUSES.DEAD.KEY_DEAD) {
    return Constants.REGISTER_SALES_HISTORY.INVOICE_STATUSES.DEAD.VALUE
  }

  else if (invoiceStatus === Constants.REGISTER_SALES_HISTORY.INVOICE_STATUSES.COMPLETED.KEY) {
    return Constants.REGISTER_SALES_HISTORY.INVOICE_STATUSES.COMPLETED.VALUE
  }

  else if (invoiceStatus === Constants.REGISTER_SALES_HISTORY.INVOICE_STATUSES.RETURNED_COMPLETED.KEY) {
    return Constants.REGISTER_SALES_HISTORY.INVOICE_STATUSES.RETURNED_COMPLETED.VALUE;
  }
  else {
    return "";

  }

}


export function var_check(v) {
  if (typeof v !== "undefined" && v !== "" && v !== null) return true;
  else return false;
}


export function var_check_updated(v) {
  if (v !== "undefined" && v !== "null" && v !== "" && v !== null) return true;
  else return false;
}

export function var_check_updated_all(v) {
  if (v !== "undefined" && v !== "null" && v !== "" && v !== null && v !== undefined) return true;
  else return false;
}


export function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

export function current_datetime() {
  var currentdate = new Date();
  var datetime =
    currentdate.getFullYear() +
    "/" +
    (currentdate.getMonth() + 1) +
    "/" +
    currentdate.getDate() +
    " " +
    currentdate.getHours() +
    ":" +
    currentdate.getMinutes() +
    ":" +
    currentdate.getSeconds();
  return datetime;
}

//$(document).ready(() => {});

export const toFixed = (num) => {
  num = num.toString(); //If it's not already a String
  num = num.slice(0, (num.indexOf("."))+2); //With 3 exposing the hundredths place
  return Number(num); //If you need it back as a Number
}