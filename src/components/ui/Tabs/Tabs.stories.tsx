import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tabs } from "./Tabs";

const meta = {
  title: "UI/Tabs",
  component: Tabs,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="overview">
      <Tabs.List>
        <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
        <Tabs.Trigger value="analytics">Analytics</Tabs.Trigger>
        <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="overview">
        <div className="rounded-lg border border-line bg-surface p-6">
          <h3 className="mb-2 text-base font-semibold text-ink">Overview</h3>
          <p className="text-ink-muted">
            Summary of your project at a glance. Key metrics, recent activity,
            and quick actions live here.
          </p>
        </div>
      </Tabs.Content>
      <Tabs.Content value="analytics">
        <div className="rounded-lg border border-line bg-surface p-6">
          <h3 className="mb-2 text-base font-semibold text-ink">Analytics</h3>
          <p className="text-ink-muted">
            Detailed performance data, charts, and trends for this reporting period.
          </p>
        </div>
      </Tabs.Content>
      <Tabs.Content value="settings">
        <div className="rounded-lg border border-line bg-surface p-6">
          <h3 className="mb-2 text-base font-semibold text-ink">Settings</h3>
          <p className="text-ink-muted">
            Configure preferences, permissions, and integrations for this project.
          </p>
        </div>
      </Tabs.Content>
    </Tabs>
  ),
};

export const WithDisabledTab: Story = {
  render: () => (
    <Tabs defaultValue="active">
      <Tabs.List>
        <Tabs.Trigger value="active">Active</Tabs.Trigger>
        <Tabs.Trigger value="disabled" disabled>
          Unavailable
        </Tabs.Trigger>
        <Tabs.Trigger value="another">Another</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="active">
        <div className="rounded-lg border border-line bg-surface p-6">
          <p className="text-ink-muted">This tab is active and interactive.</p>
        </div>
      </Tabs.Content>
      <Tabs.Content value="another">
        <div className="rounded-lg border border-line bg-surface p-6">
          <p className="text-ink-muted">Another available tab.</p>
        </div>
      </Tabs.Content>
    </Tabs>
  ),
};

export const ManyTabs: Story = {
  render: () => (
    <Tabs defaultValue="profile">
      <Tabs.List>
        {["Profile", "Security", "Notifications", "Billing", "Integrations"].map(
          (label) => (
            <Tabs.Trigger key={label} value={label.toLowerCase()}>
              {label}
            </Tabs.Trigger>
          ),
        )}
      </Tabs.List>
      {["Profile", "Security", "Notifications", "Billing", "Integrations"].map(
        (label) => (
          <Tabs.Content key={label} value={label.toLowerCase()}>
            <div className="rounded-lg border border-line bg-surface p-6">
              <h3 className="mb-1 text-base font-semibold text-ink">{label}</h3>
              <p className="text-ink-muted">
                Manage your {label.toLowerCase()} settings here.
              </p>
            </div>
          </Tabs.Content>
        ),
      )}
    </Tabs>
  ),
};
