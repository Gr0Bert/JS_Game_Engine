import {Vector3} from "./Vector3";

export class Matrix4x4 {
  public constructor(public data: number[]) {
  }

  public static identity(): Matrix4x4 {
    return new Matrix4x4([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ])
  }

  public static orthographic(left: number, right: number, bottom: number, top: number, nearClip: number, farClip: number): Matrix4x4 {
    const lr = 1.0 / (left - right)
    const bt = 1.0 / (bottom - top)
    const nf = 1.0 / (nearClip - farClip)

    return new Matrix4x4([
      -2.0 * lr, 0, 0, 0,
      0, -2.0 * bt, 0, 0,
      0, 0, 2.0 * nf, 0,
      (left + right) * lr, (top + bottom) * bt, (farClip + nearClip) * nf, 1
    ])
  }

  public toFloat32Array(): Float32Array {
    return new Float32Array(this.data)
  }

  public static translation(position: Vector3): Matrix4x4 {
    return new Matrix4x4([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      position.x, position.y, position.z, 1
    ])
  }
}
