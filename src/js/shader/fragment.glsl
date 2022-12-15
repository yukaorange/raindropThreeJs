uniform sampler2D uTexture;

uniform float uProgress;
uniform float uTime;

varying vec2 vUv;

float Random11(float inputValue, float seed) {
  return fract(sin(inputValue * 345.456) * seed);
}

float Random21(vec2 inputValue, float seed) {
  return fract(sin(dot(inputValue, vec2(123.456, 43.12))) * seed);
}

vec2 Drops(vec2 uv, float seed) {

  float shiftY = Random11(0.5, seed);
  uv.y += shiftY;//Y軸に沿ってセルをずらす

  float cellsResolution = 20.;
  uv = uv * cellsResolution;//セルを増やす

  float rowIndex = floor(uv.y);//Y軸の数値＝行番号として取得
  float shiftX = Random11(rowIndex, seed);//ランダム行番号の・・・
  uv.x += shiftX;//セルをX軸に沿ってセルをずらす

  vec2 cellIndex = floor(uv);//セル番号
  vec2 cellUv = fract(uv);//セルのuv

  vec2 cellCenter = vec2(0.5);//0.5,0.5を代入
  float distanceFromCenter = distance(cellUv, cellCenter);//
  float isInsideDrop = 1.0 - step(0.1, distanceFromCenter);

  float isDropShown = step(0.8, Random21(cellIndex, seed + 14244.324));

  float dropIntensity = 1. - fract(uTime * 0.1 + Random21(cellIndex, seed + 32132.432) * 2.0) * 2.0;
  dropIntensity = sign(dropIntensity) * abs(dropIntensity * dropIntensity * dropIntensity * dropIntensity);
  dropIntensity = clamp(dropIntensity, 0., 1.);

  vec2 vecToCenter = normalize(cellCenter - cellUv);
  vec2 dropValue = vecToCenter * distanceFromCenter * distanceFromCenter * 40.0;

  vec2 drop = dropValue * isDropShown * dropIntensity * isInsideDrop;

  return drop;
}

void main() {
  vec2 uv = vUv;
  // uv.x = fract(uv.x + uTime);
  vec2 drops = vec2(0.0);
  for(int i = 0; i < 2; i++) {
    drops += Drops(uv, 42424.43 + float(i) * 12313.432);
  }
  uv += drops;
  vec4 textureColor = texture2D(uTexture,uv);
  gl_FragColor = vec4(textureColor);
}