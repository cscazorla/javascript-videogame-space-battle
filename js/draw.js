var Draw = {
    vector(ctx, vector2, style) {
        ctx.save()

        if (style !== undefined) {
            ctx.strokeStyle = style
            ctx.fillStyle = style
        }

        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.lineTo(vector2.x, vector2.y)
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(vector2.x, vector2.y, 2, 0, 2 * Math.PI, false)
        ctx.fill()

        ctx.restore()
    },

    vector2dir(ctx, origin, vector2, style) {
        ctx.save()

        if (style !== undefined) {
            ctx.strokeStyle = style
            ctx.fillStyle = style
        }

        ctx.beginPath()
        ctx.moveTo(origin.x, origin.y)
        ctx.lineTo(origin.x + vector2.x, origin.y + vector2.y)
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(
            origin.x + vector2.x,
            origin.y + vector2.y,
            2,
            0,
            2 * Math.PI,
            false
        )
        ctx.fill()

        ctx.restore()
    },

    circle(ctx, vector2, radius, style, fill) {
        ctx.save()

        if (style !== undefined) {
            fill ? (ctx.fillStyle = style) : (ctx.strokeStyle = style)
        }

        ctx.beginPath()
        ctx.arc(vector2.x, vector2.y, radius, 0, 2 * Math.PI, false)
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(vector2.x, vector2.y, radius, 0, 2 * Math.PI, false)
        fill ? ctx.fill() : ctx.stroke()

        ctx.restore()
    },

    line(ctx, vector2start, vector2end, style) {
        ctx.save()

        if (style !== undefined) {
            ctx.strokeStyle = style
        }

        ctx.beginPath()
        ctx.moveTo(vector2start.x, vector2start.y)
        ctx.lineTo(vector2end.x, vector2end.y)
        ctx.stroke()

        ctx.restore()
    },

    text(ctx, text, vector2, font) {
        font = font || '10pt Ubuntu'
        ctx.font = font

        ctx.fillText(text, vector2.x, vector2.y)
    },

    translateAxisToCenter(ctx, canvas) {
        ctx.translate(canvas.width * 0.5, canvas.height * 0.5) // center
    },

    cartesianAxis(ctx, coords, count) {
        ctx.save()

        ctx.strokeStyle = 'rgba(0,0,0, 0.25)'
        //ctx.strokeStyle = "red";

        ctx.font = '6pt Consolas'

        coords = coords || 320
        count = count || 16

        ctx.beginPath()
        ctx.moveTo(-coords, 0)
        ctx.lineTo(coords, 0)
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(0, -coords)
        ctx.lineTo(0, coords)
        ctx.stroke()

        if (ctx.setLineDash) {
            ctx.setLineDash([1, 2])
        } else {
            ctx.strokeStyle = 'rgba(0,0,0, 0.125)'
        }

        ctx.beginPath()
        ctx.moveTo(-coords, coords * 0.5)
        ctx.lineTo(coords, coords * 0.5)
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(-coords, -coords * 0.5)
        ctx.lineTo(coords, -coords * 0.5)
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(coords * 0.5, -coords)
        ctx.lineTo(coords * 0.5, coords)
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(-coords * 0.5, -coords)
        ctx.lineTo(-coords * 0.5, coords)
        ctx.stroke()

        ctx.setLineDash([])

        ctx.strokeStyle = 'rgba(0,0,0, 0.25)'

        var i,
            inc = (coords * 2) / count,
            max = count,
            x,
            y

        ctx.textAlign = 'center'
        for (i = 0; i <= max; ++i) {
            x = -coords + i * inc
            ctx.beginPath()
            ctx.moveTo(x, 4)
            ctx.lineTo(x, -4)
            ctx.stroke()

            if (x !== 0) {
                ctx.fillText(x, x, -12)
            }
        }

        ctx.fillText('(0,0)', 0, -12)

        ctx.textAlign = 'left'
        for (i = 0; i <= max; ++i) {
            y = -coords + i * inc
            ctx.beginPath()
            ctx.moveTo(4, y)
            ctx.lineTo(-4, y)
            ctx.stroke()

            if (y !== 0) {
                ctx.fillText(y, +12, y - 4)
            }
        }

        ctx.restore()
    },
}
