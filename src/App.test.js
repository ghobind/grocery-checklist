import React from "react";
import { render } from "@testing-library/react";
import { createServer } from "miragejs";
import { fetchShopping } from "./api";
import { DataStoreContext } from "./contexts";
import ShoppingLists from "./ShoppingLists";

let server;

beforeEach(() => {
  server = createServer({
    routes() {
      this.namespace = "api";
      this.logging = false;

      this.get("/shopping", () => {
        return [
          {
            name: "My shopping list 1",
            id: 1,
            date: "2020-01-01T08:00:00.000Z",
            price: 78.2,
            tableContent: [
              {
                item: "Apple",
                price: 1.3,
                quantity: 2,
              },
              {
                item: "Coke",
                price: "76.90",
                quantity: "70",
              },
            ],
          },
          {
            name: "My shopping list 2",
            id: 2,
            date: "2020-02-03T08:00:00.000Z",
            price: 35.3,
            tableContent: [
              {
                item: "Apple",
                price: 1.3,
                quantity: 2,
              },
              {
                item: "Bottle",
                price: "34",
                quantity: "1",
              },
            ],
          },
          {
            name: "My shopping list 3",
            id: 3,
            date: "2020-03-03T08:00:00.000Z",
            price: 90.84,
            tableContent: [
              {
                item: "Apple",
                price: 1.3,
                quantity: 2,
              },
              {
                item: "Sugar",
                price: "89.54",
                quantity: "1234",
              },
            ],
          },
          {
            name: "My shopping list 4",
            id: 4,
            date: "2020-04-04T08:00:00.000Z",
            price: 101.3,
            tableContent: [
              {
                item: "Apple",
                price: 1.3,
                quantity: 2,
              },
              {
                item: "Watermelon",
                price: "100",
                quantity: "20",
              },
            ],
          },
          {
            name: "My shopping list 5",
            id: 5,
            date: "2020-05-05T08:00:00.000Z",
            price: 104.22,
            tableContent: [
              {
                item: "Banana",
                price: "104.22",
                quantity: "123",
              },
            ],
          },
        ];
      });
    },
  });
});

afterEach(() => {
  server.shutdown();
});

const destroyGroceryList = () => {
  return -1;
};

test("rendering shopping lists, check for num of cols", async () => {
  const list = await fetchShopping();
  const { getAllByTestId } = render(
    <DataStoreContext.Provider value={list}>
      <ShoppingLists
        defaultSort="date:desc"
        destroyGroceryList={destroyGroceryList}
      />
    </DataStoreContext.Provider>
  );
  expect(getAllByTestId("header").length).toEqual(5);
});

