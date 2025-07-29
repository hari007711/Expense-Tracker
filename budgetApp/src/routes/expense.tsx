import { createFileRoute } from "@tanstack/react-router";
import Expense from "../pages/expense";

export const Route = createFileRoute("/expense")({
  component: Expense,
});
