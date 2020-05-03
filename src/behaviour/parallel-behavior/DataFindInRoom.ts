import { BTNode, BTResult } from "./BTNode";
import { Blackboard } from "./Blackboard";

export class DataFindInRoom<T extends FindConstant> extends BTNode {

	constructor(public roomAlias: string, public resultAlias: string, public type: T, public filter?: FilterFunction<T>) {
		super();
	}

	run(blackboard: Blackboard): BTResult {

		const room = blackboard[this.roomAlias];
		if (!room || !(room instanceof Room)) {
			return BTResult.PANIC;
		}

		const result = room.find(this.type, this.filter ? { filter: this.filter } : undefined).map((result: any) => result.id ? result.id : result);
		blackboard[this.resultAlias] = result;

		if (result.length > 0) {
			return BTResult.SUCCESS;
		}
		return BTResult.FAILURE;
	}
}
