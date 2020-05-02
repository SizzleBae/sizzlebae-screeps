import { BTNode, BTResult, BTNodeDecorator } from "./BTNode";
import { Blackboard } from "./Blackboard";

export class RefreshTarget extends BTNode {
	constructor(public targetAlias: string) {
		super();
	}

	init(blackboard: Blackboard): void {

	}

	run(blackboard: Blackboard): BTResult {
		const target = blackboard.getTarget<{ id: Id<string> }>(this.targetAlias);
		if (!target || !target.id) {
			return BTResult.FAILURE;
		}

		const refreshed = Game.getObjectById(target.id);
		if (!refreshed) {
			return BTResult.FAILURE;
		}

		return BTResult.SUCCESS;
	}
}
