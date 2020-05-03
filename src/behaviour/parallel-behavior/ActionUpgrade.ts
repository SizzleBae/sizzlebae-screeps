import { BTNode, BTResult } from "./BTNode";
import { Blackboard } from "./Blackboard";
import { TimeFlow } from "../../utils/TimeFlow";
import { Utils } from "utils/Utils";

export class ActionUpgrade extends BTNode {

	constructor(public controllerIdAlias: string, public agentIdAlias: string) {
		super();
	}

	run(blackboard: Blackboard, callback: (result: BTResult) => void): void {
		const agent = Utils.identify<Creep>(blackboard[this.agentIdAlias], [Creep]);
		if (!agent) {
			return callback(BTResult.PANIC);
		}

		const target = Utils.identify<StructureController>(blackboard[this.controllerIdAlias], [StructureController]);
		if (!target) {
			return callback(BTResult.PANIC);
		}

		const result = agent.upgradeController(target);

		if (result === OK) {
			// TimeFlow.submitAction(Game.time + 1, () => callback(BTResult.SUCCESS));
			callback(BTResult.SUCCESS);
		} else {
			callback(BTResult.FAILURE);
		}
	}
}
