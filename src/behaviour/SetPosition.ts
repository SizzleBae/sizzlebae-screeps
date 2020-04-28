import { BTNode, BTResult } from "./BTNode";
import { Blackboard } from "./Blackboard";

export class SetPosition extends BTNode {

	constructor(public position: RoomPosition, public positionAlias: string = 'position') {
		super();

	}

	init(blackboard: Blackboard): void {
	}

	run(blackboard: Blackboard): BTResult {
		blackboard.setTarget(this.positionAlias, this.position);
		return BTResult.SUCCESS;
	}

}
