import { ErrorMapper } from 'utils/ErrorMapper';
import { BehaviourTree } from 'behaviour/BehaviourTree';
import { Sequence } from 'behaviour/Sequence';
import { SetPositionFromFlag } from 'behaviour/SetPositionFromFlag';
import { WalkToPosition } from 'behaviour/WalkToPosition';
import { GetTargetAtPosition } from 'behaviour/GetTargetAtPosition';
import { HarvestTarget } from 'behaviour/HarvestTarget';
import { UpgradeController } from 'behaviour/UpgradeController';
import { TransferToTarget } from 'behaviour/TransferToTarget';

export type ColonyStructure = Record<string,
	Record<string, {
		body: BodyPartConstant[],
		behaviour: BehaviourTree
	}>
>

const test = (sourceFlag: string, controllerFlag: string) => {
	return new Sequence([
		new SetPositionFromFlag(sourceFlag),
		new WalkToPosition(),
		new GetTargetAtPosition('source'),
		new HarvestTarget(),
		new SetPositionFromFlag(controllerFlag),
		new WalkToPosition({ range: 2 }),
		new GetTargetAtPosition('structure'),
		new UpgradeController()
	]);
}

const structure: ColonyStructure = {
	Spawn1: {
		dylan: {
			body: ['carry', 'move', 'work', 'work'],
			behaviour: new BehaviourTree(test('Source1', 'Controller'))
		},
		bob: {
			body: ['carry', 'move', 'work', 'work'],
			behaviour: new BehaviourTree(test('Source1', 'Controller'))
		},
		kun: {
			body: ['carry', 'move', 'work', 'work'],
			behaviour: new BehaviourTree(test('Source1', 'Controller'))
		},
		jhon: {
			body: ['carry', 'move', 'work', 'work'],
			behaviour: new BehaviourTree(test('Source2', 'Controller'))
		},
		eddy: {
			body: ['carry', 'move', 'work', 'work'],
			behaviour: new BehaviourTree(test('Source2', 'Controller'))
		},
		hector: {
			body: ['carry', 'move', 'work', 'work'],
			behaviour: new BehaviourTree(test('Source2', 'Controller'))
		},
		lars: {
			body: ['carry', 'move', 'work', 'work'],
			behaviour: new BehaviourTree(test('Source2', 'Controller'))
		},
		chris: {
			body: ['carry', 'move', 'work', 'work'],
			behaviour: new BehaviourTree(test('Source2', 'Controller'))
		},
		chan: {
			body: ['carry', 'move', 'work', 'work'],
			behaviour: new BehaviourTree(test('Source2', 'Controller'))
		},
		jackie: {
			body: ['carry', 'move', 'work', 'work'],
			behaviour: new BehaviourTree(test('Source2', 'Controller'))
		},
		larry: {
			body: ['carry', 'move', 'work', 'work'],
			behaviour: new BehaviourTree(test('Source2', 'Controller'))
		},
		omar: {
			body: ['carry', 'move', 'work', 'work'],
			behaviour: new BehaviourTree(test('Source2', 'Controller'))
		},
		ornn: {
			body: ['carry', 'move', 'work', 'work'],
			behaviour: new BehaviourTree(test('Source1', 'Controller'))
		},
		ashe: {
			body: ['carry', 'move', 'work', 'work'],
			behaviour: new BehaviourTree(test('Source1', 'Controller'))
		},
		oppa: {
			body: ['carry', 'move', 'work', 'work'],
			behaviour: new BehaviourTree(
				new Sequence([
					new SetPositionFromFlag('Source1'),
					new WalkToPosition(),
					new GetTargetAtPosition('source'),
					new HarvestTarget(),
					new SetPositionFromFlag('Spawn1'),
					new WalkToPosition(),
					new GetTargetAtPosition('structure'),
					new TransferToTarget('energy')
				]))
		},
		lamar: {
			body: ['carry', 'move', 'work', 'work'],
			behaviour: new BehaviourTree(
				new Sequence([
					new SetPositionFromFlag('Source2'),
					new WalkToPosition(),
					new GetTargetAtPosition('source'),
					new HarvestTarget(),
					new SetPositionFromFlag('Spawn1'),
					new WalkToPosition(),
					new GetTargetAtPosition('structure'),
					new TransferToTarget('energy')
				]))
		},
		victor: {
			body: ['carry', 'move', 'work', 'work'],
			behaviour: new BehaviourTree(
				new Sequence([
					new SetPositionFromFlag('Source2'),
					new WalkToPosition(),
					new GetTargetAtPosition('source'),
					new HarvestTarget(),
					new SetPositionFromFlag('Spawn1'),
					new WalkToPosition(),
					new GetTargetAtPosition('structure'),
					new TransferToTarget('energy')
				]))
		}
	}
}

export const loop = ErrorMapper.wrapLoop(() => {
	// console.log(`Current game tick is ${Game.time}`);

	for (const [spawnName, spawnData] of Object.entries(structure)) {
		for (const [creepName, creepData] of Object.entries(spawnData)) {
			const creep = Game.creeps[creepName];
			if (creep) {
				creepData.behaviour.tick(creep);
			} else {
				Game.spawns[spawnName].spawnCreep(creepData.body, creepName);

			}
		}
	}

	// Automatically delete memory of missing creeps
	for (const name in Memory.creeps) {
		if (!(name in Game.creeps)) {
			delete Memory.creeps[name];
		}
	}
});
