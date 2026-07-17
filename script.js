const produtos=[
    {id:1,nome: "camisa branca", preco: 59.90, categoria: "camisa", imagem: "img/camisa.webp" },
    { id: 2, nome: "Calça Jeans", preco: 99.90, categoria: "calca", imagem: "img/calça.webp" },
    { id: 3, nome: "Jaqueta Preta", preco: 199.90, categoria: "jaqueta", imagem: "img/jaqueta.webp"},
    { id: 4, nome: "Tênis Branco", preco: 249.90, categoria: "tenis", imagem: "img/tenis.webp"},
]
let carrinho = [];

const listaProdutos = document.querySelector("#listaProdutos");
const painelCarrinho = document.querySelector("#painelCarrinho");
const itensCarrinho = document.querySelector("#itensCarrinho");
const totalCarrinho = document.querySelector("#totalCarrinho");
const contadorCarrinho = document.querySelector("#contadorCarrinho");
function mostrarProdutos(lista=produtos) {
    listaProdutos.innerHTML = "";
    lista.forEach(produto => {
        const card = document.createElement("div");
        card.classList.add("card-produto");
        card.innerHTML = `
            <img src="${produto.imagem}" alt="${produto.nome}">
            <h3>${produto.nome}</h3>
            <p>R$ ${produto.preco.toFixed(2)}</p>
            <button onclick="adicionarAoCarrinho(${produto.id})">Adicionar</button>
        `;
        listaProdutos.appendChild(card);
    });
}
function atualizarCarrinho() {
    itensCarrinho.innerHTML = "";
    let total = 0;

    carrinho.forEach((item, index) => {
        total += item.preco;
        const div = document.createElement("div");
        div.classList.add("item-carrinho");
        div.innerHTML = `
            <span>${item.nome}</span>
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
function adicionarAoCarrinho(id) {
    const produto = produtos.find(p => p.id === id);
    carrinho.push(produto);
    atualizarCarrinho();
}
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
        mensagem += `• ${item.nome} - R$ ${item.preco.toFixed(2)}%0A`;
        total += item.preco;
    });

    mensagem += `%0A*Total: R$ ${total.toFixed(2)}*`;

    const numero = "5548999079786";
    window.open(`https://wa.me/${numero}?text=${mensagem}`, "_blank");
}