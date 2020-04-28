import { BTNode, BTResult } from "./BTNode";
import { Blackboard } from "./Blackboard";

export class BuildTarget extends BTNode {

	constructor(public targetAlias: string = 'target') {
		super();
	}

	init(blackboard: Blackboard): void {
	}

	run(blackboard: Blackboard): BTResult {
		if (blackboard.agent instanceof StructureTower) {
			return BTResult.FAILURE;
		}

		const target = blackboard.getTarget<ConstructionSite<BuildableStructureConstant>>(this.targetAlias);
		if (!target) {
			console.log('Failed to run BuildTarget: Missing target')
			return BTResult.FAILURE;
		}

		const result = blackboard.agent.build(target);

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
