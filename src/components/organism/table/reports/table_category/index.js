import { TableLoader } from "@teamfabric/copilot-ui/dist/molecules";
import { Pagination } from "@teamfabric/copilot-ui/dist/organisms";
import React, { useState, useEffect } from "react";

const perPageNo = 20;

function TableCategory({ Data, categoriesName, loading }) {
  const [tableData, setTableData] = useState([]);
  const [currentPageNumber, setCurrentPage] = useState(1);
  const [startItem, setStartItem] = useState("");
  const [endItem, setEndItem] = useState("");

  useEffect(() => {
    setTableData([]);
    // if (Data && Data.length > 0) {
    renderData();
    if (Data.length > 20) {
      setStartItem(1);
      setEndItem(20);
    } else {
      setStartItem(1);
      setEndItem(Data.length);
    }
    return () => renderData();
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const returnFormate = (value) => {
    return value % 1 !== 0 ? parseFloat(value).toFixed(2) : value;
  };

  const renderData = () => {
    Data.forEach((item) => {
      item.Qty = returnFormate(item.Qty);
      item.sold = returnFormate(item.sold);
      item.SalePrice = returnFormate(item.SalePrice);
      item.Cost = returnFormate(item.Cost);
      item.SpecialPrice = returnFormate(item.Discount);
    });
    setTableData(Data.slice(0,20));
  };
  const checkNaN = (value) => {
    if (isNaN(value)) {
      return 0;
    }
    return value;
  };


    const sumValues = (array, value) => array.reduce((a, b) => parseInt(a) + parseInt(b[value]), 0);

    const getSums = (array) => {
      let newArray = [];
      array.forEach((item) => {
        const data = sumValues(Data, item);
        const dataWithoutNullValues = checkNaN(data);
        const parsedValue =
          dataWithoutNullValues % 1 !== 0
            ? parseFloat(dataWithoutNullValues).toFixed(2)
            : dataWithoutNullValues;
        newArray.push({ [item]: parsedValue });
      });
      return newArray;
    };
    const prices = [
      "Qty",
      "sold",
      "SalePrice",
      "Cost",
      "SpecialPrice",
    ];
    let final;
    if (Data.length > 0) {
    final = getSums(prices);
  }
  const capitalizeFirstLetter = (string) =>
    string.charAt(0).toUpperCase() + string.slice(1);

  const handlePagination = async (id) => {
    const newId = Number(id) - Number(1);
    const totalPages = Math.ceil(Number(Data.length) / Number(perPageNo));
    if (Data.length) {
      setCurrentPage(id);
      const d = Data.slice(perPageNo * (id - 1), perPageNo * id);
      setTableData(d);
      if (id !== totalPages) {
        const s = newId * perPageNo + 1;
        const e = s - 1 + perPageNo;
        setStartItem(s);
        setEndItem(e);
      } else {
        const s = newId * perPageNo + 1;
        const e = Data.length;
        setStartItem(s);
        setEndItem(e);
      }
    }
  };

  const tableHeader = [
    "Product Name",
    "Sku",
    "Qty",
    "Sold",
    "Sale Price",
    "Cost",
    "Special Price",
    "Tax Inclusive",
  ];

  return (
    <>
      {loading ? (
        <TableLoader columns={tableHeader} theme="light" />
      ) : (
        <>
          <span className="results">
            Showing {startItem} - {endItem} of {Data.length}
          </span>
          <table className="table table__history">
            <thead>
              <tr>
                {tableHeader.map((item, index) => {
                  return (
                    <th key={index} scope="col">
                      {item}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {/* Group */}
              <tr className="heading">
                <th scope="colgroup" colspan="9">
                  {tableData &&
                    tableData.length > 0 &&
                    capitalizeFirstLetter(categoriesName)}
                </th>
              </tr>

              {tableData &&
                tableData.length > 0 &&
                tableData.map(
                  (
                    {
                      ProductName,
                      Sku,
                      Qty,
                      sold,
                      SalePrice,
                      Cost,
                      Discount,
                      SpecialPrice,
                      Tax_Inclusive_or_exclusive,
                    },
                    index
                  ) => {
                    return (
                      <tr key={index}>
                        <td>{ProductName}</td>
                        <td>{Sku}</td>
                        <td>{Qty}</td>
                        <td>{sold}</td>
                        <td>{SalePrice}</td>
                        <td>{Cost}</td>
                        {/*<td>{Discount}</td>*/}
                        <td>{SpecialPrice}</td>
                        <td>{Tax_Inclusive_or_exclusive}</td>
                      </tr>
                    );
                  }
                )}

              <tr className="footer">
                <th scope="col"></th>
                <th scope="col">Sub-Total</th>
                {final &&
                  final.length > 0 &&
                  final.map(( item , index) => {
                    for(const [key,value] of Object.entries(item)) {
                    return (
                      <th key={index + key} scope="col">
                        {value}
                      </th>
                    );
                    }
                  })}
              </tr>
            </tbody>
          </table>
          <Pagination
            handlePagination={handlePagination}
            perPage={perPageNo}
            totalRecords={Data.length}
            activePageNumber={currentPageNumber}
          />
        </>
      )}
    </>
  );
}

export default TableCategory;
