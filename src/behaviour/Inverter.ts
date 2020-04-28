import { BTNode, BTResult } from "./BTNode";
import { Blackboard } from "./Blackboard";

export class Inverter extends BTNode {
	constructor(public child: BTNode) {
		super();
	}

	init(blackboard: Blackboard): void {
		this.child.init(blackboard);
	}

	run(blackboard: Blackboard): BTResult {
		const result = this.child.run(blackboard);

		if (result === BTResult.RUNNING) {
			return BTResult.RUNNING;
		}

		if (result === BTResult.SUCCESS) {
			return BTResult.FAILURE;
		}

		return BTResult.SUCCESS;
	}
}
