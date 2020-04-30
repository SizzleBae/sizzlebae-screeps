import { BTNode, BTResult } from "./BTNode";
import { Blackboard } from "./Blackboard";

export class RepairTarget extends BTNode {

	constructor(public targetAlias: string) {
		super();
	}

	init(blackboard: Blackboard): void {
	}

	run(blackboard: Blackboard): BTResult {

		const target = blackboard.getTarget<Structure<StructureConstant>>(this.targetAlias);
		if (!target) {
			return BTResult.FAILURE;
		}

		const result = blackboard.agent.repair(target);

		if (result === OK) {
			return BTResult.SUCCESS;
			// if (target.hits < target.hitsMax) {
			// } else {
			// 	return BTResult.FAILURE;
			// }
		} else {
			return BTResult.FAILURE;
		}
	}
}
