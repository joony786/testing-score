import * as ProductsApiUtil from "../../../../utils/api/products-api-utils";
import {genericSearchPageLimit} from "../../../../utils/helpers/scripts";

// search for without-scan
export const SearchDataWithoutScan = async (value) => {
    let currValue = value;
    currValue = currValue.toLowerCase();
    if (currValue === "") {
       return [];
    } else {
        let limit = genericSearchPageLimit;
        let pageNumber = 1;
        document.getElementById("app-loader-container").style.display = "block";
        const response = await ProductsApiUtil.searchProducts(limit,pageNumber,currValue,)
        if(response.hasError){
            console.log(
                "Cant fetch registered products Data -> ",
                response.errorMessage
            );
            //message.warning(productsDiscountsViewResponse.errorMessage, 3);
            document.getElementById("app-loader-container").style.display = "none";
        }
    else if(response.status === false){
            document.getElementById("app-loader-container").style.display = "none";
            return []
        }
    else {
            document.getElementById("app-loader-container").style.display = "none";
            console.log(response.products.data,'product data ===')
            return  response.products.data
        }

        // const filteredData = registereProductsData.filter((entry) => {
        //   let searchValue = entry.searchName;
        //   searchValue = searchValue.toLowerCase();
        //   let productSku;
        //   productSku = entry.sku.toLowerCase();
        //   return (
        //     searchValue.includes(currValue) || productSku.includes(currValue)
        //   );
        // });
        // setProductsSearchResult(filteredData);
    }
};


export function returnScanType(type) {

    switch(type){
        case 'without-scan': {
            return [
                {
                    label: "Edit",
                },
                {
                    label: "Delete",
                },
            ];
        }
        case "scan-box": {
            return  [
                {
                    label: "Edit",
                },
                {
                    label: "Delete",
                },
            ];
        }
        case 'scan-one-by-one': {
            return [
                {
                    label: "Edit",
                },
                {
                    label: "Delete",
                },
            ];
        }
        default:
            break;
    }
}