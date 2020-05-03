import { BTNode, BTResult, BTNodeDecorator, BTState } from "./BTNode";
import { Blackboard } from "./Blackboard";
import { TimeFlow } from "../../utils/TimeFlow";

export class Inverter extends BTNodeDecorator {

	run(blackboard: Blackboard, callback: (result: BTResult) => void): void {
		this.child.state = BTState.EXECUTING;
		this.child.run(blackboard, result => {
			this.child.state = result as number;
			switch (result) {
				case BTResult.SUCCESS:
					return callback(BTResult.FAILURE);
				case BTResult.FAILURE:
					return callback(BTResult.SUCCESS);
				case BTResult.PANIC:
					return callback(BTResult.PANIC);
			}
		})
	}

}
