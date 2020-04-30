import { BTNode, BTResult } from "./BTNode";
import { Blackboard } from "./Blackboard";

export class SortStackWithTarget<StackType, TargetType> extends BTNode {
	constructor(public sortFunction: (a: StackType, b: StackType, target: TargetType) => number, public stackAlias: string, public targetAlias: string) {
		super();
	}

	init(blackboard: Blackboard): void {

	}

	run(blackboard: Blackboard): BTResult {
		const stack = blackboard.getStack<StackType>(this.stackAlias);
		if (!stack) {
			return BTResult.FAILURE;
		}

		const target = blackboard.getTarget<TargetType>(this.targetAlias);
		if (!target) {
			return BTResult.FAILURE;
		}

		const sorted = stack.sort((a, b) => this.sortFunction(a, b, target));
		blackboard.setStack(this.stackAlias, sorted);

		return BTResult.SUCCESS;
	}
}
