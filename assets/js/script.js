document.addEventListener("DOMContentLoaded", function () {

  let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
  let produtos = [];

  const listaProdutos = document.getElementById("listaProdutos");
  const listaCarrinho = document.getElementById("listaCarrinho");
  const totalCarrinho = document.getElementById("totalCarrinho");
  const contadorCarrinho = document.getElementById("contadorCarrinho");
  const botaoLimpar = document.getElementById("limparCarrinho");

  botaoLimpar.addEventListener("click", function () {
    carrinho = [];
    salvarCarrinho();
    atualizarCarrinho();
  });
  const botaoCheckout = document.getElementById("abrirCheckout");
  const resumoPedido = document.getElementById("resumoPedido");
  const totalCheckout = document.getElementById("totalCheckout");
  const formCheckout = document.getElementById("formCheckout");

  botaoCheckout.addEventListener("click", function () {

    if (carrinho.length === 0) {
      alert("Seu carrinho está vazio!");
      return;
    }

    atualizarResumoCheckout();

    const modal = new bootstrap.Modal(document.getElementById("checkoutModal"));
    modal.show();
  });

  function atualizarResumoCheckout() {
    resumoPedido.innerHTML = "";
    let total = 0;

    carrinho.forEach(item => {
      total += item.preco * item.quantidade;

      resumoPedido.innerHTML += `
      <div class="d-flex justify-content-between mb-2">
        <span>${item.nome} x${item.quantidade}</span>
        <span>R$ ${(item.preco * item.quantidade).toFixed(2)}</span>
      </div>
    `;
    });

    totalCheckout.textContent = total.toFixed(2);
  }

  formCheckout.addEventListener("submit", function (e) {
    e.preventDefault();

    alert("Pedido confirmado com sucesso! 🎉");

    carrinho = [];
    salvarCarrinho();
    atualizarCarrinho();

    const modal = bootstrap.Modal.getInstance(document.getElementById("checkoutModal"));
    modal.hide();
  });


  // ================= CARREGAR PRODUTOS =================
  fetch("assets/js/produtos.json")
    .then(response => response.json())
    .then(data => {
      produtos = data;
      mostrarProdutos();
      atualizarCarrinho(); // Atualiza caso já tenha itens salvos
    })
    .catch(error => {
      console.error("Erro ao carregar produtos:", error);
      listaProdutos.innerHTML = "<p>Erro ao carregar produtos.</p>";
    });

  // ================= MOSTRAR PRODUTOS =================
  function mostrarProdutos() {
    listaProdutos.innerHTML = "";

    produtos.forEach(produto => {
      listaProdutos.innerHTML += `
       <div class="produto-item">
          <div class="card produto-card border-0 shadow-sm h-100">
            <div class="img-wrapper">
              <img src="${produto.imagem}" class="card-img-top">
            </div>
            <div class="card-body text-center d-flex flex-column">
              <h5 class="fw-semibold">${produto.nome}</h5>
              <p class="text-muted small flex-grow-1">${produto.descricao}</p>
              <p class="preco mb-3">R$ ${produto.preco.toFixed(2)}</p>
              <button class="btn btn-dark w-100 mt-auto add-carrinho" data-id="${produto.id}">
                <i class="fa-solid fa-cart-plus me-2"></i>Adicionar
              </button>
            </div>
          </div>
        </div>
      `;
    });
  }

  // ================= EVENTO ADICIONAR =================
  document.addEventListener("click", function (e) {
    const botao = e.target.closest(".add-carrinho");
    if (botao) {
      const id = parseInt(botao.dataset.id);
      adicionarCarrinho(id);
    }
  });

  function adicionarCarrinho(id) {
    const produto = produtos.find(p => p.id === id);
    const itemExistente = carrinho.find(item => item.id === id);

    if (itemExistente) {
      itemExistente.quantidade++;
    } else {
      carrinho.push({ ...produto, quantidade: 1 });
    }

    salvarCarrinho();
    atualizarCarrinho();

    // 🔥 Animação no ícone do carrinho
    contadorCarrinho.classList.add("animar");
    setTimeout(() => {
      contadorCarrinho.classList.remove("animar");
    }, 300);
  }


  // ================= ATUALIZAR CARRINHO =================
  function atualizarCarrinho() {
    listaCarrinho.innerHTML = "";
    let total = 0;

    carrinho.forEach(item => {
      total += item.preco * item.quantidade;

      listaCarrinho.innerHTML += `
  <div class="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
    <div>
      <h6 class="mb-1">${item.nome}</h6>
      <div class="d-flex align-items-center gap-2">
        <button class="btn btn-sm btn-outline-secondary diminuir" data-id="${item.id}">-</button>
        <span>${item.quantidade}</span>
        <button class="btn btn-sm btn-outline-secondary aumentar" data-id="${item.id}">+</button>
      </div>
    </div>
    <div>
      <span class="fw-bold">R$ ${(item.preco * item.quantidade).toFixed(2)}</span>
      <button class="btn btn-sm btn-danger ms-2 remover-item" data-id="${item.id}">
        <i class="fa-solid fa-trash"></i>
      </button>
    </div>
  </div>
`;
    });

    totalCarrinho.textContent = total.toFixed(2);

    contadorCarrinho.textContent =
      carrinho.reduce((acc, item) => acc + item.quantidade, 0);
  }
  document.addEventListener("click", function (e) {

    const aumentar = e.target.closest(".aumentar");
    const diminuir = e.target.closest(".diminuir");

    if (aumentar) {
      const id = parseInt(aumentar.dataset.id);
      const item = carrinho.find(p => p.id === id);
      item.quantidade++;
      salvarCarrinho();
      atualizarCarrinho();
    }

    if (diminuir) {
      const id = parseInt(diminuir.dataset.id);
      const item = carrinho.find(p => p.id === id);

      if (item.quantidade > 1) {
        item.quantidade--;
      } else {
        carrinho = carrinho.filter(p => p.id !== id);
      }

      salvarCarrinho();
      atualizarCarrinho();
    }

  });


  // ================= REMOVER ITEM =================
  document.addEventListener("click", function (e) {
    const botaoRemover = e.target.closest(".remover-item");
    if (botaoRemover) {
      const id = parseInt(botaoRemover.dataset.id);
      carrinho = carrinho.filter(item => item.id !== id);
      salvarCarrinho();
      atualizarCarrinho();
    }
  });


  // ================= REMOVER ITEM =================
  const botaoFinalizar = document.getElementById("finalizarCompra");

  botaoFinalizar.addEventListener("click", function () {

    if (carrinho.length === 0) {
      alert("Seu carrinho está vazio!");
      return;
    }

    alert("Compra finalizada com sucesso! 🎉");

    carrinho = [];
    salvarCarrinho();
    atualizarCarrinho();
  });

  // ================= SALVAR NO LOCALSTORAGE =================
  function salvarCarrinho() {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
  }

});

