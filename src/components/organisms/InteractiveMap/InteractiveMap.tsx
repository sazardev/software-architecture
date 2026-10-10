import { Map as MapLibreMap, Marker, NavigationControl, Popup } from 'maplibre-gl';
import { useEffect, useRef, useState } from 'react';

import 'maplibre-gl/dist/maplibre-gl.css';

import { useMessages } from '@/lib/i18n/use-messages';
import { useTheme } from '@/lib/theme/theme-context';
import { cn } from '@/lib/utils/cn';

import './maplibre-worker';

type MapMarker = {
  coordinates: [number, number];
  label: string;
};

export type InteractiveMapProps = Readonly<{
  center?: [number, number];
  className?: string;
  markers?: MapMarker[];
  zoom?: number;
}>;

const mapStyles = {
  dark: 'https://tiles.openfreemap.org/styles/dark',
  light: 'https://tiles.openfreemap.org/styles/positron',
} as const;

const defaultCenter: [number, number] = [-3.7, 40.42];
const defaultZoom = 4;
const emptyMarkers: MapMarker[] = [];

function canRenderWebgl(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('webgl2') ?? canvas.getContext('webgl');

    return context !== null;
  } catch {
    return false;
  }
}

export function InteractiveMap({
  center = defaultCenter,
  className,
  markers = emptyMarkers,
  zoom = defaultZoom,
}: InteractiveMapProps) {
  const messages = useMessages();
  const { resolvedTheme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const initialPropsRef = useRef({ center, markers, zoom });
  const [error, setError] = useState<string | null>(() =>
    canRenderWebgl() ? null : messages.map.error,
  );

  useEffect(() => {
    const container = containerRef.current;

    if (error !== null || container === null || mapRef.current !== null) {
      return;
    }

    let isCancelled = false;

    try {
      const {
        center: initialCenter,
        markers: initialMarkers,
        zoom: initialZoom,
      } = initialPropsRef.current;

      const map = new MapLibreMap({
        center: initialCenter,
        container,
        zoom: initialZoom,
      });

      map.addControl(new NavigationControl({ showCompass: false }), 'top-right');

      for (const marker of initialMarkers) {
        new Marker()
          .setLngLat(marker.coordinates)
          .setPopup(new Popup({ offset: 24 }).setText(marker.label))
          .addTo(map);
      }

      mapRef.current = map;
    } catch {
      queueMicrotask(() => {
        if (!isCancelled) {
          setError(messages.map.error);
        }
      });
    }

    return () => {
      isCancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [error, messages.map.error]);

  useEffect(() => {
    mapRef.current?.setStyle(mapStyles[resolvedTheme]);
  }, [resolvedTheme]);

  if (error !== null) {
    return (
      <div
        className={cn(
          'my-6 flex h-80 items-center justify-center rounded-lg border border-dashed border-neutral-300 p-6 text-center text-sm text-neutral-500 dark:border-neutral-700 dark:text-neutral-400',
          className,
        )}
        role="alert"
      >
        {error}
      </div>
    );
  }

  return (
    <div
      aria-label={messages.map.label}
      className={cn(
        'relative my-6 h-80 overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800',
        className,
      )}
      ref={containerRef}
      role="region"
    />
  );
}
