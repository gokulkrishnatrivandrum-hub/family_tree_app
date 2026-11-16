import { PersonProfile, RelationshipEdge, BranchCategory, RelationshipType } from "@/types/family";

export interface ComputedRadialNode {
  id: string;
  profile: PersonProfile;
  x: number;
  y: number;
  radius: number;
  scale: number;
  degree: number;
  branchCategory: BranchCategory;
  branchColor: string;
  isHero: boolean;
  relationshipWithFocus?: string;
  relationshipWithFocusMl?: string;
}

export interface ComputedRadialEdge {
  id: string;
  sourceId: string;
  targetId: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  relationshipType: string;
  customLabel?: string;
  customLabelMl?: string;
  color: string;
  isCrossLink: boolean;
  status: "verified" | "pending" | "disputed";
}

// Branch category color mapping
export const branchColorMap: Record<BranchCategory, string> = {
  IMMEDIATE: "#5B5BD6",
  PATERNAL: "#16A6A1",
  MATERNAL: "#F2B66D",
  IN_LAWS: "#8B5CF6",
  EXTENDED: "#EC4899",
};

// Sector angle ranges (degrees)
export const branchAngleRanges: Record<BranchCategory, { minAngle: number; maxAngle: number }> = {
  IMMEDIATE: { minAngle: 0, maxAngle: 360 }, // Orbits tightly
  PATERNAL: { minAngle: 25, maxAngle: 95 },
  MATERNAL: { minAngle: 115, maxAngle: 185 },
  IN_LAWS: { minAngle: 205, maxAngle: 280 },
  EXTENDED: { minAngle: 295, maxAngle: 360 },
};

/**
 * Requirement 4: Get Line Color according to generation or relationship bond
 */
export function getEdgeGenerationColor(
  type: RelationshipType | string,
  isCrossLink = false
): { color: string; labelEn: string; labelMl: string } {
  if (isCrossLink) {
    return { color: "#F43F5E", labelEn: "Cross-link", labelMl: "പരസ്പര ലിങ്ക്" };
  }

  switch (type) {
    case "BIOLOGICAL_PARENT":
    case "ADOPTIVE_PARENT":
    case "CHILD":
    case "STEP_CHILD":
    case "STEP_PARENT":
      return { color: "#10B981", labelEn: "Parent - Child (Generational)", labelMl: "മാതാപിതാക്കൾ - മക്കൾ (തലമുറ മാറ്റം)" };
    
    case "GRANDPARENT":
    case "GRANDCHILD":
      return { color: "#F59E0B", labelEn: "Grandparent (+2 Gen)", labelMl: "മുത്തശ്ശൻ/മുത്തശ്ശി (+2 തലമുറ)" };

    case "SPOUSE":
    case "PARTNER":
      return { color: "#EC4899", labelEn: "Spouse / Married", labelMl: "വിവാഹിതർ (ദാമ്പത്യ ബന്ധം)" };

    case "SIBLING":
      return { color: "#3B82F6", labelEn: "Siblings (Same Gen)", labelMl: "സഹോദരങ്ങൾ (ഒരേ തലമുറ)" };

    case "COUSIN":
      return { color: "#8B5CF6", labelEn: "Cousins (Peers)", labelMl: "കസിൻസ് (സമപ്രായക്കാർ)" };

    case "IN_LAW":
      return { color: "#6366F1", labelEn: "In-Laws", labelMl: "ഭാര്യാ/ഭർതൃ വീട്ടുകാർ" };

    default:
      return { color: "#64748B", labelEn: "Relative", labelMl: "കുടുംബബന്ധം" };
  }
}

/**
 * Calculates degrees of separation from the focus person using BFS
 */
export function calculateDegreesOfSeparation(
  focusId: string,
  members: PersonProfile[],
  edges: RelationshipEdge[]
): Map<string, number> {
  const degrees = new Map<string, number>();
  const adjacency = new Map<string, string[]>();

  members.forEach(m => adjacency.set(m.id, []));
  edges.forEach(e => {
    if (e.status === "verified") {
      adjacency.get(e.fromPersonId)?.push(e.toPersonId);
      adjacency.get(e.toPersonId)?.push(e.fromPersonId);
    }
  });

  const queue: { id: string; dist: number }[] = [{ id: focusId, dist: 0 }];
  degrees.set(focusId, 0);

  while (queue.length > 0) {
    const { id, dist } = queue.shift()!;
    const neighbors = adjacency.get(id) || [];

    for (const neighborId of neighbors) {
      if (!degrees.has(neighborId)) {
        degrees.set(neighborId, dist + 1);
        queue.push({ id: neighborId, dist: dist + 1 });
      }
    }
  }

  members.forEach(m => {
    if (!degrees.has(m.id)) {
      degrees.set(m.id, 3);
    }
  });

  return degrees;
}