test("rendering shopping list, check for num of rows", async () => {
  const list = await fetchShopping();
  const { getAllByTestId } = render(
    <table>
      <thead>
        <tr>
          <th>No.</th>
          <th>Name</th>
          <th>Price</th>
          <th>Date</th>
          <th>Remove</th>
        </tr>
      </thead>
      <tbody>
        {list.map((entry) => {
          return (
            <tr key={entry.id} data-testid="row">
              <td onClick={() => redirect(entry)}>{entry.id}</td>
              <td onClick={() => redirect(entry)}>{entry.name}</td>
              <td onClick={() => redirect(entry)}>${entry.price.toFixed(2)}</td>
              <td onClick={() => redirect(entry)}>{entry.date}</td>
              <td>
                <i
                  className="fas fa-times"
                  onClick={() => showModal(entry)}
                ></i>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
  expect(getAllByTestId("row").length).toEqual(5);
});

test("check column 1 corresponds to list", async () => {
  const list = await fetchShopping();
  const { getAllByTestId } = render(
    <table>
      <thead>
        <tr>
          <th>No.</th>
          <th>Name</th>
          <th>Price</th>
          <th>Date</th>
          <th>Remove</th>
        </tr>
      </thead>
      <tbody>
        {list.map((entry) => {
          return (
            <tr key={entry.id} data-testid="row">
              <td onClick={() => redirect(entry)} data-testid="col1">
                {entry.id}
              </td>
              <td onClick={() => redirect(entry)}>{entry.name}</td>
              <td onClick={() => redirect(entry)}>${entry.price.toFixed(2)}</td>
              <td onClick={() => redirect(entry)}>{entry.date}</td>
              <td>
                <i
                  className="fas fa-times"
                  onClick={() => showModal(entry)}
                ></i>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
  expect(getAllByTestId("col1").length).toEqual(5);
  list.forEach((entry, index) => {
    expect(getAllByTestId("col1")[index].textContent).toBe(String(entry.id));
  });
});

test("check column 2 corresponds to list", async () => {
  const list = await fetchShopping();
  const { getAllByTestId } = render(
    <table>
      <thead>
        <tr>
          <th>No.</th>
          <th>Name</th>
          <th>Price</th>
          <th>Date</th>
          <th>Remove</th>
        </tr>
      </thead>
      <tbody>
        {list.map((entry) => {
          return (
            <tr key={entry.id} data-testid="row">
              <td onClick={() => redirect(entry)}>{entry.id}</td>
              <td onClick={() => redirect(entry)} data-testid="col2">
                {entry.name}
              </td>
              <td onClick={() => redirect(entry)}>${entry.price.toFixed(2)}</td>
              <td onClick={() => redirect(entry)}>{entry.date}</td>
              <td>
                <i
                  className="fas fa-times"
                  onClick={() => showModal(entry)}
                ></i>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
  expect(getAllByTestId("col2").length).toEqual(5);
  list.forEach((entry, index) => {
    expect(getAllByTestId("col2")[index].textContent).toBe(String(entry.name));
  });
});

test("check column 3 corresponds to list", async () => {
  const list = await fetchShopping();
  const { getAllByTestId } = render(
    <table>
      <thead>
        <tr>
          <th>No.</th>
          <th>Name</th>
          <th>Price</th>
          <th>Date</th>
          <th>Remove</th>
        </tr>
      </thead>
      <tbody>
        {list.map((entry) => {
          return (
            <tr key={entry.id} data-testid="row">
              <td onClick={() => redirect(entry)}>{entry.id}</td>
              <td onClick={() => redirect(entry)}>{entry.name}</td>
              <td onClick={() => redirect(entry)} data-testid="col3">
                ${entry.price.toFixed(2)}
              </td>
              <td onClick={() => redirect(entry)}>{entry.date}</td>
              <td>
                <i
                  className="fas fa-times"
                  onClick={() => showModal(entry)}
                ></i>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
  expect(getAllByTestId("col3").length).toEqual(5);
  list.forEach((entry, index) => {
    expect(getAllByTestId("col3")[index].textContent).toBe(
      String("$" + entry.price.toFixed(2))
    );
  });
});

test("check column 4 corresponds to list", async () => {
  const list = await fetchShopping();
  const { getAllByTestId } = render(
    <table>
      <thead>
        <tr>
          <th>No.</th>
          <th>Name</th>
          <th>Price</th>
          <th>Date</th>
          <th>Remove</th>
        </tr>
      </thead>
      <tbody>
        {list.map((entry) => {
          return (
            <tr key={entry.id} data-testid="row">
              <td onClick={() => redirect(entry)}>{entry.id}</td>
              <td onClick={() => redirect(entry)}>{entry.name}</td>
              <td onClick={() => redirect(entry)}>${entry.price.toFixed(2)}</td>
              <td onClick={() => redirect(entry)} data-testid="col4">
                {entry.date}
              </td>
              <td>
                <i
                  className="fas fa-times"
                  onClick={() => showModal(entry)}
                ></i>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
  expect(getAllByTestId("col4").length).toEqual(5);
  list.forEach((entry, index) => {
    expect(getAllByTestId("col4")[index].textContent).toBe(String(entry.date));
  });
});

test("remove a row", async () => {
  const list = await fetchShopping();
  const { getAllByTestId } = render(
    <table>
      <thead>
        <tr>
          <th>No.</th>
          <th>Name</th>
          <th>Price</th>
          <th>Date</th>
          <th>Remove</th>
        </tr>
      </thead>
      <tbody>
        {list.map((entry) => {
          return (
            <tr key={entry.id} data-testid="row">
              <td onClick={() => redirect(entry)}>{entry.id}</td>
              <td onClick={() => redirect(entry)}>{entry.name}</td>
              <td onClick={() => redirect(entry)}>${entry.price.toFixed(2)}</td>
              <td onClick={() => redirect(entry)}>{entry.date}</td>
              <td>
                <i
                  data-testid="remove"
                  className="fas fa-times"
                  onClick={() => destroyGroceryList(entry)}
                ></i>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );

  expect(getAllByTestId("row").length).toEqual(5);
  let click = destroyGroceryList(); // simulate click
  expect(getAllByTestId("row").length + click).toEqual(4);
});
