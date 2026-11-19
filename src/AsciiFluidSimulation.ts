import * as THREE from 'three';
import { GPUComputationRenderer } from 'three/addons/misc/GPUComputationRenderer.js';
import type { BackdropPointerSegment, BackdropRipple } from './pointerLight';
import { pointerLightSettings } from './pointerLight';

const rippleProfileShader = `
  float rippleInfluence(
    float distanceToOrigin, float radius, float halfWidth, float reducedMotion
  ) {
    if (reducedMotion > 0.5) {
      return 1.0 - smoothstep(0.0, radius, distanceToOrigin);
    }

    float distanceFromBand = abs(distanceToOrigin - radius);
    return 1.0 - smoothstep(0.0, halfWidth, distanceFromBand);
  }
`;

const velocityShader = `
  uniform sampler2D uStrokeTexture;
  uniform float uStrokeCount;
  uniform float uDelta;
  uniform float uAspect;
  uniform float uDissipation;
  uniform float uInputRadius;
  uniform float uPointerForce;
  uniform float uReducedMotion;
  uniform float uMaximumFlowSpeed;
  uniform float uVelocityZeroThreshold;

  ${rippleProfileShader}

  vec4 readStroke(int index, float texelOffset) {
    float x = (float(index) * 2.0 + texelOffset + 0.5) / 128.0;
    return texture2D(uStrokeTexture, vec2(x, 0.5));
  }

  void main() {
    vec2 vUv = gl_FragCoord.xy / resolution;
    vec2 velocityUv = texture2D(textureVelocity, vUv).xy;
    vec2 backUv = clamp(
      vUv - vec2(velocityUv.x / uAspect, velocityUv.y) * uDelta,
      vec2(0.0),
      vec2(1.0)
    );
    vec2 velocity =
      texture2D(textureVelocity, backUv).xy *
      exp(-uDissipation * uDelta);

    vec2 point = vec2(vUv.x * uAspect, vUv.y);
    float radiusSquared = uInputRadius * uInputRadius;

    for (int i = 0; i < 64; i++) {
      if (float(i) >= uStrokeCount) {
        break;
      }

      vec4 fromTo = readStroke(i, 0.0);
      vec4 motion = readStroke(i, 1.0);
      if (motion.w > 1.5) {
        if (uReducedMotion < 0.5) {
          vec2 offset = point - fromTo.xy;
          float distanceToOrigin = length(offset);
          vec2 outward = offset / max(distanceToOrigin, 0.000001);
          vec2 sideways = vec2(-outward.y, outward.x);
          float influence = rippleInfluence(
            distanceToOrigin, fromTo.z, fromTo.w, uReducedMotion
          );
          velocity += (outward + sideways * 0.25) * influence * motion.x;
        }
        continue;
      }
      vec2 segmentStart = fromTo.xy;
      vec2 segment = fromTo.zw - segmentStart;
      float segmentLengthSquared = max(dot(segment, segment), 0.000001);
      float along = clamp(
        dot(point - segmentStart, segment) / segmentLengthSquared,
        0.0,
        1.0
      );
      vec2 closestPoint = segmentStart + segment * along;
      float distanceToPath = length(point - closestPoint);
      float influence = exp(
        -distanceToPath * distanceToPath / radiusSquared
      );

      if (motion.w < 0.5 && uReducedMotion < 0.5) {
        velocity += motion.xy * influence * uPointerForce * uDelta;
      }
    }

    vec2 texel = 1.0 / resolution;
    float dx = uAspect / resolution.x;
    float dy = 1.0 / resolution.y;
    float pressureLeft =
      texture2D(texturePressure, vUv - vec2(texel.x, 0.0)).r;
    float pressureRight =
      texture2D(texturePressure, vUv + vec2(texel.x, 0.0)).r;
    float pressureDown =
      texture2D(texturePressure, vUv - vec2(0.0, texel.y)).r;
    float pressureUp =
      texture2D(texturePressure, vUv + vec2(0.0, texel.y)).r;
    vec2 pressureGradient = vec2(
      (pressureRight - pressureLeft) / (2.0 * dx),
      (pressureUp - pressureDown) / (2.0 * dy)
    );

    velocity -= pressureGradient;
    float speed = length(velocity);
    if (speed > uMaximumFlowSpeed) {
      velocity *= uMaximumFlowSpeed / speed;
    }
    if (length(velocity) < uVelocityZeroThreshold) {
      velocity = vec2(0.0);
    }

    gl_FragColor = vec4(velocity, 0.0, 1.0);
  }
`;

