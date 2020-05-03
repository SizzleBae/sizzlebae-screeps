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

}
