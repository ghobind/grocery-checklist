import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import GroceryList from "./GroceryList";
import PageNotFound from "./PageNotFound";
import ShoppingLists from "./ShoppingLists";

function App() {
  return (
    <Router>
      <div className="container mt-3">
        <Switch>
          <Route path="/" exact={true}>
            <ShoppingLists />
          </Route>
          <Route path="/new-grocery-list" exact={true}>
            <GroceryList />
          </Route>
          <Route>
            <PageNotFound />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
