import {
  Assignment,
  Building,
  BuildingConfig,
  buildingConfigs,
  InsertUser,
  ParkingArea,
  ParkingState,
  User,
} from "@shared/schema";
import { RESERVED_SPOT_COUNT } from "./config-spots.ts";
import { INITIAL_STATE } from "./config-initialState.ts";


export interface IStorage {
  // User operations (keeping these from the original storage interface)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Parking operations
  getState(): Promise<ParkingState>;
  startSelection(): Promise<ParkingState>;
  drawNext(): Promise<{ assignment: Assignment | null; state: ParkingState }>;
  resetSelection(): Promise<void>;

  // Second round operations
  startSecondRound(): Promise<ParkingState>;
  drawNextSecond(): Promise<{
    assignment: Assignment | null;
    state: ParkingState;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private parkingState: ParkingState;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.currentId = 1;

    // Initialize parking state
    this.parkingState = JSON.parse(JSON.stringify(INITIAL_STATE));
  }

  // User methods (keeping these from the original storage interface)
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Parking methods
  async getState(): Promise<ParkingState> {
    return this.parkingState;
  }

  async startSelection(): Promise<ParkingState> {
    // Initialize the state
    this.parkingState.isStarted = true;
    this.parkingState.isPaused = false;
    this.parkingState.isCompleted = false;
    this.parkingState.assignments = [];
    this.parkingState.currentUnit = null;
    this.parkingState.currentSpot = null;

    return this.parkingState;
  }

  async drawNext(): Promise<{
    assignment: Assignment | null;
    state: ParkingState;
  }> {
    if (
      !this.parkingState.isStarted ||
      this.parkingState.isPaused ||
      this.parkingState.isCompleted
    ) {
      return { assignment: null, state: this.parkingState };
    }

    // Get an unit from unassigned units
    const selectedUnitInfo = this.getNextUnit();

    if (!selectedUnitInfo) {
      // 所有戶別都已分配完成
      this.parkingState.isCompleted = true;
      this.parkingState.isPaused = true;
      this.parkingState.currentUnit = null;
      this.parkingState.currentSpot = null;
      console.log("所有抽籤已完成！");
      return { assignment: null, state: this.parkingState };
    }

    const { building, unit } = selectedUnitInfo;

    // Assign a random spot to the unit
    const assignedSpot = this.assignRandomSpot(building, unit);

    console.log(
      `${unit} => ${assignedSpot} (${this.parkingState.availableSpots.B3.length} B3, ${this.parkingState.availableSpots.B2.length} B2, ${this.parkingState.availableSpots.B1.length} B1, ${this.parkingState.availableSpots.MISS.length} MISS)`,
    );

    if (!assignedSpot) {
      // 無法分配車位時也標記為完成
      this.parkingState.isCompleted = true;
      this.parkingState.isPaused = true;
      console.log("無法分配更多車位，抽籤結束！");
      return { assignment: null, state: this.parkingState };
    }

    // Create the assignment
    const assignment: Assignment = {
      unit,
      building,
      spot: assignedSpot,
    };

    // Update current selection and add assignment
    this.parkingState.currentUnit = unit;
    this.parkingState.currentSpot = assignedSpot;
    this.parkingState.assignments = [
      assignment,
      ...this.parkingState.assignments,
    ];

    return { assignment, state: this.parkingState };
  }

  async resetSelection(): Promise<void> {
    this.parkingState = JSON.parse(JSON.stringify(INITIAL_STATE));
  }

  private getNextUnit(): { building: Building; unit: string } | null {
    // Create a flat array of all unassigned units
    const allUnits: { building: Building; unit: string }[] = [];

    Object.entries(this.parkingState.unassignedUnits).forEach(
      ([building, units]) => {
        units.forEach((unit) => {
          allUnits.push({ building: building as Building, unit });
        });
      }
    );

    if (allUnits.length === 0) {
      return null;
    }

    const selectedIndex = Math.floor(Math.random() * allUnits.length);
    const selected = allUnits[selectedIndex];

    // Remove the selected unit from unassignedUnits
    const unitIndex = this.parkingState.unassignedUnits[
      selected.building
    ].indexOf(selected.unit);

    if (unitIndex > -1) {
      this.parkingState.unassignedUnits[selected.building].splice(unitIndex, 1);
    }

    return selected;
  }

  private getBuildingConfig(building: Building): BuildingConfig {
    // Map individual buildings to their building group
    let buildingGroup: keyof typeof buildingConfigs;
    buildingGroup = building;
    return buildingConfigs[buildingGroup];
  }

