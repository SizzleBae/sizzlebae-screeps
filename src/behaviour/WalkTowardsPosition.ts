import { BTNode, BTResult } from "./BTNode";
import { Blackboard } from "./Blackboard";

export class WalkTowardsPosition extends BTNode {

	private path: PathStep[] | undefined;
	private lastTowards: RoomPosition | undefined;
	private lastPosition: RoomPosition | undefined;
	private hasQueuedMove = false;

	private fails = 0;

	// private pathFinderOptions: PathFinderOpts = {
	// 	roomCallback: (roomName: string) => {
	// 		const matrix = new PathFinder.CostMatrix()

	// 		const room = Game.rooms[roomName];
	// 		if (room) {
	// 			const lookAt = room.lookAtArea(0, 0, 0, 0);
	// 			for (let y = 0; y < 50; y++) {
	// 				for (let x = 0; x < 50; x++) {
	// 					let cost = 0;
	// 					lookAt[y][x].forEach(obj => {
	// 						if (obj.structure) {
	// 							if (obj.structure.structureType === 'road') {

	// 							}
	// 						}
	// 					})
	// 				}
	// 			}


	// 			matrix.set()
	// 		}

	// 		return matrix;
	// 	}
	// };

	constructor(public positionAlias: string, public options: FindPathOpts = { range: 0 }) {
		super();

	}

	init(blackboard: Blackboard): void {
		this.fails = 0;
		this.hasQueuedMove = false;
		if (!(blackboard.agent instanceof Creep)) {
			return;
		}

		const position = blackboard.getTarget<RoomPosition>(this.positionAlias);
		if (!position) {
			return;
		}

		this.findPath(blackboard.agent.pos, position, false);

	}

	run(blackboard: Blackboard): BTResult {
		if (!(blackboard.agent instanceof Creep)) {
			return BTResult.FAILURE;
		}

		if (!this.path) {
			return BTResult.FAILURE;
		}

		const position = blackboard.getTarget<RoomPosition>(this.positionAlias);
		if (!position) {
			return BTResult.FAILURE;
		}

		if (this.path.length === 0) {
			return BTResult.SUCCESS;
		}

		if (this.fails > 2) {
			return BTResult.FAILURE;
		}

		if (this.lastPosition && this.hasQueuedMove && this.lastPosition.isEqualTo(blackboard.agent.pos)) {
			this.fails++;
			this.hasQueuedMove = false;
			this.findPath(blackboard.agent.pos, position, false);
		}
		this.lastPosition = blackboard.agent.pos;

		if (this.lastTowards && !position.isEqualTo(this.lastTowards)) {
			this.findPath(blackboard.agent.pos, position, false);
		}

		const result = blackboard.agent.moveByPath(this.path);

		if (result === OK) {
			this.hasQueuedMove = true;
		}

		if (result === ERR_TIRED || result === OK) {
			return BTResult.SUCCESS;
		}

		return BTResult.FAILURE;
	}

	private findPath(from: RoomPosition, towards: RoomPosition, ignoreCreeps: boolean) {
		this.lastTowards = towards;
		this.path = from.findPathTo(towards, Object.assign({ ignoreCreeps }, this.options));
	}

}