const divergenceShader = `
  uniform float uAspect;

  void main() {
    vec2 vUv = gl_FragCoord.xy / resolution;
    vec2 texel = 1.0 / resolution;
    float dx = uAspect / resolution.x;
    float dy = 1.0 / resolution.y;
    vec2 left =
      texture2D(textureVelocity, vUv - vec2(texel.x, 0.0)).xy;
    vec2 right =
      texture2D(textureVelocity, vUv + vec2(texel.x, 0.0)).xy;
    vec2 down =
      texture2D(textureVelocity, vUv - vec2(0.0, texel.y)).xy;
    vec2 up =
      texture2D(textureVelocity, vUv + vec2(0.0, texel.y)).xy;
    float divergence =
      (right.x - left.x) / (2.0 * dx) +
      (up.y - down.y) / (2.0 * dy);

    gl_FragColor = vec4(divergence, 0.0, 0.0, 1.0);
  }
`;

const pressureShader = `
  uniform float uAspect;

  void main() {
    vec2 vUv = gl_FragCoord.xy / resolution;
    vec2 texel = 1.0 / resolution;
    float dx = uAspect / resolution.x;
    float dy = 1.0 / resolution.y;
    float inverseDxSquared = 1.0 / (dx * dx);
    float inverseDySquared = 1.0 / (dy * dy);
    float left =
      texture2D(texturePressure, vUv - vec2(texel.x, 0.0)).r;
    float right =
      texture2D(texturePressure, vUv + vec2(texel.x, 0.0)).r;
    float down =
      texture2D(texturePressure, vUv - vec2(0.0, texel.y)).r;
    float up =
      texture2D(texturePressure, vUv + vec2(0.0, texel.y)).r;
    float divergence =
      texture2D(textureDivergence, vUv).r;
    float pressure = (
      (left + right) * inverseDxSquared +
      (down + up) * inverseDySquared -
      divergence
    ) / (2.0 * (inverseDxSquared + inverseDySquared));

    gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
  }
`;

