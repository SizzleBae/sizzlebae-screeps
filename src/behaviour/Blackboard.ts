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
		return this.targets[targetAlias];
	}

	getStack<T>(stackAlias: string): T[] | undefined {
		return this.stacks[stackAlias];
	}

}
