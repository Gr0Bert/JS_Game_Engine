import {TextureUse} from "./TextureResource";
import {Color} from "./Color";

export class Material {
  public constructor(
    public name: string,
    public diffuseTexture: TextureUse,
    public tint: Color,
  ) {
  }
}