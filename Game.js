class Game {
    constructor() {
        this.stage = "preparation" //стадия подготовки
        this.playerOrder = true // чей ход

        //создание игрока
        this.player = new Topology({
            offsetX: 60,
            offsetY: 85
        })

        //создание бота
        this.computer = new Topology({
            offsetX: 590,
            offsetY: 85,
            secret: true
        })

        this.context = new Context()

        this.computer.randoming()

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

        //если идет стадия подготовки, то вызывается функция расстановки кораблей
        if (this.stage === "preparation") {
            const strategyPreparation = new StrategyPreparation({
                player: this.player, 
                computer: this.computer,
                stage: "preparation"
            })
            this.context.setStrategy(strategyPreparation)
            this.tickPreparation(timestamp)
            
        }

        //если идет стадия игры, то выхывается функция игры
        else if (this.stage === "play") {
            const strategyPlayPlayer = new StrategyPlayPlayer({
                playerOrder: this.playerOrder,
                stage: "play",
                topology: this.computer
            })
            const strategyPlayBot = new StrategyPlayBot({
                playerOrder: this.playerOrder,
                stage: "play",
                topology: this.player
            })

            //Логика игрока
            if (this.playerOrder) { 
                this.context.setStrategy(strategyPlayPlayer)
                this.tickPlayPlayer(timestamp)
            }
            //Логика бота
            else { 
                this.context.setStrategy(strategyPlayBot)
                this.tickPlayBot(timestamp)
            }

            if (this.computer.isEnd()) {
                this.stage = "completionWin"
                const strategyCompletion = new StrategyCompletion({
                    stage: "completionWin"
                })
                this.context.setStrategy(strategyCompletion)
                this.context.executeStrategy()
            }
    
            else if (this.player.isEnd()) {
                this.stage = 'completionLose'
                const strategyCompletion = new StrategyCompletion({
                    stage: "completionLose"
                })
                this.context.setStrategy(strategyCompletion)
                this.context.executeStrategy()
            }
        }

        //для отслеживания нажатия клавиши
        mouse.pleft = mouse.left
    }

    //стадия расстановки кораблей
    tickPreparation (timestamp) {
        this.context.executeStrategy({player: this.player, computer: this.computer,})
        this.player = this.context.strategy.player
        this.computer = this.context.strategy.computer
        this.stage = this.context.strategy.stage
    }

    //стадия игры
    tickPlayPlayer (timestamp) {
        this.context.executeStrategy({playerOrder: this.playerOrder, topology: this.computer,})
        this.computer = this.context.strategy.topology
        this.playerOrder = this.context.strategy.playerOrder
        this.stage = this.context.strategy.stage
    }

    //стадия игры
    tickPlayBot (timestamp) {
        this.context.executeStrategy({playerOrder: this.playerOrder, topology: this.player,})
        this.player = this.context.strategy.topology
        this.playerOrder = this.context.strategy.playerOrder
        this.stage = this.context.strategy.stage
    }
}