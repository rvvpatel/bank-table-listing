import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Accounts from "../pages"
import Detail from "../pages/Detail";

const Routes = () => {

  return (
    <div style={{ padding: '20px 0', maxWidth: '80%', margin: '0 auto' }}>
      <BrowserRouter>
        <Switch>
          <Route
            exact
            path="/"
            component={Accounts}
          />
          <Route
            exact
            path="/:id"
            component={Detail}
          />
        </Switch>
      </BrowserRouter>
    </div>
  );
};
export default Routes;
