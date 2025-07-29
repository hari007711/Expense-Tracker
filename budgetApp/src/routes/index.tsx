import {
  createRootRoute,
  createRoute,
  lazyRouteComponent,
} from "@tanstack/react-router";
import { RootComponent } from "./__root";
import Dashboard from "../pages/dashboard";
import Expense from "../pages/expense";
import Income from "../pages/income";

export const rootRoute = createRootRoute({
  component: RootComponent,
});

export const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Dashboard,
});

export const expenseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/expense",
  component: Expense,
});

export const incomeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/income",
  component: Income,
});

export const routeTree = rootRoute.addChildren([
  dashboardRoute,
  expenseRoute,
  incomeRoute,
]);
