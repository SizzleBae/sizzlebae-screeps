import { BTNode, BTResult } from "./BTNode";
import { Blackboard } from "./Blackboard";

export class WithdrawFromTarget extends BTNode {

	constructor(public type: ResourceConstant, public targetAlias: string, public amount?: number) {
		super();
	}

	init(blackboard: Blackboard): void {
	}

	run(blackboard: Blackboard): BTResult {
		if (blackboard.agent instanceof StructureTower) {
			return BTResult.FAILURE;
		}

		const target = blackboard.getTarget<Structure<StructureConstant> | Tombstone | Ruin>(this.targetAlias);
		if (!target) {
			return BTResult.FAILURE;
		}

		// const result = blackboard.agent.withdraw(target, this.type, this.amount);

		// if (result === OK || ERR_FULL) {
		// 	return BTResult.SUCCESS;
		// } else {
		// 	return BTResult.FAILURE;
		// }
		const result = blackboard.agent.withdraw(target, this.type, this.amount);

		if (result === OK) {
			return BTResult.SUCCESS;
		} else {
			return BTResult.FAILURE;
		}

	}
}
