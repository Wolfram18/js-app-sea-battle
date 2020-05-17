//поле, выстрелы, корабли
class Topology {
    constructor(param) {
        this.offsetX = param.offsetX
        this.offsetY = param.offsetY
        //для того, чтобы не показывать корабли бота
        this.secret = param.secret || false //БОТ

        this.sheeps = []
        this.checks = []
        this.kills = []
        this.injuries = []
        this.last = {}
    }

    //добавление кораблей
    //принимает какое-то кол-во кораблей и добавляет их в массив sheeps
    addSheeps(...sheeps) {
        //проверяем не был ли ранее добавлен данный корабль, 
        //если не был, то добавляем в sheeps
        for(const sheep of sheeps) {
            if(!this.sheeps.includes(sheep)) {
                this.sheeps.push(sheep)
            }
        }
        return this
    }

    //добавление выстрелов
    //принимает какое-то кол-во выстрелов и добавляет их в массив checks
    addChecks(...checks) {
        //проверяем не был ли ранее добавлен данный выстрел, 
        //если не был, то добавляем в checks
        for(const check of checks) {
            if(!this.checks.includes(check)) {
                this.checks.push(check)
            }
        }
        return this
    }

    //проверяем не был ли ранее добавлен данный выстрел
    isChecked(point) {
        const flag = this.checks.find(check => check.x === point.x && check.y === point.y)
        if (flag) {
            return true
        } 
        return false
    }

    //добавление последнего хода
    addThelast(last) {
        this.last = last
        return this
    }

    //отрисовка поля, кораблей, точек, ранений и последнего хода
    draw (context) {
        this.drawFields(context)

        //Отрисовка или не отрисовка кораблей 
        //БОТ
        if (!this.secret) {
            for(const sheep of this.sheeps) {
            this.drawSheep(context, sheep)
            }
        }
        
        for(const check of this.checks) {
            this.drawCheck(context, check)
        }

        for(const injury of this.injuries) {
            this.drawInjury(context, injury)
        }

        this.drawLast(context, this.last)

        return this
    }

    //рисование клеток морского боя
    drawFields (context) {
        context.strokeStyle = "blue"
        context.lineWidth = 1.7

        //вертикальные линии
        for (let i = 1; i <= 11; i++) {
            context.beginPath()

            //начальная точка для рисования
            context.moveTo(
                this.offsetX + i * FIELD_SIZE,
                this.offsetY
            )
            //конечная точка для рисования    
            context.lineTo(
                this.offsetX + i * FIELD_SIZE,
                this.offsetY + 11 * FIELD_SIZE
            )
            context.stroke()
        }

        //горизонтальные линии
        for (let i = 1; i <= 11; i++) {
            context.beginPath()

            //начальная точка для рисования
            context.moveTo(
                this.offsetX,
                this.offsetY  + i * FIELD_SIZE
            )
            //конечная точка для рисования    
            context.lineTo(
                this.offsetX + 11 * FIELD_SIZE,
                this.offsetY + i * FIELD_SIZE
            )
            context.stroke()
        }

        context.textAlign = "center"
        context.font = "20px comics sans"
        context.fillStyle = "black";
        
        //буквы
        const alphabet = "АБВГДЕЖЗИК"
        for(let i = 0; i < 10; i++) {
            const letter = alphabet[i]
            context.fillText(
                letter, 
                this.offsetX + i * FIELD_SIZE + FIELD_SIZE * 1.5,
                this.offsetY + FIELD_SIZE * 0.8
            )
        }

        //цифры
        for(let i = 1; i <= 10; i++) {
            context.fillText(
                i, 
                this.offsetX + FIELD_SIZE * 0.5,
                this.offsetY + i * FIELD_SIZE + FIELD_SIZE * 0.8
            )
        }
        return this
    }

    //рисование корабля
    drawSheep (context, sheep) {
        context.fillStyle = 'rgba(0, 0, 0, 0.75)'

        context.beginPath()
        context.rect(
            this.offsetX + sheep.x * FIELD_SIZE + FIELD_SIZE + 2,
            this.offsetY + sheep.y * FIELD_SIZE + FIELD_SIZE + 2,
            (sheep.direct === 0 ? sheep.size : 1) * FIELD_SIZE - 4,
            (sheep.direct === 1 ? sheep.size : 1) * FIELD_SIZE - 4
        )
        context.fill()

        return this
    }

    //рисование точки (выстрела)
    drawCheck(context, check) {
        context.fillStyle = 'black'

        context.beginPath()
        context.arc(
            this.offsetX + check.x * FIELD_SIZE + FIELD_SIZE * 1.5, //координата центра по x
            this.offsetY + check.y * FIELD_SIZE + FIELD_SIZE * 1.5, //координата центра по y
            3, //радиус
            0, 
            Math.PI * 2
        )
        context.fill() //заливка

        return this
    }

