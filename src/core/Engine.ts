import {PrimitiveGLBufferResource} from "./gl/PrimitiveGLBufferResource";
import {CompiledShader} from "./gl/CompiledShader";
import {AttributeInfo} from "./gl/AttributeInfo";
import {Sprite} from "./graphics/Sprite";
import {FragmentShaderSource, VertexShaderSource} from "./gl/Shader";
import {Matrix4x4} from "./math/Matrix4x4";
import {GLUtilities} from "./gl/GL";

const VERTEX_SHADER_SOURCE = new VertexShaderSource(
  `
      attribute vec3 a_position;
      uniform mat4 u_projection;
      uniform mat4 u_model;

      void main() {
        gl_Position = u_projection * u_model * vec4(a_position, 1.0);
      }
    `,
  new AttributeInfo(0, 3, 0, WebGLRenderingContext.FLOAT, false)
)

const FRAGMENT_SHADER_SOURCE = new FragmentShaderSource(`
      precision mediump float;
      uniform vec4 u_color;

      void main() {
        gl_FragColor = u_color;
      }
    `)

export class Engine {
  private shader: CompiledShader

  public constructor(
    private gl: WebGLRenderingContext,
    private next: (f: () => void) => void,
  ) {}

  public start(): void {
    this.gl.clearColor(0,0, 0,1)
    this.shader = new CompiledShader('basic', VERTEX_SHADER_SOURCE, FRAGMENT_SHADER_SOURCE, this.gl)
    this.shader.use()
    const projection = Matrix4x4.orthographic(0, GLUtilities.getCanvas().width, 0, GLUtilities.getCanvas().height, -100.0, 100)

    const uColorLocation = this.shader.getUniformLocation('u_color')
    uColorLocation && this.gl.uniform4f(uColorLocation, 1, 0.5, 0, 1)

    const uProjectionLocation = this.shader.getUniformLocation('u_projection')
    uProjectionLocation && this.gl.uniformMatrix4fv(uProjectionLocation, false, projection.toFloat32Array())

    this.loop()
  }

  public loop(): void {
    this.gl.clear(WebGLRenderingContext.COLOR_BUFFER_BIT)
    const buffer = new PrimitiveGLBufferResource(VERTEX_SHADER_SOURCE.attribute, this.gl)
    buffer.use(buf => {
      const sprite = new Sprite(100, 100)
      buf.withData(sprite.getData())

      const positionMatrix = Matrix4x4.translation(sprite.getPosition()).toFloat32Array()
      const uModelLocation = this.shader.getUniformLocation('u_model')
      uModelLocation && this.gl.uniformMatrix4fv(uModelLocation, false, positionMatrix)

      buf.draw()
    })
    this.logic()
    this.next(() => this.loop())
  }

  private logic(): void {
  }
}
