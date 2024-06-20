// import { FC } from "react";

// const User: FC = () => {
//   return <div>DashboardUser Page</div>;
// };

// export default User;
import Suspense from "@/common/Suspense";
import { RoutePaths } from "@/constants/RouteConstants";
import { lazy } from "react";
import { Navigate, useRoutes } from "react-router-dom";
import { configureRoutes } from "@/utils/RouterUtils";

function Session() {
  const routes = useRoutes(ROUTES);

  return (
    <>
      <Suspense>{routes}</Suspense>
    </>
  );
}

export default Session;

const ROUTES = configureRoutes(
  [
    {
      path: "*",
      element: <Navigate to={RoutePaths.USERS} replace />,
    },
    {
      index: true,
      path: RoutePaths.USERS,
      element: lazy(() => import("./UserList")),
    },
    {
      path: RoutePaths.USERS_DETAILS,
      element: lazy(() => import("./UserDetails")),
    },
  ] as any,
  {
    pathPrifix: RoutePaths.USERS,
    excludePathPrifix: true,
  }
);