const activationShader = `
  uniform sampler2D uStrokeTexture;
  uniform float uStrokeCount;
  uniform float uDelta;
  uniform float uAspect;
  uniform float uDissipation;
  uniform float uInputRadius;
  uniform float uActivationForce;
  uniform float uReducedMotion;

  ${rippleProfileShader}

  vec4 readStroke(int index, float texelOffset) {
    float x = (float(index) * 2.0 + texelOffset + 0.5) / 128.0;
    return texture2D(uStrokeTexture, vec2(x, 0.5));
  }

  void main() {
    vec2 vUv = gl_FragCoord.xy / resolution;
    vec2 velocity = texture2D(textureVelocity, vUv).xy;
    vec2 backUv = vUv;

    if (uReducedMotion < 0.5) {
      backUv = clamp(
        vUv - vec2(velocity.x / uAspect, velocity.y) * uDelta,
        vec2(0.0),
        vec2(1.0)
      );
    }

    vec2 previousActivation = texture2D(textureActivation, backUv).rg;
    float activation = previousActivation.r * exp(-uDissipation * uDelta);
    float rippleActivation = previousActivation.g * exp(-5.0 * uDelta);
    vec2 point = vec2(vUv.x * uAspect, vUv.y);
    float radiusSquared = uInputRadius * uInputRadius;

    for (int i = 0; i < 64; i++) {
      if (float(i) >= uStrokeCount) {
        break;
      }

      vec4 fromTo = readStroke(i, 0.0);
      vec4 motion = readStroke(i, 1.0);
      if (motion.w > 1.5) {
        float influence = rippleInfluence(
          length(point - fromTo.xy), fromTo.z, fromTo.w, uReducedMotion
        );
        float deposit = influence * motion.y;
        if (uReducedMotion > 0.5) {
          activation = mix(clamp(activation, 0.0, 1.0), 1.0, deposit);
        } else {
          rippleActivation = mix(rippleActivation, 1.0, deposit);
        }
        continue;
      }
      vec2 segmentStart = fromTo.xy;
      vec2 segment = fromTo.zw - segmentStart;
      float segmentLengthSquared = max(dot(segment, segment), 0.000001);
      float along = clamp(
        dot(point - segmentStart, segment) / segmentLengthSquared,
        0.0,
        1.0
      );
      vec2 closestPoint = segmentStart + segment * along;
      float distanceToPath = length(point - closestPoint);
      float influence = exp(
        -distanceToPath * distanceToPath / radiusSquared
      );
      float speedStrength = mix(0.25, 1.0, motion.z);
      float injected = influence * speedStrength * uActivationForce;

      if (motion.w > 0.5 || uReducedMotion > 0.5) {
        injected *= 0.25;
      }

      activation =
        1.0 - (1.0 - activation) * (1.0 - injected);
    }

    if (activation < 0.01) {
      activation = 0.0;
    }

    gl_FragColor = vec4(activation, rippleActivation, 0.0, 1.0);
  }
`;

const outputVertexShader = `
  void main() {
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const cellDisplayFragmentShader = `
  uniform sampler2D uActivation;
  uniform vec2 uDisplayResolution;
  uniform float uPixelRatio;

  void main() {
    vec2 pixel = vec2(
      gl_FragCoord.x / uPixelRatio,
      uDisplayResolution.y - gl_FragCoord.y / uPixelRatio
    );
    vec2 patternPosition = vec2(pixel.x - 10.0, pixel.y);
    vec2 tile = mod(
      mod(patternPosition, 80.5) + 80.5,
      80.5
    );

    if (tile.x >= 77.5 || tile.y >= 77.5) {
      discard;
    }

    vec2 cellOffset = mod(tile, 15.5);
    if (cellOffset.x >= 11.0 || cellOffset.y >= 11.0) {
      discard;
    }

    vec2 cellCenter = pixel - cellOffset + vec2(5.5);
    vec2 sampleUv = vec2(
      cellCenter.x / uDisplayResolution.x,
      1.0 - cellCenter.y / uDisplayResolution.y
    );
    vec2 activationSample = texture2D(uActivation, sampleUv).rg;
    vec2 groupIndex = floor(patternPosition / 80.5);
    vec2 cellIndex = groupIndex * 5.0 + floor(tile / 15.5);
    float cellVariation = fract(
      sin(dot(cellIndex, vec2(127.1, 311.7))) * 43758.5453
    );
    float clusteredVariation =
      0.5 + 0.25 * sin(cellIndex.x * 0.47 + cellIndex.y * 0.19) +
      0.25 * sin(cellIndex.y * 0.61 - cellIndex.x * 0.28);
    float rippleMask = step(
      0.34, mix(cellVariation, clusteredVariation, 0.55)
    );
    float activation = max(activationSample.r, activationSample.g * rippleMask);

    if (activation < 0.05) {
      discard;
    }

    float opacity = min(
      0.92,
      smoothstep(0.05, 0.8, activation) * 0.92
    );

    gl_FragColor = vec4(vec3(0.5), opacity);
  }
