const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');

const settings = {
  dimensions: [1080, 1080],
  animate: true,
};

// In the backgroud canvas-sketch uses this to make the animation
// the function that is called is the 'return ({ context, width, height }) => {' ...
// const animate = () => {
//   console.log('frame');
//   requestAnimationFrame(animate);
// }
// animate();

// 290 particles of radius 20 is kind of the limit for how much
//  particles can be created without overlaping in a reasonable time

const sketch = ({ context, width, height }) => {
  let particles = [];
  const total = 250;
  const radius = 20;
  const speed = 3;

  // const total = 4;
  // const radius = 150;
  // const speed = 10;



  for (let i = 0; i < total; i++) {
    let x = random.range(radius, width - radius)
    let y = random.range(radius, height - radius)

    // Make sure new particle doesn't overlap over already created ones
    for (let j = 0; j < particles.length; j++) {
      if (particles[j].pos.getDistance(x, y) <= 2 * radius + 12) {
        console.log("generated overlaped particle");

        x = random.range(radius, width - radius)
        y = random.range(radius, height - radius)

        j = -1;
      }
    }

    particles.push(new Particle(x, y, radius, speed))
  }


  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.strokeStyle = 'black'
    context.lineWidth = 5
    context.fillRect(0, 0, width, height);
    context.beginPath();
    context.rect(0, 0, width, height);
    context.stroke();

    for (let i = 0; i < particles.length; i++) {
      const particle = particles[i];

      // Checks collissions with all particles no calculated yet
      for (let j = i + 1; j < particles.length; j++) {
        const other = particles[j];

        const dist = particle.pos.getDistance(other.pos.x, other.pos.y);

        if (dist > 2 * radius) continue;
        // console.log("collided");

        const v1x = particle.vel.x;
        const v1y = particle.vel.y;
        const v2x = other.vel.x;
        const v2y = other.vel.y;

        const dVX = v1x - v2x;
        const dVY = v1y - v2y;

        const dx = particle.pos.x - other.pos.x;
        const dy = particle.pos.y - other.pos.y;

        // Prevents overlaped particles to become stuck with each other
        // Detects if they are moving towards each other or not
        if (dVX * dx + dVY * dy >= 0) {
          console.log("stuck");
          continue;
        }

        particle.vel.x = v2x;
        particle.vel.y = v2y;
        other.vel.x = v1x;
        other.vel.y = v1y;
      }

      // Bounce on walls
      if (particle.pos.x - particle.radius <= 0 || particle.pos.x + particle.radius >= height) particle.vel.x *= -1;
      if (particle.pos.y - particle.radius <= 0 || particle.pos.y + particle.radius >= height) particle.vel.y *= -1;

      // Refract on wall
      // if (particle.pos.x > width)  particle.pos.x = 0;
      // if (particle.pos.x < 0)      particle.pos.x = width;
      // if (particle.pos.y > height) particle.pos.y = 0;
      // if (particle.pos.y < 0)      particle.pos.y = height;
    }

    // const point = {x: 800, y: 400, radius: 10};
    // context.fillStyle = 'black';
    particles.forEach(particle => {
      particle.update();
      // particle.bounce(width, height);
      // particle.reappear(width, height);
      particle.draw(context);
    })
  };
};

canvasSketch(sketch, settings);

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  getDistance(vx, vy) {
    const dx = this.x - vx;
    const dy = this.y - vy;
    return Math.sqrt(dx * dx + dy * dy);
  }
}

class Particle {
  constructor(x, y, r, vel) {
    this.pos = new Vector(x, y);
    this.vel = new Vector(vel * random.range(-1, 1), vel * random.range(-1, 1));
    this.radius = r; // 11.5;  // random.range(4, 12);
    this.color = 'lightblue'
    if (random.range(0, 1) < 0.15) this.color = 'blue';


  }

  bounce(width, height) {
    if (this.pos.x + this.radius > width || this.pos.x - this.radius < 0) this.vel.x *= -1;
    if (this.pos.y + this.radius > height || this.pos.y - this.radius < 0) this.vel.y *= -1;
  }

  reappear(width, height) {
    if (this.pos.x > width) this.pos.x = 0
    if (this.pos.x < 0) this.pos.x = width
    if (this.pos.y > height) this.pos.y = 0
    if (this.pos.y < 0) this.pos.y = height
  }

  update() {
    // this.vel.x *= 0.99
    // this.vel.y *= 0.99
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
  }

  draw(context) {
    context.save()
    context.translate(this.pos.x, this.pos.y)
    // context.fillStyle = this.color;
    context.strokeStyle = this.color;
    context.lineWidth = 4
    context.beginPath();
    context.arc(0, 0, this.radius, 0, Math.PI * 2);
    // context.fill();
    context.stroke();
    context.restore();
  }
}
