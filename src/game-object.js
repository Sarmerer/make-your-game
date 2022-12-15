import { NewHTMLElement } from "./utils.js";

export class GameObject {
  constructor() {
    this.el = null;
    this.didFirstDraw = false;

    this.immediateDraw = true;
    this.static = false;

    this.HTMLType = "div";
    this.elProps = {};

    this.debuggers = {};
    this.activeDebuggers_ = {};
  }

  setStatic(isStatic) {
    this.static = isStatic;
  }

  setImmediateDraw(immediateDraw) {
    this.immediateDraw = immediateDraw;
  }

  setHTMLType(HTMLElementType) {
    this.HTMLType = HTMLElementType;
  }

  setBaseElProps(CSSProps) {
    this.elProps = CSSProps;
  }

  create_() {
    this.beforeCreated();
    this.el = NewHTMLElement(this.HTMLType, this.elProps);

    this.created();

    if (this.immediateDraw) {
      this.draw_();
    }
  }

  draw_() {
    if (this.static && this.didFirstDraw) return;
    this.update();

    for (const debugEntry of Object.values(this.activeDebuggers_)) {
      debugEntry.handler(debugEntry.element);
    }
  }

  beforeCreated() {}

  created() {}

  update() {}

  addDebugger_(name, handler, element) {
    if (this.activeDebuggers_[name]) return null;
    this.activeDebuggers_[name] = { handler, element };
    return this.activeDebuggers_[name];
  }

  removeDebugger_(name) {
    if (!this.activeDebuggers_[name]) return false;
    this.activeDebuggers_[name].element.remove();
    delete this.activeDebuggers_[name];
    return true;
  }

  getDebugElements_() {
    return Object.values(this.activeDebuggers_).map((d) => d.element);
  }

  debugEnable_() {
    for (const debuggerEntry of this.debuggers) {
      const element = NewHTMLElement("div", debuggerEntry.element);
      this.addDebugger_(
        debuggerEntry.name,
        debuggerEntry.handler.bind(this),
        element
      );
      this.debugEnabled(debuggerEntry.name);
    }
    return this.getDebugElements_();
  }

  debugDisable_() {
    for (const debuggerName of Object.keys(this.activeDebuggers_)) {
      this.removeDebugger_(debuggerName);
      this.debugDisabled(debuggerName);
    }
  }

  debugEnabled(name) {}

  debugDisabled(name) {}
}
