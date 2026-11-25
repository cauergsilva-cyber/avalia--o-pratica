document.addEventListener("DOMContentLoaded", () => {
  const inputUsuario = document.getElementById("usuario");
  const inputSenha = document.getElementById("senha");
  const confirmarSenha = document.getElementById("confirmarSenha");
  const grupoConfirmarSenha = document.getElementById("grupoConfirmarSenha");
  const tituloFormulario = document.getElementById("tituloFormulario");
  const mensagemFormulario = document.getElementById("mensagemFormulario");
  const btnOlho = document.getElementById("btnOlho");
  const iconeOlho = document.getElementById("iconeOlho");
  const btnEntrar = document.getElementById("btnEntrar");
  const btnCriarConta = document.getElementById("btnCriarConta");
  const form = document.getElementById("loginForm");

  if (!inputUsuario || !inputSenha || !confirmarSenha || !grupoConfirmarSenha || !tituloFormulario || !mensagemFormulario || !btnOlho || !iconeOlho || !btnEntrar || !btnCriarConta || !form) {
    return;
  }

  let modoCriarConta = false;

  function verificarCampos() {
    const temUsuario = inputUsuario.value.trim() !== "";
    const temSenha = inputSenha.value.trim() !== "";
    const confirmacaoValida = !modoCriarConta || confirmarSenha.value === inputSenha.value;

    btnEntrar.disabled = !(temUsuario && temSenha && (!modoCriarConta || confirmarSenha.value !== "") && confirmacaoValida);
    btnEntrar.classList.toggle("ativo", !(btnEntrar.disabled));
  }

  function concluirEntrada(usuario) {
    sessionStorage.setItem("usuarioLogado", usuario);

    if (window.location.pathname.includes("/jogo/")) {
      window.location.href = "aviso.html";
    } else {
      window.location.href = "../jogo/aviso.html";
    }
  }

  function voltarParaLogin() {
    modoCriarConta = false;

    tituloFormulario.textContent = "Entrar";
    btnEntrar.textContent = "Entrar";
    btnCriarConta.textContent = "Criar conta";
    grupoConfirmarSenha.classList.add("campo-escondido");

    inputUsuario.value = "";
    inputSenha.value = "";
    confirmarSenha.value = "";
    mensagemFormulario.textContent = "Conta criada com sucesso. Agora faça o login.";

    verificarCampos();
  }

  function alternarModo() {
    modoCriarConta = !modoCriarConta;

    tituloFormulario.textContent = modoCriarConta ? "Criar conta" : "Entrar";
    btnEntrar.textContent = modoCriarConta ? "Criar conta" : "Entrar";
    btnCriarConta.textContent = modoCriarConta ? "Voltar para entrar" : "Criar conta";
    grupoConfirmarSenha.classList.toggle("campo-escondido", !modoCriarConta);
    mensagemFormulario.textContent = "";

    inputUsuario.value = "";
    inputSenha.value = "";
    confirmarSenha.value = "";
    verificarCampos();
  }

  btnOlho.addEventListener("click", () => {
    const estaEscondida = inputSenha.type === "password";
    inputSenha.type = estaEscondida ? "text" : "password";

    if (estaEscondida) {
      iconeOlho.innerHTML = `
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      `;
    } else {
      iconeOlho.innerHTML = `
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
        <line x1="1" y1="1" x2="23" y2="23"></line>
      `;
    }
  });

  btnCriarConta.addEventListener("click", alternarModo);

  inputUsuario.addEventListener("input", () => {
    mensagemFormulario.textContent = "";
    verificarCampos();
  });

  inputSenha.addEventListener("input", () => {
    mensagemFormulario.textContent = "";
    verificarCampos();
  });

  confirmarSenha.addEventListener("input", () => {
    if (modoCriarConta && confirmarSenha.value !== inputSenha.value) {
      mensagemFormulario.textContent = "As senhas não são iguais.";
    } else {
      mensagemFormulario.textContent = "";
    }
    verificarCampos();
  });

  form.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const usuario = inputUsuario.value.trim();
    const senha = inputSenha.value;

    if (!usuario || !senha) {
      return;
    }

    if (modoCriarConta) {
      if (senha !== confirmarSenha.value) {
        mensagemFormulario.textContent = "As senhas não são iguais.";
        return;
      }

      localStorage.setItem("contaRoblox", JSON.stringify({ usuario, senha }));
      voltarParaLogin();
      return;
    }

    const contaSalva = JSON.parse(localStorage.getItem("contaRoblox") || "null");

    if (contaSalva && contaSalva.usuario === usuario && contaSalva.senha === senha) {
      concluirEntrada(usuario);
    } else {
      mensagemFormulario.textContent = "Usuário ou senha incorretos.";
    }
  });

  verificarCampos();
});
