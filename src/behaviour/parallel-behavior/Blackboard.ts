import { Logger, LogVerbosity } from "utils/Log";

export class Blackboard {

	[name: string]: unknown | undefined;

	// private data: Record<string, any> = {};

	// get<T>(alias: string): T | undefined {
	// 	const variable = this.data[alias];
	// 	if (!variable) {
	// 		Logger.print(`Attempted to use variable in blackboard that does not exits: ${alias}`, LogVerbosity.WARNING);
	// 	}
	// 	return variable;
	// }

	// set<T>(alias: string, variable: T): void {
	// 	this.data[alias] = variable;
	// }

}
