import { BTResult, BTNodeDecorator } from "./BTNode";
import { Blackboard } from "./Blackboard";

export class RepeatUntilFail extends BTNodeDecorator {

	run(blackboard: Blackboard): BTResult {

		let result: BTResult;
		do {
			result = this.child.run(blackboard);
		}
		while (result === BTResult.SUCCESS)

		if (result === BTResult.FAILURE) {
			return BTResult.SUCCESS;
		}
		return result;
	}
}
