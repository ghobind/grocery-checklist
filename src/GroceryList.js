import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import AddItemModal from "./AddItemModal";
import _ from "lodash";
import statusMessage from "./swal-api";

export default function GroceryList({ createShoppingList, editShoppingList }) {
  const history = useHistory();
  const [name, setName] = useState("");
  const [newItem, setNewItem] = useState({});
  const [isModalShown, setIsModalShown] = useState();
  const [tableContent, setTableContent] = useState([]);
  const [totalPrice, setTotalPrice] = useState();
  const [showErrors, setShowErrors] = useState(false);
  const [click, setClick] = useState(false);
  const [errors, setErrors] = useState({});
  const [editing, setEditing] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [once, setOnce] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [date, setDate] = useState("");

  const location = useLocation();

  function handleSubmit() {
    setClick(true);
    let localErrors = {};
    if (!name) {
      localErrors.name = "Grocery list name is required";
    }
    if (_.isEmpty(tableContent)) {
      localErrors.table = "Table must have at least 1 row!";
    }

    setErrors(localErrors);

    if (_.isEmpty(localErrors) && !click) {
      if (editing) {
        // update if editing
        let id = location.state[0].id;
        let groceryList = {
          name,
          id,
          date: Date(),
          price: totalPrice,
          tableContent,
        };
        // allow user to change date if he wishes but will not update date to today
        if (date !== "") {
          groceryList.date = new Date(date + "PST");
        }
        statusMessage(true, "You have successfully edited " + name + "!");
        editShoppingList(groceryList);
      } else {
        // create a new grocery list if new
        let groceryList = {
          name,
          date: Date(),
          price: totalPrice,
          tableContent,
        };
        if (date !== "") {
          // TODO: this is currently assumed to be PDT, internationalize this if possible
          groceryList.date = new Date(date + "PST");
          console.log(groceryList.date);
        }
        statusMessage(true, "You have successfully added " + name + "!");
        createShoppingList(groceryList);
      }

      history.push("/");
    } else {
      statusMessage(
        false,
        "You have some errors! See error messages for more info"
      );
      setShowErrors(true);
    }
  }

  function removeRow(item) {
    setRemoving(true);
    let updated = tableContent.filter((content) => {
      return content.item !== item.item;
    });
    setTableContent(updated);
    statusMessage(true, "You have successfully removed " + item.item + "!");
  }

  function handleNameChange(event) {
    setName(event.target.value);
  }
  function handleDateChange(event) {
    setDate(event.target.value);
  }

  function hideAddListModal() {
    setIsModalShown(false);
  }
  function showAddListModal() {
    setIsModalShown(true);
  }

  function confirmAddList() {
    hideAddListModal();
  }
  function dontSubmit(event) {
    event.preventDefault();
  }

  useEffect(() => {
    if (location.state) {
      const localName = location.state[0].name;
      const localTable = location.state[0].tableContent;
      const localPrice = location.state[0].price;
      const localDate = new Date(location.state[0].date)
        .toISOString()
        .substr(0, 10);

      // that means i'm importing so it should be making a new list
      if (location.state[1]) {
        setEditing(false);
      } else {
        setEditing(true);
      }

      setName(localName);
      setTableContent(localTable);
      setTotalPrice(localPrice);
      setDate(localDate);
    } else {
      setDate(new Date().toISOString().substr(0, 10));
    }
  }, [location.state]);

  useEffect(() => {
    setClick(false);
  }, [click, errors]);

  useEffect(() => {
    setShowErrors(false);
    if (!_.isEmpty(newItem)) {
      let duplicate = false;
      tableContent.forEach((content) => {
        if (content.item === newItem.item) {
          duplicate = true;
        }
      });
      if (!duplicate && !removing) {
        let price = 0;
        tableContent.forEach((content) => {
          price += Number(content.price);
        });
        price += Number(newItem.price);
        setTotalPrice(Number(price));

        setTableContent(tableContent.concat(newItem));

        statusMessage(
          true,
          "You have successfully added a " + newItem.item + "!"
        );
        setOnce(false);
      } else if (removing) {
        setRemoving(false);
        setOnce(false);
      } else {
        if (!once) {
          setOnce(true);
        } else {
          setOnce(false);
          statusMessage(false, newItem.item + " already exists!");
        }
      }
    }
    let price = 0;
    tableContent.forEach((content) => {
      price += Number(content.price);
    });
    setTotalPrice(Number(price));
    if (tableContent.length === 0) {
      setShowTable(false);
    } else {
      setShowTable(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newItem, tableContent]);

  return (
    <div className="mt-3">
      {isModalShown && (
        <AddItemModal
          onClose={hideAddListModal}
          onConfirm={confirmAddList}
          setNewItem={setNewItem}
        />
      )}
      <form onSubmit={dontSubmit}>
        <div>
          <span className="title">
            {editing ? "Update Grocery List" : "Make A New Grocery List"}
          </span>
          <button type="button" className="btn default" onClick={handleSubmit}>
            Save
          </button>
          <button
            type="button"
            className="btn default"
            onClick={showAddListModal}
          >
            +
          </button>
        </div>

        <div className="form-group">
          <label htmlFor="name">List Name</label>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            className="form-control"
            id="name"
          />
          {showErrors && <div className="error">{errors.name}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            value={date}
            onChange={handleDateChange}
            className="form-control"
            id="date"
          />
          {showErrors && <div className="error">{errors.date}</div>}
        </div>

        {showTable && (
          <table className="table text-center">
            <thead>
              <tr key="header">
                <th>Item</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {tableContent.map((item) => {
                return (
                  <tr key={item.item}>
                    <td>{item.item}</td>
                    <td>${Number(item.price).toFixed(2)}</td>
                    <td>{item.quantity}</td>
                    <td>
                      <i
                        className="fas fa-times"
                        onClick={() => removeRow(item)}
                      ></i>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        {totalPrice && showTable ? (
          <div className="text-center total-price">
            Total Price ${totalPrice.toFixed(2)}
          </div>
        ) : (
          <h5 className="text-center">Please add an item</h5>
        )}
        {showErrors && <div className="error text-center">{errors.table}</div>}
      </form>
    </div>
  );
}
