import { Blackboard } from "./Blackboard";
import { BTNodeVisitor } from "./BTNodeVisitor";

export enum BTResult {
	SUCCESS, FAILURE, PANIC
}

export enum BTState {
	SUCCEEDED, FAILED, PANICKED, IDLE, EXECUTING, CANCELLED
}

export abstract class BTNode {
	state: BTState = BTState.IDLE;
	abstract run(blackboard: Blackboard, callback: (result: BTResult) => void): void;

	accept(visitor: BTNodeVisitor) {
		visitor.visitNode(this);
	}
}

export abstract class BTNodeComposite extends BTNode {
	constructor(public children: BTNode[]) {
		super();
	}

	accept(visitor: BTNodeVisitor) {
		visitor.visitComposite(this);
	}
}

export abstract class BTNodeDecorator extends BTNode {
	constructor(public child: BTNode) {
		super();
	}

	accept(visitor: BTNodeVisitor) {
		visitor.visitDecorator(this);
	}
}
