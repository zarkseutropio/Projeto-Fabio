// Array para armazenar as notícias
const noticias = [];

// Array de palavras proibidas para filtrar comentários
const palavrasProibidas = ['carambolas', 'renato', 'ufpa'];

// Função chamada quando o DOM é carregado
document.addEventListener('DOMContentLoaded', () => {
    // Obtenção de referências a elementos do DOM
    const formBusca = document.getElementById('formBusca');
    const formAdicionarNoticia = document.getElementById('formAdicionarNoticia');
    const formularioAdicao = document.getElementById('formularioAdicao');
    const btnAdicionarNoticia = document.getElementById('btnAdicionarNoticia');

    // Adição de ouvintes de eventos aos elementos do DOM
    formBusca.addEventListener('submit', buscarNoticiasPorTermo);
    formAdicionarNoticia.addEventListener('submit', adicionarNoticia);
    btnAdicionarNoticia.addEventListener('click', () => mostrarElemento(formularioAdicao));

    document.getElementById('btnCesupa').addEventListener('click', () => buscarPorCategoria('cesupa'));
    document.getElementById('btnUnama').addEventListener('click', () => buscarPorCategoria('unama'));
    document.getElementById('btnFibra').addEventListener('click', () => buscarPorCategoria('fibra'));
});

// Função para buscar notícias por categoria
function buscarPorCategoria(categoria) {
    const noticiasCategoria = buscarNoticias(categoria);
    exibirResultadoBusca(noticiasCategoria, 'resultadoBusca');
}

// Função para mostrar um elemento no DOM
function mostrarElemento(elemento) {
    elemento.classList.remove('hidden');
}

// Função chamada quando o formulário de busca é enviado
function buscarNoticiasPorTermo(event) {
    event.preventDefault();
    const termo = document.getElementById('inputBusca').value;
    const resultado = buscarNoticias(termo);
    exibirResultadoBusca(resultado, 'resultadoBusca');
}

// Função chamada quando o formulário de adição de notícia é enviado
function adicionarNoticia(event) {
    event.preventDefault();
    const titulo = document.getElementById('inputTitulo').value;
    const conteudo = document.getElementById('inputConteudo').value;
    const imagem = document.getElementById('inputImagem').value;

    const selectInstituicao = document.getElementById('selectInstituicao');
    const instituicaoSelecionada = selectInstituicao.value;

    // Verificação se todos os campos estão preenchidos
    if (titulo && conteudo && imagem && instituicaoSelecionada) {
        // Criação de uma nova notícia
        const novaNoticia = {
            img: imagem,
            id: noticias.length + 1,
            titulo: titulo,
            conteudo: conteudo,
            instituicao: instituicaoSelecionada,
            comentarios: [],
        };

        // Adição da nova notícia ao array de notícias
        noticias.push(novaNoticia);

        // Limpeza dos campos do formulário
        document.getElementById('inputTitulo').value = '';
        document.getElementById('inputConteudo').value = '';
        document.getElementById('inputImagem').value = '';

        // Verificação e exibição da nova notícia
        verificarEExibirNoticia(novaNoticia);
    } else {
        alert('Por favor, preencha todos os campos.');
    }
}

// Função para exibir resultados de busca no DOM
function exibirResultadoBusca(resultado, containerId) {
    const container = document.getElementById(containerId || 'resultadoBusca');
    container.innerHTML = resultado.length === 0
        ? '<p>Nenhuma notícia encontrada.</p>'
        : resultado.map(criarElementoNoticia).join('');

    // Adição de ouvintes de evento para formulários de comentário, botões "Apagar" e botões "Apagar Comentário"
    const formsComentario = document.querySelectorAll('.formComentario');
    formsComentario.forEach(form => {
        form.addEventListener('submit', adicionarComentario);
    });

    const btnsApagar = document.querySelectorAll('.btnApagar');
    btnsApagar.forEach(btn => {
        btn.addEventListener('click', () => apagarNoticia(btn.dataset.id));
    });

    const btnsApagarComentario = document.querySelectorAll('.btnApagarComentario');
    btnsApagarComentario.forEach(btn => {
        btn.addEventListener('click', () => apagarComentario(btn.dataset.index));
    });
}

