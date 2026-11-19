import {
  Canvas,
  useFrame,
  useThree,
  type ThreeEvent,
} from '@react-three/fiber';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import AsciiVinylPass, {
  type PointerLightState,
} from './AsciiVinylPass';

const grooveVertexShader = `
  varying vec3 localPosition;

  void main() {
    localPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const grooveFragmentShader = `
  varying vec3 localPosition;

  void main() {
    float radius = length(localPosition.xy);
    float angle = atan(localPosition.y, localPosition.x);

    // Keep the grooves bright while varying their brightness gently by angle.
    float grooveWave = 0.5 + 0.5 * cos(radius * 56.0);
    float groove = smoothstep(0.78, 0.98, grooveWave);
    float directionalVariation = 0.94 + 0.06 * cos(angle);

    vec3 vinyl = vec3(0.012, 0.012, 0.012);
    vinyl += vec3(0.90, 0.90, 0.90) * groove * directionalVariation;

    gl_FragColor = vec4(vinyl, 1.0);
  }
`;

const reflectionFragmentShader = `
  varying vec3 localPosition;

  void main() {
    float reflection = exp(-pow(localPosition.y / 0.16, 2.0));
    gl_FragColor = vec4(vec3(1.0), reflection * 0.10);
  }
`;

type PressTarget = {
  x: number;
  y: number;
  pointerId: number | null;
} | null;

type PressPose = {
  depth: number;
  tiltX: number;
  tiltY: number;
};

const restingPressPose: PressPose = {
  depth: 0,
  tiltX: 0,
  tiltY: 0,
};

const maximumPressDepth = 0.075;
const maximumPressTilt = THREE.MathUtils.degToRad(2.5);
const springStiffness = 280;
const springDamping = 28;

type VinylMotionProps = {
  motionEnabled: boolean;
  reducedMotion: boolean;
  pressTarget: PressTarget;
  pressTargetChange: (target: PressTarget) => void;
  pointerLight: { current: PointerLightState };
};

function Vinyl({
  motionEnabled,
  reducedMotion,
  pressTarget,
  pressTargetChange,
  pointerLight,
}: VinylMotionProps) {
  const invalidate = useThree((state) => state.invalidate);
  const driftGroup = useRef<THREE.Group>(null);
  const interactionGroup = useRef<THREE.Group>(null);
  const spinGroup = useRef<THREE.Group>(null);
  const elapsedSeconds = useRef(0);
  const lastFrameTime = useRef<number | null>(null);
  const currentPressPose = useRef<PressPose>({ ...restingPressPose });
  const pressVelocity = useRef<PressPose>({ ...restingPressPose });
  const targetPressPose = useRef<PressPose>({ ...restingPressPose });

  const recordShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.absarc(0, 0, 1.27, 0, Math.PI * 2, false);

    const spindleOpening = new THREE.Path();
    spindleOpening.absarc(0, 0, 0.055, 0, Math.PI * 2, true);
    shape.holes.push(spindleOpening);

    return shape;
  }, []);

  const recordDepth = 0.025;
  const bevelThickness = 0.008;
  const faceClearance = 0.004;
  const faceZ = recordDepth + bevelThickness + faceClearance;
  const labelZ = faceZ + 0.004;
  const reflectionZ = faceZ + 0.002;
  const presentationTilt = THREE.MathUtils.degToRad(-58);
  const diagonal = THREE.MathUtils.degToRad(12);

  const handlePointerMove = useCallback(
    (event: ThreeEvent<PointerEvent>) => {
      const supportsFineHover = window.matchMedia(
        '(any-hover: hover) and (any-pointer: fine)',
      ).matches;

      if (
        event.nativeEvent.pointerType === 'touch' ||
        !supportsFineHover
      ) {
        pointerLight.current.active = false;
        invalidate();
        return;
      }

      pointerLight.current.x = event.pointer.x;
      pointerLight.current.y = event.pointer.y;
      pointerLight.current.active = true;
      invalidate();
    },
    [invalidate, pointerLight],
  );

  const handlePointerOut = useCallback(() => {
    pointerLight.current.active = false;
    invalidate();
  }, [invalidate, pointerLight]);

  const handlePointerDown = useCallback(
    (event: ThreeEvent<PointerEvent>) => {
      event.stopPropagation();

      if (!interactionGroup.current) {
        return;
      }

      const localPoint = interactionGroup.current.worldToLocal(
        event.point.clone(),
      );
      const distance = Math.hypot(localPoint.x, localPoint.y);
      const divisor = Math.max(1, distance);

      pressTargetChange({
        x: localPoint.x / divisor,
        y: localPoint.y / divisor,
        pointerId: event.pointerId,
      });
    },
    [pressTargetChange],
  );

  useEffect(() => {
    lastFrameTime.current = null;

    if (reducedMotion) {
      elapsedSeconds.current = 0;
      currentPressPose.current = { ...targetPressPose.current };
      pressVelocity.current = { ...restingPressPose };

      if (spinGroup.current) {
        spinGroup.current.rotation.z = 0;
      }

      if (driftGroup.current) {
        driftGroup.current.position.y = 0;
      }
    }
  }, [motionEnabled, reducedMotion]);

  useEffect(() => {
    if (pressTarget) {
      targetPressPose.current.depth = maximumPressDepth;
      targetPressPose.current.tiltX =
        -pressTarget.y * maximumPressTilt;
      targetPressPose.current.tiltY =
        pressTarget.x * maximumPressTilt;
    } else {
      targetPressPose.current = { ...restingPressPose };
    }
  }, [pressTarget]);

  useFrame((state, delta) => {
    let springDelta = 0;

    if (motionEnabled) {
      const now = performance.now();

      if (lastFrameTime.current === null) {
        lastFrameTime.current = now;
      } else {
        elapsedSeconds.current +=
          (now - lastFrameTime.current) / 1000;
        lastFrameTime.current = now;
        springDelta = Math.min(delta, 0.05);
      }

      const spinPhase = (elapsedSeconds.current % 24) / 24;
      const driftPhase = (elapsedSeconds.current % 4.5) / 4.5;
      const driftAmplitude =
        (5 * state.viewport.height) / state.size.height;

      if (spinGroup.current) {
        spinGroup.current.rotation.z =
          -spinPhase * Math.PI * 2;
      }

      if (driftGroup.current) {
        driftGroup.current.position.y =
          Math.sin(driftPhase * Math.PI * 2) * driftAmplitude;
      }
    }

    if (reducedMotion) {
      currentPressPose.current = { ...targetPressPose.current };
      pressVelocity.current = { ...restingPressPose };
    } else if (motionEnabled && springDelta > 0) {
      for (const key of ['depth', 'tiltX', 'tiltY'] as const) {
        const current = currentPressPose.current[key];
        const velocity = pressVelocity.current[key];
        const target = targetPressPose.current[key];
        const acceleration =
          springStiffness * (target - current) -
          springDamping * velocity;
        const nextVelocity = velocity + acceleration * springDelta;

        pressVelocity.current[key] = nextVelocity;
        currentPressPose.current[key] =
          current + nextVelocity * springDelta;
      }
    }

    if (interactionGroup.current) {
      interactionGroup.current.position.z =
        -currentPressPose.current.depth;
      interactionGroup.current.rotation.x =
        currentPressPose.current.tiltX;
      interactionGroup.current.rotation.y =
        currentPressPose.current.tiltY;
    }
  });

  return (
    <group ref={driftGroup}>
      <group rotation={[0, 0, diagonal]}>
        <group rotation={[presentationTilt, 0, 0]}>
          <group
            ref={interactionGroup}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerOut={handlePointerOut}
          >
            <group ref={spinGroup}>
              <mesh>
                <extrudeGeometry
                  args={[
                    recordShape,
                    {
                      depth: recordDepth,
                      bevelEnabled: true,
                      bevelThickness,
                      bevelSize: 0.008,
                      bevelSegments: 2,
                      curveSegments: 96,
                    },
                  ]}
                />
                <meshPhysicalMaterial
                  color="#101010"
                  roughness={0.72}
                  metalness={0.08}
                />
              </mesh>

              <mesh position={[0, 0, faceZ]}>
                <ringGeometry args={[0.075, 1.255, 128]} />
                <shaderMaterial
                  vertexShader={grooveVertexShader}
                  fragmentShader={grooveFragmentShader}
                />
              </mesh>

              <mesh position={[0, 0, labelZ]}>
                <ringGeometry args={[0.055, 0.23, 96]} />
                <meshPhysicalMaterial
                  color="#f4f4f4"
                  roughness={0.82}
                  metalness={0}
                />
              </mesh>
            </group>
          </group>

          <mesh position={[0, 0, reflectionZ]}>
            <ringGeometry args={[0.075, 1.255, 128]} />
            <shaderMaterial
              vertexShader={grooveVertexShader}
              fragmentShader={reflectionFragmentShader}
              transparent
              depthWrite={false}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
}

export default function VinylScene() {
  const showNormalVinyl =
    import.meta.env.DEV &&
    new URLSearchParams(window.location.search).get('vinyl') ===
      'normal';

  const containerRef = useRef<HTMLDivElement>(null);
  const [isInViewport, setIsInViewport] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [pressTarget, setPressTarget] = useState<PressTarget>(null);
  const pointerLight = useRef<PointerLightState>({
    x: 0,
    y: 0,
    active: false,
  });

  const motionEnabled =
    isInViewport && isPageVisible && !prefersReducedMotion;

  const releasePress = useCallback(() => {
    setPressTarget(null);
  }, []);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (event.key !== ' ' && event.key !== 'Enter') {
        return;
      }

      event.preventDefault();

      if (!event.repeat) {
        setPressTarget({ x: 0, y: 0, pointerId: null });
      }
    },
    [],
  );

  const handleKeyUp = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();
        releasePress();
      }
    },
    [releasePress],
  );

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const motionQuery = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    );

    const onMotionPreferenceChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    const onPageVisibilityChange = () => {
      setIsPageVisible(!document.hidden);

      if (document.hidden) {
        releasePress();
      }
    };

    const releasePointerPress = (event: PointerEvent) => {
      setPressTarget((current) =>
        current?.pointerId === event.pointerId ? null : current,
      );
    };

    const releaseOnBlur = () => {
      releasePress();
    };

    const observer =
      typeof IntersectionObserver === 'undefined'
        ? null
        : new IntersectionObserver((entries) => {
            setIsInViewport(
              entries.some((entry) => entry.isIntersecting),
            );
          });

    setPrefersReducedMotion(motionQuery.matches);
    onPageVisibilityChange();

    if (observer) {
      observer.observe(container);
    } else {
      setIsInViewport(true);
    }

    motionQuery.addEventListener('change', onMotionPreferenceChange);
    document.addEventListener(
      'visibilitychange',
      onPageVisibilityChange,
    );
    window.addEventListener('pointerup', releasePointerPress);
    window.addEventListener('pointercancel', releasePointerPress);
    window.addEventListener('blur', releaseOnBlur);

    return () => {
      observer?.disconnect();
      motionQuery.removeEventListener(
        'change',
        onMotionPreferenceChange,
      );
      document.removeEventListener(
        'visibilitychange',
        onPageVisibilityChange,
      );
      window.removeEventListener('pointerup', releasePointerPress);
      window.removeEventListener(
        'pointercancel',
        releasePointerPress,
      );
      window.removeEventListener('blur', releaseOnBlur);
    };
  }, [releasePress]);

  return (
    <div ref={containerRef} className="hero-vinyl">
      <Canvas
        camera={{ position: [0, 0, 3.5], fov: 35 }}
        dpr={[1, 1.5]}
        frameloop={motionEnabled ? 'always' : 'demand'}
        gl={{ alpha: true, antialias: true }}
        fallback={<div className="hero-vinyl-fallback" />}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[-2, 3, 4]} intensity={1.5} />
        <Vinyl
          motionEnabled={motionEnabled}
          reducedMotion={prefersReducedMotion}
          pressTarget={pressTarget}
          pressTargetChange={setPressTarget}
          pointerLight={pointerLight}
        />
        {!showNormalVinyl && (
          <AsciiVinylPass
            pointerLight={pointerLight}
            reducedMotion={prefersReducedMotion}
          />
        )}
      </Canvas>

      <button
        className="vinyl-keyboard-control"
        type="button"
        aria-label="Press the vinyl"
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onBlur={releasePress}
      />
    </div>
  );
}
