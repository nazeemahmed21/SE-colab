import React from "react";
import { render, screen } from "@testing-library/react";
import Toolbox from "./toolbox";

describe("Toolbox component", () => {
  it("renders correctly", () => {
    render(<Toolbox />);

    // Check if specific text content is present in the rendered component
    expect(screen.getByText(/Tool Box/)).toBeInTheDocument();
    expect(screen.getByText(/Please choose from our extensive tools gathered to meet your requirements/)).toBeInTheDocument();

  });
});

