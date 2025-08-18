import { render, screen, fireEvent } from "@testing-library/react";
import ColorHarmonyGenerator from "../src/components/ColorHarmonyGenerator";

describe("ColorHarmonyGenerator", () => {
  const mockOnHarmonyChange = vi.fn();

  beforeEach(() => {
    mockOnHarmonyChange.mockClear();
  });

  it("renders without crashing", () => {
    render(
      <ColorHarmonyGenerator
        colorFormat="hex"
        palette={["#3498db"]}
        onHarmonyChange={mockOnHarmonyChange}
      />
    );
    expect(
      screen.getByText("Generador de Armonías de Color")
    ).toBeInTheDocument();
  });

  it("calls onHarmonyChange with initial colors on mount", () => {
    render(
      <ColorHarmonyGenerator
        colorFormat="hex"
        palette={["#3498db"]}
        onHarmonyChange={mockOnHarmonyChange}
      />
    );
    // Expect onHarmonyChange to be called at least once with the initial color and its harmonies
    expect(mockOnHarmonyChange).toHaveBeenCalled();
    expect(mockOnHarmonyChange.mock.calls[0][0][0]).toBe("#3498db");
  });

  it("updates base color and calls onHarmonyChange", () => {
    render(
      <ColorHarmonyGenerator
        colorFormat="hex"
        palette={["#3498db"]}
        onHarmonyChange={mockOnHarmonyChange}
      />
    );

    const colorInput = screen.getByLabelText("Color Base:");
    fireEvent.change(colorInput, { target: { value: "#ff0000" } });

    expect(mockOnHarmonyChange).toHaveBeenCalledWith(
      expect.arrayContaining(["#ff0000"])
    );
  });

  it("shows JSON modal when export button is clicked", () => {
    render(
      <ColorHarmonyGenerator
        colorFormat="hex"
        palette={["#3498db"]}
        onHarmonyChange={mockOnHarmonyChange}
      />
    );

    const exportButton = screen.getByText("Exportar Armonías JSON");
    fireEvent.click(exportButton);

    expect(screen.getByText("Copiar al Portapapeles")).toBeInTheDocument();
  });
});
