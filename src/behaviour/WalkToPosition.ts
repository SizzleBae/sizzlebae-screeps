import { BTNode, BTResult } from "./BTNode";
import { Blackboard } from "./Blackboard";

export class WalkToPosition extends BTNode {

	constructor(public options?: MoveToOpts, public positionAlias: string = 'position') {
		super();

	}

	init(blackboard: Blackboard): void {
	}

	run(blackboard: Blackboard): BTResult {
		if (blackboard.agent instanceof StructureTower) {
			return BTResult.FAILURE;
		}

		const position = blackboard.getTarget<RoomPosition>(this.positionAlias);
		if (!position) {
			console.log('Failed to run WalkToPosition: Missing position')
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
