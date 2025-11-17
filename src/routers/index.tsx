import { Routes, Route } from "react-router";
import type { RouteConfig } from "./routes";
import { routeConfig } from "./routes";

const renderRoutes = (routes: RouteConfig[]) => {
  return routes.map((route, index) => {
    const { path, element, children } = route;

    if (children && children.length > 0) {
      return (
        <Route key={index} path={path} element={element}>
          {renderRoutes(children)}
        </Route>
      );
    }

    return <Route key={index} path={path} element={element} />;
  });
};

const AppRouter = () => {
  return <Routes>{renderRoutes(routeConfig)}</Routes>;
};

export default AppRouter;
