import { BTNode, BTResult } from "./BTNode";
import { Blackboard } from "./Blackboard";

export class DataSet<T> extends BTNode {

	constructor(public alias: string, public data: T) {
		super();
	}

	run(blackboard: Blackboard, callback: (result: BTResult) => void): void {
		blackboard[this.alias] = this.data;

		callback(BTResult.SUCCESS);
	}
}