// ================= CARROSSEL =================

const carrossel = document.querySelector(".carrossel-produtos");
const btnPrev = document.querySelector(".prev");
const btnNext = document.querySelector(".next");

btnNext.addEventListener("click", () => {
  carrossel.scrollBy({ left: 300, behavior: "smooth" });
});

btnPrev.addEventListener("click", () => {
  carrossel.scrollBy({ left: -300, behavior: "smooth" });
});
// ================= AUTO SCROLL =================

function iniciarAutoScroll() {
  autoScroll = setInterval(() => {
    if (carrossel.scrollLeft + carrossel.clientWidth >= carrossel.scrollWidth) {
      carrossel.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      carrossel.scrollBy({ left: 300, behavior: "smooth" });
    }
  }, 3000); // muda a cada 3 segundos
}

function pararAutoScroll() {
  clearInterval(autoScroll);
}

carrossel.addEventListener("mouseenter", pararAutoScroll);
carrossel.addEventListener("mouseleave", iniciarAutoScroll);

iniciarAutoScroll();





// ================= ASSINATURA =================
document.addEventListener("DOMContentLoaded", function () {

  const btnAssinar = document.getElementById("btnAssinar");

  if (btnAssinar) {
    btnAssinar.addEventListener("click", function () {

      let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

      // Verifica se assinatura já existe
      const assinaturaExiste = carrinho.find(item => item.tipo === "assinatura");

      if (!assinaturaExiste) {
        const assinatura = {
          id: Date.now(), // ID único
          nome: "Clube Festa no Papel",
          preco: 39.90,
          tipo: "assinatura",
          recorrente: true
        };

        carrinho.push(assinatura);
        localStorage.setItem("carrinho", JSON.stringify(carrinho));
      }

      atualizarCarrinho();
      atualizarContador();

      // Abre o carrinho automaticamente
      const offcanvas = new bootstrap.Offcanvas(document.getElementById("carrinhoOffcanvas"));
      offcanvas.show();
    });
  }

});
function atualizarCarrinho() {
  const lista = document.getElementById("listaCarrinho");
  const totalSpan = document.getElementById("totalCarrinho");

  let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

  lista.innerHTML = "";
  let total = 0;

  carrinho.forEach(item => {
    total += item.preco;

    lista.innerHTML += `
      <div class="card mb-2">
        <div class="card-body p-2 d-flex justify-content-between align-items-start">
          
          <div>
            <h6 class="mb-1">${item.nome}</h6>
            <small class="text-muted">
              ${item.tipo === "assinatura" 
                ? "Plano Mensal (Recorrente)" 
                : "Produto Digital"}
            </small>
            <p class="mb-0 fw-bold">R$ ${item.preco.toFixed(2)}</p>
          </div>

          <button class="btn btn-sm btn-outline-danger"
                  onclick="removerItem(${item.id})">
            <i class="fa-solid fa-trash"></i>
          </button>

        </div>
      </div>
    `;
  });

  totalSpan.textContent = total.toFixed(2);
}

function atualizarContador() {
  const contador = document.getElementById("contadorCarrinho");
  let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
  contador.textContent = carrinho.length;
}

// Atualiza ao carregar página
document.addEventListener("DOMContentLoaded", function () {
  atualizarCarrinho();
  atualizarContador();
});

function removerItem(id) {
  let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

  carrinho = carrinho.filter(item => item.id !== id);

  localStorage.setItem("carrinho", JSON.stringify(carrinho));

  atualizarCarrinho();
  atualizarContador();
}
