import { BTNode, BTResult } from "./BTNode";
import { Blackboard } from "./Blackboard";

export class HarvestTarget extends BTNode {

	constructor(public targetAlias: string = 'target') {
		super();
	}

	init(blackboard: Blackboard): void {
	}

	run(blackboard: Blackboard): BTResult {
		if (blackboard.agent instanceof StructureTower) {
			return BTResult.FAILURE;
		}

		if (blackboard.agent.store.getFreeCapacity() === 0) {
			return BTResult.FAILURE;
		}

		const target = blackboard.getTarget<Source | Mineral<MineralConstant> | Deposit>(this.targetAlias);
		if (!target) {
			return BTResult.FAILURE;
		}

		const result = blackboard.agent.harvest(target);

		if (result === OK) {
			return BTResult.SUCCESS;
		} else {
			return BTResult.FAILURE;
		}

	}

}
