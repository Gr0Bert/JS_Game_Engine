import {AttributeInfo} from "./AttributeInfo";
import {createWebGLArray} from "./conversions";

const TARGET_BUFFER_TYPE: number = WebGLRenderingContext.ARRAY_BUFFER


export class AttributeInfoContainer {
  public readonly size: number
  public readonly dataType: number
  public readonly typeSize: number
  public readonly stride: number

  public constructor(
    public readonly attributes: AttributeInfo[],
  ) {
    this.size = attributes.reduce((acc, cur) => {
      return acc + cur.size
    }, 0)
    this.dataType = attributes[0].dataType
    this.typeSize = attributes[0].typeSize
    this.stride = this.size * this.typeSize
  }
}

export class PrimitiveGLBufferUse {
  private dataLen: number = 0

  public constructor(
    private dataType: number,
    private size: number,
    private gl: WebGLRenderingContext,
  ) {
  }

  public withData(data: number[]) {
    this.dataLen = data.length
    const bufferData: ArrayBufferView | undefined = createWebGLArray(data, this.dataType)
    if (bufferData) {
      this.gl.bufferData(TARGET_BUFFER_TYPE, bufferData, WebGLRenderingContext.STATIC_DRAW)
    } else {
      throw new Error('Can not upload buffer')
    }
  }

  public draw(mode: number = WebGLRenderingContext.TRIANGLES): void {
    this.gl.drawArrays(mode, 0, this.dataLen / this.size)
  }
}

export class PrimitiveGLBufferResource {
  private readonly attributeInfoContainer: AttributeInfoContainer
  private readonly buffer: WebGLBuffer


  public constructor(
    attributes: AttributeInfo[],
    private readonly gl: WebGLRenderingContext,
  ) {
    this.attributeInfoContainer = new AttributeInfoContainer(attributes)
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
      const res = new PrimitiveGLBufferUse(this.attributeInfoContainer.dataType, this.attributeInfoContainer.size, this.gl)
      cb(res)
    } finally {
      this.unbind()
    }
  }

  public delete(): void {
    this.gl.deleteBuffer(this.buffer)
  }

  private bind(): void {
    this.gl.bindBuffer(TARGET_BUFFER_TYPE, this.buffer)
    this.attributeInfoContainer.attributes.forEach(attribute => {
      this.gl.vertexAttribPointer(
        attribute.location,
        attribute.size,
        attribute.dataType,
        attribute.normalized,
        this.attributeInfoContainer.stride,
        attribute.offset * this.attributeInfoContainer.typeSize
      )
      this.gl.enableVertexAttribArray(attribute.location)
    })
  }

  private unbind(): void {
    this.attributeInfoContainer.attributes.forEach(a => this.gl.disableVertexAttribArray(a.location))
    this.gl.bindBuffer(WebGLRenderingContext.ARRAY_BUFFER, null)
  }
}


