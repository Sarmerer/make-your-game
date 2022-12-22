import { NewHTMLElement } from "./utils.js";

export class GameObject {
  constructor() {
    this.tags = [];

    this.el = null;
    this.didFirstDraw = false;

    this.immediateDraw = true;
    this.static = false;

    this.HTMLType = "div";
    this.elProps = {};

    this.activeDebuggers_ = {};
  }

  addTag(tag) {
    this.tags.push(tag);
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

    return this.el;
  }

  draw_() {
    for (const debugEntry of Object.values(this.activeDebuggers_)) {
      debugEntry.handler(debugEntry.element);
    }
  }

  draw() {
    this.draw_();
  }

  beforeCreated() {}

  created() {}

  update(game) {}

  destroy_() {
    this.beforeDestroyed();
    if (this.el) this.el.remove();
    this.destroyed();
  }

  beforeDestroyed() {}

  destroyed() {}

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

  get debuggers() {
    return [];
  }
}
