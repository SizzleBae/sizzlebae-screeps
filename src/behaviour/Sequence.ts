import { BTNode, BTResult } from "./BTNode";
import { Blackboard } from "./Blackboard";
import { Logger } from "utils/Log";

export class Sequence extends BTNode {
	currentIndex: number = 0;
	childInit: boolean = false;

	constructor(readonly children: BTNode[]) {
		super();
	}

	init(blackboard: Blackboard): void {
		this.currentIndex = 0;
		this.childInit = false;
	}

	run(blackboard: Blackboard, result: BTResult): BTResult {
		for (; this.currentIndex < this.children.length; this.currentIndex++) {
			const currentChild = this.children[this.currentIndex];
			if (!this.childInit) {
				currentChild.init(blackboard);

				this.childInit = true;
			}

			const result = currentChild.run(blackboard);
			Logger.behaviour.printExecutionResult(currentChild, result, blackboard);

			if (result !== BTResult.RUNNING) {
				this.childInit = false;
			}
			if (result !== BTResult.SUCCESS) {
				return result;
			}
		}

		return BTResult.SUCCESS;
	}

}
