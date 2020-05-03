import { BTNode, BTResult } from "./BTNode";
import { Blackboard } from "./Blackboard";
import { Utils } from "utils/Utils";

export class ConditionInRange extends BTNode {
	constructor(public fromAlias: string, public toAlias: string, public range: number) {
		super();
	}

	run(blackboard: Blackboard): BTResult {
		const from = Utils.extractPosition(blackboard[this.fromAlias]);
		if (!from) {
			return BTResult.PANIC;
		}

		const to = Utils.extractPosition(blackboard[this.toAlias]);
		if (!to) {
			return BTResult.PANIC;
		}

		if (from.getRangeTo(to) <= this.range) {
			return BTResult.SUCCESS;
		}
		return BTResult.FAILURE;
	}
}
