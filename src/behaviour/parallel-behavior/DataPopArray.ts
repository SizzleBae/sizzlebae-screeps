import { BTNode, BTResult } from "./BTNode";
import { Blackboard } from "./Blackboard";

export class DataPopArray extends BTNode {

	constructor(public arrayAlias: string, public poppedAlias: string) {
		super();
	}

	run(blackboard: Blackboard, callback: (result: BTResult) => void): void {
		const array = blackboard[this.arrayAlias];
		if (!array || !(array instanceof Array)) {
			return callback(BTResult.PANIC);
		}

		const popped = array.pop();

		if (popped) {
			blackboard[this.poppedAlias] = popped;
			callback(BTResult.SUCCESS);
		} else {
			callback(BTResult.FAILURE);
		}
	}
}
