import React, { useState, useEffect, lazy, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Switch, Route, useHistory, Redirect} from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import GroupList from "./components/GetAllGroups";
import SeeAllGroups from "./components/LandingNavigation/SeeAllGroups";
import GroupDetails from "./components/GroupDetails";
import EventList from "./components/GetAllEvents";
// import EventDetails from "./components/EventDetails";
import CreateGroup from "./components/forms/CreateGroup/CreateGroup";
import Landing from "./components/LandingPage";
import CreateEvent from "./components/forms/CreateEvent/CreateEvent";
import { getGroupDetails } from "./store/groups";
import Loading from "./components/loading";
function App() {
  const history = useHistory();
  const sessionUser = useSelector(state => state.session.user);
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const EventDetails = lazy(() => import('./components/EventDetails'));
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>

      <Navigation isLoaded={isLoaded} />

      {sessionUser && isLoaded &&(
        <Switch>
          <Route exact path="/groups/:groupId/edit">
            <CreateGroup update={true} sessionUser={sessionUser}></CreateGroup>
          </Route>
        <Route exact path="/groups/new">
          <CreateGroup update={false} sessionUser={sessionUser}></CreateGroup>
        </Route>
        <Route exact path="/groups/:groupId/events/new">
          <CreateEvent></CreateEvent>
        </Route>
        <Route exact path="/events/:eventId/edit">
          <CreateEvent update={true} sessionUser={sessionUser}></CreateEvent>
        </Route>
        </Switch>
      )}
      {isLoaded && !sessionUser && (
        <Switch>

        <Route exact path="/groups/:groupId/edit">
        {() => history.replace("/")}
        </Route>

        <Route exact path="/groups/new">
          {() => history.replace("/")}
        </Route>

        </Switch>
      )}
      {isLoaded &&  (
        <Switch>
        <Route exact path="/groups">
          <GroupList></GroupList>
        </Route>
        <Route exact path="/groups/:groupId">
          <GroupDetails sessionUser={sessionUser}></GroupDetails>
        </Route>
        <Route exact path="/events">
          <EventList></EventList>
        </Route>
        <Route exact path="/events/:eventId">
          <Suspense fallback={<Loading />}>
          <EventDetails sessionUser={sessionUser}></EventDetails>
          </Suspense>
        </Route>
        <Route exact path="/">
          <Landing sessionUser={sessionUser}></Landing>
        </Route>
      </Switch>
      )}

    </>
  );
}

export default App;
