import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

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

type VinylMotionProps = {
  motionEnabled: boolean;
  reducedMotion: boolean;
};

function Vinyl({ motionEnabled, reducedMotion }: VinylMotionProps) {
  const driftGroup = useRef<THREE.Group>(null);
  const spinGroup = useRef<THREE.Group>(null);
  const elapsedSeconds = useRef(0);
  const lastFrameTime = useRef<number | null>(null);

  const recordShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.absarc(0, 0, 1, 0, Math.PI * 2, false);

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

  useEffect(() => {
    lastFrameTime.current = null;

    if (reducedMotion) {
      elapsedSeconds.current = 0;

      if (spinGroup.current) {
        spinGroup.current.rotation.z = 0;
      }

      if (driftGroup.current) {
        driftGroup.current.position.y = 0;
      }
    }
  }, [motionEnabled, reducedMotion]);

  useFrame((state) => {
    if (!motionEnabled) {
      return;
    }

    const now = performance.now();

    if (lastFrameTime.current === null) {
      lastFrameTime.current = now;
      return;
    }

    elapsedSeconds.current += (now - lastFrameTime.current) / 1000;
    lastFrameTime.current = now;

    const spinPhase = (elapsedSeconds.current % 24) / 24;
    const driftPhase = (elapsedSeconds.current % 4.5) / 4.5;
    const driftAmplitude =
      (5 * state.viewport.height) / state.size.height;

    if (spinGroup.current) {
      spinGroup.current.rotation.z = -spinPhase * Math.PI * 2;
    }

    if (driftGroup.current) {
      driftGroup.current.position.y =
        Math.sin(driftPhase * Math.PI * 2) * driftAmplitude;
    }
  });

  return (
    <group ref={driftGroup}>
      <group rotation={[0, 0, diagonal]}>
        <group rotation={[presentationTilt, 0, 0]}>
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
              <ringGeometry args={[0.075, 0.985, 128]} />
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

          <mesh position={[0, 0, reflectionZ]}>
            <ringGeometry args={[0.075, 0.985, 128]} />
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInViewport, setIsInViewport] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const motionEnabled =
    isInViewport && isPageVisible && !prefersReducedMotion;

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
    };
  }, []);

  return (
    <div ref={containerRef} className="hero-vinyl" aria-hidden="true">
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
        />
      </Canvas>
    </div>
  );
}
