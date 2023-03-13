import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import GroupList from "./components/GetAllGroups";
import SeeAllGroups from "./components/LandingNavigation/SeeAllGroups";
import GroupDetails from "./components/GroupDetails";
import EventList from "./components/GetAllEvents";
import EventDetails from "./components/EventDetails";
function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
        </Switch>
      )}
      <Switch>
        <Route exact path="/groups">
          <GroupList></GroupList>
        </Route>
        <Route path="/groups/:groupId">
          <GroupDetails></GroupDetails>
        </Route>
        <Route exact path="/events">
          <EventList></EventList>
        </Route>
        <Route exact path="/events/:eventId">
          <EventDetails></EventDetails>
        </Route>
        <Route exact path="/">
          <SeeAllGroups></SeeAllGroups>
        </Route>
        <Route exact path="/groups/new">
          {/* <CreateGroupForm></CreateGroupForm> */}
        </Route>
      </Switch>
    </>
  );
}

export default App;
