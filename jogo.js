const canvas = document.getElementById('jogoCanvas');
const ctx = canvas.getContext('2d');

const fundo = new Image();
fundo.src = 'cidade.jpg';

const pikachu = new Image();
pikachu.src = 'pikachu.png';

let gravidade = 0.5;
let gameover = false;
let pulosRestantes = 2;
let pontos = 0;
let tempoInicio = Date.now();
let tempoDecorrido = 0;
let movimentoEsquerda = false;
let movimentoDireita = false;

function reiniciarJogo() {
  gameover = false;
  pulosRestantes = 2;
  pontos = 0;
  tempoInicio = Date.now();
  personagem.y = canvas.height - 100;
  personagem.x = 100;
  personagem.velocidade_y = 0;
  obstaculo.x = canvas.width;
  obstaculo.velocidade_x = 10;
  loop();
}

document.addEventListener('keydown', (evento) => {
  if (evento.code === 'Space' && !gameover) {
    if (pulosRestantes > 0) {
      personagem.velocidade_y = pulosRestantes === 2 ? 12 : 10;
      personagem.pulando = true;
      pulosRestantes--;
    }
  }
  if (evento.code === 'KeyA') {
    movimentoEsquerda = true;
  }
  if (evento.code === 'KeyD') {
    movimentoDireita = true;
  }
  if (evento.code === 'KeyZ' && gameover) {
    reiniciarJogo();
  }
});

document.addEventListener('keyup', (evento) => {
  if (evento.code === 'KeyA') {
    movimentoEsquerda = false;
  }
  if (evento.code === 'KeyD') {
    movimentoDireita = false;
  }
});

const personagem = {
  x: 100,
  y: canvas.height - 100,
  largura: 50,
  altura: 50,
  velocidade_y: 0,
  pulando: false,
  velocidade_x: 5
};

const obstaculo = {
  x: canvas.width,
  y: canvas.height - 100,
  largura: 50,
  altura: 100,
  velocidade_x: 10
};

function desenharFundo() {
  ctx.drawImage(fundo, 0, 0, canvas.width, canvas.height);
}

function desenharPersonagem() {
  ctx.drawImage(pikachu, personagem.x, personagem.y, personagem.largura, personagem.altura);
}

function atualizarPersonagem() {
  if (movimentoEsquerda && personagem.x > 0) {
    personagem.x -= personagem.velocidade_x;
  }
  if (movimentoDireita && personagem.x + personagem.largura < canvas.width) {
    personagem.x += personagem.velocidade_x;
  }

  if (personagem.pulando) {
    personagem.y -= personagem.velocidade_y;
    personagem.velocidade_y -= gravidade;
    
    if (personagem.y >= canvas.height - 100) {
      personagem.y = canvas.height - 100;
      personagem.velocidade_y = 0;
      personagem.pulando = false;
      pulosRestantes = 2;
    }
  }
}

function desenharObstaculo() {
  ctx.fillStyle = 'red';
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
  }
}

function desenharPontuacaoETempo() {
  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  ctx.fillText(`Pontos: ${pontos}`, 20, 30);
  tempoDecorrido = Math.floor((Date.now() - tempoInicio) / 1000);
  ctx.fillText(`Tempo: ${tempoDecorrido}s`, 20, 60);
}

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  desenharFundo();
  desenharPersonagem();
  atualizarPersonagem();
  desenharObstaculo();
  atualizarObstaculo();
  verificaColisao();
  desenharPontuacaoETempo();
  if (!gameover) {
    requestAnimationFrame(loop);
  }
}

fundo.onload = () => {
  pikachu.onload = () => {
    loop();
  };
};
