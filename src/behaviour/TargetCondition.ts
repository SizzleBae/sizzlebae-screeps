import { BTNode, BTResult } from "./BTNode";
import { Blackboard } from "./Blackboard";

export class TargetCondition<T> extends BTNode {
	constructor(public targetAlias: string, public condition: (target: T) => boolean) {
		super();
	}

	init(blackboard: Blackboard): void {

	}

	run(blackboard: Blackboard): BTResult {
		const target = blackboard.getTarget<T>(this.targetAlias);
		if (!target) {
			return BTResult.FAILURE;
		}

		if (this.condition(target)) {
			return BTResult.SUCCESS;
		}

		return BTResult.FAILURE;
	}
}
