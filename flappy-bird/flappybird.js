

//canvas
let canvas;
let canvasWidth = 360;
let canvasHeight = 640;
let context;

//passarinho
let birdWidth = 34; // 408/228 = 17/12
let birdHeight = 24;
let birdX = canvasWidth / 8;
let birdY = canvasHeight / 2;
let birdImg;

let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
};

//canos
let pipeArray = [];
let pipeWidth = 64; // 384/3072 = 1/8
let pipeHeight = 512;
let pipeX = canvasWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

// fisica
let velocityX = -2;
let velocityY = 0;
let gravidade = 0.4;

let gameOver = false;
let pintuacao = 0;

window.onload = function() {
    canvas = document.getElementById("canvas");
    canvas.height = canvasHeight;
    canvas.width = canvasWidth;
    context = canvas.getContext("2d");

    // Carregar a imagem do passarinho
    birdImg = new Image();
    birdImg.src = "./Images/flappybird.png";
    birdImg.onload = function() {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }

    // Carregar as imagens dos canos
    topPipeImg = new Image();
    topPipeImg.src = "./Images/canoDeCima.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./Images/canoDeBaixo.png";

    // Iniciar o loop de animação e a criação dos canos
    requestAnimationFrame(update);
    setInterval(placePipes, 1500); // 1,5 segundos
    document.addEventListener("keydown", moveBird);
};

function update() {
    requestAnimationFrame(update);
    if(gameOver){
        return;
    }
    context.clearRect(0, 0, canvas.width, canvas.height);

    //passarinho
    velocityY += gravidade;
    bird.y = Math.max(bird.y + velocityY, 0); //bird.y += velocityY;
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if(bird.y > canvas.height){
        gameOver = true;
    }

    // canos
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);
        
        if(!pipe.passed && bird.x > pipe.x + pipe.width){
            pintuacao += 1 /2;
            pipe.passed = true;

        }

        if(detectarColizao(bird, pipe)){
            gameOver = true;
        }
    }

    //limpar os canos
    while(pipeArray.length > 0 && pipeArray[0].x < -pipeWidth){
        pipeArray.shift();
    }
    
    //pontuação
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(pintuacao, 5, 45);

    if(gameOver){
        context.fillText("GAME OVER", 5, 90)
    }
    
}

function placePipes() {

    if(gameOver){
        return;
    }

    let ramdomPipeY = pipeY - pipeHeight/4 - Math.random()*pipeHeight/2;
    let gap = canvas.height/4;

    let topPipe = {
        img: topPipeImg,
        x: pipeX,
        y: ramdomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    };
    
    pipeArray.push(topPipe);

    let bottomPipe = {
        img: bottomPipeImg,
        x: pipeX,
        y: topPipe.y + pipeHeight + gap,
        width: pipeWidth,
        height: pipeHeight,
        passed : false
    };

    pipeArray.push(bottomPipe);

}

function moveBird(e){
    if(e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyW"){
        //pula
        velocityY = -6;

        //reiniciar o jogo
        if(gameOver){
            bird.y = birdY;
            pipeArray = [];
            pintuacao = 0;
            gameOver= false
        }
    }
}

function detectarColizao(a, b){
    return a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y;
}