const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [ 1080, 1080 ]
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    context.fillStyle = 'white';

    const cx = width  * 1.1;
    const cy = height * 0.8;
    const w = width  * 0.01;
    const h = height * 0.1;

    const num = 48;
    const radius = width * 0.5;

    for (let i = 0; i < num; i++) {
      const slice = math.degToRad(360 / num);
      const angle = slice * i;

      const x = radius * Math.sin(angle) + cx;
      const y = radius * Math.cos(angle) + cy;

      // Rectangles
      context.save();
      context.translate(x, y);
      context.rotate(-angle);
      context.scale(random.range(0.1, 2), random.range(0.1, 0.5));
  
      context.beginPath();
      context.rect(-w * 0.5, random.range(0, -h * 0.5), w, h);
      context.fill();
      context.restore();

      if (i % 2 == 0) {
        context.save();
        context.translate(x * 0.8, y * 0.8);
        context.rotate(-angle);
        context.scale(random.range(0.1, 2), random.range(0.1, 0.5));
    
        context.beginPath();
        context.rect(-w * 0.5, random.range(0, -h * 0.5), w, h);
        context.fill();
        context.restore();
      }

      // Arcs
      context.save();
      context.translate(cx, cy);
      context.rotate(-angle);
  
      context.lineWidth = random.range(2, 20);

      context.beginPath();
      context.strokeStyle = 'white'
      context.arc(0,0, radius * random.range(0.7, 1.3), slice * random.range(1, -8), slice * random.range(1, 5));
      context.stroke();
      context.restore();


      context.save();
      context.translate(width * 0.25, height * 0.4);
      context.rotate(-angle);
  
      context.lineWidth = random.range(0.2, 1);

      context.beginPath();
      context.strokeStyle = 'white'
      context.arc(0,0, radius * 0.1 * random.range(0.7, 1.3), slice * random.range(1, -8), slice * random.range(1, 5));
      context.stroke();
      context.restore();

    }


    // context.translate(100, 400);
    // context.beginPath();
    // context.arc(0,0, 50, 0, Math.PI * 2);
    // context.fill();
  };
};

canvasSketch(sketch, settings);
