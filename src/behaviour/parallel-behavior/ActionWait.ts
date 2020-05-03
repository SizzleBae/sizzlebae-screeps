import { BTNode, BTResult } from "./BTNode";
import { Blackboard } from "./Blackboard";
import { TimeFlow } from "../../utils/TimeFlow";

export class ActionWait extends BTNode {

	constructor(public ticks: number) {
		super();
	}

	run(blackboard: Blackboard, callback: (result: BTResult) => void): void {
		TimeFlow.submitAction(Game.time + this.ticks, () => callback(BTResult.SUCCESS));
	}
}
