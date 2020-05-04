import { BTResult, BTNodeDecorator, BTNode, } from "./BTNode";
import { Blackboard } from "./Blackboard";

export class AlwaysSucceed extends BTNodeDecorator {

	constructor(public alwaysSucceed: boolean, child: BTNode) {
		super(child)
	}

	run(blackboard: Blackboard): BTResult {
		const result = this.child.run(blackboard);

		if (result !== BTResult.RUNNING && result !== BTResult.PANIC) {
			return this.alwaysSucceed ? BTResult.SUCCESS : BTResult.FAILURE
		}
		return result;
	}

}
