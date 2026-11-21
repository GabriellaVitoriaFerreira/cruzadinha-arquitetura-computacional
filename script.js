const TOTAL_LINHAS = 19;
const TOTAL_COLUNAS = 20;

const PALAVRAS = [
  {
    numero: 1,
    palavra: "MICROCONTROLADOR",
    direcao: "H",
    linha: 1,
    coluna: 1,
    pista: "Chip completo que reúne processador, memória e portas de entrada e saída para sistemas embarcados."
  },
  {
    numero: 2,
    palavra: "CPU",
    direcao: "V",
    linha: 0,
    coluna: 3,
    pista: "Cérebro do computador responsável por buscar, decodificar e executar as instruções dos programas."
  },
  {
    numero: 3,
    palavra: "ADDRESSBUS",
    direcao: "V",
    linha: 1,
    coluna: 14,
    pista: "Via unidirecional pela qual o processador envia a localização exata onde quer ler ou gravar."
  },
  {
    numero: 4,
    palavra: "MEMORIADEMASSA",
    direcao: "H",
    linha: 4,
    coluna: 6,
    pista: "Armazenamento permanente de grande capacidade, como HDs e SSDs, onde os arquivos ficam salvos."
  },
  {
    numero: 5,
    palavra: "DATABUS",
    direcao: "H",
    linha: 6,
    coluna: 12,
    pista: "Conjunto de trilhas bidirecionais por onde trafegam as informações entre processador, memória e periféricos."
  },
  {
    numero: 6,
    palavra: "ROM",
    direcao: "V",
    linha: 4,
    coluna: 10,
    pista: "Memória não volátil gravada de fábrica que guarda instruções essenciais para iniciar o sistema."
  },
  {
    numero: 7,
    palavra: "REGISTRADORES",
    direcao: "H",
    linha: 8,
    coluna: 2,
    pista: "Pequenas memórias ultrarrápidas dentro do processador que guardam dados e instruções em uso imediato."
  },
  {
    numero: 8,
    palavra: "ULA",
    direcao: "V",
    linha: 6,
    coluna: 18,
    pista: "Bloco interno do processador que executa cálculos matemáticos e operações lógicas com bits."
  },
  {
    numero: 9,
    palavra: "FLASH",
    direcao: "V",
    linha: 7,
    coluna: 4,
    pista: "Tecnologia de memória não volátil apagada em blocos, muito usada em pendrives e SSDs."
  },
  {
    numero: 10,
    palavra: "EEPROM",
    direcao: "H",
    linha: 11,
    coluna: 2,
    pista: "Memória não volátil que permite apagar e regravar bytes individuais usando apenas pulsos elétricos."
  },
  {
    numero: 11,
    palavra: "DMA",
    direcao: "V",
    linha: 10,
    coluna: 6,
    pista: "Recurso que permite periféricos transferirem dados direto com a memória principal sem ocupar o processador."
  },
  {
    numero: 12,
    palavra: "DUALCORE",
    direcao: "H",
    linha: 13,
    coluna: 5,
    pista: "Arquitetura de processador que possui dois núcleos físicos independentes trabalhando no mesmo chip."
  },
  {
    numero: 13,
    palavra: "RAM",
    direcao: "H",
    linha: 15,
    coluna: 10,
    pista: "Memória principal volátil e rápida que guarda programas em execução enquanto o computador está ligado."
  },
  {
    numero: 14,
    palavra: "QUADCORE",
    direcao: "V",
    linha: 11,
    coluna: 11,
    pista: "Processador equipado com quatro núcleos físicos para executar múltiplas tarefas simultaneamente."
  },
  {
    numero: 15,
    palavra: "UC",
    direcao: "H",
    linha: 17,
    coluna: 10,
    pista: "Componente interno que coordena o fluxo de dados e gera sinais de controle no processador."
  },
  {
    numero: 16,
    palavra: "CACHE",
    direcao: "H",
    linha: 18,
    coluna: 8,
    pista: "Memória intermediária muito veloz que guarda cópias de dados frequentes para acelerar o processador."
  }
];

const grade = Array.from({ length: TOTAL_LINHAS }, () =>
  Array.from({ length: TOTAL_COLUNAS }, () => null)
);

let palavraAtual = PALAVRAS[0];
let celulaFocada = null;

