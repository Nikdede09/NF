var estoque = [];
var exclusaoDesfeita = null;

function adicionarNotaFiscal() {
  var ano = document.getElementById("ano").value;
  var valor = document.getElementById("valor").value;
  var cidade = document.getElementById("cidade").value;
  var documento = document.getElementById("documento").value;


  var notaFiscal = {
    ano: ano,
    valor: valor,
    cidade: cidade,
    documento: documento,
    pago: false
  };

  estoque.push(notaFiscal);

  exibirEstoque();
  salvarEstoque();

  document.getElementById("ano").value = "";
  document.getElementById("valor").value = "";
  document.getElementById("cidade").value = "";
  document.getElementById("documento").value = "";
}

function exibirEstoque() {
  var tableBody = document.getElementById("estoque-table").getElementsByTagName("tbody")[0];
  tableBody.innerHTML = "";

  ordenarEstoque();

  for (var i = 0; i < estoque.length; i++) {
    var notaFiscal = estoque[i];

    var row = tableBody.insertRow();
    var anoCell = row.insertCell(0);
    var valorCell = row.insertCell(1);
    var cidadeCell = row.insertCell(2);
    var documentoCell = row.insertCell(3);
    var actionsCell = row.insertCell(4);

    anoCell.innerHTML = notaFiscal.ano;
    valorCell.innerHTML = "R$ " + notaFiscal.valor;
    cidadeCell.innerHTML = notaFiscal.cidade;
    documentoCell.innerHTML = notaFiscal.documento;

    if (notaFiscal.pago) {
      valorCell.classList.add("paid");
    }

    var editButton = document.createElement("button");
    editButton.innerHTML = "Alterar";
    editButton.className = "edit-button";
    editButton.onclick = (function(index) {
      return function() {
        abrirModalAlterar(index);
      };
    })(i);

    actionsCell.appendChild(editButton);

    var deleteButton = document.createElement("button");
    deleteButton.innerHTML = "Excluir";
    deleteButton.className = "delete-button";
    deleteButton.onclick = (function(index) {
      return function() {
        excluirNotaFiscal(index);
      };
    })(i);

    actionsCell.appendChild(deleteButton);

    var okButton = document.createElement("button");
    okButton.innerHTML = "OK";
    okButton.className = "ok-button";
    okButton.onclick = (function(index) {
      return function() {
        marcarComoPago(index);
      };
    })(i);

    actionsCell.appendChild(okButton);
  }
}

function excluirNotaFiscal(index) {
  if (index < estoque.length) {
    exclusaoDesfeita = estoque.splice(index, 1)[0];
    exibirEstoque();
    salvarEstoque();
    mostrarBotaoDesfazer();
  }
}

function desfazerExclusao() {
  if (exclusaoDesfeita) {
    estoque.push(exclusaoDesfeita);
    exibirEstoque();
    salvarEstoque();
    esconderBotaoDesfazer();
    exclusaoDesfeita = null;
  }
}

function abrirModalAlterar(index) {
  if (index < estoque.length) {
    var notaFiscal = estoque[index];

    var modal = document.getElementById("modalAlterarNotaFiscal");

    document.getElementById("modalAno").value = notaFiscal.ano;
    document.getElementById("modalValor").value = notaFiscal.valor;
    document.getElementById("modalCidade").value = notaFiscal.cidade;
    document.getElementById("modalDocumento").value = notaFiscal.documento;

    modal.style.display = "block";

    var modalSalvar = document.getElementById("modalSalvar");
    modalSalvar.onclick = function() {
      salvarAlteracoes(index);
    };

    var modalCancelar = document.getElementById("modalCancelar");
    modalCancelar.onclick = function() {
      fecharModal();
    };
  }
}

function salvarAlteracoes(index) {
  var modalAno = document.getElementById("modalAno").value;
  var modalValor = document.getElementById("modalValor").value;
  var modalCidade = document.getElementById("modalCidade").value;
  var modalDocumento = document.getElementById("modalDocumento").value;

  if (modalAno && modalValor && modalCidade && modalDocumento) {
    if (index < estoque.length) {
      estoque[index].ano = modalAno;
      estoque[index].valor = modalValor;
      estoque[index].cidade = modalCidade;
      estoque[index].documento = modalDocumento;
      exibirEstoque();
      salvarEstoque();
    }
    fecharModal();
  }
}

function fecharModal() {
  var modal = document.getElementById("modalAlterarNotaFiscal");
  modal.style.display = "none";
}

function mostrarBotaoDesfazer() {
  var undoButton = document.getElementById("undoButton");
  undoButton.style.display = "inline-block";
}

function esconderBotaoDesfazer() {
  var undoButton = document.getElementById("undoButton");
  undoButton.style.display = "none";
}

function marcarComoPago(index) {
  if (index < estoque.length) {
    estoque[index].pago = true;
    exibirEstoque();
    salvarEstoque();
  }
}

function salvarEstoque() {
  localStorage.setItem('estoque', JSON.stringify(estoque));
}

function carregarEstoque() {
  var estoqueSalvo = localStorage.getItem('estoque');
  if (estoqueSalvo) {
    estoque = JSON.parse(estoqueSalvo);
  }
}

function ordenarEstoque() {
  estoque.sort(function(a, b) {
    var cidadeA = a.cidade.toUpperCase();
    var cidadeB = b.cidade.toUpperCase();
    if (cidadeA < cidadeB) {
      return -1;
    }
    if (cidadeA > cidadeB) {
      return 1;
    }
    return 0;
  });
}

carregarEstoque();
exibirEstoque();
