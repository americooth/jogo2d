const canvas = document.getElementById('jogoCanvas');
const ctx = canvas.getContext('2d');

let gravidade = 0.5;
let gameover = false;
let pulosRestantes = 2;
let pontos = 0;
let tempoInicio = Date.now();
let tempoDecorrido = 0;

// Reinicia o jogo
function reiniciarJogo() {
  gameover = false;
  pulosRestantes = 2;
  pontos = 0;
  tempoInicio = Date.now();
  personagem.y = canvas.height - 50;
  personagem.velocidade_y = 0;
  obstaculo.x = canvas.width;
  obstaculo.velocidade_x = 10;
  loop(); // Reinicia o loop do jogo
}

// Evento para controle do pulo
document.addEventListener('keypress', (evento) => {
  if (evento.code === 'Space' && !gameover) {
    if (pulosRestantes > 0) {
      personagem.velocidade_y = pulosRestantes === 2 ? 12 : 10;
      personagem.pulando = true;
      pulosRestantes--;
    }
  }

  // Evento para reiniciar o jogo ao pressionar 'Z'
  if (evento.code === 'KeyZ' && gameover) {
    reiniciarJogo();
  }
});

const personagem = {
  x: 100,
  y: canvas.height - 50,
  largura: 50,
  altura: 50,
  velocidade_y: 0,
  pulando: false
};

const obstaculo = {
  x: canvas.width,
  y: canvas.height - 100,
  largura: 50,
  altura: 100,
  velocidade_x: 10
};

function desenharPersonagem() {
  ctx.fillStyle = 'white';
  ctx.fillRect(personagem.x, personagem.y, personagem.largura, personagem.altura);
}

function atualizarPersonagem() {
  if (personagem.pulando) {
    personagem.y -= personagem.velocidade_y;
    personagem.velocidade_y -= gravidade;
    
    if (personagem.y >= canvas.height - 50) {
      personagem.y = canvas.height - 50;
      personagem.velocidade_y = 0;
      personagem.pulando = false;
      pulosRestantes = 2;
    }
  }
}

function desenharObstaculo() {
  ctx.fillStyle = 'green';
  ctx.fillRect(obstaculo.x, obstaculo.y, obstaculo.largura, obstaculo.altura);
}

function atualizarObstaculo() {
  obstaculo.x -= obstaculo.velocidade_x;

  if (obstaculo.x <= -obstaculo.largura) {
    obstaculo.x = canvas.width;
    pontos += 10;
  }
}

function verificaColisao() {
  if (
    obstaculo.x < personagem.x + personagem.largura &&
    obstaculo.x + obstaculo.largura > personagem.x &&
    personagem.y < obstaculo.y + obstaculo.altura &&
    personagem.y + personagem.altura > obstaculo.y
  ) {
    obstaculo.velocidade_x = 0;
    ctx.fillStyle = 'black';
    ctx.font = '50px Arial';
    ctx.fillText('GAME OVER', 50, 100);
    gameover = true;
    tempoDecorrido = Math.floor((Date.now() - tempoInicio) / 1000);
    salvarPontuacao();
  }
}

function desenharPontuacaoETempo() {
  ctx.fillStyle = 'black';
  ctx.font = '20px Arial';
  ctx.fillText(`Pontos: ${pontos}`, 20, 30);

  tempoDecorrido = Math.floor((Date.now() - tempoInicio) / 1000);
  ctx.fillText(`Tempo: ${tempoDecorrido}s`, 20, 60);
}

function salvarPontuacao() {
  const pontuacaoAnterior = localStorage.getItem('pontuacao');
  const tempoAnterior = localStorage.getItem('tempo');

  if (!pontuacaoAnterior || pontos > parseInt(pontuacaoAnterior)) {
    localStorage.setItem('pontuacao', pontos);
    localStorage.setItem('tempo', tempoDecorrido);
  }
}

function mostrarMelhorPontuacao() {
  const melhorPontuacao = localStorage.getItem('pontuacao');
  const melhorTempo = localStorage.getItem('tempo');

  if (melhorPontuacao && melhorTempo) {
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Melhor Pontuação: ${melhorPontuacao}`, 20, 90);
    ctx.fillText(`Melhor Tempo: ${melhorTempo}s`, 20, 120);
  }
}

function loop() {
  if (!gameover) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    desenharPersonagem();
    atualizarPersonagem();
    desenharObstaculo();
    atualizarObstaculo();
    verificaColisao();
    desenharPontuacaoETempo();
    mostrarMelhorPontuacao();
    requestAnimationFrame(loop);
  }
}

loop();
