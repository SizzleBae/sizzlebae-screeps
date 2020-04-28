import { Blackboard } from "./Blackboard";
import { BTResult, BTNode } from "./BTNode";

export class BehaviourTree {
	blackboard?: Blackboard;
	lastResult = BTResult.SUCCESS;

	constructor(public root: BTNode) { }

	tick(agent: Creep): BTResult {
		if (!this.blackboard) {
			this.blackboard = { agent, stacks: {}, targets: {} };
		}

		this.blackboard.agent = agent;

		if (this.lastResult !== BTResult.RUNNING) {
			this.root.init(this.blackboard);
		}

		this.lastResult = this.root.run(this.blackboard);
		return this.lastResult;
	}

}
