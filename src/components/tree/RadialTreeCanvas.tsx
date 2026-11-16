"use client";

import React, { useRef, useState, useMemo, useCallback } from "react";
import { PersonProfile, RelationshipEdge } from "@/types/family";
import { computeRadialGraph, ComputedRadialNode, ComputedRadialEdge, branchColorMap } from "@/lib/services/graph-engine";
import { translations, Language } from "@/lib/i18n/translations";
import { ZoomIn, ZoomOut, Maximize2, Compass, Sparkles, Layers, Edit3, X, ArrowRight } from "lucide-react";

interface RadialTreeCanvasProps {
  focusPersonId: string;
  members: PersonProfile[];
  edges: RelationshipEdge[];
  onSelectPerson: (person: PersonProfile) => void;
  onEditRelationship?: (edge: RelationshipEdge) => void;
  selectedPersonId?: string;
  highlightedPathNodeIds?: string[];
  lang?: Language;
}

export const RadialTreeCanvas: React.FC<RadialTreeCanvasProps> = ({
  focusPersonId,
  members,
  edges,
  onSelectPerson,
  onEditRelationship,
  selectedPersonId,
  highlightedPathNodeIds = [],
  lang = "en",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [showLineLegend, setShowLineLegend] = useState(false);

  const t = translations["en"]; // Pure English as requested

  // Canvas virtual dimensions
  const CANVAS_WIDTH = 1600;
  const CANVAS_HEIGHT = 1300;

  // Compute radial layout with dynamic node scaling and zero-overlap collision resolution
  const { nodes, edges: computedEdges } = useMemo(() => {
    return computeRadialGraph(focusPersonId, members, edges, CANVAS_WIDTH, CANVAS_HEIGHT);
  }, [focusPersonId, members, edges]);

  // Find currently selected edge if any
  const activeEdge = useMemo(() => {
    if (!selectedEdgeId) return null;
    return computedEdges.find(e => e.id === selectedEdgeId) || null;
  }, [selectedEdgeId, computedEdges]);

  // Find original relationship edge for editing
  const rawActiveEdge = useMemo(() => {
    if (!activeEdge) return null;
    return edges.find(e => e.id === activeEdge.id) || null;
  }, [activeEdge, edges]);

  // Reset to center on "Me"
  const handleCenterOnMe = useCallback(() => {
    setScale(1);
    setPan({ x: 0, y: 0 });
    setSelectedEdgeId(null);
  }, []);

  // Pan interaction handlers (only fires on canvas background, never on nodes/badges)
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

  const handleZoom = (delta: number) => {
    setScale(prev => Math.min(Math.max(0.35, prev + delta), 2.5));
  };

  // Requirement 5: Smooth Mouse Wheel / Trackpad Scroll to Zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 0.08 : -0.08;
    setScale(prev => Math.min(Math.max(0.35, prev + zoomFactor), 2.5));
  };

  const getRelationshipIcon = (type: string) => {
    switch (type) {
      case "SPOUSE":
        return "💍";
      case "SIBLING":
        return "🤝";
      case "BIOLOGICAL_PARENT":
      case "CHILD":
        return "🌱";
      case "GRANDPARENT":
      case "GRANDCHILD":
        return "👑";
      case "IN_LAW":
        return "🏡";
      case "COUSIN":
        return "👥";
      default:
        return "🔗";
    }
  };

  const isPathFilterActive = highlightedPathNodeIds.length > 0;

  return (
    <div 
      className="relative w-full h-[740px] bg-[#F8F9FD] rounded-3xl border border-line-border/60 overflow-hidden shadow-inner select-none"
      onWheel={handleWheel}
    >
      {/* Background Subtle Constellation Star Dots */}
      <div 
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#C3C7E5 1.5px, transparent 1.5px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Floating Control Toolbar */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-card border border-line-border">
        <button
          onClick={handleCenterOnMe}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary-hover transition shadow-sm"
          title="Center on Me"
        >
          <Compass className="w-4 h-4" />
          <span>Center on Me</span>
        </button>

        <div className="h-4 w-px bg-line-border" />

        <button
          onClick={() => handleZoom(0.15)}
          className="p-1.5 text-font-muted hover:text-font-main hover:bg-surface-muted rounded-lg transition"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <span className="text-xs font-semibold text-font-muted min-w-[38px] text-center">
          {Math.round(scale * 100)}%
        </span>
        <button
          onClick={() => handleZoom(-0.15)}
          className="p-1.5 text-font-muted hover:text-font-main hover:bg-surface-muted rounded-lg transition"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleCenterOnMe}
          className="p-1.5 text-font-muted hover:text-font-main hover:bg-surface-muted rounded-lg transition"
          title="Fit View"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-line-border" />

        {/* Toggle Line Generation Colors Legend */}
        <button
          onClick={() => setShowLineLegend(!showLineLegend)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition ${
            showLineLegend ? "bg-secondary text-white" : "text-font-muted hover:bg-surface-muted"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Line Colors</span>
        </button>
      </div>

      {/* Active Selected Line Details Banner */}
      {activeEdge && (
        <div className="absolute top-4 right-4 z-20 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-2xl border border-line-border max-w-sm animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between gap-3 pb-2 border-b border-line-border">
            <span className="text-xs font-bold text-font-main flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: activeEdge.color }} />
              Connection Pathway
            </span>
            <button
              onClick={() => setSelectedEdgeId(null)}
              className="p-1 rounded-lg hover:bg-surface-muted text-font-muted"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-2 text-xs space-y-1">
            <div className="flex items-center gap-2 font-semibold text-font-main">
              <span>{members.find(m => m.id === activeEdge.sourceId)?.displayName}</span>
              <ArrowRight className="w-3.5 h-3.5 text-font-muted" />
              <span>{members.find(m => m.id === activeEdge.targetId)?.displayName}</span>
            </div>
            <p className="text-[11px] text-font-muted font-medium">
              {activeEdge.customLabel || activeEdge.relationshipType.replace("_", " ")}
            </p>
          </div>

          {onEditRelationship && rawActiveEdge && (
            <button
              onClick={() => onEditRelationship(rawActiveEdge)}
              className="mt-3 w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-hover shadow-sm transition"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Relationship</span>
            </button>
          )}
        </div>
      )}

      {/* Generation Line Color Legend Overlay */}
      {showLineLegend && (
        <div className="absolute bottom-16 left-4 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-card border border-line-border text-xs space-y-2 animate-in fade-in duration-150">
          <p className="font-bold text-font-main">Line Colors by Bond & Generation:</p>
          <div className="grid grid-cols-1 gap-1.5 text-[11px] text-font-muted">
            <div className="flex items-center gap-2">
              <span className="w-4 h-1 rounded-full bg-[#10B981]" />
              <span>Parent ➔ Child (Generational)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-1 rounded-full bg-[#EC4899]" />
              <span>Spouse / Partner (Marriage Bond)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-1 rounded-full bg-[#3B82F6]" />
              <span>Siblings (Same Generation)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-1 rounded-full bg-[#8B5CF6]" />
              <span>Cousins (Peers)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-1 rounded-full bg-[#6366F1]" />
              <span>In-Laws (Marital Branch)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-1 rounded-full bg-[#F59E0B]" />
              <span>Grandparent (+2 Generations)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-1 rounded-full bg-[#F43F5E] border-b border-dashed" />
              <span>Cross-Link (Inter-branch)</span>
            </div>
          </div>
        </div>
      )}

      {/* Branch Legend Badge Bar */}
      <div className="absolute bottom-4 left-4 z-20 hidden md:flex items-center gap-3 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-card border border-line-border text-xs">
        <span className="font-semibold text-font-main flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          Branches:
        </span>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#5B5BD6]" />
          <span>Immediate</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#16A6A1]" />
          <span>Paternal Side</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F2B66D]" />
          <span>Maternal Side</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" />
          <span>In-Laws</span>
        </div>
      </div>

      {/* Main Interactive SVG & Canvas Viewport */}
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
            {/* Glow Filter for Hero Node */}
            <filter id="hero-glow" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="0" dy="8" stdDeviation="16" floodColor="#5B5BD6" floodOpacity="0.45" />
            </filter>
            {/* Subtle shadow for nodes */}
            <filter id="node-shadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#202235" floodOpacity="0.12" />
            </filter>
            {/* Clean hardware-accelerated shadow for edge badges */}
            <filter id="badge-shadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="1.5" stdDeviation="2.5" floodColor="#000000" floodOpacity="0.14" />
            </filter>
            {/* Clean shadow for name pill */}
            <filter id="pill-shadow" x="-20%" y="-30%" width="140%" height="160%">
              <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#000000" floodOpacity="0.08" />
            </filter>
          </defs>

          {/* Orbit Rings (Visual depth reference lines) */}
          <circle cx={CANVAS_WIDTH / 2} cy={CANVAS_HEIGHT / 2} r={195} fill="none" stroke="#E2E5F5" strokeWidth="1.5" strokeDasharray="4 4" />
          <circle cx={CANVAS_WIDTH / 2} cy={CANVAS_HEIGHT / 2} r={390} fill="none" stroke="#E6E9F8" strokeWidth="1" strokeDasharray="6 6" />
          <circle cx={CANVAS_WIDTH / 2} cy={CANVAS_HEIGHT / 2} r={510} fill="none" stroke="#ECEFFC" strokeWidth="1" strokeDasharray="8 8" />

          {/* Sector Visual Labels in Orbit (Pure English) */}
          <g className="text-xs font-bold fill-[#A0A4BE] tracking-wider uppercase select-none">
            <text x={CANVAS_WIDTH / 2 + 370} y={CANVAS_HEIGHT / 2 - 190}>
              PATERNAL LINEAGE
            </text>
            <text x={CANVAS_WIDTH / 2 - 440} y={CANVAS_HEIGHT / 2 - 190}>
              MATERNAL LINEAGE
            </text>
            <text x={CANVAS_WIDTH / 2 - 400} y={CANVAS_HEIGHT / 2 + 310}>
              IN-LAWS BRANCH
            </text>
          </g>

          {/* ========================================================
              LAYER 1: CONNECTING EDGES (Rendered strictly UNDER nodes!)
              ======================================================== */}
          <g id="tree-edges-layer">
            {computedEdges.map(edge => {
              const isSelectedEdge = selectedEdgeId === edge.id;
              const isConnectedToHovered = hoveredNodeId === edge.sourceId || hoveredNodeId === edge.targetId;
              const isConnectedToSelected = selectedPersonId === edge.sourceId || selectedPersonId === edge.targetId;
              const isPathEdge = isPathFilterActive && 
                highlightedPathNodeIds.includes(edge.sourceId) && 
                highlightedPathNodeIds.includes(edge.targetId);

              const isHighlighted = isSelectedEdge || isConnectedToHovered || isConnectedToSelected || isPathEdge;
              const opacity = isPathFilterActive ? (isPathEdge ? 1 : 0.15) : (isHighlighted ? 1 : 0.8);

              const midX = (edge.sourceX + edge.targetX) / 2;
              const midY = (edge.sourceY + edge.targetY) / 2;
              
              // Gentle curve calculation
              const dx = edge.targetX - edge.sourceX;
              const dy = edge.targetY - edge.sourceY;
              const cx = midX - dy * 0.08;
              const cy = midY + dx * 0.08;

              return (
                <g 
                  key={edge.id}
                  /* Requirement 1: stop propagation on mousedown so clicking icon NEVER triggers drag or shifts */
                  onMouseDown={(e) => {
                    e.stopPropagation();
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedEdgeId(prev => (prev === edge.id ? null : edge.id));
                  }}
                  className="cursor-pointer group"
                >
                  {/* Thicker invisible hover hit path */}
                  <path
                    d={`M ${edge.sourceX} ${edge.sourceY} Q ${cx} ${cy} ${edge.targetX} ${edge.targetY}`}
                    fill="none"
                    stroke="transparent"
                    strokeWidth="20"
                  />

                  {/* Visible Edge Stroke */}
                  <path
                    d={`M ${edge.sourceX} ${edge.sourceY} Q ${cx} ${cy} ${edge.targetX} ${edge.targetY}`}
                    fill="none"
                    stroke={edge.color}
                    strokeWidth={isHighlighted ? 3.5 : 2.2}
                    strokeDasharray={isSelectedEdge || isPathEdge ? "6 4" : edge.isCrossLink ? "6 4" : "none"}
                    opacity={opacity}
                    className="transition-opacity duration-150"
                  />

                  {/* Relationship Badge Icon at midpoint (Rock-solid, zero flicker, hardware accelerated) */}
                  <g 
                    transform={`translate(${cx}, ${cy})`}
                    pointerEvents="none"
                  >
                    <circle 
                      r={13} 
                      fill="#FFFFFF" 
                      stroke={edge.color} 
                      strokeWidth={isHighlighted ? 2.5 : 1.5}
                      filter="url(#badge-shadow)"
                      opacity={opacity}
                    />
                    <text
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize="11"
                      className="select-none"
                      opacity={opacity}
                    >
                      {getRelationshipIcon(edge.relationshipType)}
                    </text>
                  </g>
                </g>
              );
            })}
          </g>

          {/* ========================================================
              LAYER 2: MEMBER NODES (Rendered ON TOP so lines pass UNDER)
              ======================================================== */}
          <g id="tree-nodes-layer">
            {nodes.map(node => {
              const isSelected = selectedPersonId === node.id;
              const isHovered = hoveredNodeId === node.id;
              const isConnectedToActiveEdge = activeEdge && (activeEdge.sourceId === node.id || activeEdge.targetId === node.id);
              const isPathNode = highlightedPathNodeIds.includes(node.id);
              const nodeDiameter = node.radius * 2;
              const displayName = node.profile.displayName;
              const opacity = isPathFilterActive ? (isPathNode ? 1 : 0.25) : 1;

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  /* Requirement 1: stop propagation on mousedown so clicking node NEVER shifts canvas */
                  onMouseDown={(e) => {
                    e.stopPropagation();
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectPerson(node.profile);
                  }}
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  className="cursor-pointer group"
                  filter={node.isHero ? "url(#hero-glow)" : "url(#node-shadow)"}
                  opacity={opacity}
                >
                  {/* Highlight ring on active or path profile (smooth pulse, no coordinate shifting) */}
                  {(isSelected || isConnectedToActiveEdge || isPathNode) && (
                    <g pointerEvents="none">
                      {/* Subtle outer pulsing halo */}
                      <circle
                        r={node.radius + 8}
                        fill="none"
                        stroke={node.isHero ? "#5B5BD6" : node.branchColor}
                        strokeWidth="2.5"
                        opacity="0.6"
                        className="animate-pulse"
                      />
                      {/* Active dashed ring */}
                      <circle
                        r={node.radius + 4}
                        fill="none"
                        stroke={node.isHero ? "#5B5BD6" : node.branchColor}
                        strokeWidth="3"
                        strokeDasharray="6 3"
                      />
                    </g>
                  )}

                  {/* Solid White Backing Circle (Guarantees NO lines bleed through photo!) */}
                  <circle
                    r={node.radius + 1}
                    fill="#FFFFFF"
                  />

                  {/* Node Outer Border Circle */}
                  <circle
                    r={node.radius}
                    fill="#FFFFFF"
                    stroke={node.isHero ? "#5B5BD6" : node.branchColor}
                    strokeWidth={node.isHero ? 4 : 3}
                  />

                  {/* Avatar Clip Path */}
                  <clipPath id={`clip-${node.id}`}>
                    <circle r={node.radius - (node.isHero ? 4 : 3)} />
                  </clipPath>

                  {/* Profile Photo */}
                  <image
                    href={node.profile.avatarUrl}
                    x={-node.radius}
                    y={-node.radius}
                    width={nodeDiameter}
                    height={nodeDiameter}
                    clipPath={`url(#clip-${node.id})`}
                    preserveAspectRatio="xMidYMid slice"
                  />

                  {/* Requirement 4: NEW MEMBER Pill Badge (Stable, rock-solid, zero flicker) */}
                  {node.profile.isNewMember && (
                    <g 
                      transform={`translate(0, ${-node.radius - 10})`}
                      pointerEvents="none"
                    >
                      <rect
                        x="-40"
                        y="-10"
                        width="80"
                        height="20"
                        rx="10"
                        fill="#10B981"
                        stroke="#FFFFFF"
                        strokeWidth="2"
                        filter="url(#badge-shadow)"
                      />
                      <text
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill="#FFFFFF"
                        fontSize="8.5"
                        fontWeight="700"
                        letterSpacing="0.5"
                        className="select-none"
                      >
                        ★ NEW MEMBER
                      </text>
                    </g>
                  )}

                  {/* Hero "ME" Badge */}
                  {node.isHero && (
                    <g 
                      transform={`translate(0, ${node.radius - 2})`}
                      pointerEvents="none"
                    >
                      <rect
                        x="-26"
                        y="-11"
                        width="52"
                        height="22"
                        rx="11"
                        fill="#5B5BD6"
                        stroke="#FFFFFF"
                        strokeWidth="2"
                        filter="url(#badge-shadow)"
                      />
                      <text
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill="#FFFFFF"
                        fontSize="10.5"
                        fontWeight="bold"
                      >
                        ME
                      </text>
                    </g>
                  )}

                  {/* Deceased Memorial Badge */}
                  {node.profile.isDeceased && (
                    <g 
                      transform={`translate(${node.radius - 10}, ${-node.radius + 10})`}
                      pointerEvents="none"
                    >
                      <circle r={9} fill="#202235" stroke="#FFFFFF" strokeWidth="1.5" />
                      <text textAnchor="middle" dominantBaseline="central" fill="#FFFFFF" fontSize="9">
                        🕊
                      </text>
                    </g>
                  )}

                  {/* Name Label Badge (with solid white pill background) */}
                  <g 
                    transform={`translate(0, ${node.radius + (node.isHero ? 20 : 15)})`}
                    pointerEvents="none"
                  >
                    <rect
                      x={-Math.min(nodeDiameter * 0.9, 75)}
                      y="-9"
                      width={Math.min(nodeDiameter * 1.8, 150)}
                      height="18"
                      rx="9"
                      fill="#FFFFFF"
                      stroke="#E7E9F1"
                      strokeWidth="1"
                      filter="url(#pill-shadow)"
                    />
                    <text
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="#202235"
                      fontSize={node.isHero ? "11.5" : node.degree === 1 ? "10.5" : "9.5"}
                      fontWeight="600"
                      className="select-none"
                    >
                      {displayName.length > 17 ? displayName.slice(0, 15) + "…" : displayName}
                    </text>
                  </g>

                  {/* Subtitle / Relation Tag */}
                  {node.profile.branchName && !node.isHero && (
                    <text
                      y={node.radius + 31}
                      textAnchor="middle"
                      fill={node.branchColor}
                      fontSize="9"
                      fontWeight="600"
                      className="select-none"
                      pointerEvents="none"
                    >
                      {node.profile.branchName}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
};