`;

type FluidVariable = ReturnType<GPUComputationRenderer['addVariable']>;

const rippleSpeedPixelsPerSecond = 480;
const maximumActiveRipples =
  64 - pointerLightSettings.backdropMaximumSegmentsPerFrame;

type ActiveRipple = {
  xFraction: number;
  yFraction: number;
  radiusFraction: number;
  distancePixels: number;
};

export class AsciiFluidSimulation {
  private activeRipples: ActiveRipple[] = [];

  get hasActiveRipples() {
    return this.activeRipples.length > 0;
  }
  readonly renderer: THREE.WebGLRenderer;

  private readonly gpu: GPUComputationRenderer;
  private readonly strokeTexture: THREE.DataTexture;
  private readonly strokeData: Float32Array;
  private readonly zeroTexture: THREE.DataTexture;
  private readonly outputMaterial: THREE.ShaderMaterial;
  private readonly outputGeometry: THREE.PlaneGeometry;
  private readonly outputScene: THREE.Scene;
  private readonly outputCamera: THREE.OrthographicCamera;
  private readonly outputResolution: THREE.Vector2;
  private readonly variables: {
    velocity: FluidVariable;
    divergence: FluidVariable;
    pressure: FluidVariable;
    activation: FluidVariable;
  };

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      premultipliedAlpha: false,
      powerPreference: 'low-power',
    });

    if (
      !this.renderer.capabilities.isWebGL2 ||
      !this.renderer.extensions.has('EXT_color_buffer_float')
    ) {
      this.renderer.dispose();
      throw new Error('Half-float fluid targets are not supported.');
    }

    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setPixelRatio(
      Math.min(window.devicePixelRatio || 1, 2),
    );

    this.gpu = new GPUComputationRenderer(
      pointerLightSettings.backdropSimulationSize,
      pointerLightSettings.backdropSimulationSize,
      this.renderer,
    );
    this.gpu.setDataType(THREE.HalfFloatType);

    this.strokeData = new Float32Array(64 * 2 * 4);
    this.strokeTexture = new THREE.DataTexture(
      this.strokeData,
      128,
      1,
      THREE.RGBAFormat,
      THREE.FloatType,
    );
    this.strokeTexture.minFilter = THREE.NearestFilter;
    this.strokeTexture.magFilter = THREE.NearestFilter;
    this.strokeTexture.generateMipmaps = false;
    this.strokeTexture.colorSpace = THREE.NoColorSpace;
    this.strokeTexture.needsUpdate = true;

    const velocity = this.gpu.addVariable(
      'textureVelocity',
      velocityShader,
      this.gpu.createTexture(),
    );
    const divergence = this.gpu.addVariable(
      'textureDivergence',
      divergenceShader,
      this.gpu.createTexture(),
    );
    const pressure = this.gpu.addVariable(
      'texturePressure',
      pressureShader,
      this.gpu.createTexture(),
    );
    const activation = this.gpu.addVariable(
      'textureActivation',
      activationShader,
      this.gpu.createTexture(),
    );

    this.variables = { velocity, divergence, pressure, activation };

    this.gpu.setVariableDependencies(velocity, [velocity, pressure]);
    this.gpu.setVariableDependencies(divergence, [velocity]);
    this.gpu.setVariableDependencies(pressure, [pressure, divergence]);
    this.gpu.setVariableDependencies(activation, [activation, velocity]);

    this.setUniforms(velocity, {
      uStrokeTexture: this.strokeTexture,
      uStrokeCount: 0,
      uDelta: 0,
      uAspect: 1,
      uDissipation: pointerLightSettings.backdropVelocityDissipation,
      uInputRadius: 0,
      uPointerForce: pointerLightSettings.backdropPointerForce,
      uReducedMotion: 0,
      uMaximumFlowSpeed: pointerLightSettings.backdropMaximumFlowSpeed,
      uVelocityZeroThreshold:
        pointerLightSettings.backdropVelocityZeroThreshold,
    });
    this.setUniforms(divergence, { uAspect: 1 });
    this.setUniforms(pressure, { uAspect: 1 });
    this.setUniforms(activation, {
      uStrokeTexture: this.strokeTexture,
      uStrokeCount: 0,
      uDelta: 0,
      uAspect: 1,
      uDissipation: pointerLightSettings.backdropActivationDissipation,
      uInputRadius: 0,
      uActivationForce: pointerLightSettings.backdropActivationForce,
      uReducedMotion: 0,
    });

    this.zeroTexture = this.gpu.createTexture();

    const error = this.gpu.init();
    if (error !== null) {
      this.gpu.dispose();
      this.strokeTexture.dispose();
      this.zeroTexture.dispose();
      this.renderer.dispose();
      throw new Error(error);
    }

    this.outputResolution = new THREE.Vector2(1, 1);
    this.outputMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uActivation: {
          value: this.gpu.getCurrentRenderTarget(activation).texture,
        },
        uDisplayResolution: { value: this.outputResolution },
        uPixelRatio: { value: this.renderer.getPixelRatio() },
      },
      vertexShader: outputVertexShader,
      fragmentShader: cellDisplayFragmentShader,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      toneMapped: false,
    });
    this.outputGeometry = new THREE.PlaneGeometry(2, 2);
    this.outputScene = new THREE.Scene();
    this.outputScene.add(
      new THREE.Mesh(this.outputGeometry, this.outputMaterial),
    );
    this.outputCamera = new THREE.OrthographicCamera(
      -1,
      1,
      1,
      -1,
      0,
      2,
    );
    this.outputCamera.position.z = 1;
  }

  private setUniforms(
    variable: FluidVariable,
    values: Record<string, THREE.Texture | number>,
  ) {
    for (const [name, value] of Object.entries(values)) {
      variable.material.uniforms[name] = { value };
    }
  }

  resize(width: number, height: number) {
    this.renderer.setSize(width, height, false);
    this.outputResolution.set(width, height);
    this.outputMaterial.uniforms.uPixelRatio.value =
      this.renderer.getPixelRatio();
  }

  update(
    segments: BackdropPointerSegment[],
    ripples: BackdropRipple[],
    bounds: DOMRect,
    deltaSeconds: number,
    reducedMotion: boolean,
  ) {
    const batch = segments.slice(
      0,
      pointerLightSettings.backdropMaximumSegmentsPerFrame,
    );
    const width = Math.max(bounds.width, 1);
    const height = Math.max(bounds.height, 1);
    const aspect = Math.max(width / height, 0.01);
    const frameDelta = Math.min(
      deltaSeconds,
      pointerLightSettings.backdropMaximumFrameDeltaSeconds,
    );
    const newRipples = ripples
      .slice(0, pointerLightSettings.backdropMaximumRipplesPerFrame)
      .map((ripple) => ({
        xFraction: (ripple.clientX - bounds.left) / width,
        yFraction: 1 - (ripple.clientY - bounds.top) / height,
        radiusFraction: ripple.radiusPixels / width,
        distancePixels: reducedMotion ? 0 : ripple.radiusPixels * 0.72,
      }));

    const viewport = document.documentElement;
    const visibleLeft = Math.max(0, -bounds.left);
    const visibleRight = Math.min(width, viewport.clientWidth - bounds.left);
    const visibleTop = Math.max(0, -bounds.top);
    const visibleBottom = Math.min(height, viewport.clientHeight - bounds.top);
    const hasVisibleBackdrop =
      visibleRight > visibleLeft && visibleBottom > visibleTop;
    const halfWidthFor = (ripple: ActiveRipple) =>
      Math.max(22, ripple.radiusFraction * width * 0.2);

    for (const ripple of this.activeRipples) {
      ripple.distancePixels += rippleSpeedPixelsPerSecond * deltaSeconds;
    }

    this.activeRipples = reducedMotion
      ? []
      : [...this.activeRipples, ...newRipples]
          .filter((ripple) => {
            if (!hasVisibleBackdrop) {
              return false;
            }

            const x = ripple.xFraction * width;
            const y = (1 - ripple.yFraction) * height;
            const farthestX = Math.max(
              Math.abs(x - visibleLeft),
              Math.abs(x - visibleRight),
            );
            const farthestY = Math.max(
              Math.abs(y - visibleTop),
              Math.abs(y - visibleBottom),
            );
            const farthestCorner = Math.hypot(farthestX, farthestY);

            return ripple.distancePixels - halfWidthFor(ripple) <= farthestCorner;
          })
          .slice(0, maximumActiveRipples);

    const rippleBatch = reducedMotion ? newRipples : this.activeRipples;

    this.strokeData.fill(0);
    batch.forEach((segment, index) => {
      const offset = index * 8;
      const fromX = (segment.fromClientX - bounds.left) / height;
      const fromY = 1 - (segment.fromClientY - bounds.top) / height;
      const toX = (segment.toClientX - bounds.left) / height;
      const toY = 1 - (segment.toClientY - bounds.top) / height;

      this.strokeData.set([fromX, fromY, toX, toY], offset);
      this.strokeData.set(
        [
          segment.velocityX / height,
          -segment.velocityY / height,
          Math.min(
            segment.speed /
              pointerLightSettings.backdropMaximumInputSpeed,
            1,
          ),
          segment.reducedMotion ? 1 : 0,
        ],
        offset + 4,
      );
    });
    rippleBatch.forEach((ripple, index) => {
      const offset = (batch.length + index) * 8;
      const baseRadius = Math.max(ripple.radiusFraction * width, 1);
      const radius = reducedMotion
        ? baseRadius
        : ripple.distancePixels;
      const halfWidth = halfWidthFor(ripple);
      const push = reducedMotion ? 0 : 650 * frameDelta;
      const brightness = reducedMotion
        ? 0.42
        : 1 - Math.exp(-22 * frameDelta);

      this.strokeData.set(
        [
          ripple.xFraction * aspect,
          ripple.yFraction,
          radius / height,
          halfWidth / height,
          push / height,
          brightness,
          0,
          2,
        ],
        offset,
      );
    });
    this.strokeTexture.needsUpdate = true;

    const steps = pointerLightSettings.backdropPressureIterations;
    const stepDelta = frameDelta / steps;
    const inputRadius =
      pointerLightSettings.backdropInputRadiusPixels / height;

    for (let step = 0; step < steps; step += 1) {
      const strokeCount = step === 0 ? batch.length + rippleBatch.length : 0;
      const reduced = reducedMotion ? 1 : 0;

      this.setUniforms(this.variables.velocity, {
        uStrokeCount: strokeCount,
        uDelta: stepDelta,
        uAspect: aspect,
        uInputRadius: inputRadius,
        uReducedMotion: reduced,
      });
      this.setUniforms(this.variables.divergence, { uAspect: aspect });
      this.setUniforms(this.variables.pressure, { uAspect: aspect });
      this.setUniforms(this.variables.activation, {
        uStrokeCount: strokeCount,
        uDelta: stepDelta,
        uAspect: aspect,
        uInputRadius: inputRadius,
        uReducedMotion: reduced,
        uDissipation: reduced
          ? pointerLightSettings.backdropReducedMotionDissipation
          : pointerLightSettings.backdropActivationDissipation,
      });

      this.gpu.compute();
    }

    return this.activationTexture;
  }

  get activationTexture() {
    return this.gpu.getCurrentRenderTarget(
      this.variables.activation,
    ).texture;
  }

  render(activationTexture: THREE.Texture) {
    this.outputMaterial.uniforms.uActivation.value = activationTexture;
    this.renderer.setRenderTarget(null);
    this.renderer.clear(true, true, true);
    this.renderer.render(this.outputScene, this.outputCamera);
  }

  clear() {
    this.activeRipples = [];
    for (const variable of Object.values(this.variables)) {
      for (const target of variable.renderTargets) {
        this.gpu.renderTexture(this.zeroTexture, target);
      }
    }
  }

  dispose() {
    this.gpu.dispose();
    this.strokeTexture.dispose();
    this.zeroTexture.dispose();
    this.outputGeometry.dispose();
    this.outputMaterial.dispose();
    this.renderer.dispose();
  }
}
