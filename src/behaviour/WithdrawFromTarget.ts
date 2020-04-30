import { BTNode, BTResult } from "./BTNode";
import { Blackboard } from "./Blackboard";

export class WithdrawFromTarget extends BTNode {

	// transferredCount: number = 0;

	constructor(public type: ResourceConstant, public targetAlias: string, public amount?: number) {
		super();
	}

	init(blackboard: Blackboard): void {
		// this.transferredCount = 0;
	}

	run(blackboard: Blackboard): BTResult {
		if (blackboard.agent instanceof StructureTower) {
			return BTResult.FAILURE;
		}

		const target = blackboard.getTarget<Structure<StructureConstant> | Tombstone | Ruin>(this.targetAlias);
		if (!target) {
			return BTResult.FAILURE;
		}

		// const oldCount = blackboard.agent.store[this.type];

		// const remaining = this.amount ? this.amount  : undefined;

		const result = blackboard.agent.withdraw(target, this.type, this.amount);
		// const newCount = blackboard.agent.store[this.type];

		// const change = newCount - oldCount;

		// this.transferredCount += change;

		if (result === OK || ERR_FULL) {
			return BTResult.SUCCESS;
		} else {
			return BTResult.FAILURE;
		}
	}
}
