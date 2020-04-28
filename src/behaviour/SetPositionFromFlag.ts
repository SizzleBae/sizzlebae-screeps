import { BTNode, BTResult } from "./BTNode";
import { Blackboard } from "./Blackboard";

export class SetPositionFromFlag extends BTNode {
	constructor(public flagName: string, public positionAlias: string = 'position') {
		super();

	}

	init(blackboard: Blackboard): void {
	}

	run(blackboard: Blackboard): BTResult {
		const flag = Game.flags[this.flagName];
		if (flag) {
			blackboard.setTarget(this.positionAlias, flag.pos);
			return BTResult.SUCCESS;
		}

		return BTResult.FAILURE;
	}
}
