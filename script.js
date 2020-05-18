const CELL_SIZE = 23 //размер тетрадной клетки в px
const FIELD_SIZE = 30 //размер клетки морского боя

//поиск тега canvas в index.html
const canvas = document.querySelector('canvas') 
//контекст тега canvas
const context = canvas.getContext('2d') 

//размеры canvas
canvas.width = 1000
canvas.height = 500

//координаты мыши над canvas
const mouse = getMouse(canvas)

//алгоритм обработки действий пользователя
const game = new Game

//очистка canvas
function clearCanvas() {
    canvas.width |= 0
}

//функция рисования прямоугольника
function drawRect (param) {
    //если нет параметров fill или stroke, то ничего не рисуем
    if (!param.fill && !param.stroke) {
        return
    }
    //создаём НОВУЮ элементарную геом. единицу
    context.beginPath() 

    // создаём прямоугольник
    context.rect(param.x, param.y, param.width, param.height) 
    
    //проверяем нужно ли закрасить и обвести прямоугольник
    if(param.fill) {
        context.fillStyle = param.fillStyle
        context.fill()
    }

    if(param.stroke) {
        context.strokeStyle = param.strokeStyle
        context.lineWidth = param.lineWidth
        context.stroke()
    }
}

//функция отрисовки тетрадного поля
function drawGrid() {
    context.strokeStyle = 'blue'
    context.lineWidth = 0.5

    //вертикльные линии клеток
    for (let i = 0; i < canvas.width / CELL_SIZE; i++) {
        context.beginPath() 
        context.moveTo(i * CELL_SIZE, 0) 
        context.lineTo(i * CELL_SIZE, canvas.height)
        context.stroke()
    }

    //горизонтальные линии клеток
    for (let i = 0; i < canvas.height / CELL_SIZE; i++) {
        context.beginPath() 
        context.moveTo(0, i * CELL_SIZE) 
        context.lineTo(canvas.width, i * CELL_SIZE)
        context.stroke()
    }

    //красная линия
    context.strokeStyle ='red'
    context.lineWidth = 2

    context.beginPath()
    context.moveTo(0, 75)
    context.lineTo(canvas.width, 75)
    context.stroke()
}

//возвращает случайный элемент из массива
//для БОТА
function getRandomFrom (array) {
    const index = Math.floor(Math.random() * array.length)
    return array[index]
}

//--------------------------------Кнопка----------------------------------
var btnRandom = {
    x:100,
    y:430,
    w:100,
    h:35,
    text:"Random",
    state:"default",

    draw: function() {
        context.font = "20px Arial ";
        switch(this.state) {
            case "over":      
                context.fillStyle = "darkblue";
                context.fillRect(this.x, this.y, this.w, this.h);
                context.fillStyle = "white";
                context.fillText("Random",this.x+this.w/2 - context.measureText("Random").width/2,this.y+this.h/2+10 );
            break;
            default:
                context.fillStyle = "blue";
                context.fillRect(this.x,this.y,this.w,this.h);
                context.fillStyle = "white";
                context.fillText("Random",this.x+this.w/2 - context.measureText("Random").width/2,this.y+this.h/2+10 );
        }    
    }
};

function func(event) {
    if(checkCollision(event.offsetX, event.offsetY, btnRandom )) {
        game.player.randoming()
        game.stage = "play"
    }
}
canvas.addEventListener("mousedown", func, false);

canvas.addEventListener("mousemove", function(e) {
    btnRandom.state = checkCollision(e.offsetX, e.offsetY, btnRandom)?"over":"def"
    btnRandom.draw()
}, false);

//Проверяет входит ли точка в  прямоугольник
function checkCollision(x, y, obj) {
    return x >= obj.x && x <= obj.x + obj.w && y >= obj.y && y <= obj.y + obj.h 
}