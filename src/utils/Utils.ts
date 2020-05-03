import { BTState } from "behaviour/parallel-behavior/BTNode";

export class Utils {
	static extractPosition(holder: unknown): RoomPosition | undefined {
		if (holder instanceof RoomPosition) {
			return holder;
		}
		if (typeof holder === 'string') {
			holder = Game.getObjectById(holder);
		}
		if (holder instanceof RoomObject) {
			return holder.pos;
		}

		return undefined;
	}

	static identify<T>(objectId: Id<T> | undefined | unknown, instanceOfList?: Function[]): T | undefined {
		if (!objectId) {
			return undefined;
		}

		const object = Game.getObjectById(objectId as Id<T>);

		if (!object) {
			return undefined;
		}

		if (instanceOfList && !instanceOfList.some(type => object instanceof type)) {
			return undefined;
		}

		return object;
	}

	static btStateToString(state: BTState): string {
		switch (state) {
			case BTState.CANCELLED:
				return 'CANCELLED';
			case BTState.EXECUTING:
				return 'EXECUTING';
			case BTState.SUCCEEDED:
				return 'SUCCEEDED';
			case BTState.FAILED:
				return 'FAILED';
			case BTState.PANICKED:
				return 'PANICKED';
			case BTState.IDLE:
				return 'IDLE';
		}
	}
}
