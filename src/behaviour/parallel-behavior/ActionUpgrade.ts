import { BTNode, BTResult } from "./BTNode";
import { Blackboard } from "./Blackboard";
import { TimeFlow } from "../../utils/TimeFlow";
import { Utils } from "utils/Utils";

export class ActionUpgrade extends BTNode {

	constructor(public controllerIdAlias: string, public agentIdAlias: string) {
		super();
	}

	run(blackboard: Blackboard): BTResult {
		const agent = Utils.identify<Creep>(blackboard[this.agentIdAlias], [Creep]);
		if (!agent) {
			return BTResult.PANIC;
		}

		const target = Utils.identify<StructureController>(blackboard[this.controllerIdAlias], [StructureController]);
		if (!target) {
			return BTResult.PANIC;
		}

		const result = agent.upgradeController(target);

		if (result === OK) {
			return BTResult.SUCCESS;
		} else {
			return BTResult.FAILURE;
		}
	}
}
