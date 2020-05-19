//Типо интерфейс
class Strategy {
    constructor() {
        this.stage = "completion"
    }

    execute(param) { }
}

//Конкретная стратегия (1)
class StrategyPreparation extends Strategy {
    constructor(param) {
        super();
        this.player = param.player
        this.stage = param.stage
    }

    execute(param) {
        this.player = param.player

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

        this.player.drawer.drawSheep(context, sheep)

        //добавление корабля, если в текущей итерации прожата левая кнопка мыши
        if (mouse.left && !mouse.pleft) {
            this.player.addSheeps(sheep)

            //проверяем, что выставили все корабли
            if (this.player.sheeps.length === 10) {
                this.stage = "play"
            }
        }
    }
}

//Конкретная стратегия (2)
class StrategyPlay extends Strategy {
    constructor(param) {
        super();
        this.player = param.player
        this.computer = param.computer
        this.playerOrder = param.playerOrder
        this.stage = param.stage
    }

    execute(param) {
        this.player = param.player
        this.computer = param.computer
        this.playerOrder = param.playerOrder

        canvas.removeEventListener("mousedown", func) //Кнопка

        //Логика игрока
        if (this.playerOrder) {
            //если мышь над полем бота
            if (!this.computer.isPointUnder(mouse)) {
                return
            }

            //получам координаты клетки
            const point = this.computer.getCoordinats(mouse)

            //добавить выстрел, если нажали левую кнопку мыши
            if (mouse.left && !mouse.pleft) {
                //нельзя стрелять в одну и ту же клетку
                if (!this.computer.isChecked(point)) {

                    this.computer.addChecks(point)
                    this.computer.LightCheckArondInjury (point);
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
}

//Конкретная стратегия (3)
class StrategyCompletion extends Strategy {
    constructor(param) {
        super();
    }

    execute() {

    }
}

// Контекст всегда работает со стратегиями через общий
// интерфейс. Он не знает, какая именно стратегия ему подана.
class Context {
    constructor() {
        this.strategy = new Strategy()
    }

    setStrategy(strategy) {
        this.strategy = strategy
    }

    executeStrategy(param) {
        this.strategy.execute(param)
    }
}