
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import FormularioConsulta from "./FormularioConsulta";

describe("FormularioConsulta", () => {
  it("deve exibir os campos do formulário", () => {
    render(
      <FormularioConsulta
        onCadastrar={vi.fn()}
        consultaEditando={null}
        onSalvarEdicao={vi.fn()}
        onCancelarEdicao={vi.fn()}
      />
    );

    expect(
      screen.getByRole("heading", { name: "Cadastrar consulta ♡" })
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Ex.: Mariana Oliveira")
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Ex.: Dra. Ana Souza")
    ).toBeInTheDocument();

    expect(screen.getByLabelText("Especialidade")).toBeInTheDocument();
  });

  it("deve cadastrar uma consulta quando os campos estiverem preenchidos", () => {
    const onCadastrar = vi.fn();

    render(
      <FormularioConsulta
        onCadastrar={onCadastrar}
        consultaEditando={null}
        onSalvarEdicao={vi.fn()}
        onCancelarEdicao={vi.fn()}
      />
    );

    fireEvent.change(screen.getByPlaceholderText("Ex.: Mariana Oliveira"), {
      target: { value: "Mariana Oliveira" },
    });

    fireEvent.change(screen.getByPlaceholderText("Ex.: Dra. Ana Souza"), {
      target: { value: "Dra. Ana Souza" },
    });

    fireEvent.change(screen.getByLabelText("Especialidade"), {
      target: { value: "Psicologia" },
    });

    fireEvent.change(screen.getByLabelText("Data"), {
      target: { value: "2026-12-04" },
    });

    fireEvent.change(screen.getByLabelText("Horário"), {
      target: { value: "14:00" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: "Cadastrar consulta ♡" })
    );

    expect(onCadastrar).toHaveBeenCalledTimes(1);

    expect(onCadastrar).toHaveBeenCalledWith(
      expect.objectContaining({
        paciente: "Mariana Oliveira",
        profissional: "Dra. Ana Souza",
        especialidade: "Psicologia",
        data: "2026-12-04",
        horario: "14:00",
        modalidade: "Online",
        status: "Agendada",
      })
    );
  });
});
