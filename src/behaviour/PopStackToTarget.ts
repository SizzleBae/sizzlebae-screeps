import { BTNode, BTResult } from "./BTNode";
import { Blackboard } from "./Blackboard";

export class PopStack extends BTNode {
	constructor(public targetAlias: string = 'target', public stackAlias: string = 'stack') {
		super();
	}

	init(blackboard: Blackboard): void {

	}

	run(blackboard: Blackboard): BTResult {
		const stack = blackboard.getStack(this.stackAlias);

		if (!stack) {
			return BTResult.FAILURE;
		}

		const target = stack.pop();

		if (!target) {
			return BTResult.FAILURE;
		}

		blackboard.setTarget(this.targetAlias, target);

		return BTResult.SUCCESS;
	}
}
