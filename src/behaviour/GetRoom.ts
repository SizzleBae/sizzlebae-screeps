import { BTNode, BTResult } from "./BTNode";
import { Blackboard } from "./Blackboard";

export class GetRoom extends BTNode {

	constructor(public roomName: string, public roomAlias: string) {
		super();
	}

	init(blackboard: Blackboard): void {
	}

	run(blackboard: Blackboard): BTResult {
		const room = Game.rooms[this.roomName];
		blackboard.setTarget(this.roomAlias, room);

		if (!room) {
			return BTResult.FAILURE;
		}

		return BTResult.SUCCESS;
	}

}
