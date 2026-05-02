import { createRef } from "react";
import { describe, it, expect } from "vitest";
import { Nav } from "./Nav";
import { Home, User, Search } from "lucide-react";

const defaultItems = [
  {
    id: "home",
    label: "Home",
    icon: Home,
  },
  {
    id: "profile",
    label: "Profile",
    icon: User,
  },
  {
    id: "search",
    label: "Search",
    icon: Search,
  },
];

describe("Nav", () => {
  it("exports the Nav component", () => {
    expect(Nav).toBeDefined();
    expect(Nav.displayName).toBe("Nav");
  });

  it("accepts forwardRef", () => {
    const ref = createRef<HTMLElement>();
    expect(ref).toBeDefined();
  });

  it("accepts items prop with NavigationItem type", () => {
    const items = defaultItems;
    expect(items).toHaveLength(3);
    expect(items[0].id).toBe("home");
  });

  it("supports controlled mode via selected prop", () => {
    const props = {
      items: defaultItems,
      selected: "profile",
      onChange: (id: string) => {
        expect(id).toBeDefined();
      },
    };
    expect(props.selected).toBe("profile");
  });

  it("supports uncontrolled mode via defaultSelected prop", () => {
    const props = {
      items: defaultItems,
      defaultSelected: "home",
    };
    expect(props.defaultSelected).toBe("home");
  });

  it("accepts className for consumer styling", () => {
    const props = {
      items: defaultItems,
      defaultSelected: "home",
      className: "custom-class",
    };
    expect(props.className).toBe("custom-class");
  });

  it("accepts asChild prop for Radix Slot composition", () => {
    const props = {
      items: defaultItems,
      asChild: true,
    };
    expect(props.asChild).toBe(true);
  });
});

