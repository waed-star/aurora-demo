import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, it, expect, vi } from "vitest";
import { NavBar } from "./NavBar";

describe("NavBar", () => {
  const defaultProps = {
    selected: "home" as const,
    onSelect: vi.fn(),
  };

  it("renders without crashing", () => {
    render(<NavBar {...defaultProps} />);
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("renders all three navigation items", () => {
    render(<NavBar {...defaultProps} />);
    expect(screen.getByRole("button", { name: /Home/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Search/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Profile/i }),
    ).toBeInTheDocument();
  });

  it("forwards ref to the nav element", () => {
    const ref = createRef<HTMLNavElement>();
    render(<NavBar ref={ref} {...defaultProps} />);
    expect(ref.current).toBeInstanceOf(HTMLNavElement);
  });

  it("calls onSelect when a navigation item is clicked", async () => {
    const onSelect = vi.fn();
    render(<NavBar {...defaultProps} onSelect={onSelect} />);

    const searchButton = screen.getByRole("button", { name: /Search/i });
    await userEvent.click(searchButton);

    expect(onSelect).toHaveBeenCalledWith("search");
  });

  it("marks the selected item with aria-current='page'", () => {
    render(<NavBar {...defaultProps} selected="search" />);
    const searchButton = screen.getByRole("button", { name: /Search/i });
    expect(searchButton).toHaveAttribute("aria-current", "page");
  });

  it("does not mark inactive items with aria-current", () => {
    render(<NavBar {...defaultProps} selected="home" />);
    const searchButton = screen.getByRole("button", { name: /Search/i });
    expect(searchButton).not.toHaveAttribute("aria-current");
  });

  it("merges consumer className last", () => {
    const { container } = render(
      <NavBar {...defaultProps} className="test-class" />,
    );
    const nav = screen.getByRole("navigation");
    expect(nav).toHaveClass("test-class");
  });

  it("supports custom item labels", () => {
    render(
      <NavBar {...defaultProps} itemLabels={["Inicio", "Buscar", "Perfil"]} />,
    );
    expect(screen.getByRole("button", { name: /Inicio/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Buscar/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Perfil/i })).toBeInTheDocument();
  });

  it("uses custom aria-label when provided", () => {
    render(<NavBar {...defaultProps} ariaLabel="App navigation" />);
    const nav = screen.getByRole("navigation", { name: "App navigation" });
    expect(nav).toBeInTheDocument();
  });

  it("navigates to next item with ArrowRight", async () => {
    const onSelect = vi.fn();
    render(<NavBar {...defaultProps} selected="home" onSelect={onSelect} />);

    const nav = screen.getByRole("navigation");
    await userEvent.keyboard("{ArrowRight}");
    nav.focus();
    await userEvent.keyboard("{ArrowRight}");

    // After focus, arrow should trigger navigation
    expect(onSelect).toHaveBeenCalled();
  });

  it("navigates with Home key", async () => {
    const onSelect = vi.fn();
    const { container } = render(
      <NavBar {...defaultProps} selected="profile" onSelect={onSelect} />,
    );

    const nav = screen.getByRole("navigation");
    nav.focus();
    await userEvent.keyboard("{Home}");

    expect(onSelect).toHaveBeenCalledWith("home");
  });

  it("navigates with End key", async () => {
    const onSelect = vi.fn();
    const { container } = render(
      <NavBar {...defaultProps} selected="home" onSelect={onSelect} />,
    );

    const nav = screen.getByRole("navigation");
    nav.focus();
    await userEvent.keyboard("{End}");

    expect(onSelect).toHaveBeenCalledWith("profile");
  });

  it("renders custom icons when provided", () => {
    const homeIcon = <span data-testid="home-icon">H</span>;
    const searchIcon = <span data-testid="search-icon">S</span>;
    const profileIcon = <span data-testid="profile-icon">P</span>;

    render(
      <NavBar
        {...defaultProps}
        homeIcon={homeIcon}
        searchIcon={searchIcon}
        profileIcon={profileIcon}
      />,
    );

    expect(screen.getByTestId("home-icon")).toBeInTheDocument();
    expect(screen.getByTestId("search-icon")).toBeInTheDocument();
    expect(screen.getByTestId("profile-icon")).toBeInTheDocument();
  });

  it("applies semantic token classes correctly", () => {
    render(<NavBar {...defaultProps} selected="home" />);
    const nav = screen.getByRole("navigation");

    // Check that semantic token classes are applied
    expect(nav).toHaveClass("bg-surface", "border-line");
  });
});
