import { BTNode, BTResult } from "./BTNode";
import { Blackboard } from "./Blackboard";

export class DataFilter<T> extends BTNode {

	constructor(public arrayAlias: string, public filterFunction: (a: T, blackboard: Blackboard) => boolean) {
		super();
	}

	run(blackboard: Blackboard): BTResult {
		const array = blackboard[this.arrayAlias];
		if (!array || !(array instanceof Array)) {
			return BTResult.PANIC;
		}
		const filtered = (array as T[]).filter(a => this.filterFunction(a, blackboard));
		blackboard[this.arrayAlias] = filtered;

		return BTResult.SUCCESS;
	}
}
