import { BTResult, BTNodeDecorator, BTState } from "./BTNode";
import { Blackboard } from "./Blackboard";

export class RepeatUntilFail extends BTNodeDecorator {

	run(blackboard: Blackboard, callback: (result: BTResult) => void): void {

		this.repeat(blackboard, callback);

	}

	private repeat(blackboard: Blackboard, callback: (result: BTResult) => void) {
		this.child.state = BTState.EXECUTING;
		this.child.run(blackboard, result => {
			this.child.state = result as number;
			if (result === BTResult.SUCCESS) {
				this.repeat(blackboard, callback)
			} else if (result === BTResult.FAILURE) {
				callback(BTResult.SUCCESS);
			} else {
				callback(BTResult.PANIC);
			}
		})
	}

}
