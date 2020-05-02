import { BTNode, BTResult } from "./BTNode";
import { Blackboard } from "./Blackboard";

export class WalkToPosition extends BTNode {

	public options: MoveToOpts;

	private initialPath: PathStep[] | undefined;

	constructor(public positionAlias: string = 'position', options?: MoveToOpts, ) {
		super();

		if (options) {
			this.options = options;
		} else {
			this.options = {};
		}

		if (!this.options.plainCost) {
			this.options.plainCost = 5;
		}
		if (!this.options.swampCost) {
			this.options.swampCost = 10;
		}
	}

	init(blackboard: Blackboard): void {
		if (!(blackboard.agent instanceof Creep)) {
			return;
		}

		const position = blackboard.getTarget<RoomPosition>(this.positionAlias);
		if (!position) {
			return;
		}

		const options = Object.assign<MoveToOpts, MoveToOpts>({ ignoreCreeps: true }, this.options)
		this.initialPath = blackboard.agent.room.findPath(blackboard.agent.pos, position, options)
	}

	run(blackboard: Blackboard): BTResult {
		if (blackboard.agent instanceof StructureTower) {
			return BTResult.FAILURE;
		}

		const position = blackboard.getTarget<RoomPosition>(this.positionAlias);
		if (!position) {
			return BTResult.FAILURE;
		}


		let range = 0;
		if (this.options && this.options.range) {
			range = this.options.range;
		}

		if (blackboard.agent.pos.getRangeTo(position) <= range) {
			return BTResult.SUCCESS;
		}

		const result = blackboard.agent.moveTo(position, this.options);

		if (result === OK || result === ERR_TIRED) {
			return BTResult.RUNNING;
		}

		return BTResult.FAILURE;
	}

}
