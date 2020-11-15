import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import _ from "lodash";

export default function AddItemModal({ onClose, onConfirm, setNewItem }) {
  const [item, setItem] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [showErrors, setShowErrors] = useState(false);
  const [click, setClick] = useState(false);
  const [errors, setErrors] = useState({});

  function handleItemChange(event) {
    setItem(event.target.value);
  }
  function handlePriceChange(event) {
    setPrice(event.target.value);
  }

  function handleQuantityChange(event) {
    setQuantity(event.target.value);
  }
  useEffect(() => {
    setClick(false);
  }, [click, errors]);

  function validate() {
    setClick(true);
    let localErrors = {};
    if (!item) {
      localErrors.name = "Item name is required";
    }
    if (!price) {
      localErrors.price = "Price is required";
    } else if (Number(price) <= 0) {
      localErrors.price = "Entered value must be greater than 0";
    }
    if (!quantity) {
      localErrors.quantity = "Quantity is required";
    } else if (Number(quantity) <= 0) {
      localErrors.quantity = "Entered value must be greater than 0";
    }

    setErrors(localErrors);

    if (_.isEmpty(localErrors) && !click) {
      setNewItem({
        item,
        price,
        quantity,
      });
      onConfirm();
    } else {
      setShowErrors(true);
    }
  }

  return createPortal(
    <>
      <div className="modal-backdrop show"></div>
      <div className="modal" tabIndex="-1" style={{ display: "block" }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Item</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                onClick={onClose}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="item">Item Name</label>
                <input
                  type="text"
                  value={item}
                  onChange={handleItemChange}
                  className="form-control"
                  id="item"
                />
                {showErrors && <div className="error">{errors.name}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="price">Item Price</label>
                <input
                  type="number"
                  value={price}
                  onChange={handlePriceChange}
                  className="form-control"
                  id="price"
                />
                {showErrors && <div className="error">{errors.price}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="quantity">Item Quantity</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="form-control"
                  id="quantity"
                />
                {showErrors && <div className="error">{errors.quantity}</div>}
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-light"
                data-dismiss="modal"
                onClick={onClose}
              >
                Cancel
              </button>
              <button type="button" className="btn btn-dark" onClick={validate}>
                Add Item
              </button>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.getElementById("modal-container")
  );
}
