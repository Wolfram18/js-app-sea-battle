class Game {
    constructor() {
        this.stage = "preparation" //стадия подготовки
        this.playerOrder = true // чей ход

        //создание игрока
        this.player = new Topology({
            offsetX: 60,
            offsetY: 90
        })

        //создание бота
        this.computer = new Topology({
            offsetX: 600,
            offsetY: 100,
            secret: true
        })

        //вынести в команду
        this.computer.randoming()
        //if нажали кнопку рандом то
        //this.player.randoming()
        //this.stage = "play"

        //регистрирует вызов функции перед обновлением экрана
        requestAnimationFrame(x => this.tick(x))
    }

    //вводит сколько существует страница в мс
    tick(timestamp) {
        requestAnimationFrame(x => this.tick(x))

        //60 раз в секунду обновлять canvas и заново рисовать drawGrid
        clearCanvas()
        drawGrid()
        btnRandom.draw(); //Кнопка

        //отрисовка поля, кораблей и выстрелов игрока и бота
        this.player.draw(context)
        this.computer.draw(context)

        //если идет стадия подготовки, то выхывается функция расстановки кораблей
        if (this.stage === "preparation") {
            this.tickPreparation(timestamp)
        }

        //если идет стадия игры, то выхывается функция игры
        else if (this.stage === "play") {
            this.tickPlay(timestamp)

            if (this.computer.isEnd()) {
                this.stage = 'end'
                alert('Поздаравляю с победой!')
            }
    
            else if (this.player.isEnd()) {
                this.stage = 'end'
                alert('Увы, попробуй еще раз.')
            }
        }

        //если идет стадия завершения, то выхывается функция завершения
        /*if (this.stage === "completion") {
            this.tickCompletion(timestamp)
        }*/

        //для отслеживания нажатия клавиши
        mouse.pleft = mouse.left
    }

    //стадия расстановки кораблей
    tickPreparation (timestamp) {
        //если мышь не над полем - выход
        if (!this.player.isPointUnder(mouse)) {
            return
        }

        //массив размеров кораблей
        const sheepSizes = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1]
        //текущий размер корабля
        const sheepSize = sheepSizes[this.player.sheeps.length]
        // получаем координаты клетки
        const coordinats = this.player.getCoordinats(mouse)

        const sheep = {
            x: coordinats.x,
            y: coordinats.y,
            direct: mouse.s ? 0 : 1,
            size: sheepSize
        }

        //если корабль вылезает за поле выход
        if (!this.player.canStay(sheep)) {
            return
        }

        this.player.drawSheep(context, sheep)

        //добавление корабля, если в текущей итерации прожата левая кнопка мыши
        if (mouse.left && !mouse.pleft) {
            this.player.addSheeps(sheep)

            //проверяем, что выставили все корабли
            if (this.player.sheeps.length === 10) {
                this.stage = "play"
            }
        }
    }

    //стадия игры
    tickPlay (timestamp) {
        canvas.removeEventListener("mousedown", func) //Кнопка

        //Логика игрока
        if (this.playerOrder) {
            //если мышь над полем бота
            if (!this.computer.isPointUnder(mouse)) {
                return
            }

            //получам координаы клетки
            const point = this.computer.getCoordinats(mouse)

            //добавить выстрел, если нажали левую кнопку мыши
            if (mouse.left && !mouse.pleft) {
                //нельзя стрелять в одну и ту же клетку
                if (!this.computer.isChecked(point)) {

                    this.computer.addChecks(point)
                    //добавляем последний ход
                    this.computer.addThelast(point)
        
                    //логика добавления точки
                    this.computer.update()
        
                    //проверяем был ли выстрел в корабль или нет
                    if (!this.computer.isSheepUnderPoint(point)) {
                        //передаём ход
                        this.playerOrder = false
                    }
                }
            }
        }

        //Логика бота
        else {
            /*задаём рандомную точку
            const point = {
                x: Math.floor(Math.random() *10),
                y: Math.floor(Math.random() *10)
            }*/

            //получаем рандомную точку среди доступным непроверенных
            const point = getRandomFrom(this.player.getUnknownFields())

            this.player.addChecks(point)
            //добавляем последний ход
            this.player.addThelast(point)

            //логика добавления точки
            this.player.update()

            //проверяем был ли выстрел в корабль или нет
            if (!this.player.isSheepUnderPoint(point)) {
                //передаём ход
                this.playerOrder = true
            }

        }
    }

    tickCompletion (timestamp) {
        
    }
}