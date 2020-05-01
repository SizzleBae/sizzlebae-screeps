import { BTNode, BTResult, BTNodeDecorator } from "./BTNode";
import { Blackboard } from "./Blackboard";

export class AlwaysSucceed extends BTNodeDecorator {
	constructor(child: BTNode) {
		super(child);
	}

	init(blackboard: Blackboard): void {
		this.child.init(blackboard);
	}

	run(blackboard: Blackboard): BTResult {
		const result = this.child.run(blackboard);
		if (result === BTResult.RUNNING) {
			return result;
		}
		return BTResult.SUCCESS;
	}
}