function mapearGrade() {
  PALAVRAS.forEach((item) => {
    for (let i = 0; i < item.palavra.length; i++) {
      const r = item.direcao === "H" ? item.linha : item.linha + i;
      const c = item.direcao === "H" ? item.coluna + i : item.coluna;

      if (!grade[r][c]) {
        grade[r][c] = {
          letraCorreta: item.palavra[i],
          numeros: [],
          palavras: [],
          elementoBox: null,
          elementoInput: null
        };
      }

      if (i === 0) {
        grade[r][c].numeros.push(item.numero);
      }
      grade[r][c].palavras.push(item);
    }
  });
}

function renderizarTabuleiro() {
  const tabuleiroEl = document.getElementById("tabuleiro");
  tabuleiroEl.style.gridTemplateColumns = `repeat(${TOTAL_COLUNAS}, var(--cell-size))`;

  for (let r = 0; r < TOTAL_LINHAS; r++) {
    for (let c = 0; c < TOTAL_COLUNAS; c++) {
      const celula = grade[r][c];

      if (!celula) {
        const vazio = document.createElement("div");
        vazio.className = "cell-empty";
        tabuleiroEl.appendChild(vazio);
        continue;
      }

      const box = document.createElement("div");
      box.className = "cell-box";
      box.style.animationDelay = `${(r + c) * 12}ms`;

      if (celula.numeros.length > 0) {
        const numSpan = document.createElement("span");
        numSpan.className = "cell-number";
        numSpan.textContent = celula.numeros.join("/");
        box.appendChild(numSpan);
      }

      const input = document.createElement("input");
      input.type = "text";
      input.maxLength = 1;
      input.className = "cell-input";
      input.setAttribute("aria-label", `Linha ${r + 1}, Coluna ${c + 1}`);
      input.dataset.linha = r;
      input.dataset.coluna = c;

      input.addEventListener("focus", () => aoFocarCelula(r, c));
      input.addEventListener("click", () => alternarDirecaoSeMesmaCelula(r, c));
      input.addEventListener("keydown", (e) => aoPressionarTecla(e, r, c));
      input.addEventListener("input", (e) => aoDigitar(e, r, c));

      box.appendChild(input);
      tabuleiroEl.appendChild(box);

      celula.elementoBox = box;
      celula.elementoInput = input;
    }
  }
}

function renderizarPistas() {
  const ulH = document.getElementById("lista-horizontais");
  const ulV = document.getElementById("lista-verticais");

  PALAVRAS.forEach((item) => {
    const li = document.createElement("li");
    li.className = "clue-item";
    li.id = `pista-${item.numero}-${item.direcao}`;
    li.innerHTML = `<strong>${item.numero}.</strong> ${item.pista}`;

    li.addEventListener("click", () => {
      selecionarPalavra(item);
      const primeiraCelula = grade[item.linha][item.coluna];
      primeiraCelula.elementoInput.focus();
    });

    if (item.direcao === "H") {
      ulH.appendChild(li);
    } else {
      ulV.appendChild(li);
    }
  });
}

function selecionarPalavra(item) {
  palavraAtual = item;

  document.querySelectorAll(".cell-box").forEach((box) => box.classList.remove("word-active"));
  document.querySelectorAll(".clue-item").forEach((li) => li.classList.remove("active"));

  for (let i = 0; i < item.palavra.length; i++) {
    const r = item.direcao === "H" ? item.linha : item.linha + i;
    const c = item.direcao === "H" ? item.coluna + i : item.coluna;
    grade[r][c].elementoBox.classList.add("word-active");
  }

  const pistaLi = document.getElementById(`pista-${item.numero}-${item.direcao}`);
  if (pistaLi) {
    pistaLi.classList.add("active");
    pistaLi.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  const barraPista = document.getElementById("pista-ativa");
  const dirTexto = item.direcao === "H" ? "Horizontal" : "Vertical";
  barraPista.innerHTML = `<strong>${item.numero} (${dirTexto}):</strong>&nbsp;${item.pista}`;
}

function aoFocarCelula(r, c) {
  const celula = grade[r][c];
  document.querySelectorAll(".cell-box").forEach((box) => box.classList.remove("cell-focused"));
  celula.elementoBox.classList.add("cell-focused");

  const pertenceAtual = celula.palavras.some(
    (p) => p.numero === palavraAtual.numero && p.direcao === palavraAtual.direcao
  );

  if (!pertenceAtual) {
    selecionarPalavra(celula.palavras[0]);
  } else {
    selecionarPalavra(palavraAtual);
  }

  celulaFocada = `${r}-${c}`;
}

function alternarDirecaoSeMesmaCelula(r, c) {
  const celula = grade[r][c];
  if (celulaFocada === `${r}-${c}` && celula.palavras.length > 1) {
    const outra = celula.palavras.find(
      (p) => p.numero !== palavraAtual.numero || p.direcao !== palavraAtual.direcao
    );
    if (outra) selecionarPalavra(outra);
  }
}

function aoDigitar(e, r, c) {
  const input = e.target;
  const valorLimpo = input.value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z]/g, "")
    .toUpperCase();

  input.value = valorLimpo.slice(-1);

  const box = grade[r][c].elementoBox;
  box.classList.remove("correct", "wrong", "pop");
  void box.offsetWidth;
  if (input.value) {
    box.classList.add("pop");
    moverFoco(r, c, 1);
  }
}

