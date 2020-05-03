export class TimeFlow {

	private static actions: { [tick: string]: Function[] | undefined } = {};

	static submitAction(tick: number, action: Function) {
		const actions = TimeFlow.actions[tick];
		if (!actions) {
			TimeFlow.actions[tick] = [action];
		} else {
			actions.push(action);
		}
	}

	static executeTick(currentTick: number) {
		const actions = TimeFlow.actions[currentTick];
		if (actions) {
			actions.forEach(action => action());
		}

		for (const tick of Object.keys(TimeFlow.actions)) {
			if (Number(tick) < currentTick) {
				delete TimeFlow.actions[tick];
			}
		}
	}
}
