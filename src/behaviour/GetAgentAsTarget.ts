import { BTNode, BTResult } from "./BTNode";
import { Blackboard } from "./Blackboard";

export class GetAgentAsTarget extends BTNode {
	constructor(public targetAlias: string) {
		super();
	}

	init(blackboard: Blackboard): void {

	}

	run(blackboard: Blackboard): BTResult {
		blackboard.setTarget(this.targetAlias, blackboard.agent);
		return BTResult.SUCCESS;
	}
}
