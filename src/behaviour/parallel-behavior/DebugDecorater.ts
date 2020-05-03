import { BTResult, BTNodeDecorator } from "./BTNode";
import { Blackboard } from "./Blackboard";
import { Logger } from "utils/Log";

export class DebugDecorator extends BTNodeDecorator {

	run(blackboard: Blackboard): BTResult {
		Logger.behaviour.beginNode(this);
		const result = this.child.run(blackboard);
		Logger.behaviour.endNode(this, result);
		return result;
	}

}
