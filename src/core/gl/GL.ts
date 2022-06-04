export class GLUtilities {
  private static canvas: HTMLCanvasElement
  private static gl: WebGLRenderingContext

  public static initialize(elementId?: string): void {
    if (elementId !== undefined) {
      this.canvas = document.getElementById(elementId) as HTMLCanvasElement
      if (this.canvas === undefined) {
        throw new Error(`Can not find canvas ${elementId}`)
      }
    } else {
      this.canvas = document.createElement('canvas') as HTMLCanvasElement
      document.body.appendChild(this.canvas)
    }

    this.gl = this.canvas.getContext('webgl') as WebGLRenderingContext
    if (this.gl === undefined) {
      throw new Error(`Can not initialize WebGL`)
    }
  }

  public static getCanvas(): HTMLCanvasElement {
    return this.canvas
  }

  public static getGL(): WebGLRenderingContext {
    return this.gl
  }
}

