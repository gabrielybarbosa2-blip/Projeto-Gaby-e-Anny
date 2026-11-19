
import { useEffect, useState } from "react";
import "./App.css";
import FormularioConsulta from "./components/FormularioConsulta";
import { filtrarConsultas } from "./utils/consultas";
import {
  listarConsultas,
  criarConsulta,
  atualizarConsulta,
  removerConsulta,
} from "./api";

const consultasIniciais = [
  {
    id: 1,
    paciente: "Mariana Oliveira",
    profissional: "Dra. Ana Souza",
    especialidade: "Psicologia",
    data: "2026-12-04",
    horario: "14:00",
    modalidade: "Online",
    status: "Agendada",
  },
  {
    id: 2,
    paciente: "Laura Mendes",
    profissional: "Dra. Julia Costa",
    especialidade: "Nutrição",
    data: "2026-12-05",
    horario: "09:30",
    modalidade: "Presencial",
    status: "Agendada",
  },
];

function consultaParaPost(consulta) {
  return {
    title: consulta.paciente,
    body: JSON.stringify({
      profissional: consulta.profissional,
      especialidade: consulta.especialidade,
      data: consulta.data,
      horario: consulta.horario,
      modalidade: consulta.modalidade,
      status: consulta.status,
    }),
    userId: 1,
  };
}

