import React, { useState, useEffect } from "react";
import { Table, IconButton, } from "@teamfabric/copilot-ui";
import * as Helpers from "./table_helpers/dummy_data";

import isEmpty from "lodash/isEmpty"

let data = Helpers.dummyTableData;
let tableColumns = [
  {
    title: "Name",
    accessor: "name",
    isSortable: true,
    className: "custom-col",
    children: [
      {
        title: "Name",
        accessor: "name",
      },
      {
        title: "Updated",
        accessor: "updated",
      },
      {
        title: "Status",
        accessor: "status",
      },
      {
        title: " ",
        accessor: "menu",
      },
    ],
  },
  {
    title: "Updated",
    accessor: "updated",
    isSortable: false,
    className: "custom-col",
  },
  {
    title: "Status",
    accessor: "status",
    isSortable: true,
    className: "custom-col",
  },
  {
    title: "Action",
    //"accessor": "menu",
    render: (_, record) => {
      return (
        <div className="table_actions">
          <IconButton
            icon="Delete"
            isRounded
            onClick={function noRefCheck() {}}
          />
          <IconButton
            icon="Edit"
            isRounded
            onClick={function noRefCheck() {}}
          />
          <IconButton
            icon="Close"
            isRounded
            onClick={function noRefCheck() {}}
          />
        </div>
      );
    },
  },
];


let perPageNo = 4;

const CustomTable = () => {
  const [tableData, setTableData] = useState(data);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTableData(data.slice(0, 4));
  }, []);

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const isFunction = (func) => {
    if (typeof func !== "undefined" && typeof func === "function") {
      return true;
    } else {
      return false;
    }
  };

  const handlePagination = async (id) => {
    // API call with page number (ie. id)

    if (data.length) {
      setLoading(true);
      await delay(1000).then(() => {
        const d = data.slice(perPageNo * (id - 1), perPageNo * id);
        setTableData(d);
      });
      setLoading(false);
    }
  
  };

  const handleRename = (val) => {
    setTableData((arr) => {
      return arr.map((obj) => {
        if (obj.uid === val.uid) {
          return { ...obj, _rename: 1 };
        }
        return obj;
      });
    });
  };

  const handleEditSuccess = (e, obj, text) => {
    setLoading(true);
    delay(10000).then(() => {
      setTableData((arr) => {
        return arr.map((item) => {
          if (obj.uid === item.uid) {
            delete item["_rename"];
            return { ...item, name: text };
          }
          return item;
        });
      });
      setLoading(false);
    });
  };

  const handleEditCancel = (e, obj) => {
    setTableData((arr) => {
      return arr.map((item) => {
        if (obj.uid === item.uid) {
          delete item["_rename"];
          return item;
        }
        return item;
      });
    });
  };

  const handleMouseEnter = (e, val, isChild, setTableData) => {
    if (isChild) {
      isFunction(setTableData) &&
        setTableData((arr) =>
          arr.map((obj) => {
            if (Array.isArray(obj.children) && !isEmpty(obj.children)) {
              obj.children = obj.children.map((child) => {
                if (child.uid === val.uid) {
                  return { ...child, _isHover: true };
                }
                return child;
              });
              return obj;
            }
            return obj;
          })
        );
    } else {
      isFunction(setTableData) &&
        setTableData((arr) => {
          return arr.map((obj) => {
            if (obj.uid === val.uid) {
              return { ...obj, _isHover: true };
            }
            return obj;
          });
        });
    }
  };

  const handleMouseLeave = (e, val, isChild, setTableData) => {
    if (isChild) {
      isFunction(setTableData) &&
        setTableData((arr) =>
          arr.map((obj) => {
            if (Array.isArray(obj.children) && !isEmpty(obj.children)) {
              obj.children = obj.children.map((child) => {
                if (child.uid === val.uid) {
                  return { ...child, _isHover: false };
                }
                return child;
              });
              return obj;
            }
            return obj;
          })
        );
    } else {
      isFunction(setTableData) &&
        setTableData((arr) => {
          return arr.map((obj) => {
            if (obj.uid === val.uid) {
              return { ...obj, _isHover: false };
            }
            return obj;
          });
        });
    }
  };

  const handleAscSort = async (key, data, callback) => {
    setLoading(true);
    await delay(1000);
    const result = [...data].sort((a, b) => (a[key] > b[key] ? 1 : -1));
    callback(result);
    setLoading(false);
  };

  const handleDscSort = async (key, data, callback) => {
    setLoading(true);
    await delay(1000);
    const result = [...data].sort((a, b) => (a[key] < b[key] ? 1 : -1));
    callback(result);
    setLoading(false);
  };

  const handleResetSort = async (key, data, callback) => {
    setLoading(true);
    await delay(1000);
    callback(data);
    setLoading(false);
  };

  return (
    <div>
      <Table
        data={tableData}
        columns={tableColumns}
        showPagination={true}
        totalRecords={data.length}
        perPage={perPageNo}
        handlePagination={handlePagination}
        handleRename={handleRename}
        handleEditSuccess={handleEditSuccess}
        handleEditCancel={handleEditCancel}
        loading={loading}
        onRowMouseEnter={handleMouseEnter}
        onRowMouseLeave={handleMouseLeave}
        rowSelectHandler={(e, rowData) =>
          console.log("selected row data", rowData, e.target.checked)
        }
        onAllRowSelect={(e, isSelected, data) =>
          console.log("selected all rows", isSelected)
        }
        onRowClick={(e, rowData) => console.log("row clicked", rowData)}
        enableSort={true}
        handleAscendingSort={handleAscSort}
        handleDescendingSort={handleDscSort}
        handleResetSort={handleResetSort}
        //isSelectable={true}
      />
    </div>
  );
};

export default CustomTable;
