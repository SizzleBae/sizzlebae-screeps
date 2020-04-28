import { BTNode, BTResult } from "./BTNode";
import { Blackboard } from "./Blackboard";

export class HarvestTarget extends BTNode {

	constructor(public alias: string = 'target') {
		super();
	}

	init(blackboard: Blackboard): void {

	}

	run(blackboard: Blackboard): BTResult {
		if (blackboard.agent instanceof StructureTower) {
			return BTResult.FAILURE;
		}

		if (blackboard.agent.store.getFreeCapacity() === 0) {
			return BTResult.SUCCESS;
		}

		const target = blackboard.targets[this.alias];
		if (!target) {
			console.log('Failed to run HarvestTarget: Missing target')
			return BTResult.FAILURE;
		}

		const result = blackboard.agent.harvest(target as any);
		if (result === OK) {
			return BTResult.RUNNING;
		}

		return BTResult.FAILURE;
	}

}
