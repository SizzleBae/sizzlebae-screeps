import { BTNode, BTResult } from "./BTNode";
import { Blackboard } from "./Blackboard";

export class Condition extends BTNode {

	constructor(public predicate: (blackboard: Blackboard) => boolean) {
		super();
	}

	run(blackboard: Blackboard, callback: (result: BTResult) => void): void {
		if (this.predicate(blackboard)) {
			callback(BTResult.SUCCESS);
		} else {
			callback(BTResult.FAILURE);
		}
	}
}
