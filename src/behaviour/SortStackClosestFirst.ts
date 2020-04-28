import { BTNode, BTResult } from "./BTNode";
import { Blackboard } from "./Blackboard";

export class SortStackClosestFirst extends BTNode {
	constructor(public targetAlias: string = 'target', public stackAlias: string = 'stack') {
		super();
	}

	init(blackboard: Blackboard): void {

	}

	run(blackboard: Blackboard): BTResult {
		const stack = blackboard.getStack<RoomObject>(this.stackAlias);
		if (!stack) {
			return BTResult.FAILURE;
		}

		const target = blackboard.getTarget<RoomObject>(this.targetAlias);
		if (!target) {
			return BTResult.FAILURE;
		}

		blackboard.setStack(this.stackAlias, stack.sort((a, b) => target.pos.getRangeTo(b) - target.pos.getRangeTo(a)));

		return BTResult.SUCCESS;
	}
}
