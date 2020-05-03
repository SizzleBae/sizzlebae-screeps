import { BTNodeComposite, BTResult } from "./BTNode";
import { Blackboard } from "./Blackboard";

export class Sequence extends BTNodeComposite {

	private currentIndex = 0;

	run(blackboard: Blackboard): BTResult {
		for (; this.currentIndex < this.children.length; this.currentIndex++) {
			const currentChild = this.children[this.currentIndex];

			const result = currentChild.run(blackboard);

			switch (result) {
				case BTResult.FAILURE:
					this.currentIndex = 0;
					return BTResult.FAILURE
				case BTResult.PANIC:
					this.currentIndex = 0;
					return BTResult.PANIC
				case BTResult.RUNNING:
					return BTResult.RUNNING;
			}
		}

		this.currentIndex = 0;
		return BTResult.SUCCESS;
	}
}
