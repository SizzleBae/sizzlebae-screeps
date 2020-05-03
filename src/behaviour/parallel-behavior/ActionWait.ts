import { BTNode, BTResult } from "./BTNode";
import { Blackboard } from "./Blackboard";
import { TimeFlow } from "../../utils/TimeFlow";

export class ActionWait extends BTNode {

	private waitUntil?: number;

	constructor(public ticks: number) {
		super();
	}

	run(blackboard: Blackboard): BTResult {
		if (this.waitUntil) {
			if (Game.time >= this.waitUntil) {
				this.waitUntil = undefined;
				return BTResult.SUCCESS;
			}
		} else {
			this.waitUntil = Game.time + this.ticks;
		}
		return BTResult.RUNNING;
	}
}
