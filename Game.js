class Game {
    constructor() {
        this.stage = "preparation" //стадия подготовки

        //создание игрока
        this.player = new Topology({
            offsetX: 60,
            offsetY: 90
        })

        //создание бота
        this.computer = new Topology({
            offsetX: 600,
            offsetY: 100
        })

        //добавление игроку кораблей и точек (выстрелов)
        this.player
            .addSheeps(
                { x: 0, y: 0, direct: 0, size:3 },
                { x: 0, y: 2, direct: 0, size:4 },
            )
            .addChecks(
                { x: 5, y: 5 }
            )

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
    }

    //стадия расстановки кораблей
    tickPreparation (timestamp) {

    }
}