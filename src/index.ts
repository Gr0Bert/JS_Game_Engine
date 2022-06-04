import {GLUtilities} from "./core/gl/GL";
import {Engine} from "./core/Engine";

window.onload = () => {
  GLUtilities.initialize()
  const engine = new Engine(GLUtilities.getGL(), (f) => requestAnimationFrame(f))
  engine.start()
  console.log(engine)
}

window.onresize = () => {
  GLUtilities.getCanvas().width = window.innerWidth
  GLUtilities.getCanvas().height = window.innerHeight
  GLUtilities.getGL().viewport(-1, 1, -1, 1)
}

export {}
