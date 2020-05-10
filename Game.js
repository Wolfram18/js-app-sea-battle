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
        this.player.randoming()
        this.stage = "play"

        //регистрирует вызов функции перед обновлением экрана
        requestAnimationFrame(x => this.tick(x))
    }

    //вводит сколько существует страница в мс
    tick(timestamp) {
        requestAnimationFrame(x => this.tick(x))

        //60 раз в секунду обновлять canvas и заново рисовать drawGrid
        clearCanvas()
        drawGrid()

        //отрисовка поля, кораблей и выстрелов игрока и бота
        this.player.draw(context)
        this.computer.draw(context)


        //если идет стадия подготовки, то выхывается функция расстановки кораблей
        if (this.stage = "preparation") {
            this.tickPreparation(timestamp)
        }

        //если идет стадия игры, то выхывается функция игры
        if (this.stage = "play") {
            this.tickPlay(timestamp)
        }

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
                this.stage === "play"
            }
        }
    }

    //стадия игры
    tickPlay (timestamp) {
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
                this.computer.addChecks(point) //ЗАМЕНИТЬ НА GETPOINTSTATUS ДЛЯ ПРОДОЛЖЕНИЯ ХОДОВ
                //логика добавления точки      //КОТОРАЯ ВОЗВРАЩАЕТ СОСТОЧНИЕ КЛЕТКИ (КОРАБЛЬ, ВЫСТРЕЛ, РАНА)
                this.computer.update()
                //передаём ход
                this.playerOrder = false

                //ВЫВОДТЕКСТА
            }
        }

        //Логика бота
        else {
            //задаём рандомную точку
            const point = {
                x: Math.floor(Math.random() *10),
                y: Math.floor(Math.random() *10)
            }

            //ЗАДЕРЖКА

            this.player.addChecks(point)
            //логика добавления точки
            this.player.update()
            //передаём ход
            this.playerOrder = true

            //ВЫВОДТЕКСТА
        }
    }
}