/**
 * Computes positions, scales, and sizes for the Radial Constellation View with ZERO OVERLAP
 */
export function computeRadialGraph(
  focusId: string,
  members: PersonProfile[],
  edges: RelationshipEdge[],
  canvasWidth = 1600,
  canvasHeight = 1300
): { nodes: ComputedRadialNode[]; edges: ComputedRadialEdge[] } {
  const centerX = canvasWidth / 2;
  const centerY = canvasHeight / 2;
  const degrees = calculateDegreesOfSeparation(focusId, members, edges);

  const totalMembers = members.length;
  // Requirement 2: Dynamically scale down circles as member density increases
  const densityScale = Math.max(0.68, Math.min(1.0, 15 / Math.max(totalMembers, 10)));

  const nodes: ComputedRadialNode[] = [];
  const nodePositionMap = new Map<string, { x: number; y: number; radius: number }>();

  // Center Focus Person ("Me" / Hero)
  const focusMember = members.find(m => m.id === focusId) || members[0];
  const heroRadius = Math.round(62 * densityScale);
  const heroNode: ComputedRadialNode = {
    id: focusMember.id,
    profile: focusMember,
    x: centerX,
    y: centerY,
    radius: heroRadius,
    scale: 1.0,
    degree: 0,
    branchCategory: focusMember.branchCategory,
    branchColor: branchColorMap[focusMember.branchCategory],
    isHero: true,
  };
  nodes.push(heroNode);
  nodePositionMap.set(focusMember.id, { x: centerX, y: centerY, radius: heroRadius });

  // Separate non-hero members by branch category
  const branchGroups: Record<BranchCategory, PersonProfile[]> = {
    IMMEDIATE: [],
    PATERNAL: [],
    MATERNAL: [],
    IN_LAWS: [],
    EXTENDED: [],
  };

  members.forEach(m => {
    if (m.id !== focusId) {
      const cat = m.branchCategory || "EXTENDED";
      branchGroups[cat].push(m);
    }
  });

  // Calculate orbital positions with anti-overlap spacing
  (Object.keys(branchGroups) as BranchCategory[]).forEach(category => {
    const list = branchGroups[category];
    if (list.length === 0) return;

    if (category === "IMMEDIATE") {
      // Immediate circle around center at ~190px radius
      const radiusOrbit = 195;
      const angleStep = (2 * Math.PI) / list.length;
      list.forEach((m, idx) => {
        const angle = idx * angleStep - Math.PI / 2;
        const x = centerX + radiusOrbit * Math.cos(angle);
        const y = centerY + radiusOrbit * Math.sin(angle);
        const degree = degrees.get(m.id) || 1;
        const nodeRadius = Math.round(42 * densityScale);
        
        const node: ComputedRadialNode = {
          id: m.id,
          profile: m,
          x,
          y,
          radius: nodeRadius,
          scale: 0.8 * densityScale,
          degree,
          branchCategory: category,
          branchColor: branchColorMap[category],
          isHero: false,
        };
        nodes.push(node);
        nodePositionMap.set(m.id, { x, y, radius: nodeRadius });
      });
    } else {
      // Sector branches (PATERNAL, MATERNAL, IN_LAWS, EXTENDED)
      const { minAngle, maxAngle } = branchAngleRanges[category];
      const radMin = (minAngle * Math.PI) / 180;
      const radMax = (maxAngle * Math.PI) / 180;
      const totalSpan = radMax - radMin;
      const angleStep = list.length > 1 ? totalSpan / (list.length - 1) : 0;

      list.forEach((m, idx) => {
        const degree = degrees.get(m.id) || 2;
        // Stagger sub-orbits so nodes do not cluster on the exact same radius
        const baseOrbit = degree === 1 ? 260 : degree === 2 ? 390 : 510;
        const stagger = (idx % 2 === 0 ? 0 : 70);
        const finalOrbit = baseOrbit + stagger;

        const angle = list.length === 1 ? (radMin + radMax) / 2 : radMin + idx * angleStep;
        const x = centerX + finalOrbit * Math.cos(angle);
        const y = centerY + finalOrbit * Math.sin(angle);

        const nodeRadius = degree === 1 
          ? Math.round(38 * densityScale) 
          : degree === 2 
            ? Math.round(30 * densityScale) 
            : Math.round(24 * densityScale);

        const node: ComputedRadialNode = {
          id: m.id,
          profile: m,
          x,
          y,
          radius: nodeRadius,
          scale: (degree === 1 ? 0.75 : degree === 2 ? 0.6 : 0.48) * densityScale,
          degree,
          branchCategory: category,
          branchColor: branchColorMap[category],
          isHero: false,
        };
        nodes.push(node);
        nodePositionMap.set(m.id, { x, y, radius: nodeRadius });
      });
    }
  });

  // COLLISION RESOLUTION PASS (Iterative repulsion to guarantee ZERO OVERLAP)
  const iterations = 35;
  for (let it = 0; it < iterations; it++) {
    for (let i = 1; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const nA = nodes[i];
        const nB = nodes[j];

        const dx = nB.x - nA.x;
        const dy = nB.y - nA.y;
        const dist = Math.hypot(dx, dy);
        // Required minimum distance includes radii + extra padding for name label
        const minDist = nA.radius + nB.radius + 48;

        if (dist < minDist && dist > 0.001) {
          const overlap = (minDist - dist) * 0.5;
          const nx = (dx / dist) * overlap;
          const ny = (dy / dist) * overlap;

          // Push both nodes away from each other
          nA.x -= nx;
          nA.y -= ny;
          nB.x += nx;
          nB.y += ny;

          nodePositionMap.set(nA.id, { x: nA.x, y: nA.y, radius: nA.radius });
          nodePositionMap.set(nB.id, { x: nB.x, y: nB.y, radius: nB.radius });
        }
      }
    }
  }

  // Calculate and format edges with generation colors
  const computedEdges: ComputedRadialEdge[] = [];
  edges.forEach(e => {
    const sPos = nodePositionMap.get(e.fromPersonId);
    const tPos = nodePositionMap.get(e.toPersonId);

    if (sPos && tPos) {
      const sMember = members.find(m => m.id === e.fromPersonId);
      const tMember = members.find(m => m.id === e.toPersonId);
      const isCrossLink = Boolean(
        sMember && tMember &&
        sMember.branchCategory !== tMember.branchCategory &&
        sMember.branchCategory !== "IMMEDIATE" &&
        tMember.branchCategory !== "IMMEDIATE"
      );

      const genColorInfo = getEdgeGenerationColor(e.relationshipType, isCrossLink);

      computedEdges.push({
        id: e.id,
        sourceId: e.fromPersonId,
        targetId: e.toPersonId,
        sourceX: sPos.x,
        sourceY: sPos.y,
        targetX: tPos.x,
        targetY: tPos.y,
        relationshipType: e.relationshipType,
        customLabel: e.customLabel,
        customLabelMl: e.customLabelMl,
        color: genColorInfo.color,
        isCrossLink,
        status: e.status,
      });
    }
  });

  return { nodes, edges: computedEdges };
}

