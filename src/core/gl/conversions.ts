export const createWebGLArray = (data: number[], glDataType: number): ArrayBufferView | undefined => {
  switch (glDataType) {
    case WebGLRenderingContext.FLOAT:
      return new Float32Array(data)
    case WebGLRenderingContext.INT:
      return new Int32Array(data)
    case WebGLRenderingContext.UNSIGNED_INT:
      return new Uint32Array(data)
    case WebGLRenderingContext.SHORT:
      return new Int16Array(data)
    case WebGLRenderingContext.UNSIGNED_SHORT:
      return new Uint16Array(data)
    case WebGLRenderingContext.BYTE:
      return new Int8Array(data)
    case WebGLRenderingContext.UNSIGNED_BYTE:
      return new Uint8Array(data)
    default:
      return undefined
  }
}

export const getTypeSize = (glDataType: number): number | undefined => {
  switch (glDataType) {
    case WebGLRenderingContext.FLOAT:
    case WebGLRenderingContext.INT:
    case WebGLRenderingContext.UNSIGNED_INT:
      return 4
    case WebGLRenderingContext.SHORT:
    case WebGLRenderingContext.UNSIGNED_SHORT:
      return 2
    case WebGLRenderingContext.BYTE:
    case WebGLRenderingContext.UNSIGNED_BYTE:
      return 1
    default:
      return undefined
  }
}