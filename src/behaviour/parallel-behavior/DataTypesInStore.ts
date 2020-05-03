import { BTNode, BTResult } from "./BTNode";
import { Blackboard } from "./Blackboard";
import { Utils } from "utils/Utils";

export class DataTypesInStore extends BTNode {

	constructor(public storeIdAlias: string, public typeArrayAlias: string) {
		super();
	}

	run(blackboard: Blackboard): BTResult {
		const container = Utils.identify<{ store: GenericStore }>(blackboard[this.storeIdAlias]);
		if (!container || !container.store) {
			return BTResult.PANIC;
		}

		const types = Object.keys(container.store);
		blackboard[this.typeArrayAlias] = types;
		console.log(types);
		return BTResult.SUCCESS;
	}
}
