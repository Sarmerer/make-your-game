class Display {
  constructor() {
    this.nativeWidth = 1280;
    this.nativeHeight = 720;
    this.aspectRatio = this.nativeWidth / this.nativeHeight;

    this.width = this.nativeWidth;
    this.height = this.nativeHeight;
    this.scale = 1.0;
    this.prevScale = 1.0;

    this.buffer = NewHTMLElement("div", {
      id: "canvas",
      style: {
        width: px(this.width),
        height: px(this.height),
        position: "absolute",
      },
    });

    document.body.prepend(this.buffer);
  }

  resize() {
    let deviceWidth = document.documentElement.clientWidth;
    let deviceHeight = document.documentElement.clientHeight;
    let deviceAspectRatio = deviceWidth / deviceHeight;

    if (deviceAspectRatio < this.aspectRatio) {
      this.height = deviceWidth / this.aspectRatio;
      this.width = deviceWidth;
    } else {
      this.height = deviceHeight;
      this.width = deviceHeight * this.aspectRatio;
    }

    this.prevScale = this.scale;
    this.scale = deviceAspectRatio / this.aspectRatio;

    this.buffer.style.width = px(this.width);
    this.buffer.style.height = px(this.height);
  }
}
