import { BTNode, BTResult } from "./BTNode";
import { Blackboard } from "./Blackboard";
import { Utils } from "utils/Utils";

type CapacityType = 'Capacity' | 'Used' | 'Free';
type ConditionType = 'LessThan' | 'MoreThan' | 'EqualTo';

export class ConditionCapacity<ResourceType extends ResourceConstant> extends BTNode {
	constructor(public targetIdAlias: string, public capacityType: CapacityType, public conditionType: ConditionType, public amount: number, public resourceType?: ResourceConstant) {
		super();
	}

	run(blackboard: Blackboard): BTResult {
		const target = Utils.identify<{ store: Store<ResourceType, false> }>(blackboard[this.targetIdAlias]);

		if (!target || !target.store) {
			return BTResult.PANIC;
		}

		let capacity: number | null = null;
		switch (this.capacityType) {
			case "Capacity":
				capacity = target.store.getCapacity(this.resourceType);
				break;
			case "Free":
				capacity = target.store.getFreeCapacity(this.resourceType);
				break;
			case "Used":
				capacity = target.store.getUsedCapacity(this.resourceType);
				break;
		}

		if (capacity === null) {
			return BTResult.PANIC;
		}

		let result: boolean = false;
		switch (this.conditionType) {
			case "EqualTo":
				result = capacity === this.amount;
				break;
			case "LessThan":
				result = capacity < this.amount;
				break;
			case "MoreThan":
				result = capacity > this.amount;
				break;
		}

		if (result) {
			return BTResult.SUCCESS;
		}
		return BTResult.FAILURE;
	}

}
