import { BTNode, BTResult } from "./BTNode";
import { Blackboard } from "./Blackboard";

export class TransferToTarget extends BTNode {

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

		const target = blackboard.getTarget<Creep | PowerCreep | Structure<StructureConstant>>(this.targetAlias);
		if (!target) {
			return BTResult.FAILURE;
		}

		// const oldCount = blackboard.agent.store[this.type];

		// const remaining = this.amount ? this.amount - this.transferredCount : undefined;

		const result = blackboard.agent.transfer(target, this.type, this.amount);
		// const newCount = blackboard.agent.store[this.type];

		// const change = newCount - oldCount;

		// this.transferredCount += change;

		if (result === OK) {
			// if (!this.amount || this.transferredCount < this.amount) {
			// 	return BTResult.RUNNING;
			// } else {
			return BTResult.SUCCESS;
			// }
		}

		return BTResult.FAILURE;

	}
}
