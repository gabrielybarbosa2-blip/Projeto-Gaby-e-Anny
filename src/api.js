
const API_URL = "https://jsonplaceholder.typicode.com";

async function requisicao(endpoint, opcoes = {}) {
  const resposta = await fetch(`${API_URL}${endpoint}`, {
    ...opcoes,
    headers: {
      "Content-Type": "application/json",
      ...opcoes.headers,
    },
  });

  if (!resposta.ok) {
    throw new Error(`Erro na requisição: ${resposta.status}`);
  }

  if (resposta.status === 204) {
    return null;
  }

  return resposta.json();
}

export function listarConsultas({ signal } = {}) {
  return requisicao("/posts?_limit=10", { signal });
}

export function criarConsulta(consulta) {
  return requisicao("/posts", {
    method: "POST",
    body: JSON.stringify(consulta),
  });
}

export function atualizarConsulta(id, consulta) {
  return requisicao(`/posts/${id}`, {
    method: "PUT",
    body: JSON.stringify(consulta),
  });
}

export function removerConsulta(id) {
  return requisicao(`/posts/${id}`, {
    method: "DELETE",
  });
}
