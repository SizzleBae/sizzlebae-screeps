import { BTNode, BTResult, BTNodeDecorator, BTState } from "./BTNode";
import { Blackboard } from "./Blackboard";
import { TimeFlow } from "../../utils/TimeFlow";

export class Repeater extends BTNodeDecorator {

	private lastTick: number = 0;
	private repeats: number = 0;

	constructor(public maxPerTick = 99, child: BTNode) {
		super(child);
	}

	run(blackboard: Blackboard, callback: (result: BTResult) => void): void {
		this.repeat(blackboard, callback);
	}

	private repeat(blackboard: Blackboard, callback: (result: BTResult) => void) {
		if (Game.time === this.lastTick) {
			this.repeats++;

			if (this.repeats >= this.maxPerTick) {
				TimeFlow.submitAction(Game.time + 1, () => this.repeat(blackboard, callback));
				return;
			}
		} else {
			this.lastTick = Game.time;
		}

		this.child.state = BTState.EXECUTING;
		this.child.run(blackboard, result => {
			this.child.state = result as number;
			this.repeat(blackboard, callback)
		})
	}

}
