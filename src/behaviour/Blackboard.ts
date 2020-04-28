export type Blackboard = {
	agent: Creep | StructureTower;
	targets: Record<string, any>;
	stacks: Record<string, any[]>;
	position?: RoomPosition;
}
