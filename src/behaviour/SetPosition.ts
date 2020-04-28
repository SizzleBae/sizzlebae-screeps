import { BTNode, BTResult } from "./BTNode";
import { Blackboard } from "./Blackboard";

export class SetPosition extends BTNode {

	constructor(public position: RoomPosition) {
		super();

	}

	init(blackboard: Blackboard): void {
	}

	run(blackboard: Blackboard): BTResult {
		blackboard.position = this.position;
		return BTResult.SUCCESS;
	}

}
