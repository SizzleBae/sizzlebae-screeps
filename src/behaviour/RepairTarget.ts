import { BTNode, BTResult } from "./BTNode";
import { Blackboard } from "./Blackboard";

export class RepairTarget extends BTNode {

	private hasRun: boolean = false;

	constructor(public targetAlias: string) {
		super();
	}

	init(blackboard: Blackboard): void {
		this.hasRun = false;
	}

	run(blackboard: Blackboard): BTResult {

		const target = blackboard.getTarget<Structure<StructureConstant>>(this.targetAlias);
		if (!target) {
			return BTResult.FAILURE;
		}

		const result = this.hasRun ? OK : blackboard.agent.repair(target);

		if (result === OK && target.hits < target.hitsMax) {
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
