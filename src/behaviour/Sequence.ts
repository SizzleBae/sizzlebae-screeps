import { BTNode, BTResult } from "./BTNode";
import { Blackboard } from "./Blackboard";

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

	run(blackboard: Blackboard): BTResult {
		for (; this.currentIndex < this.children.length; this.currentIndex++) {
			const currentChild = this.children[this.currentIndex];
			if (!this.childInit) {
				currentChild.init(blackboard);

				this.childInit = true;
			}

			const result = currentChild.run(blackboard);

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
