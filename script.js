let carrinho = [];
let produtoAberto = null;
let tamanhoSelecionado = null;

const listaProdutos = document.querySelector("#listaProdutos");
const painelCarrinho = document.querySelector("#painelCarrinho");
const itensCarrinho = document.querySelector("#itensCarrinho");
const totalCarrinho = document.querySelector("#totalCarrinho");
const contadorCarrinho = document.querySelector("#contadorCarrinho");

const modalOverlay = document.querySelector("#modalOverlay");
const modalImagemPrincipal = document.querySelector("#modalImagemPrincipal");
const modalMiniaturas = document.querySelector("#modalMiniaturas");
const modalNome = document.querySelector("#modalNome");
const modalPreco = document.querySelector("#modalPreco");
const modalDescricao = document.querySelector("#modalDescricao");
const modalTamanhosWrap = document.querySelector("#modalTamanhosWrap");
const modalTamanhos = document.querySelector("#modalTamanhos");
const modalAdicionar = document.querySelector("#modalAdicionar");

function mostrarProdutos(lista = produtos) {
    listaProdutos.innerHTML = "";
    lista.forEach(produto => {
        const card = document.createElement("div");
        card.classList.add("card-produto");
        card.innerHTML = `
            <img src="${produto.imagens[0]}" alt="${produto.nome}">
            <h3>${produto.nome}</h3>
            <p>R$ ${produto.preco.toFixed(2)}</p>
            <button>Ver produto</button>
        `;
        card.addEventListener("click", () => abrirModal(produto.id));
        listaProdutos.appendChild(card);
    });
}

function abrirModal(id) {
    const produto = produtos.find(p => p.id === id);
    if (!produto) return;

    produtoAberto = produto;
    tamanhoSelecionado = null;

    modalNome.textContent = produto.nome;
    modalPreco.textContent = `R$ ${produto.preco.toFixed(2)}`;
    modalDescricao.textContent = produto.descricao;

    modalImagemPrincipal.src = produto.imagens[0];
    modalImagemPrincipal.alt = produto.nome;

    modalMiniaturas.innerHTML = "";
    if (produto.imagens.length > 1) {
        modalMiniaturas.style.display = "flex";
        produto.imagens.forEach((img, index) => {
            const mini = document.createElement("img");
            mini.src = img;
            mini.alt = `${produto.nome} - foto ${index + 1}`;
            if (index === 0) mini.classList.add("ativa");
            mini.addEventListener("click", () => {
                modalImagemPrincipal.src = img;
                modalMiniaturas.querySelectorAll("img").forEach(m => m.classList.remove("ativa"));
                mini.classList.add("ativa");
            });
            modalMiniaturas.appendChild(mini);
        });
    } else {
        modalMiniaturas.style.display = "none";
    }
    modalTamanhos.innerHTML = "";
    if (produto.tamanhos && produto.tamanhos.length > 0) {
        modalTamanhosWrap.style.display = "block";
        produto.tamanhos.forEach(tam => {
            const btn = document.createElement("button");
            btn.classList.add("btn-tamanho");
            btn.textContent = tam;
            btn.addEventListener("click", () => {
                tamanhoSelecionado = tam;
                modalTamanhos.querySelectorAll(".btn-tamanho").forEach(b => b.classList.remove("selecionado"));
                btn.classList.add("selecionado");
            });
            modalTamanhos.appendChild(btn);
        });
    } else {
        modalTamanhosWrap.style.display = "none";
    }

    modalOverlay.classList.add("aberto");
}

function fecharModal() {
    modalOverlay.classList.remove("aberto");
    produtoAberto = null;
}

document.querySelector("#modalFechar").addEventListener("click", fecharModal);
modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) fecharModal();
});

modalAdicionar.addEventListener("click", () => {
    if (!produtoAberto) return;

    if (produtoAberto.tamanhos && produtoAberto.tamanhos.length > 0 && !tamanhoSelecionado) {
        alert("Selecione um tamanho antes de adicionar ao carrinho.");
        return;
    }

    carrinho.push({
        nome: produtoAberto.nome,
        preco: produtoAberto.preco,
        tamanho: tamanhoSelecionado
    });

    atualizarCarrinho();
    fecharModal();
    painelCarrinho.classList.add("aberto");
});

function atualizarCarrinho() {
    itensCarrinho.innerHTML = "";
    let total = 0;

    carrinho.forEach((item, index) => {
        total += item.preco;
        const div = document.createElement("div");
        div.classList.add("item-carrinho");
        div.innerHTML = `
            <span>${item.nome}${item.tamanho ? " (" + item.tamanho + ")" : ""}</span>
            <span>R$ ${item.preco.toFixed(2)}</span>
            <button class="btn-remover" onclick="removerDoCarrinho(${index})">✕</button>
        `;
        itensCarrinho.appendChild(div);
    });

    totalCarrinho.textContent = total.toFixed(2);
    contadorCarrinho.textContent = carrinho.length;
}

function removerDoCarrinho(index) {
    carrinho.splice(index, 1);
    atualizarCarrinho();
}

document.querySelector("#btnCarrinho").addEventListener("click", () => {
    painelCarrinho.classList.add("aberto");
});
document.querySelector("#fecharCarrinho").addEventListener("click", () => {
    painelCarrinho.classList.remove("aberto");
});

mostrarProdutos();

const botoesFiltro = document.querySelectorAll(".btn-filtro");

botoesFiltro.forEach(botao => {
    botao.addEventListener("click", () => {
        botoesFiltro.forEach(b => b.classList.remove("ativo"));
        botao.classList.add("ativo");

        const categoria = botao.dataset.categoria;

        if (categoria === "todos") {
            mostrarProdutos(produtos);
        } else {
            const filtrados = produtos.filter(p => p.categoria === categoria);
            mostrarProdutos(filtrados);
        }
    });
});

document.querySelector("#btnFinalizar").addEventListener("click", finalizarCompra);

function finalizarCompra() {
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    let mensagem = "Olá! Quero comprar:%0A%0A";
    let total = 0;

    carrinho.forEach(item => {
        mensagem += `• ${item.nome}${item.tamanho ? " (Tam. " + item.tamanho + ")" : ""} - R$ ${item.preco.toFixed(2)}%0A`;
        total += item.preco;
    });

    mensagem += `%0A*Total: R$ ${total.toFixed(2)}*`;

    const numero = "5548999079786";
    window.open(`https://wa.me/${numero}?text=${mensagem}`, "_blank");
}
