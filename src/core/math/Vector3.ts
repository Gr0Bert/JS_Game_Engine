export class Vector3 {
  public constructor(
    public readonly x: number = 0,
    public readonly y: number = 0,
    public readonly z: number = 0,
  ) {}

  public toArray(): [number, number, number] {
    return [this.x, this.y, this.z]
  }

  public toFloat32Array(): Float32Array {
    return new Float32Array(this.toArray())
  }
}
