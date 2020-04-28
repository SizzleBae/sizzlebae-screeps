import { BTNode, BTResult } from "./BTNode";
import { Blackboard } from "./Blackboard";

export class HasRemainingCapacity extends BTNode {
	constructor(public type: ResourceConstant, public targetAlias: string = 'target') {
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
