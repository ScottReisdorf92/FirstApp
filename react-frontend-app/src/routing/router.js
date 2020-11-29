import React from 'react';
import { Route, Switch } from 'react-router-dom';
// TODO: import routes
// TODO: import @materil-ui/core/makeStyle

// TODO: finish
/*
  const useStyles = makeStyles(()=> ({}))
*/

function Router() {
  const classes = useStyles();

  return (
    <switch>
    {
      routes.map((route, key) =>
        <route key={key} exact path={route})>
          <div /*TO DO: classes for styling*/ >
            {route.component}
          </div>
        </route>
        // TODO: create home route
      );
    }
    </switch>
