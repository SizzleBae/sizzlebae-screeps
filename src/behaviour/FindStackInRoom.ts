import { BTNode, BTResult } from "./BTNode";
import { Blackboard } from "./Blackboard";

export class FindStackInRoom<T extends FindConstant> extends BTNode {
	constructor(public type: T, public options?: FilterOptions<T>, public stackAlias: string = 'stack', public roomAlias: string = 'room') {
		super();
	}

	init(blackboard: Blackboard): void {

	}

	run(blackboard: Blackboard): BTResult {
		const room = blackboard.getTarget<Room>(this.roomAlias);

		if (!room) {
			return BTResult.FAILURE;
		}

		blackboard.setStack(this.stackAlias, room.find(this.type, this.options));

		return BTResult.SUCCESS;
	}
}
