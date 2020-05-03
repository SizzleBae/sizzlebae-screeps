import { Blackboard } from "./Blackboard";
import { BTResult, BTNode, BTNodeComposite, BTNodeDecorator } from "./BTNode";
// import { DebugDecorator } from "./DebugDecorator";

export class BehaviourTree {
	blackboard?: Blackboard;
	lastResult = BTResult.SUCCESS;

	constructor(public root: BTNode) { }

	tick(agent: Creep | StructureTower): BTResult {
		if (!this.blackboard) {
			this.blackboard = new Blackboard(agent);
		}

		this.blackboard.agent = agent;

		if (this.lastResult !== BTResult.RUNNING) {
			this.root.init(this.blackboard);
		}

		this.lastResult = this.root.run(this.blackboard);
		return this.lastResult;
	}

	// debug(): this {
	// 	this.root = this.convertNodeToDebug(this.root);

	// 	return this;
	// }

	// convertNodeToDebug(node: BTNode): DebugDecorator {
	// 	if (node instanceof BTNodeComposite) {
	// 		node.children = node.children.map(child => this.convertNodeToDebug(child));
	// 		// node.children = node.children.map(child => new DebugDecorator(child));
	// 	}
	// 	else if (node instanceof BTNodeDecorator) {
	// 		node.child = this.convertNodeToDebug(node.child);
	// 		// node.child = new DebugDecorator(node);
	// 	}

	// 	return new DebugDecorator(node);
	// }
}
