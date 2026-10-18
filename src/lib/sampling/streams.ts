import { Random } from '../random/index.ts';

export interface ReservoirState {
  /** Items currently kept, by their position in the stream. */
  reservoir: number[];
  /** Number of items seen so far. */
  seen: number;
  /** What happened with the last item: kept in a free slot, replaced a slot, or discarded. */
  last: {
    item: number;
    action: 'llenar' | 'reemplazar' | 'descartar';
    slot: number;
    draw: number;
  } | null;
}

export function emptyReservoir(): ReservoirState {
  return { reservoir: [], seen: 0, last: null };
}

/**
 * One step of Vitter's algorithm R: the first k items fill the reservoir; item
 * t (1-based) then replaces a uniformly chosen slot with probability k/t. After
 * t items, each of them is in the reservoir with probability k/t.
 */
export function reservoirStep(state: ReservoirState, k: number, random: Random): ReservoirState {
  const item = state.seen;
  const t = state.seen + 1;
  if (state.reservoir.length < k) {
    return {
      reservoir: [...state.reservoir, item],
      seen: t,
      last: { item, action: 'llenar', slot: state.reservoir.length, draw: state.reservoir.length },
    };
  }
  const draw = random.int(0, t - 1);
  if (draw < k) {
    const reservoir = [...state.reservoir];
    reservoir[draw] = item;
    return { reservoir, seen: t, last: { item, action: 'reemplazar', slot: draw, draw } };
  }
  return {
    reservoir: state.reservoir,
    seen: t,
    last: { item, action: 'descartar', slot: -1, draw },
  };
}

/** Runs algorithm R over a stream of the given length and returns the final reservoir. */
export function reservoirSample(length: number, k: number, random: Random): number[] {
  let state = emptyReservoir();
  for (let i = 0; i < length; i += 1) state = reservoirStep(state, k, random);
  return state.reservoir;
}

export interface Network {
  /** Adjacency lists. */
  neighbors: number[][];
  /** Positions in [0, 1]² for drawing. */
  x: number[];
  y: number[];
  /** Hidden trait that defines the target population. */
  member: boolean[];
}

/**
 * A random geometric network where members of a hidden population cluster
 * together: members link mostly to members, as in networks of people who
 * share a rare condition or activity.
 */
export function hiddenPopulationNetwork(
  size: number,
  memberShare: number,
  homophily: number,
  random: Random,
): Network {
  const x: number[] = [];
  const y: number[] = [];
  const member: boolean[] = [];
  const centers = [
    [0.3, 0.35],
    [0.7, 0.65],
  ];
  for (let i = 0; i < size; i += 1) {
    const isMember = random.next() < memberShare;
    member.push(isMember);
    if (isMember) {
      const c = centers[random.int(0, centers.length - 1)] ?? [0.5, 0.5];
      x.push(Math.min(0.97, Math.max(0.03, (c[0] ?? 0.5) + random.normal(0, 0.12))));
      y.push(Math.min(0.97, Math.max(0.03, (c[1] ?? 0.5) + random.normal(0, 0.12))));
    } else {
      x.push(random.uniform(0.03, 0.97));
      y.push(random.uniform(0.03, 0.97));
    }
  }
  const neighbors = Array.from({ length: size }, () => [] as number[]);
  const radius = 0.16;
  for (let i = 0; i < size; i += 1) {
    for (let j = i + 1; j < size; j += 1) {
      const d = Math.hypot((x[i] ?? 0) - (x[j] ?? 0), (y[i] ?? 0) - (y[j] ?? 0));
      if (d > radius) continue;
      const same = member[i] === member[j];
      const p = (same ? homophily : 1 - homophily) * (1 - d / radius);
      if (random.next() < p) {
        neighbors[i]?.push(j);
        neighbors[j]?.push(i);
      }
    }
  }
  return { neighbors, x, y, member };
}

export interface SnowballWave {
  /** Units recruited in this wave. */
  recruits: number[];
  /** For each recruit, who referred them (-1 for seeds). */
  referrers: number[];
}

/**
 * Snowball sampling: each recruited member names up to `coupons` of their
 * neighbors who are members and have not been recruited yet.
 */
export function snowballWaves(
  network: Network,
  seeds: readonly number[],
  coupons: number,
  waves: number,
  random: Random,
): SnowballWave[] {
  const recruited = new Set(seeds);
  const result: SnowballWave[] = [{ recruits: [...seeds], referrers: seeds.map(() => -1) }];
  let frontier = [...seeds];
  for (let w = 1; w <= waves; w += 1) {
    const recruits: number[] = [];
    const referrers: number[] = [];
    for (const person of frontier) {
      const candidates = (network.neighbors[person] ?? []).filter(
        (other) => network.member[other] && !recruited.has(other),
      );
      for (const other of random.sample(candidates, coupons)) {
        if (recruited.has(other)) continue;
        recruited.add(other);
        recruits.push(other);
        referrers.push(person);
      }
    }
    result.push({ recruits, referrers });
    if (recruits.length === 0) break;
    frontier = recruits;
  }
  return result;
}
