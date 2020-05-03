import { BTNode, BTResult } from "./BTNode";
import { Blackboard } from "./Blackboard";
import { TimeFlow } from "../../utils/TimeFlow";
import { Utils } from "utils/Utils";

export class ActionTransfer extends BTNode {

	constructor(public targetIdAlias: string, public agentIdAlias: string, public resourceType: ResourceConstant, public amount?: number) {
		super();
	}

	run(blackboard: Blackboard, callback: (result: BTResult) => void): void {
		const agent = Utils.identify<Creep>(blackboard[this.agentIdAlias], [Creep]);
		if (!agent) {
			return callback(BTResult.PANIC);
		}

		const target = Utils.identify<Creep | Structure | PowerCreep>(blackboard[this.targetIdAlias], [Creep, Structure, PowerCreep]);
		if (!target) {
			return callback(BTResult.PANIC);
		}

		const result = agent.transfer(target, this.resourceType, this.amount);

		if (result === OK) {
			callback(BTResult.SUCCESS);
			// TimeFlow.submitAction(Game.time + 1, () => callback(BTResult.SUCCESS));
		} else {
			callback(BTResult.FAILURE);
		}
	}
}
