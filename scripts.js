/* 
  --------------------------------------------------------------------------------------
  Função para obter listas de clientes do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/

const getList = async () => {
  const url = 'http://127.0.0.1:5000/clients';

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();

    if (!Array.isArray(data.clients)) {
      throw new Error("Formato inesperado: 'clients' não é uma lista.");
    }

    data.clients.forEach(({ name, income, benefitClient, client_id }) => {
      insertClient(name, income, benefitClient, client_id);
    });

  } catch (error) {
    console.error("Erro ao obter listas do servidor:", error.message);
  }
};

/*
  --------------------------------------------------------------------------------------
  Chamada da função para carregamento inicial dos dados
  --------------------------------------------------------------------------------------
*/
getList()

/* 
  --------------------------------------------------------------------------------------
  Função assíncrona para adicionar um item à lista do servidor via requisição POST,
  com parâmetros nome, renda e benefício para cliente
  --------------------------------------------------------------------------------------
*/
const postClient = async (name, income, benefitClient) => {
  try {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('income', income);     
    formData.append('benefitClient', benefitClient);      

    const url = `http://127.0.0.1:5000/client`;

    const response = await fetch(url, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Erro ao adicionar cliente: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
  } catch (error) {
    console.error(`Erro ao tentar adicionar o cliente:`, error);
  }
};

/* 
  --------------------------------------------------------------------------------------
  Função para criar um botão "close" para cada item da lista
  --------------------------------------------------------------------------------------
*/
const insertButton = (parent) => {
  const botaoFechar = document.createElement("span");
  botaoFechar.className = "close";
  botaoFechar.textContent = "×"; // Unicode para símbolo de fechar

  parent.appendChild(botaoFechar);
};


/*
  --------------------------------------------------------------------------------------
  Função para remover um item da lista de acordo com o click no botão close
  --------------------------------------------------------------------------------------
*/
const removeElement = () => {
  const closeButtons = document.querySelectorAll(".close");

  closeButtons.forEach(button => {
    button.addEventListener("click", () => {
      const row = button.closest("tr");
      const nomeItem = row?.querySelector("td")?.innerText;

      if (!nomeItem) return;

      if (confirm("Você tem certeza?")) {
        row.remove();
        deleteItem(nomeItem);
        alert("Removido!");
      }
    });
  });
};

/*
  --------------------------------------------------------------------------------------
  Função para deletar um item da lista do servidor via requisição DELETE
  --------------------------------------------------------------------------------------
*/
const deleteItem = async (item) => {
  try {
    const params = new URLSearchParams({ name: item });
    const response = await fetch(`http://127.0.0.1:5000/client?${params}`, {
      method: 'DELETE',
    });

    const data = await response.json();
    console.log('Item deletado:', data);
  } catch (error) {
    console.error('Erro ao deletar item:', error);
  }
};

/*
  --------------------------------------------------------------------------------------
  Utilitário para verificar se o valor é texto válido
  --------------------------------------------------------------------------------------
*/
const isTextoValido = (valor) => {
  return typeof valor === "string" && valor.trim() !== "" && isNaN(valor);
};

/*
  --------------------------------------------------------------------------------------
  Função para limpar os campos de entrada
  --------------------------------------------------------------------------------------
*/
const clearFields = () => {
  const campos = [
    "newInputClient",
    "newIncomeClient",
    "newBenefitClient",
    "newInputCard",
    "newLimitCard",
    "newBenefitCard",
    "newIdClient"
  ];

  campos.forEach((id) => {
    const campo = document.getElementById(id);
    if (campo) campo.value = "";
  });
};


/*
  --------------------------------------------------------------------------------------
  Função para adicionar um novo cliente 
  --------------------------------------------------------------------------------------
*/

const newClient = () => {
  const nomeCliente = document.getElementById("newInputClient").value;
  const rendaCliente = document.getElementById("newIncomeClient").value;
  const beneficioCliente = document.getElementById("newBenefitClient").value;

  if (!isTextoValido(nomeCliente)) {
    alert("O nome do cliente precisa ser texto válido!");
    return;
  }

   if (isNaN(rendaCliente)) {
    alert("A renda cadastrada precisa ser um valor numérico!");
    return;
  }

  if (!isTextoValido(beneficioCliente)) {
    alert("Os benefícios precisam ser texto válido!");
    return;
  }

  insertClient(nomeCliente, rendaCliente, beneficioCliente);
  postClient(nomeCliente, rendaCliente, beneficioCliente);
  alert("Cliente adicionado!");
};

/*
  --------------------------------------------------------------------------------------
  Função para inserir clientes na lista de clientes
  --------------------------------------------------------------------------------------
*/
const insertClient = (nomeCliente, rendaCliente, beneficioCliente, client_id) => {
  const table = document.getElementById("clientTable");
  const row = table.insertRow();

  [nomeCliente, rendaCliente, beneficioCliente, client_id].forEach((valor) => {
    const celula = row.insertCell();
    celula.textContent = valor;
  });

  insertButton(row.insertCell());
  clearFields();
  removeElement();
};

/*
  --------------------------------------------------------------------------------------
  Função para adicionar um novo cartao
  --------------------------------------------------------------------------------------
*/

const newCard = () => {
  const nomeCartao = document.getElementById("newInputCard").value;
  const limiteCartao = document.getElementById("newLimitCard").value;
  const beneficioCartao = document.getElementById("newBenefitCard").value;
  const idCliente = document.getElementById("newIdClient").value;

  if (!isTextoValido(nomeCartao)) {
    alert("O nome do cartão precisa ser texto válido!");
    return;
  }

  if (isNaN(limiteCartao)) {
    alert("O limite cadastrado precisa ser um valor numérico!");
    return;
  }

  if (isNaN(idCliente)) {
    alert("O id do cliente cadastrado precisa ser um valor numérico!");
    return;
  }

  if (!isTextoValido(beneficioCartao)) {
    alert("Os benefícios precisam ser texto válido!");
    return;
  }

  insertCard(nomeCartao, limiteCartao, beneficioCartao, idCliente);
  postCard(nomeCartao, limiteCartao, beneficioCartao, idCliente);
  alert("Cartão adicionado!");
};

/*
  --------------------------------------------------------------------------------------
  Função para inserir cartão na lista de cartões
  --------------------------------------------------------------------------------------
*/
const insertCard = (nomeCartao, limiteCartao, beneficioCartao, idCliente) => {
  const table = document.getElementById("cardTable");
  const row = table.insertRow();

  [nomeCartao, limiteCartao, beneficioCartao, idCliente].forEach((valor) => {
    const celula = row.insertCell();
    celula.textContent = valor;
  });

  insertButton(row.insertCell());
  clearFields();
  removeElement();
};

/* 
  --------------------------------------------------------------------------------------
  Função assíncrona para adicionar um cartão à lista do servidor via requisição POST,
  com parâmetros nome, renda, benefício, id do cliente
  --------------------------------------------------------------------------------------
*/
const postCard = async (name, limit, benefitCard, client_id) => {
  try {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('limit', limit);     
    formData.append('benefitCard', benefitCard);
    formData.append('client_id', client_id);      

    const url = `http://127.0.0.1:5000/card`;

    const response = await fetch(url, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Erro ao adicionar cartão: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
  } catch (error) {
    console.error(`Erro ao tentar adicionar o cartão:`, error);
  }
};


/* 
  --------------------------------------------------------------------------------------
  Função para obter listas de cartões do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/

const getCard = async () => {
  const url = 'http://127.0.0.1:5000/cards';

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();

    if (!Array.isArray(data.cards)) {
      throw new Error("Formato inesperado: 'clients' não é uma lista.");
    }

    data.cards.forEach(({ name, limit, benefitCard, client_id}) => {
      insertCard(name, limit, benefitCard, client_id);
    });

  } catch (error) {
    console.error("Erro ao obter listas do servidor:", error.message);
  }
};

getCard()