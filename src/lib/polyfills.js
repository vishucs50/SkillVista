// Ensure web standards needed by pdfjs-dist / pdf-parse exist in serverless Node.js environments.
if (typeof globalThis.DOMMatrix === "undefined") {
  globalThis.DOMMatrix = class DOMMatrix {
    constructor(init) {
      if (Array.isArray(init)) {
        this.a = init[0] ?? 1;
        this.b = init[1] ?? 0;
        this.c = init[2] ?? 0;
        this.d = init[3] ?? 1;
        this.e = init[4] ?? 0;
        this.f = init[5] ?? 0;
      } else {
        this.a = 1;
        this.b = 0;
        this.c = 0;
        this.d = 1;
        this.e = 0;
        this.f = 0;
      }
      this.m11 = this.a;
      this.m12 = this.b;
      this.m13 = 0;
      this.m14 = 0;
      this.m21 = this.c;
      this.m22 = this.d;
      this.m23 = 0;
      this.m24 = 0;
      this.m31 = 0;
      this.m32 = 0;
      this.m33 = 1;
      this.m34 = 0;
      this.m41 = this.e;
      this.m42 = this.f;
      this.m43 = 0;
      this.m44 = 1;
      this.is2D = true;
      this.isIdentity =
        this.a === 1 &&
        this.b === 0 &&
        this.c === 0 &&
        this.d === 1 &&
        this.e === 0 &&
        this.f === 0;
    }
    transformPoint(point = { x: 0, y: 0 }) {
      return {
        x: point.x * this.a + point.y * this.c + this.e,
        y: point.x * this.b + point.y * this.d + this.f,
      };
    }
  };
}

export {};

