import { BTNode, BTResult } from "./BTNode";
import { Blackboard } from "./Blackboard";

export class Wait extends BTNode {

	ticksWaited = 0;

	constructor(public waitTicks: number) {
		super();

	}

	init(blackboard: Blackboard): void {
		this.ticksWaited = 0;
	}

	run(blackboard: Blackboard): BTResult {
		if (this.ticksWaited >= this.waitTicks) {
			return BTResult.SUCCESS;
		}

		this.ticksWaited++;
		return BTResult.RUNNING;
	}

}
