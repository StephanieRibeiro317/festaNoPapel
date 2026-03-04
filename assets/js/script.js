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
 