    //отрисовка ранений
    drawInjury(context, injury) {
        context.strokeStyle = 'red'
        context.lineWidth = 1.5

        //первая линия
        context.beginPath()
        context.moveTo(
            this.offsetX + injury.x * FIELD_SIZE + FIELD_SIZE + 1.5, //координата центра по x
            this.offsetY + injury.y * FIELD_SIZE + FIELD_SIZE + 1.5, //координата центра по y
        )
        context.lineTo(
            this.offsetX + injury.x * FIELD_SIZE + FIELD_SIZE * 2 - 1.5, //координата центра по x
            this.offsetY + injury.y * FIELD_SIZE + FIELD_SIZE * 2 - 1.5, //координата центра по y
        )
        context.stroke()

        //вторая линия
        context.beginPath()
        context.moveTo(
            this.offsetX + injury.x * FIELD_SIZE + FIELD_SIZE *2 - 1.5, //координата центра по x
            this.offsetY + injury.y * FIELD_SIZE + FIELD_SIZE + 1.5, //координата центра по y
        )
        context.lineTo(
            this.offsetX + injury.x * FIELD_SIZE + FIELD_SIZE + 1.5, //координата центра по x
            this.offsetY + injury.y * FIELD_SIZE + FIELD_SIZE * 2 - 1.5, //координата центра по y
        )
        context.stroke()

        return this
    }

    //рисование последнего хода
    drawLast(context, last) {
        context.strokeStyle = 'green'
        context.lineWidth = 2.5

        //первая линия (лево)
        context.beginPath()
        context.moveTo(
            this.offsetX + last.x * FIELD_SIZE + FIELD_SIZE + 2, //координата центра по x
            this.offsetY + last.y * FIELD_SIZE + FIELD_SIZE + 1, //координата центра по y
        )
        context.lineTo(
            this.offsetX + last.x * FIELD_SIZE + FIELD_SIZE + 2, //координата центра по x
            this.offsetY + last.y * FIELD_SIZE + FIELD_SIZE * 2 - 1, //координата центра по y
        )
        context.stroke()

        //вторая линия (право)
        context.beginPath()
        context.moveTo(
            this.offsetX + last.x * FIELD_SIZE + FIELD_SIZE * 2 - 2, //координата центра по x
            this.offsetY + last.y * FIELD_SIZE + FIELD_SIZE + 1, //координата центра по y
        )
        context.lineTo(
            this.offsetX + last.x * FIELD_SIZE + FIELD_SIZE * 2 - 2, //координата центра по x
            this.offsetY + last.y * FIELD_SIZE + FIELD_SIZE * 2 - 1, //координата центра по y
        )
        context.stroke()

        //третья линия (верх)
        context.beginPath()
        context.moveTo(
            this.offsetX + last.x * FIELD_SIZE + FIELD_SIZE * 2 - 2, //координата центра по x
            this.offsetY + last.y * FIELD_SIZE + FIELD_SIZE + 2, //координата центра по y
        )
        context.lineTo(
            this.offsetX + last.x * FIELD_SIZE + FIELD_SIZE + 2, //координата центра по x
            this.offsetY + last.y * FIELD_SIZE + FIELD_SIZE + 2, //координата центра по y
        )
        context.stroke()

        //четвёртая линия (низ)
        context.beginPath()
        context.moveTo(
            this.offsetX + last.x * FIELD_SIZE + FIELD_SIZE + 2, //координата центра по x
            this.offsetY + last.y * FIELD_SIZE + FIELD_SIZE * 2 - 2, //координата центра по y
        )
        context.lineTo(
            this.offsetX + last.x * FIELD_SIZE + FIELD_SIZE * 2 - 2, //координата центра по x
            this.offsetY + last.y * FIELD_SIZE + FIELD_SIZE * 2 - 2, //координата центра по y
        )
        context.stroke()

        return this
    }

    //положение мышки. true, если в области поля морского боя
    //false, если на буквах, цифрах или вне поля
    isPointUnder (point) {
        if (
            point.x < this.offsetX + FIELD_SIZE || 
            point.x > this.offsetX + 11 * FIELD_SIZE ||
            point.y < this.offsetY + FIELD_SIZE || 
            point.y > this.offsetY + 11 * FIELD_SIZE
        ) {
            return false
        }
        return true     
    }


    //получить координаты клетки
    getCoordinats (point) {
        //если мышка не над полем, то возвращаем false
        if (!this.isPointUnder(point)) {
            return false
        }

        //иначе - её координаты
        const x = parseInt((point.x - this.offsetX - FIELD_SIZE) / FIELD_SIZE)
        const y = parseInt((point.y - this.offsetY - FIELD_SIZE) / FIELD_SIZE)

        //причем между 0 и 9
        return {
            x: Math.max(0, Math.min(9, x)),
            y: Math.max(0, Math.min(9, y)),
        }
    }

