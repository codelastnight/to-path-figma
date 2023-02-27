const vectorNetwork = {
    // The vertices of the triangle
    vertices: [
      { x: 0, y: 100 },
      { x: 100, y: 100 },
      { x: 50, y: 0 },
    ],
  
    // The edges of the triangle. 'start' and 'end' refer to indices in the vertices array.
    segments: [
      {
        start: 0,
        tangentStart: { x: 0, y: 0 }, // optional
        end: 1,
        tangentEnd: { x: 0, y: 0 }, // optional
      },
      {
        start: 1,
        end: 2,
      },
      {
        start: 2,
        end: 0,
      },
    ],
  
    // The loop that forms the triangle. Each loop is a
    // sequence of indices into the segments array.
    regions: [
      { windingRule: "NONZERO", loops: [[0, 1, 2]] }
    ],
  }