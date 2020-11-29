import React, {useContext } from "react";
import { Redirect, Route } from "react-router-dom";
import { userContext } from "../../App";


const PrivateRoute = ({children, ...rest}) => {
  const [logegdInUser, setLoggedInUser] = useContext(userContext);
  return (
    <Route
      {...rest}
      render={({ location }) =>
        logegdInUser.email ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};

export default PrivateRoute;
