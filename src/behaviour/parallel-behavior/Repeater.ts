import { BTNode, BTResult, BTNodeDecorator } from "./BTNode";
import { Blackboard } from "./Blackboard";

export class Repeater extends BTNodeDecorator {

	private lastTick: number = 0;
	private repeats: number = 0;

	constructor(public maxPerTick = 99, child: BTNode) {
		super(child);
	}

	run(blackboard: Blackboard): BTResult {
		if (this.lastTick !== Game.time) {
			this.lastTick = Game.time;
			this.repeats = 0;
		}
		return this.doRepeat(blackboard);
	}

	private doRepeat(blackboard: Blackboard): BTResult {
		let result = this.child.run(blackboard);

		if (result !== BTResult.PANIC && result !== BTResult.RUNNING) {
			if (this.repeats < this.maxPerTick) {
				this.repeats++;
				result = this.doRepeat(blackboard);
			}
		}

		return result;
	}
}
