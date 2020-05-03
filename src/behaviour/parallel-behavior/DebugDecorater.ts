import { BTNode, BTResult, BTNodeDecorator, BTState } from "./BTNode";
import { Blackboard } from "./Blackboard";
import { Logger, LogVerbosity } from "utils/Log";
import { Utils } from "utils/Utils";

export class DebugDecorator extends BTNodeDecorator {

	private executionCount = 0;

	run(blackboard: Blackboard, callback: (result: BTResult) => void): void {
		this.child.state = BTState.EXECUTING;
		Logger.print(`${this.child.constructor.name} - ${Utils.btStateToString(this.child.state)} - ${this.executionCount}`, LogVerbosity.DEBUG);
		this.child.run(blackboard, result => {
			this.child.state = result as number;
			callback(result);
			Logger.print(`${this.child.constructor.name} - ${Utils.btStateToString(this.child.state)} - ${this.executionCount}`, LogVerbosity.DEBUG);
			this.executionCount++;
		})
	}

}
