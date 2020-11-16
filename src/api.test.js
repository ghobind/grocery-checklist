const {
  fetchShopping,
  saveNewGroceryList,
  editGroceryList,
  fetchGroceryList,
} = require("./api");
import { createServer, Response } from "miragejs";

let server;

beforeEach(() => {
  server = createServer({
    routes() {
      this.namespace = "api";
      this.logging = false;

      // GET /shopping/id;
      this.get("/shopping/:id", (schema, request) => {
        if (request.params.id === "1") {
          return {
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
          };
        }
        return new Response(404, {}, null);
      });

      // GET /shopping
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
        ];
      });

      // POST /shopping
      this.post("/shopping", (schema, request) => {
        return Object.assign(JSON.parse(request.requestBody), { id: 5 });
      });

      // PUT /shopping/:id
      this.put("/shopping/:id", (schema, request) => {
        return Object.assign(JSON.parse(request.requestBody), {
          name: "Updated",
        });
      });
    },
  });
});

afterEach(() => {
  server.shutdown();
});

test("fetchShopping()", async () => {
  const list = await fetchShopping();
  expect(list).toEqual([
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
  ]);
});

test("saveNewGroceryList() when adding a new list", async () => {
  const list = await saveNewGroceryList({
    name: "My shopping list 1",
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
  });
  expect(list).toEqual({
    name: "My shopping list 1",
    id: 5,
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
  });
});

test("editNewGroceryList() when updating a list", async () => {
  return editGroceryList({
    name: "Before",
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
  }).then((issue) => {
    expect(issue).toEqual({
      name: "Updated",
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
    });
  });
});

test("fetchGroceryList() with a list that exists", () => {
  return fetchGroceryList(1).then((list) => {
    expect(list).toEqual({
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
    });
  });
});

test("fetchGroceryList() with a list that doesn't exist", () => {
  return fetchGroceryList(99).then(
    () => {},
    (error) => {
      expect(error).toBe(
        `There was an error requesting the issue with and id of 99`
      );
    }
  );
});
