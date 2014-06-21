require('fibers')

function spawn(f) {
    var fiber = Fiber(function() {
    try {
      f()
    } catch (e) {
        console.error(e.stack)
    }
    })
    fiber.run()
    return fiber;
}

exports.spawn = spawn
