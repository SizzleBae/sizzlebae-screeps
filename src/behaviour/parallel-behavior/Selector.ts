import { BTNodeComposite, BTResult, BTState } from "./BTNode";
import { Blackboard } from "./Blackboard";

export class Selector extends BTNodeComposite {

	run(blackboard: Blackboard, callback: (result: BTResult) => void): void {
		this.children.forEach(child => child.state = BTState.IDLE);

		this.doNext(0, blackboard, callback);
	}

	private doNext(index: number, blackboard: Blackboard, callback: (result: BTResult) => void) {
		if (index === this.children.length) {
			callback(BTResult.FAILURE);
			return;
		}

		const child = this.children[index];
		child.state = BTState.EXECUTING;
		child.run(blackboard, result => {
			if (result === BTResult.FAILURE) {
				child.state = BTState.FAILED;
				this.doNext(index + 1, blackboard, callback);
			} else {
				if (result === BTResult.PANIC) {
					child.state = BTState.PANICKED;
				} else if (result === BTResult.SUCCESS) {
					child.state = BTState.SUCCEEDED;
					callback(result);
					for (let i = index + 1; i < this.children.length; i++) {
						this.children[i].state = BTState.CANCELLED;
					}
				}
			}
		})
	}

}
