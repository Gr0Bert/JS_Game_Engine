import {getTypeSize} from "./conversions";

export type AttributeSize = 1 | 2 | 3 | 4

export class AttributeInfo {
  public typeSize: number

  public constructor(
    // location of this attribute
    public location: number,
    // number of elements in this attribute (i.e. vec3 = 3)
    public size: AttributeSize,
    // number of elements from beginning of the buffer
    public offset: number,
    public dataType: number,
    public normalized: boolean = false
  ) {
    const typeSize = getTypeSize(dataType)
    if (typeSize) {
      this.typeSize = typeSize
    } else {
      throw new Error(`Unrecognized data type ${dataType.toString()}`)
    }
  }
}
