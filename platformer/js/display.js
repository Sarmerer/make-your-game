class Display {
  constructor() {
    this.initialWidth = document.documentElement.clientWidth;
    this.initialHeight = document.documentElement.clientHeight;
    this.xScale = 1.0;
    this.yScale = 1.0;
    this.scaleChanged = false;

    this.buffer = document.createElement("div");
    this.buffer.id = "canvas";
    this.buffer.style.width = px(this.initialWidth);
    this.buffer.style.height = px(this.initialHeight);

    document.body.appendChild(this.buffer);
  }

  resize(width, height, whr) {
    let newWidth, newHeight;
    if (height / width > whr) {
      newWidth = width * whr;
      newHeight = width;
    } else {
      newWidth = height;
      newHeight = height / whr;
    }
    this.buffer.style.height = px(newWidth);
    this.buffer.style.width = px(newHeight);
    let newX = width / this.initialWidth;
    let newY = height / this.initialHeight;

    if (newX != this.xScale) {
      this.xScale = newX;
      this.scaleChanged = true;
    }
    if (newY != this.yScale) {
      this.yScale = newY;
      this.scaleChanged = true;
    }
  }

  get width() {
    return this.buffer.style.width;
  }
  get height() {
    return this.buffer.style.height;
  }
}
