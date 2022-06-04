import {AttributeInfo} from "./AttributeInfo";

const TARGET_BUFFER_TYPE: number = WebGLRenderingContext.ARRAY_BUFFER

export class PrimitiveGLBufferUse {
  private dataLen: number = 0

  public constructor(
    private attribute: AttributeInfo,
    private gl: WebGLRenderingContext,
  ) {
  }

  public withData(data: number[]) {
    this.dataLen = data.length
    const bufferData: ArrayBufferView | undefined = this.attribute.createWebGLArray(data)
    if (bufferData) {
      this.gl.bufferData(TARGET_BUFFER_TYPE, bufferData, WebGLRenderingContext.STATIC_DRAW)
    } else {
      throw new Error('Can not upload buffer')
    }
  }

  public draw(mode: number = WebGLRenderingContext.TRIANGLES): void {
    this.gl.drawArrays(mode, 0, this.dataLen / this.attribute.size)
  }
}

export class PrimitiveGLBufferResource {
  private readonly buffer: WebGLBuffer

  public constructor(
    private attribute: AttributeInfo,
    private gl: WebGLRenderingContext,
  ) {
    const buffer = gl.createBuffer()
    if (buffer) {
      this.buffer = buffer
    } else {
      throw new Error(`Can not create buffer`)
    }
  }

  public use(cb: (buffer: PrimitiveGLBufferUse) => void): void {
    try {
      this.bind()
      const res = new PrimitiveGLBufferUse(this.attribute, this.gl)
      cb(res)
    } finally {
      this.unbind()
    }
  }

  public delete(): void {
    this.gl.deleteBuffer(this.buffer)
  }

  public bind(): void {
    this.gl.bindBuffer(TARGET_BUFFER_TYPE, this.buffer)
    if (this.attribute) {
      this.gl.vertexAttribPointer(
        this.attribute.location,
        this.attribute.size,
        this.attribute.dataType,
        this.attribute.normalized,
        0, // openGL should compute stride itself. If buffer will contain complex structure than stride should be calculated based on ALL attributes
        this.attribute.offset * this.attribute.typeSize
      )
      this.gl.enableVertexAttribArray(this.attribute.location)
    }
  }

  public unbind(): void {
    this.gl.disableVertexAttribArray(this.attribute.location)
    this.gl.bindBuffer(WebGLRenderingContext.ARRAY_BUFFER, null)
  }
}


