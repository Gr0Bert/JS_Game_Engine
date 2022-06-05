export class ImageAsset {
  public readonly height: number
  public readonly width: number

  public constructor(
    public readonly name: string,
    public readonly data: HTMLImageElement
  ) {
    this.width = data.width
    this.height = data.height
  }


  public static loadAsset(name: string): Promise<ImageAsset> {
    const image = new Image()

    return new Promise(resolve => {
      image.onload = () => {
        resolve(new ImageAsset(name, image))
      }
      image.src = name
    })
  }
}