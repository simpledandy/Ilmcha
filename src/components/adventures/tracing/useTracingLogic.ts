// components/adventures/tracing/useTracingLogic.ts
import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { PanResponder, Animated } from 'react-native';
import type { Segment } from '@/src/types/common';

const MIN_COVERAGE = 0.5;

export const useTracingLogic = (
  topic: string,
  segments: Segment[] | undefined,
  onComplete?: () => void,
  canvasLayout?: { width: number; height: number }
) => {
  const [currentSegment, setCurrentSegment] = useState(0);
  const [completedSegments, setCompletedSegments] = useState<boolean[]>([]);
  const [userPath, setUserPath] = useState<{ x: number; y: number }[]>([]);
  const userPathRef = useRef<{ x: number; y: number }[]>([]);

  // --- Animated values ---
  const dashOffset = useRef(new Animated.Value(0)).current;
  const startDotScale = useRef(new Animated.Value(1)).current;
  const pathOpacity = useRef(new Animated.Value(1)).current;
  const flashAnim = useRef(new Animated.Value(1)).current;

  // --- Refs to avoid stale-closure in PanResponder ---
  const currentSegmentRef = useRef(0);
  const segmentsRef = useRef<Segment[] | undefined>(segments);
  const validateStrokeRef = useRef<
    (segment: Segment, path: { x: number; y: number }[]) => boolean
  >(() => false);
  const markSegmentCompleteRef = useRef<() => void>(() => {});
  const flashFailRef = useRef<() => void>(() => {});

  useEffect(() => { currentSegmentRef.current = currentSegment; }, [currentSegment]);
  useEffect(() => { segmentsRef.current = segments; }, [segments]);

  // Convert normalized point to absolute canvas coords
  const getCanvasPoint = useCallback(
    (pt: { x: number; y: number }) => {
      const w = Math.max(1, canvasLayout?.width ?? 0);
      const h = Math.max(1, canvasLayout?.height ?? 0);
      return { x: pt.x * w, y: pt.y * h };
    },
    [canvasLayout]
  );

  // Dynamic tolerance (small, to prevent tap-to-win)
  const getEffectiveTolerance = useCallback(() => {
    const w = canvasLayout?.width ?? 0;
    const h = canvasLayout?.height ?? 0;
    const base = Math.min(w, h);
    return Math.max(24, Math.min(20, base * 0.03));
  }, [canvasLayout]);

  const flashComplete = useCallback(() => {
    flashAnim.setValue(0);
    Animated.sequence([
      Animated.timing(flashAnim, { toValue: 1.5, duration: 150, useNativeDriver: true }),
      Animated.timing(flashAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
  }, [flashAnim]);

  const flashFail = useCallback(() => {
    Animated.sequence([
      Animated.timing(pathOpacity, { toValue: 0.2, duration: 150, useNativeDriver: true }),
      Animated.timing(pathOpacity, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
  }, [pathOpacity]);

  // Keep a ref to flashFail for PanResponder
  useEffect(() => { flashFailRef.current = flashFail; }, [flashFail]);

  const validateStroke = useCallback((segment: Segment, path: { x: number; y: number }[]) => {
    if (path.length < 2) return false;

    const scaledGuidePoints = (segment.points || []).map(getCanvasPoint);
    if (scaledGuidePoints.length === 0) return false;

    const tol = getEffectiveTolerance();

    const closePoints = scaledGuidePoints.filter((gp) =>
      path.some((up) => Math.hypot(up.x - gp.x, up.y - gp.y) < tol)
    ).length;

    // Require start & end to be close and coverage to be sufficient
    const startClose =
      Math.hypot(path[0].x - scaledGuidePoints[0].x, path[0].y - scaledGuidePoints[0].y) < tol;
    const endPt = scaledGuidePoints[scaledGuidePoints.length - 1];
    const endClose =
      Math.hypot(path[path.length - 1].x - endPt.x, path[path.length - 1].y - endPt.y) < tol;

    if (scaledGuidePoints.length <= 2) {
      return startClose && endClose && closePoints === scaledGuidePoints.length;
    }
    return startClose && endClose && (closePoints / scaledGuidePoints.length >= MIN_COVERAGE);
  }, [getCanvasPoint, getEffectiveTolerance]);

  // Keep a ref to validator for PanResponder
  useEffect(() => { validateStrokeRef.current = validateStroke; }, [validateStroke]);

  const markSegmentComplete = useCallback(() => {
    setCompletedSegments((prev) => {
      const updated = [...prev];
      updated[currentSegmentRef.current] = true; // <-- use ref (latest index)
      return updated;
    });

    flashComplete();
    userPathRef.current = [];
    setUserPath([]);

    setTimeout(() => {
      setCurrentSegment((prev) => {
        const lastIndex = (segmentsRef.current?.length || 1) - 1;
        if (prev < lastIndex) return prev + 1;
        onComplete?.();
        return prev;
      });
    }, 500);
  }, [flashComplete, onComplete]);

  // Keep a ref to completion for PanResponder
  useEffect(() => { markSegmentCompleteRef.current = markSegmentComplete; }, [markSegmentComplete]);

  // Add point
  const addPoint = useCallback((x: number, y: number) => {
    userPathRef.current.push({ x, y });
    setUserPath([...userPathRef.current]);
  }, []);

  // Create PanResponder ONCE, but always use refs for latest state/logic
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: (evt) => {
          const { locationX, locationY } = evt.nativeEvent;
          userPathRef.current = [{ x: locationX, y: locationY }];
          setUserPath([...userPathRef.current]);
        },
        onPanResponderMove: (evt) => {
          const { locationX, locationY } = evt.nativeEvent;
          addPoint(locationX, locationY);
        },
        onPanResponderRelease: () => {
          const idx = currentSegmentRef.current;             // <-- latest current segment
          const seg = segmentsRef.current?.[idx];           // <-- latest segments
          if (seg && validateStrokeRef.current(seg, userPathRef.current)) {
            markSegmentCompleteRef.current();               // <-- latest completion logic
          } else {
            flashFailRef.current();                         // <-- latest fail flash
            userPathRef.current = [];
            setUserPath([]);
          }
        },
      }),
    [addPoint] // handlers use refs; only addPoint is a stable callback dep
  );

  // Reset when topic truly changes
  const lastTopicRef = useRef<string | null>(null);
  useEffect(() => {
    if (lastTopicRef.current !== topic) {
      if (segments?.length) {
        setCompletedSegments(Array(segments.length).fill(false));
        setCurrentSegment(0);
        setUserPath([]);
      }
      lastTopicRef.current = topic;
    }
  }, [topic, segments?.length]);

  // Restart dash & start-dot per active segment
  useEffect(() => {
    dashOffset.setValue(0);
    const dashAnim = Animated.loop(
      Animated.timing(dashOffset, {
        toValue: -30,
        duration: 500,
        useNativeDriver: true,
      })
    );

    startDotScale.setValue(1);
    const startDotAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(startDotScale, { toValue: 1.4, duration: 600, useNativeDriver: true }),
        Animated.timing(startDotScale, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    );

    const timeout = setTimeout(() => {
      dashAnim.start();
      startDotAnim.start();
    }, 300);

    return () => clearTimeout(timeout);
  }, [currentSegment, dashOffset, startDotScale]);

  return {
    currentSegment,
    completedSegments,
    userPath,
    dashOffset,
    startDotScale,
    pathOpacity,
    flashAnim,
    panResponder,
    getCanvasPoint,
  };
};