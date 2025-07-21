import {
  AVAILABLE_SPOTS_B1,
  AVAILABLE_SPOTS_B2,
  AVAILABLE_SPOTS_B3,
  AVAILABLE_SPOTS_MISS,
} from "./config-spots.ts";
import { shuffleArray } from "./shuffleArray.ts";
import { SWAPPING_UNITS} from "./config-units.ts";
import secondRoundData from "./second.json";
import type { ParkingArea, ParkingState } from "@shared/schema.ts";

export const INITIAL_STATE = {
  allSpots: {
    B3: Array.from(AVAILABLE_SPOTS_B3),
    B2: Array.from(AVAILABLE_SPOTS_B2),
    B1: Array.from(AVAILABLE_SPOTS_B1),
    MISS: Array.from(AVAILABLE_SPOTS_MISS),
  },
  availableSpots: {
    B3: shuffleArray(Array.from(AVAILABLE_SPOTS_B3)),
    B2: shuffleArray(Array.from(AVAILABLE_SPOTS_B2)),
    B1: shuffleArray(Array.from(AVAILABLE_SPOTS_B1)),
    MISS: shuffleArray(Array.from(AVAILABLE_SPOTS_MISS)),
  },
  reservedSpots: {},
  unassignedUnits: JSON.parse(JSON.stringify(SWAPPING_UNITS)),
  bicycleSpots: [],
  friendlySpots: [],
  restrictedUnits: {},
  assignments: [],
  currentUnit: null,
  currentSpot: null,
  isStarted: false,
  isPaused: false,
  isCompleted: false,

  // Second round properties
  isSecondRound: false,
  secondRoundUnits: secondRoundData as Record<string, ParkingArea[]>,
  secondRoundAssignments: [],
  isSecondRoundCompleted: false,
} satisfies ParkingState
