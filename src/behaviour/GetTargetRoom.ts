import { BTNode, BTResult } from "./BTNode";
import { Blackboard } from "./Blackboard";

export class GetTargetRoom extends BTNode {
	constructor(public roomAlias: string = 'room', public targetAlias: string = 'target') {
		super();
	}

	init(blackboard: Blackboard): void {

	}

	run(blackboard: Blackboard): BTResult {
		const target = blackboard.getTarget<RoomObject>(this.targetAlias);
		if (!target) {
			return BTResult.FAILURE;
		}

		blackboard.setTarget(this.roomAlias, target.room);
		return BTResult.SUCCESS;
	}
}
