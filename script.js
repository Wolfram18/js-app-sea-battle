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
    context.lineWidth = 2
    context.strokeStyle ='red'

    context.beginPath()
    context.moveTo(0, 75)
    context.lineTo(canvas.width, 75)
    context.stroke()
}