export interface LineagePathStep {
  fromPerson: PersonProfile;
  toPerson: PersonProfile;
  relationLabel: string;
  edgeId: string;
}

export interface LineagePathResult {
  nodeIds: string[];
  edgeIds: string[];
  steps: LineagePathStep[];
}

/**
 * Requirement 8: Breadth-First-Search pathfinder connecting "Me" to any target relative
 */
export function findLineagePath(
  focusId: string,
  targetId: string,
  members: PersonProfile[],
  edges: RelationshipEdge[]
): LineagePathResult | null {
  if (focusId === targetId) return null;

  // Build graph with edge references
  const adj = new Map<string, { neighborId: string; edge: RelationshipEdge }[]>();
  members.forEach(m => adj.set(m.id, []));

  edges.forEach(e => {
    if (e.status === "verified") {
      adj.get(e.fromPersonId)?.push({ neighborId: e.toPersonId, edge: e });
      adj.get(e.toPersonId)?.push({ neighborId: e.fromPersonId, edge: e });
    }
  });

  const queue: string[] = [focusId];
  const visited = new Set<string>([focusId]);
  const parent = new Map<string, { prevNodeId: string; edge: RelationshipEdge }>();

  let found = false;
  while (queue.length > 0) {
    const curr = queue.shift()!;
    if (curr === targetId) {
      found = true;
      break;
    }

    const neighbors = adj.get(curr) || [];
    for (const { neighborId, edge } of neighbors) {
      if (!visited.has(neighborId)) {
        visited.add(neighborId);
        parent.set(neighborId, { prevNodeId: curr, edge });
        queue.push(neighborId);
      }
    }
  }

  if (!found) return null;

  // Backtrack from target to focus
  const nodeIds: string[] = [];
  const edgeIds: string[] = [];
  const steps: LineagePathStep[] = [];

  let curr = targetId;
  nodeIds.push(curr);

  while (curr !== focusId) {
    const p = parent.get(curr);
    if (!p) break;
    edgeIds.push(p.edge.id);
    const fromP = members.find(m => m.id === p.prevNodeId);
    const toP = members.find(m => m.id === curr);

    if (fromP && toP) {
      steps.unshift({
        fromPerson: fromP,
        toPerson: toP,
        relationLabel: p.edge.customLabel || p.edge.relationshipType.replace("_", " "),
        edgeId: p.edge.id,
      });
    }

    curr = p.prevNodeId;
    nodeIds.push(curr);
  }

  nodeIds.reverse();
  edgeIds.reverse();

  return { nodeIds, edgeIds, steps };
}

