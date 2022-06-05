import {ImageAsset} from "../assets/ImageAsset";

export class TextureUse {
  public constructor(private readonly gl: WebGLRenderingContext) {
  }

  public load(imageAsset: ImageAsset): void {
    this.gl.texImage2D(
      WebGLRenderingContext.TEXTURE_2D,
      0,
      WebGLRenderingContext.RGBA,
      WebGLRenderingContext.RGBA,
      WebGLRenderingContext.UNSIGNED_BYTE,
      imageAsset.data
    )

    if (this.isPowerOf2(imageAsset)) {
      this.gl.generateMipmap(WebGLRenderingContext.TEXTURE_2D)
    } else {
      this.gl.texParameteri(WebGLRenderingContext.TEXTURE_2D, WebGLRenderingContext.TEXTURE_WRAP_S, WebGLRenderingContext.CLAMP_TO_EDGE)
      this.gl.texParameteri(WebGLRenderingContext.TEXTURE_2D, WebGLRenderingContext.TEXTURE_WRAP_T, WebGLRenderingContext.CLAMP_TO_EDGE)
      this.gl.texParameteri(WebGLRenderingContext.TEXTURE_2D, WebGLRenderingContext.TEXTURE_MIN_FILTER, WebGLRenderingContext.LINEAR)
    }
  }

  private isPowerOf2(imageAsset: ImageAsset): boolean {
    return (this.isValuePowerOf2(imageAsset.width) && this.isValuePowerOf2(imageAsset.height))
  }

  private isValuePowerOf2(value: number): boolean {
    return (value & (value - 1)) == 0
  }
}

export class TextureResource {
  private readonly glTexture: WebGLTexture

  public constructor(
    public readonly name: string,
    private readonly gl: WebGLRenderingContext
  ) {
    const texture = gl.createTexture()
    if (texture) {
      this.glTexture = texture
    } else {
      throw new Error(`Can not create texture ${name}`)
    }
  }

  public use(cb: (texture: TextureUse) => void): void {
    try {
      this.gl.bindTexture(WebGLRenderingContext.TEXTURE_2D, this.glTexture)
      cb(new TextureUse(this.gl))
    } finally {
      this.gl.bindTexture(WebGLRenderingContext.TEXTURE_2D, null)
    }
  }

  public delete(): void {
    this.gl.deleteTexture(this.glTexture)
  }
}