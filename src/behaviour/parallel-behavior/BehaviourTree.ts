import { BTNodeDecorator, BTResult, BTState, BTNode, BTNodeComposite } from "./BTNode";
import { Blackboard } from "./Blackboard";
import { BTLogger } from "./BTLogger";
import { DebugDecorator } from "./DebugDecorater";

export class BehaviourTree extends BTNodeDecorator {

	readonly blackboard: Blackboard = new Blackboard();

	run(): void {
		this.state = BTState.EXECUTING;
		this.child.state = BTState.EXECUTING;

		this.child.run(this.blackboard, result => {
			this.child.state = result as number;
			this.state = result as number;
		});
	}

	logState() {
		this.accept(new BTLogger());
	}

	debug(): this {
		this.child = this.convertNodeToDebug(this.child);

		return this;
	}

	convertNodeToDebug(node: BTNode): DebugDecorator {
		if (node instanceof BTNodeComposite) {
			node.children = node.children.map(child => this.convertNodeToDebug(child));
		}
		else if (node instanceof BTNodeDecorator) {
			node.child = this.convertNodeToDebug(node.child);
		}

		return new DebugDecorator(node);
	}

}
