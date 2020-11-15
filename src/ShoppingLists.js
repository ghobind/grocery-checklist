import React, { useContext, useEffect, useState } from "react";
import { DataStoreContext } from "./contexts";
import sortBy from "lodash.sortby";
import { useHistory } from "react-router-dom";
import DeleteListModal from "./DeleteListModal";

export default function ShoppingLists({ defaultSort, destroyGroceryList }) {
  const [sortedRows, setSortedRows] = useState([]);
  const [defaultSortedField, defaultSortDirection] = defaultSort.split(":");
  const [currentSortedField, setCurrentSortedField] = useState(
    defaultSortedField
  );
  const [currentSortDirection, setCurrentSortDirection] = useState(
    defaultSortDirection
  );
  const [isModalShown, setIsModalShown] = useState();
  const [toBeDeleted, setToBeDeleted] = useState({});

  const history = useHistory();
  const { shopping } = useContext(DataStoreContext);

  useEffect(() => {
    let initialSortedRows = sortBy(shopping, [currentSortedField]);
    if (currentSortedField === "date") {
      initialSortedRows = initialSortedRows.sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
      });
      console.log(initialSortedRows);
    }
    if (currentSortDirection === "desc") {
      initialSortedRows = initialSortedRows.reverse();
      console.log(initialSortedRows);
    }
    setSortedRows(initialSortedRows);
  }, [shopping, currentSortedField, currentSortDirection]);

  function formatDate(string) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(string).toLocaleDateString([], options);
  }

  function redirect(entry) {
    let path = "/view";
    history.push(path, [entry]);
  }

  function removeRow() {
    destroyGroceryList(toBeDeleted);
    hideModal();
  }

  function showModal(entry) {
    setToBeDeleted(entry);
    setIsModalShown(true);
  }
  function hideModal() {
    setIsModalShown(false);
  }

  function populateRows() {
    return (
      sortedRows &&
      sortedRows.map((entry) => {
        return (
          <tr key={entry.id}>
            <td onClick={() => redirect(entry)}>{entry.id}</td>
            <td onClick={() => redirect(entry)}>{entry.name}</td>
            <td onClick={() => redirect(entry)}>${entry.price.toFixed(2)}</td>
            <td onClick={() => redirect(entry)}>{formatDate(entry.date)}</td>
            <td>
              <i className="fas fa-times" onClick={() => showModal(entry)}></i>
            </td>
          </tr>
        );
      })
    );
  }

  function sortRows(field) {
    if (field === currentSortedField) {
      if (currentSortDirection === "asc") {
        setCurrentSortDirection("desc");
      } else {
        setCurrentSortDirection("asc");
      }
    } else {
      setCurrentSortedField(field);
      setCurrentSortDirection("asc");
    }
  }

  return (
    <div className="mt-4">
      {isModalShown && (
        <DeleteListModal onClose={hideModal} onConfirm={removeRow} />
      )}
      <table className="table table-hover text-center">
        <thead>
          <tr>
            <th onClick={() => sortRows("id")}>No.</th>
            <th onClick={() => sortRows("name")}>Name</th>
            <th onClick={() => sortRows("price")}>Price</th>
            <th onClick={() => sortRows("date")}>Date</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>{populateRows()}</tbody>
      </table>
    </div>
  );
}
