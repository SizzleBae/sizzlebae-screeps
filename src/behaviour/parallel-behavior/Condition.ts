import { BTNode, BTResult } from "./BTNode";
import { Blackboard } from "./Blackboard";

export class Condition extends BTNode {

	constructor(public predicate: (blackboard: Blackboard) => boolean) {
		super();
	}

	run(blackboard: Blackboard): BTResult {
		if (this.predicate(blackboard)) {
			return BTResult.SUCCESS;
		}
		return BTResult.FAILURE;
	}
}
