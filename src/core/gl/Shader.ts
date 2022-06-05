import {AttributeInfo} from "./AttributeInfo";

export class VertexShaderSource {
  public constructor(public readonly source: string, public readonly attributes: AttributeInfo[]) {
  }
}

export class FragmentShaderSource {
  public constructor(public readonly source: string) {
  }
}
