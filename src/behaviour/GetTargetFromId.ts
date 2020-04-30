import { BTNode, BTResult } from "./BTNode";
import { Blackboard } from "./Blackboard";

export class GetTargetFromId extends BTNode {
	constructor(public idAlias: string, public targetAlias: string) {
		super();
	}

	init(blackboard: Blackboard): void {
	}

	run(blackboard: Blackboard): BTResult {
		const id = blackboard.getTarget<string>(this.idAlias);
		if (!id) {
			return BTResult.FAILURE;
		}

		const target = Game.getObjectById(id);

		if (!target) {
			return BTResult.FAILURE;
		}

		blackboard.setTarget(this.targetAlias, target);
		return BTResult.SUCCESS;
	}
}
