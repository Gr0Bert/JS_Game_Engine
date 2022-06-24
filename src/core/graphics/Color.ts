export class Color {
  public constructor(
    public r: number = 255,
    public g: number = 255,
    public b: number = 255,
    public a: number = 255,
  ) {

  }

  public toArray(): number[] {
    return [this.r, this.g, this.b, this.a]
  }

  public toFloatArray(): number[] {
    return [this.r / 255.0, this.g / 255.0, this.b / 255.0, this.a / 255.0]
  }

  public toFloat32Array(): Float32Array {
    return new Float32Array(this.toFloatArray())
  }

  public static white(): Color {
    return new Color(255, 255, 255, 255)
  }

  public static black(): Color {
    return new Color(0, 0, 0, 255)
  }

  public static red(): Color {
    return new Color(255, 0, 0, 255)
  }

  public static green(): Color {
    return new Color(0, 255, 0, 255)
  }

  public static blue(): Color {
    return new Color(0, 0, 255, 255)
  }
}