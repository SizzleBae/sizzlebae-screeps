import { BTNode, BTResult } from "./BTNode";
import { Blackboard } from "./Blackboard";
import { TimeFlow } from "../../utils/TimeFlow";
import { Utils } from "utils/Utils";

export class ActionHarvest extends BTNode {

	constructor(public targetIdAlias: string, public agentIdAlias: string) {
		super();
	}

	run(blackboard: Blackboard, callback: (result: BTResult) => void): void {
		const agent = Utils.identify<Creep>(blackboard[this.agentIdAlias], [Creep]);
		if (!agent) {
			return callback(BTResult.PANIC);
		}

		const target = Utils.identify<Source | Mineral | Deposit>(blackboard[this.targetIdAlias], [Source, Mineral, Deposit]);
		if (!target) {
			return callback(BTResult.PANIC);
		}

		const result = agent.harvest(target);

		if (result === OK) {
			callback(BTResult.SUCCESS);
			// TimeFlow.submitAction(Game.time + 1, () => callback(BTResult.SUCCESS));
		} else {
			callback(BTResult.FAILURE);
		}
	}
}
