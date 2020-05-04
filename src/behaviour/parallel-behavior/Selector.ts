import { BTNodeComposite, BTResult } from "./BTNode";
import { Blackboard } from "./Blackboard";

export class Selector extends BTNodeComposite {

	currentIndex = 0;

	run(blackboard: Blackboard): BTResult {
		for (; this.currentIndex < this.children.length; this.currentIndex++) {
			const currentChild = this.children[this.currentIndex];

			const result = currentChild.run(blackboard);

			switch (result) {
				case BTResult.SUCCESS:
					this.currentIndex = 0;
					return BTResult.SUCCESS
				case BTResult.PANIC:
					this.currentIndex = 0;
					return BTResult.PANIC
				case BTResult.RUNNING:
					return BTResult.RUNNING;
			}
		}

		this.currentIndex = 0;
		return BTResult.FAILURE;
	}
}
