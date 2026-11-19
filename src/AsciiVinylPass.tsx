import {
  useEffect,
  useMemo,
  useRef,
  type MutableRefObject,
} from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const asciiSettings = {
  cellWidth: 6,
  cellHeight: 9,
  glyphs: ' .:-=+*#@',
  brightnessMinimum: 0.02,
  brightnessMaximum: 0.62,
  glyphBrightness: 0.94,
};

export type PointerLightState = {
  x: number;
  y: number;
  active: boolean;
};

type AsciiVinylPassProps = {
  pointerLight: MutableRefObject<PointerLightState>;
  reducedMotion: boolean;
};

const pointerLightSettings = {
  radiusWidthFraction: 0.16,
  maximumStrength: 0.28,
  smoothingSeconds: 0.1,
  fadeOutSeconds: 0.2,
};

const vertexShader = `
  void main() {
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uSource;
  uniform sampler2D uGlyphAtlas;
  uniform vec2 uResolution;
  uniform vec2 uCellSize;
  uniform float uGlyphCount;
  uniform float uBrightnessMinimum;
  uniform float uBrightnessMaximum;
  uniform float uGlyphBrightness;
  uniform vec2 uPointer;
  uniform float uLightRadius;
  uniform float uLightStrength;

  void main() {
    vec2 cellOrigin =
      floor(gl_FragCoord.xy / uCellSize) * uCellSize;
    vec2 cellPosition = fract(gl_FragCoord.xy / uCellSize);
    vec2 cellCenter = cellOrigin + 0.5 * uCellSize;
    float radiusRatio =
      distance(cellCenter, uPointer) / max(uLightRadius, 1.0);
    float pointerFalloff =
      1.0 - smoothstep(0.0, 1.0, radiusRatio);
    pointerFalloff *= pointerFalloff;

    float coverageSum = 0.0;
    vec3 colorSum = vec3(0.0);
    float peakLuminance = 0.0;

    for (int y = 0; y < 2; y++) {
      for (int x = 0; x < 2; x++) {
        vec2 sampleOffset =
          (vec2(float(x), float(y)) + vec2(0.5)) / 2.0;
        vec2 sourcePixel = cellOrigin + sampleOffset * uCellSize;
        vec2 sourceUv = sourcePixel / uResolution;
        vec4 source = texture2D(uSource, sourceUv);

        coverageSum += source.a;
        colorSum += source.rgb * source.a;
        peakLuminance = max(
          peakLuminance,
          dot(source.rgb, vec3(0.2126, 0.7152, 0.0722))
        );
      }
    }

    float coverage = coverageSum * 0.25;

    if (coverage <= 0.001) {
      discard;
    }

    float averageLuminance =
      dot(colorSum, vec3(0.2126, 0.7152, 0.0722)) /
      max(coverageSum, 0.001);
    float luminance = mix(averageLuminance, peakLuminance, 0.35);
    float illuminatedLuminance = mix(
      luminance,
      1.0,
      uLightStrength * pointerFalloff
    );

    float brightness = clamp(
      (illuminatedLuminance - uBrightnessMinimum) /
        max(uBrightnessMaximum - uBrightnessMinimum, 0.001),
      0.0,
      1.0
    );

    float glyphIndex =
      floor(brightness * (uGlyphCount - 1.0) + 0.5);

    vec2 glyphUv = vec2(
      (glyphIndex + cellPosition.x) / uGlyphCount,
      cellPosition.y
    );

    float glyphCoverage = texture2D(uGlyphAtlas, glyphUv).a;
    float inkBrightness =
      mix(0.38, uGlyphBrightness, brightness);
    vec3 cellColor =
      mix(vec3(0.003), vec3(inkBrightness), glyphCoverage);

    gl_FragColor = vec4(cellColor * coverage, coverage);
  }
`;

function createGlyphAtlas() {
  const glyphWidth = 16;
  const glyphHeight = 24;
  const canvas = document.createElement('canvas');

  canvas.width = glyphWidth * asciiSettings.glyphs.length;
  canvas.height = glyphHeight;

  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('Could not create the ASCII glyph atlas.');
  }

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.font = '18px monospace';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillStyle = '#ffffff';

  for (let index = 0; index < asciiSettings.glyphs.length; index += 1) {
    context.fillText(
      asciiSettings.glyphs[index],
      index * glyphWidth + glyphWidth / 2,
      glyphHeight / 2,
    );
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.NoColorSpace;
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;

  return texture;
}

