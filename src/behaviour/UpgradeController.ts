import { BTNode, BTResult } from "./BTNode";
import { Blackboard } from "./Blackboard";

export class UpgradeController extends BTNode {

	constructor(public targetAlias: string) {
		super();
	}

	init(blackboard: Blackboard): void {
	}

	run(blackboard: Blackboard): BTResult {
		if (blackboard.agent instanceof StructureTower) {
			return BTResult.FAILURE;
		}

		const target = blackboard.getTarget<StructureController>(this.targetAlias);
		if (!target) {
			return BTResult.FAILURE;
		}

		const result = blackboard.agent.upgradeController(target);

		if (result === OK) {
			return BTResult.SUCCESS;
		} else {
			return BTResult.FAILURE;
		}
	}
}
