import Polygon from './polygon.js'

export default class Asteroid extends Polygon {
    constructor(ctx, stageProps, position, points, scale, lifes, w, velocity) {
        super(ctx, stageProps, position, points, scale)
        this.lifes = lifes
        
        this.w = w
        this.velocity = velocity
    }
}
