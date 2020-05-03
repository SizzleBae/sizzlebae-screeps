import { BTNode, BTResult } from "./BTNode";
import { Blackboard } from "./Blackboard";

export class DataSortArray<T> extends BTNode {

	constructor(public arrayAlias: string, public sortFunction: (a: T, b: T, blackboard: Blackboard) => number) {
		super();
	}

	run(blackboard: Blackboard, callback: (result: BTResult) => void): void {
		const array = blackboard[this.arrayAlias];
		if (!array || !(array instanceof Array)) {
			return callback(BTResult.PANIC);
		}
		const sorted = (array as T[]).sort((a, b) => this.sortFunction(a, b, blackboard));
		blackboard[this.arrayAlias] = sorted;

		return callback(BTResult.SUCCESS);
	}
}
