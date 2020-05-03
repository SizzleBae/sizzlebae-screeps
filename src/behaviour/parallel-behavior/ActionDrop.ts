import { BTNode, BTResult } from "./BTNode";
import { Blackboard } from "./Blackboard";
import { TimeFlow } from "../../utils/TimeFlow";
import { Utils } from "utils/Utils";

export class ActionDrop extends BTNode {

	constructor(public resourceTypeAlias: string, public agentIdAlias: string, public amount?: number) {
		super();
	}

	run(blackboard: Blackboard): BTResult {
		const agent = Utils.identify<Creep>(blackboard[this.agentIdAlias], [Creep]);
		if (!agent) {
			return BTResult.PANIC;
		}

		const resourceType = blackboard[this.resourceTypeAlias] as ResourceConstant;
		if (!resourceType || typeof resourceType !== 'string') {
			return BTResult.PANIC;
		}

		const result = agent.drop(resourceType, this.amount);

		if (result === OK) {
			return BTResult.SUCCESS;
		} else {
			return BTResult.FAILURE;
		}
	}
}
