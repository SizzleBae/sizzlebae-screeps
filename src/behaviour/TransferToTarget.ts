import { BTNode, BTResult } from "./BTNode";
import { Blackboard } from "./Blackboard";

export class TransferToTarget extends BTNode {

	transferredCount: number = 0;

	constructor(public type: ResourceConstant, public alias: string = 'target', public amount?: number) {
		super();
	}

	init(blackboard: Blackboard): void {
		this.transferredCount = 0;
	}

	run(blackboard: Blackboard): BTResult {
		if (blackboard.agent instanceof StructureTower) {
			return BTResult.FAILURE;
		}

		const target = blackboard.targets[this.alias];
		if (!target) {
			console.log('Failed to init TransferToTarget: Missing target')
			return BTResult.FAILURE;
		}

		const oldCount = blackboard.agent.store[this.type];

		const remaining = this.amount ? this.amount - this.transferredCount : oldCount;

		const result = blackboard.agent.transfer(target as any, this.type, remaining);
		const newCount = blackboard.agent.store[this.type];

		const change = newCount - oldCount;

		this.transferredCount += change;

		if (result === OK) {
			if (!this.amount || this.transferredCount < this.amount) {
				return BTResult.RUNNING;
			}

			return BTResult.SUCCESS;

		} else {
			return BTResult.FAILURE;
		}
	}
}
