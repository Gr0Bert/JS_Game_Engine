import {Vector3} from "../math/Vector3";

export class Sprite {
  private readonly data: number[]
  private position: Vector3 = new Vector3(200,0,0)

  public constructor(
    width: number,
    height: number
  ) {
    this.data = [
      0, 0, 0,
      0, height, 0,
      width, height, 0,
      width, height, 0,
      width, 0.0, 0,
      0.0, 0.0, 0,
    ]
  }

  public getData(): number[] {
    return this.data
  }

  public getPosition(): Vector3 {
    return this.position
  }
}
