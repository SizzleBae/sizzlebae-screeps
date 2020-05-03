import { BTNodeDecorator, BTResult, BTNode, BTNodeComposite } from "./BTNode";
import { Blackboard } from "./Blackboard";
import { DebugDecorator } from "./DebugDecorater";

export class BehaviourTree extends BTNodeDecorator {

	readonly blackboard: Blackboard = new Blackboard();

	run(): BTResult {
		return this.child.run(this.blackboard);
	}

	debug(): this {
		this.child = this.convertNodeToDebug(this.child);

		return this;
	}

	private convertNodeToDebug(node: BTNode): DebugDecorator {
		if (node instanceof BTNodeComposite) {
			node.children = node.children.map(child => this.convertNodeToDebug(child));
		}
		else if (node instanceof BTNodeDecorator) {
			node.child = this.convertNodeToDebug(node.child);
		}

		return new DebugDecorator(node);
	}

}
