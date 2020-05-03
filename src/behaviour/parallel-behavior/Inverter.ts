import { BTResult, BTNodeDecorator, } from "./BTNode";
import { Blackboard } from "./Blackboard";

export class Inverter extends BTNodeDecorator {

	run(blackboard: Blackboard): BTResult {
		const result = this.child.run(blackboard);

		switch (result) {
			case BTResult.SUCCESS:
				return BTResult.FAILURE;
			case BTResult.FAILURE:
				return BTResult.SUCCESS;
			case BTResult.RUNNING:
				return BTResult.RUNNING;
			case BTResult.PANIC:
				return BTResult.PANIC;
		}
	}

}
