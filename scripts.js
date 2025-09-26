/*
  --------------------------------------------------------------------------------------
  Função para obter a lista existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const getList = async () => {
  let url = 'http://127.0.0.1:5000/produtos';
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      data.produtos.forEach(item => insertList(item.nome, item.quantidade, item.valor))
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Chamada da função para carregamento inicial dos dados
  --------------------------------------------------------------------------------------
*/
getList()


/*
  --------------------------------------------------------------------------------------
  Função para colocar um item na lista do servidor via requisição POST
  --------------------------------------------------------------------------------------
*/
const postItem = async (inputProduct, inputQuantity, inputPrice) => {
  const formData = new FormData();
  formData.append('nome', inputProduct);
  formData.append('quantidade', inputQuantity);
  formData.append('valor', inputPrice);

  let url = 'http://127.0.0.1:5000/produto';
  fetch(url, {
    method: 'post',
    body: formData
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}


/*
  --------------------------------------------------------------------------------------
  Função para criar um botão close para cada item da lista
  --------------------------------------------------------------------------------------
*/
const insertButton = (parent) => {
  let span = document.createElement("span");
  let txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  parent.appendChild(span);
}


/*
  --------------------------------------------------------------------------------------
  Função para remover um item da lista de acordo com o click no botão close
  --------------------------------------------------------------------------------------
*/
const removeElement = () => {
  let close = document.getElementsByClassName("close");
  // var table = document.getElementById('myTable');
  let i;
  for (i = 0; i < close.length; i++) {
    close[i].onclick = function () {
      let div = this.parentElement.parentElement;
      const nomeItem = div.getElementsByTagName('td')[0].innerHTML
      if (confirm("Você tem certeza?")) {
        div.remove()
        deleteItem(nomeItem)
        alert("Removido!")
      }
    }
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para deletar um item da lista do servidor via requisição DELETE
  --------------------------------------------------------------------------------------
*/
const deleteItem = (item) => {
  console.log(item)
  let url = 'http://127.0.0.1:5000/produto?nome=' + item;
  fetch(url, {
    method: 'delete'
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}

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
  document.getElementById("newInputClient").value = "";
  document.getElementById("newFirstBenefitClient").value = "";
  document.getElementById("newSecondBenefitClient").value = "";
};

/*
  --------------------------------------------------------------------------------------
  Função para adicionar um novo cliente 
  --------------------------------------------------------------------------------------
*/

const newClient = () => {
  const nomeCliente = document.getElementById("newInputClient").value;
  const beneficioPrimarioCliente = document.getElementById("newFirstBenefitClient").value;
  const beneficioSecundarioCliente = document.getElementById("newSecondBenefitClient").value;

  if (!isTextoValido(nomeCliente)) {
    alert("O nome do cliente precisa ser texto válido!");
    return;
  }

  if (!isTextoValido(beneficioPrimarioCliente) || !isTextoValido(beneficioSecundarioCliente)) {
    alert("Os benefícios precisam ser texto válido!");
    return;
  }

  insertClient(nomeCliente, beneficioPrimarioCliente, beneficioSecundarioCliente);
  postItem(nomeCliente, beneficioPrimarioCliente, beneficioSecundarioCliente);
  alert("Cliente adicionado!");
};

/*
  --------------------------------------------------------------------------------------
  Função para inserir clientes na lista de clientes
  --------------------------------------------------------------------------------------
*/
const insertClient = (nomeCliente, beneficioPrimarioCliente, beneficioSecundarioCliente) => {
  const table = document.getElementById("clientTable");
  const row = table.insertRow();

  [nomeCliente, beneficioPrimarioCliente, beneficioSecundarioCliente].forEach((valor) => {
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
  const beneficioPrimarioCartao = document.getElementById("newFirstBenefitCard").value;
  const beneficioSecundarioCartao = document.getElementById("newSecondBenefitCard").value;

  if (!isTextoValido(nomeCartao)) {
    alert("O nome do cartão precisa ser texto válido!");
    return;
  }

  if (!isTextoValido(beneficioPrimarioCartao) || !isTextoValido(beneficioSecundarioCartao)) {
    alert("Os benefícios precisam ser texto válido!");
    return;
  }

  insertCard(nomeCartao, beneficioPrimarioCartao, beneficioSecundarioCartao);
  postItem(nomeCartao, beneficioPrimarioCartao, beneficioSecundarioCartao);
  alert("Cartão adicionado!");
};

/*
  --------------------------------------------------------------------------------------
  Função para inserir cartão na lista de cartões
  --------------------------------------------------------------------------------------
*/
const insertCard = (nomeCartao, beneficioPrimarioCartao, beneficioSecundarioCartao) => {
  const table = document.getElementById("cardTable");
  const row = table.insertRow();

  [nomeCartao, beneficioPrimarioCartao, beneficioSecundarioCartao].forEach((valor) => {
    const celula = row.insertCell();
    celula.textContent = valor;
  });

  insertButton(row.insertCell());
  clearFields();
  removeElement();
};



