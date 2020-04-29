import { Blackboard } from "./Blackboard";

export enum BTResult {
	SUCCESS, FAILURE, RUNNING
}

export type ResultTree = {
	node: BTNode;
	result: BTResult;
}

export abstract class BTNode {
	abstract init(blackboard: Blackboard): void;
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

