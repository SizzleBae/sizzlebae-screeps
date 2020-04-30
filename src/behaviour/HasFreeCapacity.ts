import { BTNode, BTResult } from "./BTNode";
import { Blackboard } from "./Blackboard";

export class HasFreeCapacity extends BTNode {
	constructor(public targetAlias: string, public type?: ResourceConstant) {
		super();
	}

	init(blackboard: Blackboard): void {

	}

	run(blackboard: Blackboard): BTResult {
		const target = blackboard.getTarget<{ store: Store<ResourceConstant, false> }>(this.targetAlias);
		if (!target) {
			return BTResult.FAILURE;
		}

		if (target.store.getFreeCapacity(this.type) === 0) {
			return BTResult.FAILURE;
		}

		return BTResult.SUCCESS;
	}
}
