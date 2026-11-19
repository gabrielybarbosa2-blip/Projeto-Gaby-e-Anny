
import { describe, it, expect } from "vitest";
import {
  validarConsulta,
  filtrarConsultas,
} from "./consultas";

const consultaValida = {
  paciente: "Mariana Oliveira",
  profissional: "Dra. Ana Souza",
  especialidade: "Psicologia",
  data: "2026-12-04",
  horario: "14:00",
  modalidade: "Online",
};

const consultas = [
  {
    ...consultaValida,
    id: 1,
  },
  {
    ...consultaValida,
    id: 2,
    paciente: "Laura Mendes",
  },
];

describe("validarConsulta", () => {
  it("deve aceitar uma consulta preenchida corretamente", () => {
    expect(validarConsulta(consultaValida)).toBe(true);
  });

  it("deve lançar um erro quando o paciente não for informado", () => {
    expect(() =>
      validarConsulta({ ...consultaValida, paciente: "" })
    ).toThrow("Informe o nome do paciente.");
  });

  it("deve lançar um erro quando o profissional não for informado", () => {
    expect(() =>
      validarConsulta({ ...consultaValida, profissional: "" })
    ).toThrow("Informe o nome do profissional.");
  });
});

describe("filtrarConsultas", () => {
  it("deve encontrar pacientes ignorando maiúsculas e minúsculas", () => {
    const resultado = filtrarConsultas(consultas, "mariana");

    expect(resultado).toHaveLength(1);
    expect(resultado[0].paciente).toBe("Mariana Oliveira");
  });

  it("deve retornar todas as consultas quando a busca estiver vazia", () => {
    expect(filtrarConsultas(consultas, "")).toHaveLength(2);
  });
});
