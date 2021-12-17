import React from "react";

function TableHistory() {
  return (
    <table className="table table__history">
      <thead>
        <tr>
          <th scope="col">Date</th>
          <th scope="col">Quantity</th>
          <th scope="col">Supplier</th>
        </tr>
      </thead>

      <tbody>
        {/* Ordered */}
        <tr className="heading">
          <th scope="colgroup" colspan="3">
            Ordered
          </th>
        </tr>

        <tr>
          <td>02-20-2020</td>
          <td>1</td>
          <td>Head Office</td>
        </tr>

        {/* Received */}
        <tr className="heading">
          <th scope="colgroup" colspan="3">
            Received
          </th>
        </tr>

        <tr>
          <td>02-20-2020</td>
          <td>1</td>
          <td>Head Office</td>
        </tr>

        {/* Sold */}
        <tr className="heading">
          <th scope="colgroup" colspan="3">
            Sold
          </th>
        </tr>

        <tr>
          <td>02-20-2020</td>
          <td>1</td>
          <td>Head Office</td>
        </tr>
      </tbody>
    </table>
  );
}

export default TableHistory;
