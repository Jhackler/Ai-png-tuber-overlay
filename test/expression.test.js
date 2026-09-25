'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const {
  detectExpression,
  parseIFacialMocap,
  parseVTubeStudio,
} = require('../lib/expression');

test('a strong smile is happy', () => {
  const result = detectExpression({
    CheekSquintLeft: 80,
    CheekSquintRight: 80,
    MouthSmileLeft: 70,
    MouthSmileRight: 70,
  });
  assert.equal(result.expression, 'happy');
});

test('closed eyes beat a smile', () => {
  const result = detectExpression({
    EyeBlinkLeft: 90,
    EyeBlinkRight: 90,
    MouthSmileLeft: 80,
    MouthSmileRight: 80,
  });
  assert.equal(result.expression, 'eyes_closed');
});

test('a quiet face stays neutral', () => {
  assert.equal(detectExpression({}).expression, 'neutral');
});

test('iFacial values stay on the 0-100 scale', () => {
  const shapes = parseIFacialMocap(Buffer.from('mouthSmile_L-40|eyeBlink_L-10=head|rx#1'));
  assert.equal(shapes.mouthSmile_L, 40);
  assert.equal(shapes.eyeBlink_L, 10);
  assert.equal(shapes.rx, undefined);
});

test('VTS 0-1 blendshapes scale to 0-100', () => {
  const packet = Buffer.from(JSON.stringify({
    FaceFound: true,
    BlendShapes: [{ k: 'MouthSmileLeft', v: 0.5 }],
  }));
  assert.equal(parseVTubeStudio(packet).MouthSmileLeft, 50);
});

test('VTS with no face returns null', () => {
  const packet = Buffer.from(JSON.stringify({ FaceFound: false, BlendShapes: [{ k: 'JawOpen', v: 1 }] }));
  assert.equal(parseVTubeStudio(packet), null);
});

test('a non-JSON VTS packet falls back to iFacial', () => {
  const shapes = parseVTubeStudio(Buffer.from('jawOpen-30|='));
  assert.equal(shapes.jawOpen, 30);
});
