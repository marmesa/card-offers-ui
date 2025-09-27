/*
  --------------------------------------------------------------------------------------
  Função para obter a lista existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
/* 
  --------------------------------------------------------------------------------------
  Função para obter listas de clientes e cartões do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const getList = async () => {
  try {
    const endpoints = {
      cliente: 'http://127.0.0.1:5000/cliente',
      cartao: 'http://127.0.0.1:5000/cartao'
    };

    for (const tipo in endpoints) {
      const response = await fetch(endpoints[tipo], { method: 'GET' });

      if (!response.ok) {
        throw new Error(`Erro ao buscar ${tipo}: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      data.forEach(item => {
        const { nome, quantidade, valor } = item;

        if (tipo === "cliente") {
          insertClient(nome, quantidade, valor);
        } else {
          insertCard(nome, quantidade, valor);
        }
      });
    }
  } catch (error) {
    console.error("Erro ao obter listas do servidor:", error);
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
  com parâmetros nome, valor e benefício, adaptável para cliente ou cartão
  --------------------------------------------------------------------------------------
*/
const postItem = async (nome, valor, beneficio, tipo) => {
  try {
    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('quantidade', valor);     // Para cliente: renda | Para cartão: limite
    formData.append('valor', beneficio);      // Para cliente/cartão: benefício

    const endpoint = tipo === "cliente" ? "cliente" : "cartao";
    const url = `http://127.0.0.1:5000/${endpoint}`;

    const response = await fetch(url, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Erro ao adicionar ${tipo}: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`${tipo.charAt(0).toUpperCase() + tipo.slice(1)} adicionado com sucesso:`, data);
  } catch (error) {
    console.error(`Erro ao tentar adicionar o ${tipo}:`, error);
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
  Função para remover um item da lista ao clicar no botão "close", considerando múltiplas listas
  --------------------------------------------------------------------------------------
*/
const removeElement = () => {
  const botoesFechar = document.querySelectorAll(".close");

  botoesFechar.forEach((botao) => {
    botao.onclick = () => {
      const linha = botao.closest("tr");
      const tabela = botao.closest("table");
      const nomeItem = linha?.querySelector("td")?.textContent;

      if (!nomeItem || !tabela) {
        console.warn("Informações insuficientes para remover o item.");
        return;
      }

      // Determina o tipo com base no ID da tabela
      const tipo = tabela.id === "clientTable" ? "cliente" : "cartao";

      if (confirm(`Você tem certeza que deseja remover este ${tipo}?`)) {
        linha.remove();
        deleteItem(nomeItem, tipo);
        alert(`${tipo.charAt(0).toUpperCase() + tipo.slice(1)} removido!`);
      }
    };
  });
};

/* 
  --------------------------------------------------------------------------------------
  Função assíncrona para deletar um item da lista do servidor via requisição DELETE
  --------------------------------------------------------------------------------------
*/
const deleteItem = async (item, tipo) => {
  try {
    const endpoint = tipo === "cliente" ? "cliente" : "cartao";
    const url = `http://127.0.0.1:5000/${endpoint}?nome=${encodeURIComponent(item)}`;
    
    const response = await fetch(url, { method: 'DELETE' });

    if (!response.ok) {
      throw new Error(`Erro ao deletar ${tipo}: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`${tipo.charAt(0).toUpperCase() + tipo.slice(1)} deletado com sucesso:`, data);
  } catch (error) {
    console.error(`Erro ao tentar deletar o ${tipo}:`, error);
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
    "newBenefitCard"
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
  postItem(nomeCliente, rendaCliente, beneficioCliente, cliente);
  alert("Cliente adicionado!");
};

/*
  --------------------------------------------------------------------------------------
  Função para inserir clientes na lista de clientes
  --------------------------------------------------------------------------------------
*/
const insertClient = (nomeCliente, rendaCliente, beneficioCliente) => {
  const table = document.getElementById("clientTable");
  const row = table.insertRow();

  [nomeCliente, rendaCliente, beneficioCliente].forEach((valor) => {
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

  if (!isTextoValido(nomeCartao)) {
    alert("O nome do cartão precisa ser texto válido!");
    return;
  }

  if (isNaN(limiteCartao)) {
    alert("O limite cadastrado precisa ser um valor numérico!");
    return;
  }

  if (!isTextoValido(beneficioCartao)) {
    alert("Os benefícios precisam ser texto válido!");
    return;
  }

  insertCard(nomeCartao, limiteCartao, beneficioCartao);
  postItem(nomeCartao, limiteCartao, beneficioCartao, cartao);
  alert("Cartão adicionado!");
};

/*
  --------------------------------------------------------------------------------------
  Função para inserir cartão na lista de cartões
  --------------------------------------------------------------------------------------
*/
const insertCard = (nomeCartao, limiteCartao, beneficioCartao) => {
  const table = document.getElementById("cardTable");
  const row = table.insertRow();

  [nomeCartao, limiteCartao, beneficioCartao].forEach((valor) => {
    const celula = row.insertCell();
    celula.textContent = valor;
  });

  insertButton(row.insertCell());
  clearFields();
  removeElement();
};



