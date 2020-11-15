import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import SelectListModal from "./SelectListModal";

export default function Navigation() {
  const [isModalShown, setIsModalShown] = useState();

  function openModal(event) {
    event.preventDefault();
    setIsModalShown(true);
  }
  function closeModal() {
    setIsModalShown(false);
  }

  return (
    <div className="navigation">
      {isModalShown && <SelectListModal onClose={closeModal} />}
      <NavLink to="/" className="brand" activeClassName="brand">
        Grocery Checklist
      </NavLink>
      <NavLink to="/" exact className="default" activeClassName="active">
        Home
      </NavLink>
      <NavLink to="/graph" exact className="default" activeClassName="active">
        Graph
      </NavLink>
      <span className="spacing">
        <NavLink to="/new" exact className="default" activeClassName="active">
          New
        </NavLink>
      </span>
      <NavLink
        onClick={openModal}
        to="/import"
        exact
        className="default"
        activeClassName="active"
      >
        Import
      </NavLink>
    </div>
  );
}
