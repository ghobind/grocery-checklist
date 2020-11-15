import React, { useContext } from "react";

import { DataStoreContext } from "./contexts";
import { createPortal } from "react-dom";
import { useHistory } from "react-router-dom";

export default function ConfirmDeleteIssueModal({ onClose }) {
  const { shopping } = useContext(DataStoreContext);
  const history = useHistory();
  function handleClick(list) {
    let path = "/view";
    history.push(path, [list, "import"]);
    onClose();
  }
  return createPortal(
    <>
      <div className="modal-backdrop show"></div>
      <div className="modal" tabIndex="-1" style={{ display: "block" }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Select Grocery List</h5>
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
              <div className="list-group">
                {shopping.map((list) => {
                  return (
                    <button
                      key={list.id}
                      type="button"
                      onClick={() => handleClick(list)}
                      className="list-group-item list-group-item-action text-center"
                    >
                      <span>{list.name} </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.getElementById("modal-container")
  );
}
