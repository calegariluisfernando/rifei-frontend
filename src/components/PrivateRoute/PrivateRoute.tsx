import React from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../../contexts/Auth/AuthContext";
import CalegariHttpClient from "../../services/HttpClients/CalegariHttpClient/CalegariHttpClient";

export default function PrivateRoute({ children }: { children: JSX.Element }) {

    const { user } = useAuth();
    const location = useLocation();

    if (!user?.token) {

        // Redirect them to the /login page, but save the current location they were
        // trying to go to when they were redirected. This allows us to send them
        // along to that page after they login, which is a nicer user experience
        // than dropping them off on the home page.
        return <Navigate to={'/login'} state={{ from: location }} replace />;
    }

    CalegariHttpClient.getInstance().setToken(user.token);

    return children;
}