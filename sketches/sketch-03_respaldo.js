const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random')

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true
};

// In the backgroud canvas-sketch uses this to make the animation
// the function that is called is the 'return ({ context, width, height }) => {' ...
// const animate = () => {
//   console.log('frame');
//   requestAnimationFrame(animate);
// }
// animate();

const sketch = ({context, width, height }) => {
  const agents = [];

  for (let i = 0; i < 40; i++) { 
    const x = random.range(0, width)
    const y = random.range(0, height)
    agents.push(new Agent(x, y))
  } 

  
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    for (let i = 0; i < agents.length; i++) {
      const agent = agents[i];
      for (let j = 0; j < agents.length; j++) {
        const other = agents[j];

        context.beginPath();
        context.moveTo(agent.pos.x, agent.pos.y);
        context.lineTo(other.pos.x, other.pos.y);
	      context.lineWidt = 1;
        context.stroke();
      }
    }

    // const point = {x: 800, y: 400, radius: 10};
    context.fillStyle = 'black';
    agents.forEach(agent => {
      agent.update();
      agent.bounce(width, height)
      agent.draw(context)
    })
  };
};

canvasSketch(sketch, settings);

class Vector {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
  }
}

class Agent {
  constructor(x, y) {
    this.pos = new Vector(x, y);
    this.vel = new Vector(random.range(-1,1), random.range(-1,1));
    this.radius = 8;  // random.range(4, 12);

  }

  bounce(width, height) {
    if (this.pos.x > width  || this.pos.x < 0) this.vel.x *= -1
    if (this.pos.y > height || this.pos.y < 0) this.vel.y *= -1 
  }

  update() {
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
  }

  draw(context) {
    context.save()
    context.translate(this.pos.x, this.pos.y)
    // context.fillStyle = 'black';
    context.fillStroke = 'black'
    context.lineWidth = 4
    context.beginPath();
    context.arc(0, 0, this.radius, 0, Math.PI * 2);
    // context.fill();
    context.stroke();
    context.restore();
  }
}
