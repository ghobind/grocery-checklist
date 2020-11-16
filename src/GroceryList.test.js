import React from "react";
import { fireEvent, render } from "@testing-library/react";
import { useState } from "react";
const { MemoryRouter } = require("react-router-dom");
const { default: GroceryList } = require("./GroceryList");

test("prevent saving without adding a list name", () => {
  const { getByTestId } = render(
    <MemoryRouter initialEntries={["/"]}>
      <GroceryList />
    </MemoryRouter>
  );
  expect(getByTestId("list-name")).toHaveValue("");
  fireEvent.click(getByTestId("save-button"));
  expect(getByTestId("name-error").textContent).toBe(
    "Grocery list name is required"
  );
});

test("prevent saving without adding at least one item", () => {
  const { getByTestId } = render(
    <MemoryRouter initialEntries={["/"]}>
      <GroceryList />
    </MemoryRouter>
  );
  expect(getByTestId("list-name")).toHaveValue("");
  fireEvent.change(getByTestId("list-name"), {
    target: {
      value: "New List",
    },
  });
  expect(getByTestId("list-name")).toHaveValue("New List");

  fireEvent.click(getByTestId("save-button"));

  // prevented from going to next page cos didn't fill table
  expect(getByTestId("list-name")).toHaveValue("New List");
});

test("successful date change", () => {
  const { getByTestId } = render(
    <MemoryRouter initialEntries={["/"]}>
      <GroceryList />
    </MemoryRouter>
  );

  expect(getByTestId("date-input")).toHaveValue(
    new Date().toISOString().substr(0, 10)
  );

  fireEvent.change(getByTestId("date-input"), {
    target: {
      value: "2010-05-05",
    },
  });
  expect(getByTestId("date-input")).toHaveValue("2010-05-05");
});
