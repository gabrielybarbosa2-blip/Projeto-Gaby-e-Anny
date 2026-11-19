
import { useState } from "react";
import { validarConsulta } from "../utils/consultas";

const formularioInicial = {
  paciente: "",
  profissional: "",
  especialidade: "",
  data: "",
  horario: "",
  modalidade: "Online",
};

function FormularioConsulta({
  onCadastrar,
  consultaEditando,
  onSalvarEdicao,
  onCancelarEdicao,
}) {
  const [formulario, setFormulario] = useState(() => ({
    ...formularioInicial,
    ...(consultaEditando || {}),
  }));

  const [erro, setErro] = useState("");
  const editando = Boolean(consultaEditando);

  function atualizarCampo(evento) {
    const { name, value } = evento.target;

    setFormulario((formularioAtual) => ({
      ...formularioAtual,
      [name]: value,
    }));
  }

  function enviarFormulario(evento) {
    evento.preventDefault();

    try {
      validarConsulta(formulario);

      if (editando) {
        onSalvarEdicao({
          ...consultaEditando,
          ...formulario,
        });
      } else {
        onCadastrar({
          ...formulario,
          status: "Agendada",
        });
      }

      setFormulario({ ...formularioInicial });
      setErro("");
    } catch (erroValidacao) {
      setErro(erroValidacao.message);
    }
  }

  function cancelarEdicao() {
    setFormulario({ ...formularioInicial });
    setErro("");
    onCancelarEdicao();
  }

  return (
    <form className="form-consulta" onSubmit={enviarFormulario}>
      <div className="titulo-formulario">
        <span className="subtitulo">
          {editando ? "EDITANDO AGENDAMENTO" : "NOVO AGENDAMENTO"}
        </span>

        <h2>
          {editando ? "Editar consulta ♡" : "Cadastrar consulta ♡"}
        </h2>

        <p>
          {editando
            ? "Altere os dados e salve suas modificações."
            : "Preencha os dados para organizar sua consulta."}
        </p>
      </div>

      <div className="campos-formulario">
        <label>
          Nome do paciente
          <input
            name="paciente"
            value={formulario.paciente}
            onChange={atualizarCampo}
            placeholder="Ex.: Mariana Oliveira"
          />
        </label>

        <label>
          Nome do profissional
          <input
            name="profissional"
            value={formulario.profissional}
            onChange={atualizarCampo}
            placeholder="Ex.: Dra. Ana Souza"
          />
        </label>

        <label>
          Especialidade
          <select
            name="especialidade"
            value={formulario.especialidade}
            onChange={atualizarCampo}
          >
            <option value="">Selecione</option>
            <option value="Psicologia">Psicologia</option>
            <option value="Nutrição">Nutrição</option>
          </select>
        </label>

        <label>
          Data
          <input
            type="date"
            name="data"
            value={formulario.data}
            onChange={atualizarCampo}
          />
        </label>

        <label>
          Horário
          <input
            type="time"
            name="horario"
            value={formulario.horario}
            onChange={atualizarCampo}
          />
        </label>

        <label>
          Modalidade
          <select
            name="modalidade"
            value={formulario.modalidade}
            onChange={atualizarCampo}
          >
            <option value="Online">Online</option>
            <option value="Presencial">Presencial</option>
          </select>
        </label>
      </div>

      {erro && <p className="erro-formulario">{erro}</p>}

      <div className="acoes-formulario">
        <button className="botao-principal" type="submit">
          {editando ? "Salvar alterações ♡" : "Cadastrar consulta ♡"}
        </button>

        {editando && (
          <button
            className="botao-cancelar"
            type="button"
            onClick={cancelarEdicao}
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

export default FormularioConsulta;
