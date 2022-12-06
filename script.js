//--------------------------------CONSTANTS--------------------------------
const WIDTH = 600;
const HEIGHT = 800;
const IMGSIZE = 30;
const RENDERSPEED = 75; //defined in ms, ex. on every 200ms next state is rendered
const OPPONENTNUMBER = 30; // ex. 30 rocks, 30 papers, 30 scissors

const canvas = document.getElementById('my-canvas');
canvas.width = WIDTH;
canvas.height = HEIGHT;
const canvasContext = canvas.getContext('2d');

const rock = new Image();
rock.src = 'img/rock.png';
const paper = new Image();
paper.src = "img/paper.png";
const scissor = new Image();
scissor.src = "img/scissors.png";

let rocks = [];
let papers = [];
let scissors = [];


//--------------------------------HELPERS--------------------------------
function getRand(min, max){
    return parseInt(Math.random() * (max - min + 1) + min);
}
function isPositionValid(array, x, y){
    array.forEach(element => {
        if(x>element[0] && x<element[0]+IMGSIZE)
            if(y>element[1] && y<element[1]+IMGSIZE)
                return false;
    });
    return true;
}
function areOverlapping(x1, y1, x2, y2){
    if (x1+IMGSIZE > x2 && x1 < x2+IMGSIZE)
        if (y1+IMGSIZE > y2 && y1 < y2+IMGSIZE)
            return true;
    return false;
}
function migrateImg(array1, array2, element2){ //turn element2 from array2 into array1
    let index = array2.indexOf(element2);
    array2.splice(index, 1);
    return array1.push(element2);
}


//--------------------------------CODE--------------------------------
function initalSetup(){
    for(let i=0;i<OPPONENTNUMBER;i++){
        rocks.push([])
        let x = getRand(1, WIDTH-IMGSIZE)
        let y = getRand(1, HEIGHT-IMGSIZE)
        if(isPositionValid(rocks,x,y) && isPositionValid(scissors,x,y) && isPositionValid(papers,x,y)){
            rocks[i].push(x);
            rocks[i].push(y);
            continue;
        }
        i--;
    }
    for(let i=0;i<OPPONENTNUMBER;i++){
        papers.push([])
        let x = getRand(1, WIDTH-IMGSIZE)
        let y = getRand(1, HEIGHT-IMGSIZE)
        if(isPositionValid(rocks,x,y) && isPositionValid(scissors,x,y) && isPositionValid(papers,x,y)){
            papers[i].push(x);
            papers[i].push(y);
            continue;
        }
        i--;
    }
    for(let i=0;i<OPPONENTNUMBER;i++){
        scissors.push([])
        let x = getRand(1, WIDTH-IMGSIZE)
        let y = getRand(1, HEIGHT-IMGSIZE)
        if(isPositionValid(rocks,x,y) && isPositionValid(scissors,x,y) && isPositionValid(papers,x,y)){
            scissors[i].push(x);
            scissors[i].push(y);
            continue;
        }
        i--;
    }
}

function nextStep(){ //calls next step functions (in random order?)
    nextStepRocks();
    nextStepPapers();
    nextStepScissors();
    checkForOverlaps();
}
function nextStepRocks(){
    for(let i = 0;i<rocks.length;i++){
        let distance = 10000
        let deltaX = 0
        let deltaY = 0
        for(let j = 0;j<scissors.length;j++){
            let dist = Math.sqrt(Math.pow(rocks[i][0]-scissors[j][0],2) + Math.pow(rocks[i][1]-scissors[j][1],2))
            if(dist > distance)
                continue;
            distance = dist;

            deltaX = 0 + 1*((rocks[i][0] != scissors[j][0]))
                - 2*(rocks[i][0]>scissors[j][0]);

            deltaY = 0 + 1*((rocks[i][1] != scissors[j][1]))
                - 2*(rocks[i][1]>scissors[j][1]);
        }
        rocks[i][0]+=deltaX
        rocks[i][1]+=deltaY
    }
}
function nextStepPapers(){
    for(let i = 0;i<papers.length;i++){
        let distance = 10000
        let deltaX = 0
        let deltaY = 0
        for(let j = 0;j<rocks.length;j++){
            let dist = Math.sqrt(Math.pow(papers[i][0]-rocks[j][0],2) + Math.pow(papers[i][1]-rocks[j][1],2))
            if(dist > distance)
                continue;
            distance = dist;

            deltaX = 0 + 1*((papers[i][0] != rocks[j][0]))
                - 2*(papers[i][0]>rocks[j][0]);

            deltaY = 0 + 1*((papers[i][1] != rocks[j][1]))
                - 2*(papers[i][1]>rocks[j][1]);
        }
        papers[i][0]+=deltaX
        papers[i][1]+=deltaY
    }
}
function nextStepScissors(){
    for(let i = 0;i<scissors.length;i++){
        let distance = 10000
        let deltaX = 0
        let deltaY = 0
        for(let j = 0;j<papers.length;j++){
            let dist = Math.sqrt(Math.pow(scissors[i][0]-papers[j][0],2) + Math.pow(scissors[i][1]-papers[j][1],2))
            if(dist > distance)
                continue;
            distance = dist;

            deltaX = 0 + 1*((scissors[i][0] != papers[j][0]))
                - 2*(scissors[i][0]>papers[j][0]);

            deltaY = 0 + 1*((scissors[i][1] != papers[j][1]))
                - 2*(scissors[i][1]>papers[j][1]);
        }
        scissors[i][0]+=deltaX
        scissors[i][1]+=deltaY
    }
}

function checkForOverlaps(){
    for (let i = 0; i < rocks.length; i++)
        for (let j = 0; j < scissors.length; j++){
            if (areOverlapping(rocks[i][0], rocks[i][1], scissors[j][0], scissors[j][1]))
                migrateImg(rocks, scissors, scissors[j]);
        }
    for (let i = 0; i < papers.length; i++)
        for (let j = 0; j < rocks.length; j++){
            if (areOverlapping(papers[i][0], papers[i][1], rocks[j][0], rocks[j][1]))
                migrateImg(papers, rocks, rocks[j]);
        }
    for (let i = 0; i < scissors.length; i++)
    for (let j = 0; j < papers.length; j++){
        if (areOverlapping(scissors[i][0], scissors[i][1], papers[j][0], papers[j][1]))
            migrateImg(scissors, papers, papers[j]);
    }
}

function render(){
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < rocks.length; i++)
        canvasContext.drawImage(rock, rocks[i][0], rocks[i][1], 30, 30);
    for (let i = 0; i < papers.length; i++)
        canvasContext.drawImage(paper, papers[i][0], papers[i][1], 30, 30);
    for (let i = 0; i < scissors.length; i++)
        canvasContext.drawImage(scissor, scissors[i][0], scissors[i][1], 30, 30);
}

initalSetup();
setInterval(render, RENDERSPEED)
setInterval(nextStep, RENDERSPEED)