function aoPressionarTecla(e, r, c) {
  if (e.key === "Backspace") {
    e.preventDefault();
    const input = grade[r][c].elementoInput;
    const box = grade[r][c].elementoBox;
    box.classList.remove("correct", "wrong");

    if (input.value !== "") {
      input.value = "";
    } else {
      moverFoco(r, c, -1);
    }
  } else if (e.key === "ArrowRight") {
    e.preventDefault();
    focarSeExistir(r, c + 1);
  } else if (e.key === "ArrowLeft") {
    e.preventDefault();
    focarSeExistir(r, c - 1);
  } else if (e.key === "ArrowDown") {
    e.preventDefault();
    focarSeExistir(r + 1, c);
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    focarSeExistir(r - 1, c);
  }
}

function moverFoco(r, c, passo) {
  const proxR = palavraAtual.direcao === "V" ? r + passo : r;
  const proxC = palavraAtual.direcao === "H" ? c + passo : c;
  focarSeExistir(proxR, proxC);
}

function focarSeExistir(r, c) {
  if (r >= 0 && r < TOTAL_LINHAS && c >= 0 && c < TOTAL_COLUNAS && grade[r][c]) {
    grade[r][c].elementoInput.focus();
  }
}

mapearGrade();
renderizarTabuleiro();
renderizarPistas();

function conferirRespostas() {
  document.querySelectorAll(".cell-box").forEach((box) => {
    box.classList.remove("correct", "wrong");
  });

  let acertos = 0;

  PALAVRAS.forEach((item) => {
    let palavraCorreta = true;
    const celulasDaPalavra = [];

    for (let i = 0; i < item.palavra.length; i++) {
      const r = item.direcao === "H" ? item.linha : item.linha + i;
      const c = item.direcao === "H" ? item.coluna + i : item.coluna;
      const celula = grade[r][c];
      celulasDaPalavra.push(celula);

      if (celula.elementoInput.value !== item.palavra[i]) {
        palavraCorreta = false;
      }
    }

    const pistaLi = document.getElementById(`pista-${item.numero}-${item.direcao}`);

    if (palavraCorreta) {
      acertos++;
      pistaLi.classList.add("solved");
      celulasDaPalavra.forEach((cel) => {
        cel.elementoBox.classList.remove("wrong");
        cel.elementoBox.classList.add("correct");
      });
    } else {
      pistaLi.classList.remove("solved");
      celulasDaPalavra.forEach((cel) => {
        if (!cel.elementoBox.classList.contains("correct") && cel.elementoInput.value !== "") {
          cel.elementoBox.classList.add("wrong");
        }
      });
    }
  });

  atualizarContador(acertos);
}

function reiniciarJogo() {
  document.querySelectorAll(".cell-input").forEach((input) => {
    input.value = "";
  });
  document.querySelectorAll(".cell-box").forEach((box) => {
    box.classList.remove("correct", "wrong", "pop");
  });
  document.querySelectorAll(".clue-item").forEach((li) => {
    li.classList.remove("solved");
  });

  atualizarContador(0);
}

function atualizarContador(acertos) {
  const pill = document.getElementById("contador");
  const texto = document.getElementById("texto-contador");
  texto.textContent = `${acertos} de ${PALAVRAS.length} palavras`;

  pill.classList.remove("updated");
  void pill.offsetWidth;
  pill.classList.add("updated");
}

document.getElementById("btn-conferir").addEventListener("click", conferirRespostas);
document.getElementById("btn-reiniciar").addEventListener("click", reiniciarJogo);