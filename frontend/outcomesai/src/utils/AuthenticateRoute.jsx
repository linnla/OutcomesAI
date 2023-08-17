import React from 'react';
import { Navigate, Route } from 'react-router-dom';

function AuthenticatedRoute({ path, element, user }) {
  if (!user) {
    return <Navigate to='/login' />;
  }
  return <Route path={path} element={element} />;
}

export default AuthenticatedRoute;