// Função para criar elemento HTML representando uma notícia
function criarElementoNoticia(noticia) {
    return `
        <section class="noticia" data-id="${noticia.id}">
            <img src="${noticia.img}" alt="${noticia.titulo}">
            <h2>${noticia.titulo}</h2>
            <p>${noticia.conteudo}</p>
            <p>Instituição: ${noticia.instituicao}</p>
            <button class="btnApagar" data-id="${noticia.id}">Apagar</button>

            <section class="comentarios">
                <h3>Comentários</h3>
                <ul>${renderizarComentarios(noticia.comentarios)}</ul>

                <form class="formComentario" data-id="${noticia.id}">
                    <label for="inputComentario">Adicionar Comentário:</label>
                    <input type="text" id="inputComentario" required>
                    <button type="submit">Adicionar</button>
                </form>
            </section>
        </section>
    `;
}

// Função para renderizar os comentários de uma notícia
function renderizarComentarios(comentarios) {
    return comentarios.map((comentario, index) => `
        <li>
            ${comentario}
            <button class="btnApagarComentario" data-index="${index}">Apagar</button>
        </li>
    `).join('');
}

// Função para buscar notícias por termo
function buscarNoticias(termo) {
    const termoMinusculo = termo.toLowerCase();
    return noticias.filter(noticia =>
        noticia.titulo.toLowerCase().includes(termoMinusculo) ||
        noticia.conteudo.toLowerCase().includes(termoMinusculo)
    );
}

// Função para verificar e exibir uma notícia específica
function verificarEExibirNoticia(novaNoticia) {
    const categoriasConhecidas = ['cesupa', 'unama', 'fibra'];
    const categoria = categoriasConhecidas.find(c => novaNoticia.instituicao.toLowerCase() === c);

    // Limpeza dos resultados das categorias conhecidas
    limparResultados(categoriasConhecidas);

    // Exibição da nova notícia na categoria correspondente (se houver)
    if (categoria) {
        exibirResultadoBusca([novaNoticia], `noticia${categoria.charAt(0).toUpperCase() + categoria.slice(1)}`);
    } else {
        exibirResultadoBusca([novaNoticia]);
    }
}

// Função para limpar resultados de categorias conhecidas
function limparResultados(secoes) {
    secoes.forEach(secao => {
        const container = document.getElementById(`noticia${secao.charAt(0).toUpperCase() + secao.slice(1)}`);
        if (container) container.innerHTML = '';
    });
}

// Função para apagar uma notícia
function apagarNoticia(id) {
    const index = noticias.findIndex(noticia => noticia.id == id);

    // Remoção da notícia do array e atualização da exibição
    if (index !== -1) {
        noticias.splice(index, 1);
        exibirResultadoBusca(noticias, 'resultadoBusca');
    }
}

// Função para apagar um comentário
function apagarComentario(index) {
    const noticiaId = event.currentTarget.closest('.noticia').dataset.id;
    const noticia = noticias.find(noticia => noticia.id == noticiaId);

    // Remoção do comentário da notícia e atualização da exibição
    if (noticia && noticia.comentarios && noticia.comentarios.length > index) {
        noticia.comentarios.splice(index, 1);
        exibirResultadoBusca(noticias, 'resultadoBusca');
    }
}

// Função para adicionar um comentário
function adicionarComentario(event) {
    event.preventDefault();
    const noticiaId = event.currentTarget.dataset.id;
    const inputComentario = event.currentTarget.querySelector('#inputComentario');
    const comentario = inputComentario.value;

    // Verificação se o comentário não contém palavras proibidas
    if (comentario && !contemPalavrasProibidas(comentario)) {
        const noticia = noticias.find(noticia => noticia.id == noticiaId);

        // Adição do comentário à notícia e atualização da exibição
        if (noticia) {
            if (!noticia.comentarios) {
                noticia.comentarios = [];
            }

            noticia.comentarios.push(comentario);
            exibirResultadoBusca(noticias, 'resultadoBusca');
            inputComentario.value = '';
        }
    } else {
        alert('Seu comentário contém palavras proibidas.');
    }
}

// Função para verificar se um comentário contém palavras proibidas
function contemPalavrasProibidas(comentario) {
    const comentarioMinusculo = comentario.toLowerCase();
    return palavrasProibidas.some(palavra => comentarioMinusculo.includes(palavra));
}