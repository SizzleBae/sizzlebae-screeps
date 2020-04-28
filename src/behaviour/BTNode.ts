import { Blackboard } from "./Blackboard";

export enum BTResult {
	SUCCESS, FAILURE, RUNNING
}

export abstract class BTNode {
	abstract init(blackboard: Blackboard): void;
	abstract run(blackboard: Blackboard): BTResult;
}
