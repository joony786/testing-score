import React, {useEffect, useState} from "react";
import {Table} from "@teamfabric/copilot-ui";
import {Input} from "@teamfabric/copilot-ui/dist/atoms";
import {Icon} from "@teamfabric/copilot-ui/dist/atoms/icon/Icon";

let tableColumns = [
    {
        "title": "SKU",
        "accessor": "sku",
    },
    {
        "title": "Ordered Quantity",
        "accessor": "quantity",
        
    },
    
    {
      "title": "Delete",
      "accessor": "delete",
    },


];




let perPageNo = 20;

const StockNestedVariantsProductsTable = (props) => {
    const [tableData, setTableData] = useState([])
    const [newTableData, setNewTableData] = useState([])
    const [allData,setAllData] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setAllData(props.tableData);
        setTableData(props.tableData);
        renderData(props.tableData.variants);
    }, [props.tableData]);


    const renderData = (tableData) => {
        setAllData(tableData);
        let allStockData = tableData && tableData;
        for(let i = 0; i < allStockData.length; i++) {
            let item = allStockData[i];
            // item.qty = 1
            item.quantity = (
                <div>
                    <Input
                        className="primary"
                        inputProps={{
                            disabled: false,
                            onChange: e => handleChanges(e.target.value, item.id),
                            value: item.qty,
                            type: 'text'
                        }}
                        width="50%"
                        maskOptions={{
                  regex: '[0-9]*'
                }}
                    />
                </div>
            );
            item.delete = (
                <div style={{padding: '2rem', cursor: 'pointer'}}>
                    <Icon iconName="Delete" size={15}
                          className="delete-action-btn"
                          onClick={() => handleDelete(item.id)}
                    />
                </div>
            );


        }
        setTableData(allStockData);
    }


    const handleDelete = (selectedProdId) => {
        const newData = [...props.tableData.variants];
        const index = newData && newData.findIndex(item => selectedProdId === item.id);
        if (index > -1) {
            newData.splice(index, 1);
            setTableData(newData);
            [...props.tableData.variants] = newData;
            if(!newData.length){
            props.setShowVariantsModal(false)
            }
        }
    }

    const handleChanges = (changeValue, selectedProdId) => {
      let productsTotalQuantity = 0;
      let totalQuantity = 0;
      let newData = props.tableData.variants;
      const index = newData && newData.findIndex(item => selectedProdId === item.id);
      if (index > -1) {
        newData.forEach(item => {
          if(item.id === selectedProdId){
                  item.qty = changeValue;
                  productsTotalQuantity = productsTotalQuantity + parseInt(item.qty);
              }
        });
        newData.forEach(item => {
            if(item.qty)
            totalQuantity = totalQuantity + parseInt(item.qty)
        })
        setNewTableData(newData);
        sendFinalDataToParent(totalQuantity)
      }

    }

    const delay = ms => new Promise(res => setTimeout(res, ms));

function sendFinalDataToParent(productsTotalQuantity) {
    let data = props.tableData;
            data.qty =  productsTotalQuantity
    props.onChangeProductsData(data, productsTotalQuantity);
}

  
    
  
    const handlePagination = async id => {
      // API call with page number (ie. id)
      
      setLoading(true)
      await delay(1000).then(() => {
        const d = allData && allData.slice(perPageNo * (id - 1), perPageNo * id)
        setTableData(d)
      })
      setLoading(false)
    }
  
  
  
   
    function isEmptyTableData(data) {
      return data.length === 0;
    }
    return (
      <div>
        <Table
          data={tableData}
          columns={tableColumns}
          //showPagination={true}
          totalRecords = {allData.length}
          perPage={perPageNo}
          handlePagination={handlePagination}
          render={({ data }) => {
          return isEmptyTableData(data)  && !loading ? (
            <tbody>
              <tr>
                <td colSpan={tableColumns.length + 1}>
                  <div className="table-no-search-data">NO RESULTS FOUND</div>
                </td>
              </tr>
            </tbody>
          ) : null;
        }}
        />
      </div>
    )
  }

export default StockNestedVariantsProductsTable;
