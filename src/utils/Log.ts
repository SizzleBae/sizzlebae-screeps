import { DebugDecorator } from "behaviour/parallel-behavior/DebugDecorater";
import { BTNodeComposite, BTResult, BTNodeDecorator } from "behaviour/parallel-behavior/BTNode";

export enum LogVerbosity {
	MESSAGE, WARNING, ERROR, DEBUG
}

export interface Log {
}

export class BehaviorLog implements Log {

	// private agentsIdFilter: string[] = [];

	private indentLevel = 0;

	beginNode(node: DebugDecorator) {
		const indent = Array(this.indentLevel).fill('| ').join('');

		if (node.child instanceof BTNodeComposite || node.child instanceof BTNodeDecorator) {
			Logger.print(`${indent}${node.child.constructor.name}`, LogVerbosity.DEBUG);
			this.indentLevel++;
		}
	}

	endNode(node: DebugDecorator, result: BTResult) {
		if (node.child instanceof BTNodeComposite || node.child instanceof BTNodeDecorator) {
			this.indentLevel--;
		}

		const indent = Array(this.indentLevel).fill('| ').join('');
		Logger.print(`${indent}${node.child.constructor.name} - ${this.resultToString(result).toUpperCase()}`, LogVerbosity.DEBUG);
	}

	// agentToString(agent: Agent): string {
	// 	if (agent instanceof Creep) {
	// 		return agent.name;
	// 	} else if (agent instanceof StructureTower) {
	// 		return `tower-${agent.id}`
	// 	}

	// 	return 'unknown-agent-type';
	// }

	resultToString(result: BTResult): string {
		switch (result) {
			case BTResult.FAILURE:
				return 'failure'
			case BTResult.SUCCESS:
				return 'success'
			case BTResult.RUNNING:
				return 'running'
			case BTResult.PANIC:
				return 'panic'
		}
	}
}

export class Logger {
	static readonly behaviour: BehaviorLog = new BehaviorLog();

	static verbosity: LogVerbosity = LogVerbosity.MESSAGE;

	static printTickStart() {
		console.log(`_________________________${Game.time}_________________________`)
	}

	static print(message: string, verbosity: LogVerbosity) {
		if (verbosity <= this.verbosity) {
			console.log(message);
		}
	}
}
