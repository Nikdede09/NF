var estoque = [];
var exclusaoDesfeita = null;

function adicionarNotaFiscal() {
  var ano = document.getElementById("ano").value;
  var valor = document.getElementById("valor").value.replace(',', '.');
  var cidade = document.getElementById("cidade").value;
  var documento = document.getElementById("documento").value;

  var notaFiscal = {
    ano: ano,
    cidade: cidade,

    documento: documento,
    valor: valor,

    pago: false
  };

  estoque.push(notaFiscal);

  exibirEstoque();
  salvarEstoque();

  document.getElementById("ano").value = "";
  document.getElementById("cidade").value = "";
  document.getElementById("documento").value = "";

  document.getElementById("valor").value = "";
}

function exibirEstoque() {
  var tableBody = document.getElementById("estoque-table").getElementsByTagName("tbody")[0];
  tableBody.innerHTML = "";

  ordenarEstoque();

  for (var i = 0; i < estoque.length; i++) {
    var notaFiscal = estoque[i];

    var row = tableBody.insertRow();
    var anoCell = row.insertCell(0);
    var cidadeCell = row.insertCell(1);
    var documentoCell = row.insertCell(2);

 var valorCell = row.insertCell(3);
    var actionsCell = row.insertCell(4);

    anoCell.innerHTML = notaFiscal.ano;
    valorCell.innerHTML = "R$ " + notaFiscal.valor.replace('.', ',');
    cidadeCell.innerHTML = notaFiscal.cidade;
    documentoCell.innerHTML = notaFiscal.documento;

    if (notaFiscal.pago) {
      valorCell.classList.add("paid");

      var cancelOkButton = document.createElement("button");
      cancelOkButton.innerHTML = "<i class='fas fa-times'></i> Cancelar OK";
      cancelOkButton.className = "cancel-ok-button";
      cancelOkButton.onclick = (function(index) {
        return function() {
          cancelarOk(index);
        };
      })(i);

      actionsCell.appendChild(cancelOkButton);
    } else {
      var okButton = document.createElement("button");
      okButton.innerHTML = "<i class='fas fa-check'></i> OK";
      okButton.className = "ok-button";
      okButton.onclick = (function(index) {
        return function() {
          marcarComoPago(index);
        };
      })(i);

      actionsCell.appendChild(okButton);
    }

    var editButton = document.createElement("button");
    editButton.innerHTML = "<i class='fas fa-edit'></i> Editar";
    editButton.className = "edit-button";
    editButton.onclick = (function(index) {
      return function() {
        abrirModalAlterar(index);
      };
    })(i);

    actionsCell.appendChild(editButton);

    var deleteButton = document.createElement("button");
    deleteButton.innerHTML = "<i class='fas fa-trash'></i> Excluir";
    deleteButton.className = "delete-button";
    deleteButton.onclick = (function(index) {
      return function() {
        excluirNotaFiscal(index);
      };
    })(i);

    actionsCell.appendChild(deleteButton);
  }
  verificarMostrarBotaoCancelarTodas();
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
    document.getElementById("modalCidade").value = notaFiscal.cidade;

    document.getElementById("modalDocumento").value = notaFiscal.documento;
    document.getElementById("modalValor").value = notaFiscal.valor.replace('.', ',');


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
  var modalCidade = document.getElementById("modalCidade").value;
  var modalDocumento = document.getElementById("modalDocumento").value;


  var modalValor = document.getElementById("modalValor").value.replace(',', '.');

  if (modalAno && modalValor && modalCidade && modalDocumento) {
    if (index < estoque.length) {
      estoque[index].ano = modalAno;
      estoque[index].cidade = modalCidade;
      estoque[index].documento = modalDocumento;

      estoque[index].valor = modalValor;
      exibirEstoque();
      salvarEstoque();
    }
    fecharModal();
  } else {
    alert("Por favor, preencha todos os campos.");
  }
}

function fecharModal() {
  var modal = document.getElementById("modalAlterarNotaFiscal");
  modal.style.display = "none";
}

function marcarComoPago(index) {
  if (index < estoque.length) {
    estoque[index].pago = true;
    exibirEstoque();
    salvarEstoque();
  }
}

function cancelarOk(index) {
  if (index < estoque.length) {
    estoque[index].pago = false;
    exibirEstoque();
    salvarEstoque();
  }
}

function mostrarBotaoDesfazer() {
  var button = document.getElementById("cancelAllOkButton");
  button.style.display = "inline";
}

function esconderBotaoDesfazer() {
  var button = document.getElementById("cancelAllOkButton");
  button.style.display = "none";
}

function verificarMostrarBotaoCancelarTodas() {
  var temOk = estoque.some(function(notaFiscal) {
    return notaFiscal.pago;
  });

  if (temOk) {
    mostrarBotaoDesfazer();
  } else {
    esconderBotaoDesfazer();
  }
}

function cancelarTodasAsNotasOk() {
  estoque.forEach(function(notaFiscal) {
    notaFiscal.pago = false;
  });

  exibirEstoque();
  salvarEstoque();
  esconderBotaoDesfazer();
}

function salvarEstoque() {
  localStorage.setItem("estoque", JSON.stringify(estoque));
}

function carregarEstoque() {
  var estoqueSalvo = localStorage.getItem("estoque");
  if (estoqueSalvo) {
    estoque = JSON.parse(estoqueSalvo);
  }
  exibirEstoque();
}

carregarEstoque();