function App() {
  const [busca, setBusca] = useState("");
  const [consultaEditando, setConsultaEditando] = useState(null);
  const [consultas, setConsultas] = useState(consultasIniciais);
  const [carregando, setCarregando] = useState(true);
  const [processando, setProcessando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function carregarConsultas() {
      setCarregando(true);
      setErro("");

      try {
        const dados = await listarConsultas({
          signal: controller.signal,
        });

        if (!Array.isArray(dados)) {
          throw new Error("Resposta inválida da API.");
        }

        // A API de demonstração não contém consultas reais.
        // Mantemos os dados próprios do MenteSã na tela.
        setConsultas(consultasIniciais);
      } catch (error) {
        if (error.name !== "AbortError") {
          setErro(
            "Não foi possível acessar a API. As consultas cadastradas continuam disponíveis."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setCarregando(false);
        }
      }
    }

    carregarConsultas();

    return () => controller.abort();
  }, []);

  async function cadastrarConsulta(novaConsulta) {
    setProcessando(true);
    setErro("");

    try {
      const resultado = await criarConsulta(
        consultaParaPost(novaConsulta)
      );

      setConsultas((listaAtual) => [
        ...listaAtual,
        {
          ...novaConsulta,
          id: resultado?.id ?? Date.now(),
          status: "Agendada",
        },
      ]);
    } catch {
      setErro("Não foi possível cadastrar a consulta. Tente novamente.");
    } finally {
      setProcessando(false);
    }
  }

  async function salvarEdicao(consultaAtualizada) {
    setProcessando(true);
    setErro("");

    try {
      await atualizarConsulta(
        consultaAtualizada.id,
        consultaParaPost(consultaAtualizada)
      );

      setConsultas((listaAtual) =>
        listaAtual.map((consulta) =>
          consulta.id === consultaAtualizada.id
            ? consultaAtualizada
            : consulta
        )
      );

      setConsultaEditando(null);
    } catch {
      setErro("Não foi possível editar a consulta. Tente novamente.");
    } finally {
      setProcessando(false);
    }
  }

  function cancelarEdicao() {
    setConsultaEditando(null);
  }

  async function excluirConsulta(id) {
    const confirmar = window.confirm(
      "Deseja realmente excluir esta consulta?"
    );

    if (!confirmar) return;

    setProcessando(true);
    setErro("");

    try {
      await removerConsulta(id);

      setConsultas((listaAtual) =>
        listaAtual.filter((consulta) => consulta.id !== id)
      );

      if (consultaEditando?.id === id) {
        setConsultaEditando(null);
      }
    } catch {
      setErro("Não foi possível excluir a consulta. Tente novamente.");
    } finally {
      setProcessando(false);
    }
  }

  function editarConsulta(consulta) {
    setConsultaEditando({ ...consulta });

    document
      .getElementById("cadastro")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const consultasFiltradas = filtrarConsultas(consultas, busca);

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logo">
          <span className="logo-icon">♡</span>
          <h1>MenteSã</h1>
          <p>Cuide de você com carinho.</p>
        </div>

        <nav className="menu">
          <a className="menu-item ativo" href="#inicio">
            <span>⌂</span> Início
          </a>

          <a className="menu-item" href="#consultas">
            <span>▦</span> Consultas
          </a>

          <a className="menu-item" href="#cadastro">
            <span>＋</span> Nova consulta
          </a>

          <a className="menu-item" href="#sobre">
            <span>♡</span> Sobre o projeto
          </a>
        </nav>

        <div className="sidebar-footer">Feito com carinho ♡</div>
      </aside>

      <main className="conteudo" id="inicio">
        <header className="topbar">
          <div>
            <span className="subtitulo">SEU ESPAÇO DE CUIDADO</span>
            <h2>Olá! Que bom ter você aqui 🌷</h2>
          </div>

          <div className="avatar">M</div>
        </header>

        <section className="boas-vindas">
          <div className="boas-vindas-texto">
            <span className="etiqueta">BEM-VINDA AO MENTESÃ</span>

            <h2>Cuidar de si também é uma conquista.</h2>

            <p>
              Organize suas consultas de Psicologia e Nutrição
              em um só lugar, com mais leveza e praticidade.
            </p>

            <a className="botao-principal" href="#cadastro">
              Agendar consulta <span>→</span>
            </a>
          </div>

          <div className="decoracao" aria-hidden="true">
            <span>☁</span>
            <span>♡</span>
            <span>✿</span>
          </div>
        </section>

        <section className="resumo">
          <div className="resumo-card">
            <span className="resumo-icone">♡</span>
            <div>
              <p>Consultas cadastradas</p>
              <h3>{consultas.length}</h3>
            </div>
          </div>

          <div className="resumo-card">
            <span className="resumo-icone">✿</span>
            <div>
              <p>Especialidades</p>
              <h3>2</h3>
            </div>
          </div>
        </section>

        <section className="secao-formulario" id="cadastro">
          <FormularioConsulta
            key={consultaEditando?.id ?? "nova-consulta"}
            onCadastrar={cadastrarConsulta}
            consultaEditando={consultaEditando}
            onSalvarEdicao={salvarEdicao}
            onCancelarEdicao={cancelarEdicao}
          />
        </section>

        <section className="secao-consultas" id="consultas">
          <div className="titulo-secao">
            <div>
              <span className="subtitulo">TUDO ORGANIZADO</span>
              <h2>Suas consultas</h2>
            </div>

            <span className="contador">
              {consultasFiltradas.length}{" "}
              {consultasFiltradas.length === 1 ? "consulta" : "consultas"}
            </span>
          </div>

          <input
            className="campo-busca"
            type="text"
            placeholder="⌕  Buscar pelo nome do paciente..."
            aria-label="Buscar consultas pelo nome do paciente"
            value={busca}
            onChange={(evento) => setBusca(evento.target.value)}
          />

          {erro && (
            <div role="alert" className="mensagem-erro">
              {erro}
            </div>
          )}

          {processando && (
            <p role="status">Processando operação...</p>
          )}

          <div className="lista-consultas">
            {carregando ? (
              <div className="vazio">
                <h3>Carregando consultas...</h3>
                <p>Aguarde um instante.</p>
              </div>
            ) : consultasFiltradas.length > 0 ? (
              consultasFiltradas.map((consulta) => (
                <article className="consulta-card" key={consulta.id}>
                  <div className="data-card">
                    <span>
                      {consulta.data.slice(8, 10)}/
                      {consulta.data.slice(5, 7)}
                    </span>

                    <strong>{consulta.horario}</strong>
                  </div>

                  <div className="consulta-info">
                    <span className="especialidade">
                      {consulta.especialidade}
                    </span>

                    <h3>{consulta.paciente}</h3>
                    <p>{consulta.profissional}</p>

                    <span className="modalidade">
                      {consulta.modalidade}
                    </span>
                  </div>

                  <span className="status">{consulta.status}</span>

                  <div className="acoes-consulta">
                    <button
                      type="button"
                      className="botao-editar"
                      disabled={processando}
                      onClick={() => editarConsulta(consulta)}
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      className="botao-excluir"
                      disabled={processando}
                      onClick={() => excluirConsulta(consulta.id)}
                    >
                      Excluir
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <div className="vazio">
                <span>♡</span>
                <h3>Nenhuma consulta encontrada</h3>

                <p>
                  {busca.trim()
                    ? "Tente pesquisar por outro nome."
                    : "Suas consultas aparecerão aqui quando forem cadastradas."}
                </p>
              </div>
            )}
          </div>
        </section>

        <footer id="sobre">
          <p>MenteSã ♡ Um espaço para cuidar de você.</p>
          <span>Projeto acadêmico • IFMS 2026</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
