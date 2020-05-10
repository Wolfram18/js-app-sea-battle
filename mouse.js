//получить положение мыши над canvas
function getMouse (element) {
    const mouse = {
        x: 0,
        y: 0
    }

    element.addEventListener('mousemove', function(event) {
        //абсолютное положение элемента 
        //относительно верхнего левого угла страницы
        const rect = element.getBoundingClientRect()

        mouse.x = event.clientX - rect.left;
        mouse.y = event.clientY - rect.top;
    })

    return mouse
}

