import { Logger, LogVerbosity } from "utils/Log";

export type Agent = Creep | StructureTower;

export class Blackboard {

	private targets: Record<string, any> = {};
	private stacks: Record<string, any[]> = {};

	constructor(public agent: Agent) {

	}

	setStack<T>(stackAlias: string, stack: T[]) {
		this.stacks[stackAlias] = stack;
	}

	setTarget<T>(targetAlias: string, target: T) {
		this.targets[targetAlias] = target;
	}

	getTarget<T>(targetAlias: string): T | undefined {
		if (!this.targets[targetAlias]) {
			// Logger.print(`Attempted to use target variable in blackboard that does not exits: ${targetAlias}`, LogVerbosity.WARNING);
		}
		return this.targets[targetAlias];
	}

	getStack<T>(stackAlias: string): T[] | undefined {
		if (!this.stacks[stackAlias]) {
			// Logger.print(`Attempted to use stack variable in blackboard that does not exits: ${stackAlias}`, LogVerbosity.WARNING);
		}
		return this.stacks[stackAlias];
	}

}
