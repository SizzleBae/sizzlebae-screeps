import { BTNode, BTResult } from "./BTNode";
import { Blackboard } from "./Blackboard";

export class PickUpTarget extends BTNode {

	constructor(public targetAlias: string = 'target') {
		super();
	}

	init(blackboard: Blackboard): void {
	}

	run(blackboard: Blackboard): BTResult {
		if (blackboard.agent instanceof StructureTower) {
			return BTResult.FAILURE;
		}

		const target = blackboard.getTarget<Resource<ResourceConstant>>(this.targetAlias);
		if (!target) {
			return BTResult.FAILURE;
		}

		const result = blackboard.agent.pickup(target);

		if (result === OK) {
			return BTResult.RUNNING;
		} else if (result === ERR_FULL) {
			return BTResult.SUCCESS;
		}
		return BTResult.FAILURE;

	}
}
