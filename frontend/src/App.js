import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import GroupList from "./components/GetAllGroups";
import SeeAllGroups from "./components/LandingNavigation/SeeAllGroups";
function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      <SeeAllGroups></SeeAllGroups>
      {isLoaded && (
        <Switch>
        </Switch>
      )}
      <Switch>
        <Route path="/groups">
          <GroupList></GroupList>
        </Route>
      </Switch>
    </>
  );
}

export default App;
