// CLIFFORD ATTRACTOR SHADER

uniform float Time;

// The number of shapes that the clifford attractor will merge between. 
#define NUMSHAPES 3

void main() {

  // Constants were hand picked to produce meaningful shapes. Can be altered to produce unique results.
  const float aInit[NUMSHAPES] = float[](1.0, 2.53, -1.54);
  const float bInit[NUMSHAPES] = float[](2.0, 1.67, 4.21);
  const float cInit[NUMSHAPES] = float[](4.36, 1.26, 1.53);
  const float dInit[NUMSHAPES] = float[](-3.0, 2.24, 1.04);

  // How fast to merge between different shapes.
  float cycleTime = 3.;

  float stage = mod(Time/20., cycleTime);

  // Current parameter values.
  float a, b, c, d;

  int mixStart, mixEnd;

  // Mix between first and second shape.
  if(stage < (cycleTime / float(NUMSHAPES))) {
    // Start at shape 1, transform to shape 2.
    mixStart = 1;
    mixEnd = 2;
  } else if (stage < 2. * (cycleTime / float(NUMSHAPES))) {
    mixStart = 2;
    mixEnd = 3;
  } else {
    mixStart = 3;
    mixEnd = 1;
  }

  a = mix(aInit[mixStart], aInit[mixEnd],  mod(stage, (cycleTime / float(NUMSHAPES))));
  b = mix(bInit[mixStart], bInit[mixEnd],  mod(stage, (cycleTime / float(NUMSHAPES))));
  c = mix(cInit[mixStart], cInit[mixEnd],  mod(stage, (cycleTime / float(NUMSHAPES))));
  d = mix(dInit[mixStart], dInit[mixEnd],  mod(stage, (cycleTime / float(NUMSHAPES))));

  gl_PointSize = 0.5;

  // Find pixel coordinates.
  float x = mod(gl_VertexID, 25.);
  float y = floor(gl_VertexID/ 25.);
  
  float tmpX;
  float tmpY;
  
  for (int i = 0; i < 5; i++) {
    // Store previous values of X and Y for future calculation.
    tmpX = x; tmpY = y;
    // The actual clifford attractor formula. See here for more information: https://blbadger.github.io/clifford-attractor.html.
    x = (sin(a * tmpY) - cos(b * tmpX));
    y = (sin(c * tmpX) - cos(d * tmpY));
  }
  
  gl_Position = vec4(x / 5., y / 5., 0., 0.7);
}