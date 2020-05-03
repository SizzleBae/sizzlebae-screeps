import { BTNode, BTResult } from "./BTNode";
import { Blackboard } from "./Blackboard";

export class DataSet<T> extends BTNode {

	constructor(public alias: string, public data: T) {
		super();
	}

	run(blackboard: Blackboard): BTResult {
		blackboard[this.alias] = this.data;

		return BTResult.SUCCESS;
	}
}
