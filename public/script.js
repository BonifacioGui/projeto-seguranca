// Define a URL base da sua API
const apiUrl = 'http://localhost:3000';

// Pega a referência da div de resultado
const resultadoDiv = document.getElementById('resultado');

/**
 * Função para controlar a troca de abas.
 * @param {Event} evt - O evento do clique.
 * @param {string} tabName - O ID da aba a ser aberta.
 */
function openTab(evt, tabName) {
    // Esconde todos os conteúdos das abas
    const tabcontent = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Remove a classe "active" de todos os botões de aba
    const tablinks = document.getElementsByClassName("tab-link");
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Mostra a aba clicada e adiciona a classe "active" ao botão
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";

    // Limpa a mensagem de resultado ao trocar de aba
    resultadoDiv.innerText = "";
    resultadoDiv.className = "";
}

/**
 * Função genérica para fazer requisições à API.
 * @param {string} endpoint - A rota da API (ex: '/registrar').
 * @param {object} corpo - O corpo da requisição.
 */
async function fazerRequisicao(endpoint, corpo) {
    try {
        const resposta = await fetch(`${apiUrl}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(corpo)
        });

        const dados = await resposta.json();

        resultadoDiv.className = ""; // Limpa classes antigas

        if (resposta.ok) {
            resultadoDiv.innerText = dados.mensagem;
            resultadoDiv.classList.add('sucesso');
        } else {
            resultadoDiv.innerText = dados.erro;
            resultadoDiv.classList.add('erro');
        }
    } catch (err) {
        resultadoDiv.innerText = 'Erro de conexão com o servidor.';
        resultadoDiv.classList.add('erro');
    }
}

// Funções chamadas pelos botões no HTML
function registrar() {
    const nome_usuario = document.getElementById('regUsuario').value;
    const senha = document.getElementById('regSenha').value;
    fazerRequisicao('/registrar', { nome_usuario, senha });
}

function login() {
    const nome_usuario = document.getElementById('loginUsuario').value;
    const senha = document.getElementById('loginSenha').value;
    fazerRequisicao('/login', { nome_usuario, senha });
}

function alterarSenha() {
    const nome_usuario = document.getElementById('altUsuario').value;
    const nova_senha = document.getElementById('altNovaSenha').value;
    fazerRequisicao('/alterar-senha', { nome_usuario, nova_senha });
}