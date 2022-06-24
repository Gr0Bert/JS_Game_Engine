import {PrimitiveGLBufferResource} from "./gl/PrimitiveGLBufferResource";
import {CompiledShader} from "./gl/CompiledShader";
import {AttributeInfo} from "./gl/AttributeInfo";
import {Sprite} from "./graphics/Sprite";
import {FragmentShaderSource, VertexShaderSource} from "./gl/Shader";
import {Matrix4x4} from "./math/Matrix4x4";
import {ImageAsset} from "./assets/ImageAsset";
import {TextureResource} from "./graphics/TextureResource";
import {SCORE_TEXTURE} from "../index";

const VERTEX_SHADER_SOURCE = new VertexShaderSource(
  `
      attribute vec3 a_position;
      attribute vec2 a_textureCoordinate;
      
      uniform mat4 u_projection;
      uniform mat4 u_model;
      
      varying vec2 v_textureCoordinate;

      void main() {
        gl_Position = u_projection * u_model * vec4(a_position, 1.0);
        v_textureCoordinate = a_textureCoordinate;
      }
    `,
  [
    new AttributeInfo(0, 3, 0, WebGLRenderingContext.FLOAT, false),
    new AttributeInfo(1, 2, 3, WebGLRenderingContext.FLOAT, false)
    ]
)

const FRAGMENT_SHADER_SOURCE = new FragmentShaderSource(`
      precision mediump float;
      
      uniform vec4 u_tint;
      uniform sampler2D u_diffuse;
      varying vec2 v_textureCoordinate;

      void main() {
        gl_FragColor = u_tint * texture2D(u_diffuse, v_textureCoordinate);
      }
    `)

export class Engine {
  // @ts-ignore
  private shader: CompiledShader
  // @ts-ignore
  private projection: Matrix4x4

  public constructor(
    private assets: Record<string, ImageAsset>,
    private gl: WebGLRenderingContext,
    private next: (f: () => void) => void,
  ) {}

  public start(): void {
    this.gl.clearColor(0,0, 0,1)
    this.shader = new CompiledShader('basic', VERTEX_SHADER_SOURCE, FRAGMENT_SHADER_SOURCE, this.gl)
    this.shader.use()

    this.loop()
  }

  public loop(): void {
    console.log('ERROR:', this.gl.getError().toString(16))
    this.gl.clear(WebGLRenderingContext.COLOR_BUFFER_BIT)

    const uProjectionLocation = this.shader.getUniformLocation('u_projection')
    uProjectionLocation && this.gl.uniformMatrix4fv(uProjectionLocation, false, this.projection.toFloat32Array())

    const buffer = new PrimitiveGLBufferResource(VERTEX_SHADER_SOURCE.attributes, this.gl)
    buffer.use(buf => {
      new TextureResource(SCORE_TEXTURE, this.gl).use(texture => {
        const sprite = new Sprite(100, 100)
        texture.load(this.assets[SCORE_TEXTURE])
        buf.withData(sprite.getData())

        const uDiffuseLocation = this.shader.getUniformLocation('u_diffuse')
        uDiffuseLocation && this.gl.uniform1i(uDiffuseLocation, 0)

        const uTintLocation = this.shader.getUniformLocation('u_tint')
        uTintLocation && this.gl.uniform4f(uTintLocation, 1, 1, 1, 1)

        const positionMatrix = Matrix4x4.translation(sprite.getPosition()).toFloat32Array()
        const uModelLocation = this.shader.getUniformLocation('u_model')
        uModelLocation && this.gl.uniformMatrix4fv(uModelLocation, false, positionMatrix)

        buf.draw()
      })
    })
    this.logic()
    this.next(() => this.loop())
  }

  private logic(): void {
  }

  public resize(width: number, height: number): void {
    this.projection = Matrix4x4.orthographic(0, width, height, 0, -100.0, 100)
  }
}
