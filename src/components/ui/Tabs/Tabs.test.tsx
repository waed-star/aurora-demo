import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { Tabs } from "./Tabs";

function renderTabs() {
  return render(
    <Tabs defaultValue="tab1">
      <Tabs.List>
        <Tabs.Trigger value="tab1">Tab One</Tabs.Trigger>
        <Tabs.Trigger value="tab2">Tab Two</Tabs.Trigger>
        <Tabs.Trigger value="tab3" disabled>Tab Three</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tab1">Content One</Tabs.Content>
      <Tabs.Content value="tab2">Content Two</Tabs.Content>
      <Tabs.Content value="tab3">Content Three</Tabs.Content>
    </Tabs>,
  );
}

describe("Tabs", () => {
  it("renders the default active tab content", () => {
    renderTabs();
    expect(screen.getByText("Content One")).toBeInTheDocument();
  });

  it("switches content on trigger click", async () => {
    renderTabs();
    await userEvent.click(screen.getByRole("tab", { name: "Tab Two" }));
    expect(screen.getByText("Content Two")).toBeInTheDocument();
  });

  it("does not activate a disabled trigger", async () => {
    renderTabs();
    const disabledTab = screen.getByRole("tab", { name: "Tab Three" });
    expect(disabledTab).toBeDisabled();
    await userEvent.click(disabledTab);
    expect(screen.queryByText("Content Three")).not.toBeInTheDocument();
  });

  it("has correct ARIA roles", () => {
    renderTabs();
    expect(screen.getAllByRole("tab")).toHaveLength(3);
    expect(screen.getByRole("tabpanel")).toBeInTheDocument();
  });
});
