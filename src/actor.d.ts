export class Actor {
  constructor(x: number, y: number, width: number, height: number);

  private _x: number;
  private _y: number;

  private _width: number;
  private _height: number;

  private _xVel: number;
  private _yVel: number;

  private _direction: number;

  private _div: HTMLDivElement;

  get x(): number;
  set x(x: number);
	get y(): number;
	set y(y: number);
	get width(): number;
	set width(width: number);
	get height(): number;
	set height(height: number);
	get xv(): number;
	set xv(xv: number);
	get yv(): number;
	set yv(yv: number);
	get direction(): number;
	set direction(direction: number);
	get div(): HTMLDivElement;
	set div(div: HTMLDivElement);
	

  draw(): void;
  oppositeDirection(direction: number): number;
}
