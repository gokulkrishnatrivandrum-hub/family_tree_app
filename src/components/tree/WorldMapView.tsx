"use client";

import React, { useRef, useState, useMemo } from "react";
import { PersonProfile } from "@/types/family";
import { computeGeographicMapLayout } from "@/lib/services/graph-engine";
import { Globe, ZoomIn, ZoomOut, Maximize2, MapPin, Users, Plane, Sparkles } from "lucide-react";

interface WorldMapViewProps {
  focusPersonId: string;
  members: PersonProfile[];
  onSelectPerson: (person: PersonProfile) => void;
}

export const WorldMapView: React.FC<WorldMapViewProps> = ({
  focusPersonId,
  members,
  onSelectPerson,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);

  const CANVAS_WIDTH = 1400;
  const CANVAS_HEIGHT = 850;

  const { cityNodes, flightLines, focusCityPos } = useMemo(() => {
    return computeGeographicMapLayout(focusPersonId, members, CANVAS_WIDTH, CANVAS_HEIGHT);
  }, [focusPersonId, members]);

  // Pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 0.08 : -0.08;
    setScale(prev => Math.min(Math.max(0.4, prev + zoomFactor), 2.5));
  };

  const uniqueCountriesCount = new Set(cityNodes.map(c => c.country)).size;

  return (
    <div 
      className="relative w-full h-[740px] bg-[#0E1326] rounded-3xl border border-line-border overflow-hidden shadow-2xl select-none"
      onWheel={handleWheel}
    >
      {/* Top Floating Map Diaspora Metric Badge */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-3 bg-[#171D36]/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 text-white shadow-xl">
        <div className="flex items-center gap-2 font-bold text-xs">
          <Globe className="w-4 h-4 text-emerald-400" />
          <span>Global Family Lineage Map</span>
        </div>
        <div className="h-3.5 w-px bg-white/20" />
        <span className="text-xs text-white/80 font-medium">
          {cityNodes.length} Cities across {uniqueCountriesCount} Countries
        </span>
      </div>

      {/* Floating Zoom Controls */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-[#171D36]/90 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/10 text-white shadow-xl">
        <button
          onClick={() => setScale(prev => Math.min(prev + 0.15, 2.5))}
          className="p-1.5 hover:bg-white/10 rounded-lg transition"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <span className="text-xs font-semibold min-w-[36px] text-center">
          {Math.round(scale * 100)}%
        </span>
        <button
          onClick={() => setScale(prev => Math.max(prev - 0.15, 0.4))}
          className="p-1.5 hover:bg-white/10 rounded-lg transition"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={() => { setScale(1); setPan({ x: 0, y: 0 }); }}
          className="p-1.5 hover:bg-white/10 rounded-lg transition"
          title="Reset View"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Interactive Map SVG Viewport */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`w-full h-full cursor-${isDragging ? "grabbing" : "grab"} flex items-center justify-center`}
      >
        <svg
          viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
          className="w-full h-full pointer-events-auto"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
            transformOrigin: "center center",
            transition: isDragging ? "none" : "transform 0.15s ease-out",
          }}
        >
          <defs>
            {/* Glow effect for global connection arcs */}
            <filter id="arc-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#16A6A1" floodOpacity="0.8" />
            </filter>
            <radialGradient id="ocean-radial" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#151C38" />
              <stop offset="100%" stopColor="#0B0F21" />
            </radialGradient>
          </defs>

          {/* Deep Ocean Backdrop */}
          <rect width={CANVAS_WIDTH} height={CANVAS_HEIGHT} fill="url(#ocean-radial)" />

          {/* Grid Longitude & Latitude Lines */}
          <g stroke="#232C52" strokeWidth="0.8" strokeDasharray="3 3">
            {[200, 400, 600, 800, 1000, 1200].map(x => (
              <line key={x} x1={x} y1={0} x2={x} y2={CANVAS_HEIGHT} />
            ))}
            {[150, 300, 450, 600, 750].map(y => (
              <line key={y} x1={0} y1={y} x2={CANVAS_WIDTH} y2={y} />
            ))}
          </g>

          {/* Stylized Continental Landmass Outlines */}
          <g fill="#1E2749" stroke="#313E70" strokeWidth="1.2" opacity="0.6">
            {/* Europe / UK */}
            <path d="M 220 200 Q 260 160 300 180 T 360 240 T 320 310 T 240 280 Z" />
            {/* Middle East & Arabian Peninsula */}
            <path d="M 500 350 Q 560 320 620 370 T 660 480 T 580 500 T 510 420 Z" />
            {/* Indian Subcontinent (Prominent Center) */}
            <path d="M 740 420 Q 820 380 910 430 T 890 620 T 830 730 T 780 620 T 740 480 Z" />
            {/* South East Asia / Singapore / Malaysia */}
            <path d="M 1040 540 Q 1120 520 1180 590 T 1150 720 T 1060 670 Z" />
          </g>

          {/* Flight & Lineage Arcs Radiating from "Me" */}
          <g id="flight-arcs">
            {flightLines.map((line, idx) => {
              const midX = (line.fromX + line.toX) / 2;
              const midY = (line.fromY + line.toY) / 2;
              // Arch height based on distance
              const dx = line.toX - line.fromX;
              const dy = line.toY - line.fromY;
              const dist = Math.hypot(dx, dy);
              const arcOffset = Math.min(dist * 0.28, 120);
              const cx = midX;
              const cy = midY - arcOffset;

              const isHovered = hoveredCity === line.cityName;

              return (
                <g key={idx}>
                  <path
                    d={`M ${line.fromX} ${line.fromY} Q ${cx} ${cy} ${line.toX} ${line.toY}`}
                    fill="none"
                    stroke={isHovered ? "#38BDF8" : "#16A6A1"}
                    strokeWidth={isHovered ? 3.5 : 2}
                    strokeDasharray="6 4"
                    opacity={isHovered ? 1 : 0.75}
                    filter="url(#arc-glow)"
                    className="animate-pulse"
                  />
                  {/* Moving beacon signal on arc */}
                  <circle
                    cx={(midX + cx) / 2}
                    cy={(midY + cy) / 2}
                    r={3.5}
                    fill="#38BDF8"
                    className="animate-ping"
                  />
                </g>
              );
            })}
          </g>

          {/* City Hub Markers & Profile Photo Nodes */}
          {cityNodes.map((city) => {
            const isHome = city.members.some(m => m.id === focusPersonId);
            const isHovered = hoveredCity === city.cityName;

            return (
              <g
                key={city.cityName}
                transform={`translate(${city.x}, ${city.y})`}
                onMouseEnter={() => setHoveredCity(city.cityName)}
                onMouseLeave={() => setHoveredCity(null)}
                className="cursor-pointer group"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectPerson(city.members[0]);
                }}
              >
                {/* Pulsing City Base Ring */}
                <circle
                  r={isHome ? 28 : 22}
                  fill="none"
                  stroke={isHome ? "#5B5BD6" : "#16A6A1"}
                  strokeWidth="2"
                  opacity="0.6"
                  className="animate-ping"
                />

                <circle
                  r={isHome ? 22 : 17}
                  fill="#1B2342"
                  stroke={isHome ? "#5B5BD6" : isHovered ? "#38BDF8" : "#16A6A1"}
                  strokeWidth={isHome ? 3.5 : 2.5}
                />

                {/* Primary Resident Avatar */}
                <clipPath id={`city-clip-${city.cityName}`}>
                  <circle r={isHome ? 19 : 15} />
                </clipPath>

                <image
                  href={city.members[0].avatarUrl}
                  x={-(isHome ? 19 : 15)}
                  y={-(isHome ? 19 : 15)}
                  width={(isHome ? 19 : 15) * 2}
                  height={(isHome ? 19 : 15) * 2}
                  clipPath={`url(#city-clip-${city.cityName})`}
                  preserveAspectRatio="xMidYMid slice"
                />

                {/* Member Count Badge if > 1 */}
                {city.members.length > 1 && (
                  <g transform={`translate(${isHome ? 14 : 11}, ${-(isHome ? 14 : 11)})`}>
                    <circle r={9} fill="#5B5BD6" stroke="#FFFFFF" strokeWidth="1.5" />
                    <text
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="#FFFFFF"
                      fontSize="9"
                      fontWeight="bold"
                    >
                      {city.members.length}
                    </text>
                  </g>
                )}

                {/* City Name Label Card */}
                <g transform={`translate(0, ${isHome ? 34 : 28})`}>
                  <rect
                    x={-55}
                    y={-10}
                    width={110}
                    height={20}
                    rx={10}
                    fill="#151C38"
                    stroke={isHome ? "#5B5BD6" : "#2E3B6E"}
                    strokeWidth="1.2"
                  />
                  <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#FFFFFF"
                    fontSize="10"
                    fontWeight="bold"
                  >
                    {city.cityName}
                  </text>
                </g>

                {/* Country Subtitle */}
                <text
                  y={isHome ? 54 : 48}
                  textAnchor="middle"
                  fill="#94A3B8"
                  fontSize="8.5"
                  fontWeight="600"
                >
                  {isHome ? "★ Home Center" : city.country}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
