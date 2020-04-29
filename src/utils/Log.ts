import { BTResult, BTNode } from "behaviour/BTNode";
import { Blackboard, Agent } from "behaviour/Blackboard";

export enum LogVerbosity {
	MESSAGE, WARNING, ERROR, DEBUG
}

export interface Log {
}

export class BehaviorLog implements Log {
	private agentsIdFilter: string[] = [];

	setAgentsFilter(agentsFilter: Agent[]) {
		this.agentsIdFilter = agentsFilter.map(agent => agent.id);
	}

	printExecutionResult(node: BTNode, result: BTResult, blackboard: Blackboard) {
		if (this.agentsIdFilter.some(id => id === blackboard.agent.id))
			Logger.print(`Agent ${this.agentToString(blackboard.agent)} executed ${node.constructor.name} with result ${this.resultToString(result)}.`, LogVerbosity.DEBUG);
	}

	agentToString(agent: Agent): string {
		if (agent instanceof Creep) {
			return agent.name;
		} else if (agent instanceof StructureTower) {
			return `tower-${agent.id}`
		}

		return 'unknown-agent-type';
	}

	resultToString(result: BTResult): string {
		switch (result) {
			case BTResult.FAILURE:
				return 'failure'
			case BTResult.RUNNING:
				return 'success'
			case BTResult.SUCCESS:
				return 'running'
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
