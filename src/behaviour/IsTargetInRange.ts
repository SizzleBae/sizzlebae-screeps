import { BTNode, BTResult } from "./BTNode";
import { Blackboard } from "./Blackboard";

export class IsTargetInRange extends BTNode {
	constructor(public targetAlias: string, public positionAlias: string, public range: number) {
		super();
	}

	init(blackboard: Blackboard): void {

	}

	run(blackboard: Blackboard): BTResult {
		const target = blackboard.getTarget<RoomObject>(this.targetAlias);
		if (!target) {
			return BTResult.FAILURE;
		}

		const position = blackboard.getTarget<RoomPosition>(this.positionAlias);
		if (!position) {
			return BTResult.FAILURE;
		}

		if (target.pos.inRangeTo(position, this.range)) {
			return BTResult.SUCCESS;
		}
		return BTResult.FAILURE;
	}
}
