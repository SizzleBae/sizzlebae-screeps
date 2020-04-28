import { BTNode, BTResult } from "./BTNode";
import { Blackboard } from "./Blackboard";

export class RepeatUntilFail extends BTNode {
	childInit = false;

	constructor(public child: BTNode) {
		super();
	}

	init(blackboard: Blackboard): void {
	}

	run(blackboard: Blackboard): BTResult {
		let result: BTResult;
		do {
			if (!this.childInit) {
				this.child.init(blackboard);
				this.childInit = true;
			}
			result = this.child.run(blackboard);

			if (result === BTResult.RUNNING) {
				return BTResult.RUNNING;
			}

			this.childInit = false;
		} while (result === BTResult.SUCCESS)

		return BTResult.SUCCESS;
	}
}
