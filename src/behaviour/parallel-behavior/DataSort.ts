import { BTNode, BTResult } from "./BTNode";
import { Blackboard } from "./Blackboard";

export class DataSort<T> extends BTNode {

	constructor(public arrayAlias: string, public sortFunction: (a: T, b: T, blackboard: Blackboard) => number) {
		super();
	}

	run(blackboard: Blackboard): BTResult {
		const array = blackboard[this.arrayAlias];
		if (!array || !(array instanceof Array)) {
			return BTResult.PANIC;
		}
		const sorted = (array as T[]).sort((a, b) => this.sortFunction(a, b, blackboard));
		blackboard[this.arrayAlias] = sorted;

		return BTResult.SUCCESS;
	}
}
