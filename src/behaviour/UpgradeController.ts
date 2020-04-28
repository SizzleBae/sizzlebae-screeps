import { BTNode, BTResult } from "./BTNode";
import { Blackboard } from "./Blackboard";

export class UpgradeController extends BTNode {

	constructor(public alias: string = 'target') {
		super();
	}

	init(blackboard: Blackboard): void {
	}

	run(blackboard: Blackboard): BTResult {
		if (blackboard.agent instanceof StructureTower) {
			return BTResult.FAILURE;
		}

		const target = blackboard.targets[this.alias];
		if (!target) {
			console.log('Failed to init UpgradeController: Missing target')
			return BTResult.FAILURE;
		}

		const result = blackboard.agent.upgradeController(target as any);

		if (result === OK) {
			if (blackboard.agent.store.energy > 0) {
				return BTResult.RUNNING;
			} else {
				return BTResult.SUCCESS;
			}
		} else {
			return BTResult.FAILURE;
		}
	}
}