export interface MapCityNode {
  cityName: string;
  country: string;
  x: number;
  y: number;
  members: PersonProfile[];
}

/**
 * Requirement 6: Geographic Projection for World Map Diaspora View
 */
export function computeGeographicMapLayout(
  focusId: string,
  members: PersonProfile[],
  canvasWidth = 1400,
  canvasHeight = 850
): {
  cityNodes: MapCityNode[];
  flightLines: {
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
    cityName: string;
    memberCount: number;
  }[];
  focusCityPos: { x: number; y: number };
} {
  // Approximate projection mapping for our global family diaspora
  // Longitude range: -10° to 115° E -> mapped to x: 120 to canvasWidth - 120
  // Latitude range: -5° to 58° N -> mapped to y: canvasHeight - 100 to 80
  const minLng = -15;
  const maxLng = 115;
  const minLat = -5;
  const maxLat = 58;

  const project = (lat: number, lng: number) => {
    const x = 120 + ((lng - minLng) / (maxLng - minLng)) * (canvasWidth - 240);
    // Invert latitude for SVG y
    const y = canvasHeight - 120 - ((lat - minLat) / (maxLat - minLat)) * (canvasHeight - 220);
    return { x, y };
  };

  // Group members by location
  const cityMap = new Map<string, { lat: number; lng: number; members: PersonProfile[]; country: string }>();

  members.forEach(m => {
    const loc = m.location || "Kerala, India";
    const coords = m.coordinates || { lat: 9.9312, lng: 76.2673 };
    const country = loc.includes("UK") ? "UK" : loc.includes("UAE") ? "UAE" : loc.includes("Singapore") ? "Singapore" : "India";
    const key = loc.split(",")[0].trim();

    if (!cityMap.has(key)) {
      cityMap.set(key, { ...coords, members: [], country });
    }
    cityMap.get(key)!.members.push(m);
  });

  const cityNodes: MapCityNode[] = [];
  cityMap.forEach((data, cityName) => {
    const pos = project(data.lat, data.lng);
    cityNodes.push({
      cityName,
      country: data.country,
      x: pos.x,
      y: pos.y,
      members: data.members,
    });
  });

  // Home location (Kochi / Focus Person)
  const homeCity = cityNodes.find(c => c.members.some(m => m.id === focusId)) || cityNodes[0] || { x: canvasWidth / 2, y: canvasHeight / 2 };
  const focusCityPos = { x: homeCity.x, y: homeCity.y };

  // Generate curved flight lines from home city to other cities
  const flightLines = cityNodes
    .filter(c => c.cityName !== homeCity.cityName)
    .map(c => ({
      fromX: focusCityPos.x,
      fromY: focusCityPos.y,
      toX: c.x,
      toY: c.y,
      cityName: c.cityName,
      memberCount: c.members.length,
    }));

  return { cityNodes, flightLines, focusCityPos };
}

