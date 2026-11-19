
export function validarConsulta(consulta) {
  if (!consulta.paciente.trim()) {
    throw new Error("Informe o nome do paciente.");
  }

  if (!consulta.profissional.trim()) {
    throw new Error("Informe o nome do profissional.");
  }

  if (!consulta.especialidade) {
    throw new Error("Selecione uma especialidade.");
  }

  if (!consulta.data) {
    throw new Error("Informe a data da consulta.");
  }

  if (!consulta.horario) {
    throw new Error("Informe o horário da consulta.");
  }

  return true;
}

export function filtrarConsultas(consultas, termo) {
  const busca = termo.trim().toLowerCase();

  return consultas.filter((consulta) =>
    consulta.paciente.toLowerCase().includes(busca)
  );
}
