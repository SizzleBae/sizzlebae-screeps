import { BTNode, BTResult } from "./BTNode";
import { Blackboard } from "./Blackboard";
import { Utils } from "utils/Utils";

export class ActionWithdraw extends BTNode {

	constructor(public targetIdAlias: string, public agentIdAlias: string, public resourceType: ResourceConstant, public amount?: number) {
		super();
	}

	run(blackboard: Blackboard): BTResult {
		const agent = Utils.identify<Creep>(blackboard[this.agentIdAlias], [Creep]);
		if (!agent) {
			return BTResult.PANIC;
		}

		const target = Utils.identify<Structure | Tombstone | Ruin>(blackboard[this.targetIdAlias], [Structure, Tombstone, Ruin]);
		if (!target) {
			return BTResult.PANIC;
		}

		const result = agent.withdraw(target, this.resourceType, this.amount);

		if (result === OK) {
			return BTResult.SUCCESS;
		} else {
			return BTResult.FAILURE;
		}
	}
}
