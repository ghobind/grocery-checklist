import { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import {
  deleteGroceryList,
  editGroceryList,
  fetchShopping,
  saveNewGroceryList,
} from "./api";
import "./App.css";
import { DataStoreContext } from "./contexts";
import GroceryList from "./GroceryList";
import Navigation from "./Navigation";
import PageNotFound from "./PageNotFound";
import ShoppingLists from "./ShoppingLists";
import statusMessage from "./swal-api";
import Charts from "./Charts";

function App() {
  const [shopping, setShopping] = useState();
  useEffect(() => {
    fetchShopping().then((shopping) => {
      setShopping(shopping);
    });
  }, []);

  function createShoppingList(groceryList) {
    saveNewGroceryList(groceryList).then((newShoppingList) => {
      setShopping(shopping.concat(newShoppingList));
    });
  }
  function editShoppingList(groceryList) {
    editGroceryList(groceryList).then(() => {
      const updated = shopping.map((list) => {
        if (list.id === groceryList.id) {
          return groceryList;
        } else {
          return list;
        }
      });
      setShopping(updated);
    });
  }

  function destroyGroceryList(groceryList) {
    console.log(groceryList);
    deleteGroceryList(groceryList.id).then(() => {
      const filtered = shopping.filter((list) => {
        return list.id !== groceryList.id;
      });
      setShopping(filtered);
      statusMessage(
        true,
        "You have successfully deleted " + groceryList.name + "!"
      );
    });
  }
  return (
    <DataStoreContext.Provider value={{ shopping }}>
      <Router>
        <div className="container mt-4">
          <Navigation />
          <Switch>
            <Route path="/" exact={true}>
              <ShoppingLists
                defaultSort="date:desc"
                destroyGroceryList={destroyGroceryList}
              />
            </Route>
            <Route path="/new" exact={true}>
              <GroceryList
                createShoppingList={createShoppingList}
                editShoppingList={editShoppingList}
              />
            </Route>
            <Route path="/view" exact={true}>
              <GroceryList
                createShoppingList={createShoppingList}
                editShoppingList={editShoppingList}
              />
            </Route>
            <Route path="/graph" exact={true}>
              <Charts />
            </Route>
            <Route path="*">
              <PageNotFound />
            </Route>
          </Switch>
        </div>
      </Router>
    </DataStoreContext.Provider>
  );
}

export default App;
