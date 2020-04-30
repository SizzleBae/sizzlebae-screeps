import { BTNode, BTResult } from "./BTNode";
import { Blackboard } from "./Blackboard";

export class HarvestTarget extends BTNode {

	private hasRun: boolean = false;

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

		const result = this.hasRun ? OK : blackboard.agent.harvest(target);

		if (result === OK) {
			if (this.hasRun) {
				this.hasRun = false;
				return BTResult.SUCCESS;
			} else {
				this.hasRun = true;
				return BTResult.RUNNING;
			}
		} else {
			return BTResult.FAILURE;
		}

	}

}
