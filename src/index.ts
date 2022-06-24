import {GLUtilities} from "./core/gl/GL";
import {Engine} from "./core/Engine";
import {ImageAsset} from "./core/assets/ImageAsset";

export const SCORE_TEXTURE = 'assets/textures/score.png'

window.onload = () => {
  GLUtilities.initialize()
  Promise.all(
    [ImageAsset.loadAsset(SCORE_TEXTURE)]
  ).then(assets => {
    const assetsMap = assets.reduce((acc: Record<string, ImageAsset>, cur) => {
      acc[cur.name] = cur;
      return acc;
    }, {})
    const engine = new Engine(assetsMap, GLUtilities.getGL(), (f) => requestAnimationFrame(f))

    GLUtilities.getCanvas().width = window.innerWidth
    GLUtilities.getCanvas().height = window.innerHeight
    engine.resize(GLUtilities.getCanvas().width, GLUtilities.getCanvas().height)

    window.onresize = () => {
      GLUtilities.getCanvas().width = window.innerWidth
      GLUtilities.getCanvas().height = window.innerHeight
      GLUtilities.getGL().viewport(-1, 1, GLUtilities.getCanvas().width, GLUtilities.getCanvas().height)
      engine.resize(GLUtilities.getCanvas().width, GLUtilities.getCanvas().height)
    }

    engine.start()
    console.log(engine)
  }).catch(error => {
    console.error(error)
  })

}


export {}
