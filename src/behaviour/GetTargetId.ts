import { BTNode, BTResult } from "./BTNode";
import { Blackboard } from "./Blackboard";

export class GetTargetId extends BTNode {
	constructor(public targetAlias: string, public idAlias: string) {
		super();
	}

	init(blackboard: Blackboard): void {
	}

	run(blackboard: Blackboard): BTResult {
		const target = blackboard.getTarget<any>(this.targetAlias);
		if (!target || !target.id) {
			return BTResult.FAILURE;
		}

		blackboard.setTarget(this.idAlias, target.id);
		return BTResult.SUCCESS;
	}
}
