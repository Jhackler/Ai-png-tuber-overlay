'use strict';

const DEFAULT_THRESHOLDS = {
  smile: 20,
  frown: 25,
  surprised: 25,
  eyesClosed: 55,
};

function detectExpression(blendShapes, thresholds = DEFAULT_THRESHOLDS) {
  const shapes = blendShapes || {};
  const limits = thresholds || DEFAULT_THRESHOLDS;
  const get = (...names) => {
    for (const name of names) {
      if (shapes[name] !== undefined) return shapes[name];
    }
    return 0;
  };

  const eyeBlinkL = get('EyeBlinkLeft', 'eyeBlink_L', 'eyeBlinkLeft');
  const eyeBlinkR = get('EyeBlinkRight', 'eyeBlink_R', 'eyeBlinkRight');
  const eyeSquintL = get('EyeSquintLeft', 'eyeSquint_L', 'eyeSquintLeft');
  const eyeSquintR = get('EyeSquintRight', 'eyeSquint_R', 'eyeSquintRight');
  const eyeWideL = get('EyeWideLeft', 'eyeWide_L', 'eyeWideLeft');
  const eyeWideR = get('EyeWideRight', 'eyeWide_R', 'eyeWideRight');

  const browDownL = get('BrowDownLeft', 'browDown_L', 'browDownLeft');
  const browDownR = get('BrowDownRight', 'browDown_R', 'browDownRight');
  const browInnerUp = get('BrowInnerUp', 'browInnerUp', 'browInner_Up');
  const browOuterL = get('BrowOuterUpLeft', 'browOuterUp_L', 'browOuterUpLeft');
  const browOuterR = get('BrowOuterUpRight', 'browOuterUp_R', 'browOuterUpRight');

  const cheekSquintL = get('CheekSquintLeft', 'cheekSquint_L', 'cheekSquintLeft');
  const cheekSquintR = get('CheekSquintRight', 'cheekSquint_R', 'cheekSquintRight');

  const mouthSmileL = get('MouthSmileLeft', 'mouthSmile_L', 'mouthSmileLeft');
  const mouthSmileR = get('MouthSmileRight', 'mouthSmile_R', 'mouthSmileRight');
  const mouthFrownL = get('MouthFrownLeft', 'mouthFrown_L', 'mouthFrownLeft');
  const mouthFrownR = get('MouthFrownRight', 'mouthFrown_R', 'mouthFrownRight');
  const jawOpen = get('JawOpen', 'jawOpen', 'jaw_Open');
  const mouthFunnel = get('MouthFunnel', 'mouthFunnel', 'mouth_Funnel');

  const eyesClosed = (eyeBlinkL + eyeBlinkR) / 2;
  const cheekSquint = (cheekSquintL + cheekSquintR) / 2;
  const eyeSquint = (eyeSquintL + eyeSquintR) / 2;
  const mouthSmile = (mouthSmileL + mouthSmileR) / 2;
  const smile = (cheekSquint * 0.45) + (eyeSquint * 0.35) + (mouthSmile * 0.20);

  const browDown = (browDownL + browDownR) / 2;
  const mouthFrown = (mouthFrownL + mouthFrownR) / 2;
  const frown = (browDown * 0.40) + (browInnerUp * 0.30) + (mouthFrown * 0.30);

  const eyeWide = (eyeWideL + eyeWideR) / 2;
  const browUp = ((browOuterL + browOuterR) / 2 + browInnerUp) / 2;
  const surprised = (eyeWide * 0.35) + (jawOpen * 0.35) + (browUp * 0.15) + (mouthFunnel * 0.15);

  if (eyesClosed > limits.eyesClosed) {
    return { expression: 'eyes_closed', confidence: eyesClosed, smile, frown, surprised, eyesClosed };
  }
  if (surprised > limits.surprised && surprised > smile && surprised > frown) {
    return { expression: 'surprised', confidence: surprised, smile, frown, surprised, eyesClosed };
  }
  if (smile > limits.smile && smile > frown) {
    return { expression: 'happy', confidence: smile, smile, frown, surprised, eyesClosed };
  }
  if (frown > limits.frown && frown > smile) {
    return { expression: 'sad', confidence: frown, smile, frown, surprised, eyesClosed };
  }
  return { expression: 'neutral', confidence: 100, smile, frown, surprised, eyesClosed };
}

function parseIFacialMocap(data) {
  const str = data.toString('utf-8').trim();
  const blendShapes = {};
  const mainPart = str.split('=')[0];
  if (!mainPart) return blendShapes;

  const parts = mainPart.split('|');
  for (const part of parts) {
    if (!part || part.includes('#')) continue;
    const dashIdx = part.lastIndexOf('-');
    if (dashIdx > 0) {
      const name = part.substring(0, dashIdx);
      const value = parseFloat(part.substring(dashIdx + 1));
      if (!isNaN(value) && name.length > 0) {
        blendShapes[name] = value;
      }
    }
  }
  return blendShapes;
}

function parseVTubeStudio(data) {
  try {
    const json = JSON.parse(data.toString('utf-8'));
    const faceFound = json.FaceFound ?? json.faceFound;
    if (faceFound === false) return null;

    const rawBS = json.BlendShapes || json.blendShapes;
    if (rawBS && typeof rawBS === 'object') {
      const bs = {};
      if (Array.isArray(rawBS)) {
        for (const item of rawBS) {
          const key = item.k ?? item.key ?? item.name ?? item.K;
          const val = item.v ?? item.value ?? item.V ?? 0;
          if (key !== undefined && key !== null) {
            const numVal = typeof val === 'number' ? val : parseFloat(val) || 0;
            bs[key] = numVal <= 1.0 ? numVal * 100 : numVal;
          }
        }
      } else {
        for (const [key, val] of Object.entries(rawBS)) {
          bs[key] = typeof val === 'number' && val <= 1.0 ? val * 100 : parseFloat(val) || 0;
        }
      }
      if (Object.keys(bs).length > 0) return bs;
    }

    if (faceFound !== undefined) {
      console.log('[vts-parser] FaceFound but no BlendShapes parsed. Keys:', Object.keys(json).join(', '));
    }
  } catch (e) {
    return parseIFacialMocap(data);
  }
  return null;
}

module.exports = {
  DEFAULT_THRESHOLDS,
  detectExpression,
  parseIFacialMocap,
  parseVTubeStudio,
};