export default function AsciiVinylPass({
  pointerLight,
  reducedMotion,
}: AsciiVinylPassProps) {
  const { gl, scene, camera, invalidate } = useThree();

  const renderTarget = useMemo(() => {
    const target = new THREE.WebGLRenderTarget(1, 1, {
      format: THREE.RGBAFormat,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      depthBuffer: true,
      stencilBuffer: false,
    });

    target.texture.colorSpace = THREE.NoColorSpace;
    target.texture.generateMipmaps = false;

    return target;
  }, []);

  const glyphAtlas = useMemo(createGlyphAtlas, []);

  const uniforms = useMemo(
    () => ({
      uSource: { value: renderTarget.texture },
      uGlyphAtlas: { value: glyphAtlas },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uCellSize: {
        value: new THREE.Vector2(
          asciiSettings.cellWidth,
          asciiSettings.cellHeight,
        ),
      },
      uGlyphCount: { value: asciiSettings.glyphs.length },
      uBrightnessMinimum: {
        value: asciiSettings.brightnessMinimum,
      },
      uBrightnessMaximum: {
        value: asciiSettings.brightnessMaximum,
      },
      uGlyphBrightness: {
        value: asciiSettings.glyphBrightness,
      },
      uPointer: { value: new THREE.Vector2() },
      uLightRadius: { value: 1 },
      uLightStrength: { value: 0 },
    }),
    [glyphAtlas, renderTarget],
  );

  const postMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms,
        vertexShader,
        fragmentShader,
        transparent: true,
        blending: THREE.NoBlending,
        depthTest: false,
        depthWrite: false,
        toneMapped: false,
      }),
    [uniforms],
  );

  const postGeometry = useMemo(
    () => new THREE.PlaneGeometry(2, 2),
    [],
  );

  const postCamera = useMemo(() => {
    const postProcessCamera = new THREE.OrthographicCamera(
      -1,
      1,
      1,
      -1,
      0,
      2,
    );

    postProcessCamera.position.z = 1;

    return postProcessCamera;
  }, []);

  const postScene = useMemo(() => {
    const fullscreenScene = new THREE.Scene();
    fullscreenScene.add(
      new THREE.Mesh(postGeometry, postMaterial),
    );

    return fullscreenScene;
  }, [postGeometry, postMaterial]);

  const drawingBufferSize = useMemo(
    () => new THREE.Vector2(),
    [],
  );
  const smoothedPointer = useMemo(() => new THREE.Vector2(), []);
  const targetPointer = useMemo(() => new THREE.Vector2(), []);
  const pointerStrength = useRef(0);

  useEffect(
    () => () => {
      renderTarget.dispose();
      glyphAtlas.dispose();
      postGeometry.dispose();
      postMaterial.dispose();
    },
    [glyphAtlas, postGeometry, postMaterial, renderTarget],
  );

  useEffect(() => {
    const clearPointer = () => {
      pointerLight.current.active = false;
      invalidate();
    };

    gl.domElement.addEventListener('pointerleave', clearPointer);
    window.addEventListener('blur', clearPointer);
    document.addEventListener('visibilitychange', clearPointer);

    return () => {
      gl.domElement.removeEventListener('pointerleave', clearPointer);
      window.removeEventListener('blur', clearPointer);
      document.removeEventListener('visibilitychange', clearPointer);
    };
  }, [gl, invalidate, pointerLight]);

  useFrame((_, delta) => {
    gl.getDrawingBufferSize(drawingBufferSize);

    const width = Math.max(1, Math.floor(drawingBufferSize.x));
    const height = Math.max(1, Math.floor(drawingBufferSize.y));
    const pixelRatio = gl.getPixelRatio();

    if (renderTarget.width !== width || renderTarget.height !== height) {
      renderTarget.setSize(width, height);
      uniforms.uResolution.value.set(width, height);
    }

    uniforms.uCellSize.value.set(
      asciiSettings.cellWidth * pixelRatio,
      asciiSettings.cellHeight * pixelRatio,
    );

    const pointer = pointerLight.current;
    targetPointer.set(
      ((pointer.x + 1) * 0.5) * width,
      ((pointer.y + 1) * 0.5) * height,
    );

    if (reducedMotion) {
      smoothedPointer.copy(targetPointer);
      pointerStrength.current = pointer.active ? 1 : 0;
    } else if (pointer.active) {
      const smoothing =
        1 - Math.exp(-delta / pointerLightSettings.smoothingSeconds);

      smoothedPointer.lerp(targetPointer, smoothing);
      pointerStrength.current = 1;
    } else {
      pointerStrength.current = Math.max(
        0,
        pointerStrength.current -
          delta / pointerLightSettings.fadeOutSeconds,
      );
    }

    uniforms.uPointer.value.copy(smoothedPointer);
    uniforms.uLightRadius.value =
      width * pointerLightSettings.radiusWidthFraction;
    uniforms.uLightStrength.value =
      pointerStrength.current * pointerLightSettings.maximumStrength;

    const previousTarget = gl.getRenderTarget();

    gl.setRenderTarget(renderTarget);
    gl.clear(true, true, true);
    gl.render(scene, camera);

    gl.setRenderTarget(previousTarget);
    gl.clear(true, true, true);
    gl.render(postScene, postCamera);
  }, 1);

  return null;
}
