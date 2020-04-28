import { BTNode, BTResult } from "./BTNode";
import { Blackboard } from "./Blackboard";

export class GetAgentRoom extends BTNode {
	constructor(public alias: string = 'target') {
		super();
	}

	init(blackboard: Blackboard): void {

	}

	run(blackboard: Blackboard): BTResult {
		blackboard.targets[this.alias] = blackboard.agent.room;
		return BTResult.SUCCESS;
	}
}
