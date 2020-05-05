import { BTNode, BTResult } from "./BTNode";
import { Blackboard } from "./Blackboard";
import { Utils } from "utils/Utils";

export class ActionRepair extends BTNode {

	constructor(public targetIdAlias: string, public agentIdAlias: string) {
		super();
	}

	run(blackboard: Blackboard): BTResult {
		const agent = Utils.identify<Creep>(blackboard[this.agentIdAlias], [Creep]);
		if (!agent) {
			return BTResult.PANIC;
		}

		const target = Utils.identify<Structure>(blackboard[this.targetIdAlias], [Structure]);
		if (!target) {
			return BTResult.PANIC;
		}

		const result = agent.repair(target);

		if (result === OK) {
			return BTResult.SUCCESS;
		} else {
			return BTResult.FAILURE;
		}
	}
}
