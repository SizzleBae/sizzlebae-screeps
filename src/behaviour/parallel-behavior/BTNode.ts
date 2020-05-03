import { Blackboard } from "./Blackboard";

export enum BTResult {
	SUCCESS, FAILURE, RUNNING, PANIC
}

export abstract class BTNode {
	abstract run(blackboard: Blackboard): BTResult;
}

export abstract class BTNodeComposite extends BTNode {
	constructor(public children: BTNode[]) {
		super();
	}
}

export abstract class BTNodeDecorator extends BTNode {
	constructor(public child: BTNode) {
		super();
	}
}
