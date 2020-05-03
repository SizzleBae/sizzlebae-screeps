import { BTNode, BTResult } from "./BTNode";
import { Blackboard } from "./Blackboard";
import { TimeFlow } from "../../utils/TimeFlow";
import { Utils } from "utils/Utils";

export class ActionTransfer extends BTNode {

	constructor(public targetIdAlias: string, public agentIdAlias: string, public resourceType: ResourceConstant, public amount?: number) {
		super();
	}

	run(blackboard: Blackboard): BTResult {
		const agent = Utils.identify<Creep>(blackboard[this.agentIdAlias], [Creep]);
		if (!agent) {
			return BTResult.PANIC;
		}

		const target = Utils.identify<Creep | Structure | PowerCreep>(blackboard[this.targetIdAlias], [Creep, Structure, PowerCreep]);
		if (!target) {
			return BTResult.PANIC;
		}

		const result = agent.transfer(target, this.resourceType, this.amount);

		if (result === OK) {
			return BTResult.SUCCESS;
		} else {
			return BTResult.FAILURE;
		}
	}
}
