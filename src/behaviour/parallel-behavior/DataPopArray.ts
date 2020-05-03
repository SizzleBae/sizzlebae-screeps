import { BTNode, BTResult } from "./BTNode";
import { Blackboard } from "./Blackboard";

export class DataPopArray extends BTNode {

	constructor(public arrayAlias: string, public poppedAlias: string) {
		super();
	}

	run(blackboard: Blackboard): BTResult {
		const array = blackboard[this.arrayAlias];
		if (!array || !(array instanceof Array)) {
			return BTResult.PANIC;
		}

		const popped = array.pop();

		if (popped) {
			blackboard[this.poppedAlias] = popped;
			return BTResult.SUCCESS;
		}
		return BTResult.FAILURE;
	}
}
