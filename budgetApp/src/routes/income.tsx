import { createFileRoute } from "@tanstack/react-router";
import Income from "../pages/income";

export const Route = createFileRoute("/income")({
  component: Income,
});
