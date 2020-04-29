import { BTNode, BTResult } from "./BTNode";
import { Blackboard } from "./Blackboard";

export class DropStore extends BTNode {

    constructor(public type: ResourceConstant) {
        super();
    }

    init(blackboard: Blackboard): void {
    }

    run(blackboard: Blackboard): BTResult {
        if (blackboard.agent instanceof StructureTower) {
            return BTResult.FAILURE;
        }

        const result = blackboard.agent.drop(this.type);

        return BTResult.SUCCESS;

    }
}