  private assignRandomSpot(building: Building, unit: string): string | null {
    const buildingGroup = this.getBuildingGroup(building);

    // 檢查是否為受限戶別
    const hasRestrictedUnit = this.parkingState.restrictedUnits[unit];
    if (hasRestrictedUnit) {
      const spots = this.parkingState.availableSpots[hasRestrictedUnit];
      if (spots && spots.length > 0) {
        const randomIndex = Math.floor(Math.random() * spots.length);
        const selectedSpot = spots[randomIndex];
        spots.splice(randomIndex, 1);
        return selectedSpot;
      }
      return null;
    }

    // 優先使用預留車位
    const reservedKeys = Object.keys(this.parkingState.reservedSpots).filter(
      (key) => key.startsWith(buildingGroup + "_")
    );

    for (const key of reservedKeys) {
      const reservedSpots = this.parkingState.reservedSpots[key];
      if (reservedSpots && reservedSpots.length > 0) {
        const randomIndex = Math.floor(Math.random() * reservedSpots.length);
        const selectedSpot = reservedSpots[randomIndex];
        reservedSpots.splice(randomIndex, 1);
        return selectedSpot;
      }
    }

    // 如果預留車位用完，使用一般車位
    const buildingConfig = this.getBuildingConfig(building);
    const eligibleAreas = buildingConfig.eligibleAreas;

    // 篩選有剩餘車位的區域
    const availableAreas = eligibleAreas.filter(
      (area) =>
        this.parkingState.availableSpots[area] &&
        this.parkingState.availableSpots[area].length >
          RESERVED_SPOT_COUNT[area]
    );

    if (availableAreas.length === 0) {
      return null;
    }

    // 隨機選擇區域
    const randomAreaIndex = Math.floor(Math.random() * availableAreas.length);
    const selectedArea = availableAreas[randomAreaIndex];

    // 隨機選擇車位
    const spots = this.parkingState.availableSpots[selectedArea];
    const randomSpotIndex = Math.floor(Math.random() * spots.length);
    const selectedSpot = spots[randomSpotIndex];

    // 從可用車位中移除
    spots.splice(randomSpotIndex, 1);

    return selectedSpot;
  }

  private getBuildingGroup(building: Building): string {
    return building;
  }

  // Second round methods
  async startSecondRound(): Promise<ParkingState> {
    this.parkingState.isSecondRound = true;
    this.parkingState.isPaused = false;
    this.parkingState.secondRoundAssignments = [];
    this.parkingState.currentUnit = null;
    this.parkingState.currentSpot = null;
    this.parkingState.isSecondRoundCompleted = false;

    return this.parkingState;
  }

  async drawNextSecond(): Promise<{
    assignment: Assignment | null;
    state: ParkingState;
  }> {
    if (this.parkingState.isSecondRoundCompleted) {
      return { assignment: null, state: this.parkingState };
    }

    // Get units that haven't been assigned a second spot yet
    const assignedSecondUnits = this.parkingState.secondRoundAssignments.map(
      (a) => a.unit
    );
    const availableUnits = Object.keys(
      this.parkingState.secondRoundUnits
    ).filter((unit) => !assignedSecondUnits.includes(unit));

    if (availableUnits.length === 0) {
      this.parkingState.isSecondRoundCompleted = true;
      this.parkingState.isPaused = true;
      this.parkingState.currentUnit = null;
      this.parkingState.currentSpot = null;
      return { assignment: null, state: this.parkingState };
    }

    // Select first unit
    const selectedUnit = availableUnits[0];
    const preferredAreas = this.parkingState.secondRoundUnits[selectedUnit];

    // Try to assign a spot from preferred areas
    let assignedSpot: string | null = null;
    for (const area of preferredAreas) {
      const availableSpots = this.parkingState.availableSpots[area];
      if (availableSpots && availableSpots.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableSpots.length);
        assignedSpot = availableSpots[randomIndex];
        availableSpots.splice(randomIndex, 1);
        break;
      } else {
        console.log(`No available spots in ${area} for ${selectedUnit}`);
      }
    }

    if (assignedSpot) {
      const assignment: Assignment = {
        unit: selectedUnit,
        building: selectedUnit.charAt(0) as Building,
        spot: assignedSpot,
      };

      this.parkingState.secondRoundAssignments.push(assignment);
      this.parkingState.currentUnit = selectedUnit;
      this.parkingState.currentSpot = assignedSpot;

      return { assignment, state: this.parkingState };
    } else {
      const excludedAreas = Object.entries(this.parkingState.availableSpots)
        .filter(
          ([area, spots]) =>
            !preferredAreas.includes(area as ParkingArea) && spots.length > 0
        )
        .map(([area]) => area) as ParkingArea[];

      for (const area of excludedAreas) {
        const availableSpots = this.parkingState.availableSpots[area];
        if (availableSpots && availableSpots.length > 0) {
          const randomIndex = Math.floor(Math.random() * availableSpots.length);
          assignedSpot = availableSpots[randomIndex];
          availableSpots.splice(randomIndex, 1);
          break;
        } else {
          console.log(
            `No available spots in ${area} for ${selectedUnit} (secondary)`
          );
        }
      }

      const assignment: Assignment = {
        unit: selectedUnit,
        building: selectedUnit.charAt(0) as Building,
        spot: assignedSpot as string,
      };

      this.parkingState.secondRoundAssignments.push(assignment);
      this.parkingState.currentUnit = selectedUnit;
      this.parkingState.currentSpot = assignedSpot;

      return { assignment, state: this.parkingState };
    }
  }
}

export const storage = new MemStorage();
