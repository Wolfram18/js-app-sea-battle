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

function drawRules() {
    context.strokeStyle = 'black'
    context.fillStyle = 'rgba(0, 0, 0, 0.75)'
    context.lineWidth = 1.7

    context.beginPath()
    context.rect(300, 20, 120, 30) 
    context.fill()
    context.stroke()

    context.beginPath()
    context.rect(500, 20, 90, 30) 
    context.fill()
    context.stroke()

    context.beginPath()
    context.rect(670, 20, 60, 30) 
    context.fill()
    context.stroke()

    context.beginPath()
    context.rect(800, 20, 30, 30) 
    context.fill()
    context.stroke()

    context.textAlign = "center"
    context.font = "30px comics sans"
    context.fillStyle = "black";

    const text = "Расставьте корабли:"
    context.fillText(text, 150, 40)

    const x1 = "x1"
    context.fillText(x1,450,40)

    const x2 = "x2"
    context.fillText(x2,620,40)

    const x3 = "x3"
    context.fillText(x3,760,40)

    const x4 = "x4"
    context.fillText(x4,860,40)
}

//возвращает случайный элемент из массива
//для БОТА
function getRandomFrom (array) {
    const index = Math.floor(Math.random() * array.length)
    return array[index]
}