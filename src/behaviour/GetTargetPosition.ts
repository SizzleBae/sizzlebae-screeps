import { BTNode, BTResult } from "./BTNode";
import { Blackboard } from "./Blackboard";

export class GetTargetPosition extends BTNode {
	constructor(public targetAlias: string = 'target', public positionAlias = 'position') {
		super();
	}

	init(blackboard: Blackboard): void {

	}

	run(blackboard: Blackboard): BTResult {
		const target = blackboard.getTarget<RoomObject>(this.targetAlias);

		if (!target) {
			return BTResult.FAILURE;
		}

		if (!target.pos) {
			return BTResult.FAILURE;
		}

		blackboard.setTarget(this.positionAlias, target.pos);
		return BTResult.SUCCESS;
	}
}