    //проверяем можно ли разместить корабль в топологии
    canStay (sheep) {

        //проверяем не выходит ли корабль за область поля
        if (sheep.direct === 0 && sheep.x + sheep.size > 10) {
            return false
        }
        if (sheep.direct === 1 && sheep.y + sheep.size > 10) {
            return false
        }

        //пока ничего нет на поле - корабль можно поставить в любое место
        const map = []
        for (let i = 0; i < 10; i++) {
            map[i] = []
            for (let j = 0; j < 10; j++) {
                map[i][j] = true
            }
        }

        //если на поле стоит корабль, то все его клетки и все клетко вокруг него становятся false
        for (const sheep of this.sheeps) {
            if (sheep.direct === 0) {
                for (let x = sheep.x - 1; x < sheep.x + sheep.size + 1; x++) {
                    for (let y = sheep.y - 1; y < sheep.y + 2; y++) {
                        if (map[y] && map[y][x]) {
                            map[y][x] = false
                        }
                    }
                }
            }
            else {
                for (let x = sheep.x - 1; x < sheep.x + 2; x++) {
                    for (let y = sheep.y - 1; y < sheep.y + sheep.size + 1 ; y++) {
                        if (map[y] && map[y][x]) {
                            map[y][x] = false
                        }
                    }
                }
            }
        }

        if (sheep.direct === 0) {
            for (let i = 0; i < sheep.size; i++) {
                if(!map[sheep.y][sheep.x + i]) {
                    return false
                }
            }
        }
        else {
            for (let i = 0; i < sheep.size; i++) {
                if(!map[sheep.y + i][sheep.x]) {
                    return false
                }
            }
        }
        return true
    }

    //расстановка кораблей случайным образом
    randoming() {
        this.sheeps =[]

        for (let size = 4; size > 0; size--) {
            for (let n = 0; n < 5 - size; n++) {
                let flag = false

                while (!flag) {
                    const sheep = {
                        x: Math.floor(Math.random() * 10),
                        y: Math.floor(Math.random() * 10),
                        direct: Math.random() > Math.random() ? 0 : 1,
                        size
                    }
    
                    if(this.canStay(sheep)) {
                        this.addSheeps(sheep)
                        flag = true
                    } 
                }
                
            }
        }
        return true
    }

    update () {
        //надо убрать возможность добавления в массив повторных точек
        this.checks = this.checks
            //каждый объект checks превращаем в строку
            .map(check => JSON.stringify(check))
            //фильтруем все повторяющиеся элементы(элем, инд, лист)
            //если послед индекс элемента вернёт несовпад с инд элемент - удаляем
            .filter((e, i, l) => l.lastIndexOf(e) === i)
            //переводим обратно в объект
            .map(check => JSON.parse(check))

        //добавляем возможность ранения

        //карта кораблей
        const map = this.getSheepsMap()
        
        //проверяем, является ли точка, которую ранили - положением корабля
        for (const check of this.checks) {
            if (map[check.y][check.x]) {
                this.injuries.push(check)

                const index = this.checks.indexOf(check)
                this.checks.splice(index, 1)
            }
        }

    }

    getSheepsMap () {
        //формируем карту кораблей
        const map = []
        for (let i = 0; i < 10; i++) {
            map[i] = []
            for (let j = 0; j < 10; j++) {
                map[i][j] = false
            }
        }

        //ставим true, где стоит корабль
        for (const sheep of this.sheeps) {
            if (sheep.direct === 0) {
                for (let x = sheep.x; x < sheep.x + sheep.size; x++) {
                    if (map[sheep.y] && !map[sheep.y][x]) {
                        map[sheep.y][x] = true
                    }
                }
            }
            else {
                for (let y = sheep.y; y < sheep.y + sheep.size; y++) {
                    if (map[y] && !map[y][sheep.x]) {
                        map[y][sheep.x] = true
                    }
                }
            }
        }

        return map
    }

    //возвращаем true, если в ячейке стоит корабль
    isSheepUnderPoint (point) {
        //карта кораблей
        const map = this.getSheepsMap()

        return map[point.y][point.x]
    }

    //проверяем был ли выстрел по клетке
    getUnknownFields () {
        const unknownFields = []

        for (let y = 0; y < 10; y++) {
            for (let x = 0; x < 10; x++) {
                //неизвестная клетка
                let flag = true
                //проходим по всем клеткам c выстрелами
                for (const check of this.checks) {
                    if (check.x === x && check.y === y) {
                        flag = false
                        break
                    }
                }

                //если флаг не опущен, проходим по всем раненым клеткам
                if (flag) {
                    for (const injury of this.injuries) {
                        if (injury.x === x && injury.y === y) {
                            flag = false
                            break
                        }
                    }
                }

                //если фаг до сих пор не опущен, то добавляем эту клетку в неиследованные
                if (flag) {
                    unknownFields.push({ x, y })
                }
            }
        }

        return unknownFields
    }

    //проверяет убиты ли все корабли
    isEnd() {
        //карта кораблей
        const map = this.getSheepsMap()

        //делаем false все клетки с ранениями
        for (const injury of this.injuries) {
            map[injury.y][injury.x] = false
        }

        //ищем хоть один true
        for (let status of map.flat()) {
            if (status) {
                return false
            }
        }

        return true
    }
}