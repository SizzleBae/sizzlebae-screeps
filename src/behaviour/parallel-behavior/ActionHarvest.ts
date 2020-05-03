import { BTNode, BTResult } from "./BTNode";
import { Blackboard } from "./Blackboard";
import { TimeFlow } from "../../utils/TimeFlow";
import { Utils } from "utils/Utils";

export class ActionHarvest extends BTNode {

	constructor(public targetIdAlias: string, public agentIdAlias: string) {
		super();
	}

	run(blackboard: Blackboard): BTResult {
		const agent = Utils.identify<Creep>(blackboard[this.agentIdAlias], [Creep]);
		if (!agent) {
			return BTResult.PANIC;
		}

		const target = Utils.identify<Source | Mineral | Deposit>(blackboard[this.targetIdAlias], [Source, Mineral, Deposit]);
		if (!target) {
			return BTResult.PANIC;
		}

		const result = agent.harvest(target);

		if (result === OK) {
			return BTResult.SUCCESS;
		} else {
			return BTResult.FAILURE;
		}
	}
}
