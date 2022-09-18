
export class Vector2 {
  x;
  y;
  
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  getTxt() {
    return `${this.x}, ${this.y}`;
  }

  getReverse() {
    return new Vector2(-this.x, -this.y);
  }

  vectorTo(relVect) {
    return new Vector2(relVect.x - this.x, relVect.y - this.y);
  }

  vectorFrom(relVect) {
    return new Vector2(this.x - relVect.x, this.y - relVect.y);
  }

  addVector(vector) {
    return new Vector2(this.x + vector.x, this.y + vector.y);
  }

  getScaledVector(scaleFactor) {
    return new Vector2(this.x * scaleFactor, this.y * scaleFactor);
  }

  getUnitVector() {
    const mag = this.getMag();
    return new Vector2(this.x / mag, this.y / mag);
  }

  getMag() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }

  // Positive angle means clockwise, negative anticlockwise.
  getRotatedVector(angle, rotOrigin = new Vector2(0, 0)) {
    const rotVec = new Vector2(this.x, this.y);

    const sinA = Math.sin(angle);
    const cosA = Math.cos(angle);

    // Translate point back to origin.
    rotVec.x -= rotOrigin.x;
    rotVec.y -= rotOrigin.y;

    // Rotate point.
    const xNew = rotVec.y * sinA + rotVec.x * cosA;
    const yNew = rotVec.y * cosA - rotVec.x * sinA;

    // Translate point back.
    rotVec.x = xNew + rotOrigin.x;
    rotVec.y = yNew + rotOrigin.y;
    return rotVec;
  }
}