import {FragmentShaderSource, VertexShaderSource} from "./Shader";

export class CompiledShader {
  private readonly program: WebGLProgram

  public constructor(
    private readonly name: string,
    vertexSource: VertexShaderSource,
    fragmentSource: FragmentShaderSource,
    private gl: WebGLRenderingContext
  ) {
    const vertexShader = CompiledShader.loadShader(name, vertexSource.source, WebGLRenderingContext.VERTEX_SHADER, gl)
    const fragmentShader = CompiledShader.loadShader(name, fragmentSource.source, WebGLRenderingContext.FRAGMENT_SHADER, gl)
    this.program = CompiledShader.createProgram(name, vertexShader, fragmentShader, gl)
  }

  public getName(): string {
    return this.name
  }

  public use(): void {
    this.gl.useProgram(this.program)
  }

  public getUniformLocation(name: string) : WebGLUniformLocation | undefined {
    return this.gl.getUniformLocation(this.program, name) || undefined
  }

  public getAttributeLocation(name: string): number | undefined {
    return this.gl.getAttribLocation(this.program, name) || undefined
  }

  private static loadShader(
    name: string,
    source: string,
    shaderType: number,
    gl: WebGLRenderingContext
  ): WebGLShader {
    const shader: WebGLShader | null = gl.createShader(shaderType)

    if (shader) {
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      const error = gl.getShaderInfoLog(shader)
      if (error !== '') {
        throw new Error(`Error compiling shader ${name}: ` + error)
      }
    } else {
      throw new Error(`Error creating shader: ${source} ${shaderType}`)
    }

    return shader
  }

  private static createProgram(
    name: string,
    vertexShader: WebGLShader,
    fragmentShader: WebGLShader,
    gl: WebGLRenderingContext
  ): WebGLProgram {
    const program = gl.createProgram()
    if (program) {
      gl.attachShader(program, vertexShader)
      gl.attachShader(program, fragmentShader)

      gl.linkProgram(program)
      const error = gl.getProgramInfoLog(program)
      if (error !== '') {
        throw new Error(`Error linking shader ${name}`)
      }
    } else {
      throw new Error(`Error creating program ${name}`)
    }

    return program
  }
}
