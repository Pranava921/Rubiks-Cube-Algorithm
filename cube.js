class RubiksCube {
  constructor() {
    this.faces = {
      U: Array(9).fill('white'),
      D: Array(9).fill('yellow'),
      F: Array(9).fill('green'),
      B: Array(9).fill('blue'),
      L: Array(9).fill('orange'),
      R: Array(9).fill('red'),
    };
    this.history = [];
    this.manualMoves=[];
    this.render();
  }

  rotateFace(face, direction = 'CW', isManual =false, skipRender = false) {
  const old = [...this.faces[face]];
  const rotateCW = [6, 3, 0, 7, 4, 1, 8, 5, 2];
  const rotateCCW = [2, 5, 8, 1, 4, 7, 0, 3, 6];
  const map = direction === 'CW' ? rotateCW : rotateCCW;

  this.faces[face] = map.map(i => old[i]);
   const adjacent = {
    F: [['U', 6, 7, 8], ['R', 0, 3, 6], ['D', 2, 1, 0], ['L', 8, 5, 2]],
    B: [['U', 2, 1, 0], ['L', 0, 3, 6], ['D', 6, 7, 8], ['R', 8, 5, 2]],
    U: [['B', 2, 1, 0], ['R', 2, 1, 0], ['F', 2, 1, 0], ['L', 2, 1, 0]],
    D: [['F', 6, 7, 8], ['R', 6, 7, 8], ['B', 6, 7, 8], ['L', 6, 7, 8]],
    L: [['U', 0, 3, 6], ['F', 0, 3, 6], ['D', 0, 3, 6], ['B', 8, 5, 2]],
    R: [['U', 8, 5, 2], ['B', 0, 3, 6], ['D', 8, 5, 2], ['F', 8, 5, 2]]
  };

  if (adjacent[face]) {
    const strips = adjacent[face].map(([f, i1, i2, i3]) =>
      [this.faces[f][i1], this.faces[f][i2], this.faces[f][i3]]
    );

    if (direction === 'CCW') strips.unshift(strips.pop());
    else strips.push(strips.shift());

    adjacent[face].forEach(([f, i1, i2, i3], idx) => {
      [this.faces[f][i1], this.faces[f][i2], this.faces[f][i3]] = strips[idx];
    });
  }
  if (isManual) this.manualMoves.push(`Rotate ${face} ${direction}`);
  else this.history.push(`Rotate ${face} ${direction}`);
  console.log(`Rotated ${face} ${direction}`);
  if (!skipRender) this.render();
}


  scramble(moves = 10) {
    const faces = ['F', 'B', 'U', 'D', 'L', 'R'];
    const dirs = ['CW', 'CCW'];
    for (let i = 0; i < moves; i++) {
      const f = faces[Math.floor(Math.random() * faces.length)];
      const d = dirs[Math.floor(Math.random() * dirs.length)];
      this.rotateFace(f, d,true);
    }
    // alert('Cube scrambled!');
    this.render();
  }

  getCubeSvg() {
    const size = 50;
    const colors = {
      white: '#fff', yellow: '#ff0', green: '#0f0',
      blue: '#00f', orange: '#ffa500', red: '#f00'
    };
    const svg = [`<svg width="600" height="600">`];

    // for (const [face, stickers] of Object.entries(this.faces)) {
    //   const [ox, oy] = positions[face];
    //   stickers.forEach((color, i) => {
    //     const x = ox + (i % 3);
    //     const y = oy + Math.floor(i / 3);
    //     svg += `<rect x="${x * size}" y="${y * size}" width="${size}" height="${size}" fill="${colors[color]}" stroke="#000"/>`;
    //   });
    // }
    const drawFace = (face, offsetX, offsetY) => {
            this.faces[face].forEach((color, i) => {
                const x = offsetX + (i % 3) * size;
                const y = offsetY + Math.floor(i / 3) * size;
                svg.push(`<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="${colors[color]}" stroke="black"/>`);
            });
        };

        // Adjust layout for 2D net
        drawFace('U', 150, 0);
        drawFace('L', 0, 150);
        drawFace('F', 150, 150);
        drawFace('R', 300, 150);
        drawFace('B', 450, 150);
        drawFace('D', 150, 300);

    svg.push('</svg>');
    return svg.join('');
  }

  render() {
    const container = document.getElementById("cube-container");
    container.innerHTML = this.getCubeSvg();
  }

    // solve() {
    // if (this.history.length === 0) {
    //     alert("Cube is already solved or scramble history not found.");
    //     return;
    // }

    // alert("Solving in reverse steps...");
    // const reverseSteps = [...this.history].reverse();

    // reverseSteps.forEach(step => {
    //     const [_, face, direction] = step.split(" ");
    //     const opposite = direction === 'CW' ? 'CCW' : 'CW';
    //     this.rotateFace(face, opposite);
    // });

    // alert("Cube solved!");
    // this.history = []; // Clear history after solving
    // }
    solve() {
    const allSteps = [...this.manualMoves, ...this.history].reverse();
    let i = 0;

      const interval = setInterval(() => {
        if (i >= allSteps.length) {
          clearInterval(interval);
          alert("Cube solved!");
          this.manualMoves = [];
          this.history = [];
          return;
        }

      const [_, face, direction] = allSteps[i].split(" ");
      const opposite = direction === 'CW' ? 'CCW' : 'CW';
      this.rotateFace(face, opposite);
      i++;
    }, 1000); // Adjust timing as needed
}


}

const cube = new RubiksCube();
