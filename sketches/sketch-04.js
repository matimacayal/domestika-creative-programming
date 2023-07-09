const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');
const Tweakpane = require('tweakpane');

const settings = {
  dimensions: [ 1080, 1080 ],
  // dimensions: [ 2040, 2040 ],
  animate: true
};

const params = {
  cols: 10,
  rows: 10,
  scaleMin: 1,
  scaleMax: 30,
  freq: 0.001,
  amp: 0.2,
  speed: 15,
}

const sketch = () => {


  return ({ context, width, height, frame }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    const rows = params.cols;
    const cols = params.rows;
    const numCells = cols * rows;

    const gridw = width  * 0.8;
    const gridh = height * 0.8;
    const cellw = gridw / cols;
    const cellh = gridh / rows;

    const margx = (width  - gridw) * 0.5;
    const margy = (height - gridh) * 0.5;

    for (let i = 0; i < numCells; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);

      const x = cellw * col;
      const y = cellh * row;
      const w = cellw * 0.8;
      const h = cellh * 0.8;

      // const n = random.noise2D(-x + frame * 15, -y, 0.001);
      // const n = random.noise2D(-x + frame * params.speed, y, params.freq);
      const n = random.noise3D(x, y, frame * params.speed, params.freq);
      const angle = - n * Math.PI * params.amp;
      // const radius = 0.3 * cellw * (n + 1);

      // const scale = (n + 1) / 2 * 30;
      // const scale = (n * 0.5 + 0.5 ) * 30;
      const scale = math.mapRange(n, -1, 1, params.scaleMin, params.scaleMax);

      context.save();
      context.translate(x,y);
      context.translate(margx, margy);
      context.translate(cellw * 0.5, cellh * 0.5);
      context.rotate(angle);

      context.lineWidth = scale;

      context.beginPath();
      context.moveTo(w * -0.5, 0);
      context.lineTo(w *  0.5, 0);
      context.stroke();
      context.restore();

      // context.beginPath();
      // context.arc(0, 0, radius, 0, Math.PI * 2);
      // context.fillStyle = 'black';
      // context.fill();
      // context.restore();

    }
  };
};

const createPane = () => {
  const pane = new Tweakpane.Pane();
  let folder;
  folder = pane.addFolder({title: 'Grid'});
  folder.addInput(params, 'cols', { min: 2, max: 50, step: 1 });
  folder.addInput(params, 'rows', { min: 2, max: 50, step: 1 });
  folder.addInput(params, 'scaleMin', { min: 1, max: 100 });
  folder.addInput(params, 'scaleMax', { min: 1, max: 100 });

  folder = pane.addFolder({ title: 'Noise' });
  folder.addInput(params, 'freq', { min: -0.01, max: 0.01});
  folder.addInput(params, 'amp', { min: 0, max: 1});
  folder.addInput(params, 'speed', { min: 0, max: 80});
};

createPane();
canvasSketch(sketch, settings);
