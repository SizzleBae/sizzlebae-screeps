import { BTNode, BTResult } from "./BTNode";
import { Blackboard } from "./Blackboard";
import { Utils } from "utils/Utils";

export class DataSortByDistance extends BTNode {

	constructor(public arrayAlias: string, public targetIdAlias: string) {
		super();
	}

	run(blackboard: Blackboard): BTResult {
		const array = blackboard[this.arrayAlias];
		if (!array || !(array instanceof Array)) {
			return BTResult.PANIC;
		}

		const target = Utils.extractPosition(blackboard[this.targetIdAlias]);
		if (!target) {
			return BTResult.PANIC;
		}

		let arrayContainsInvalidPosition = false;
		const sorted = array.sort((a, b) => {
			const aPos = Utils.extractPosition(a);
			const bPos = Utils.extractPosition(b);
			if (aPos && bPos) {
				return target.getRangeTo(bPos) - target.getRangeTo(aPos);
			}
			arrayContainsInvalidPosition = true;
			return 0;
		})

		if (arrayContainsInvalidPosition) {
			return BTResult.PANIC;
		}

		blackboard[this.arrayAlias] = sorted;
		return BTResult.SUCCESS;
	}
}
