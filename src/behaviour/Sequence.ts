import { BTNode, BTResult, BTNodeComposite } from "./BTNode";
import { Blackboard } from "./Blackboard";
import { Logger } from "utils/Log";

export class Sequence extends BTNodeComposite {
	currentIndex: number = 0;
	childInit: boolean = false;

	constructor(children: BTNode[]) {
		super(children);
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
