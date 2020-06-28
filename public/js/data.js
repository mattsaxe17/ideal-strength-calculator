var deviation = .03,
	repRatios = [0, 1, .97, .94, .92, .89, .86, .83, .81, .78, .76],
	exercises = new Array,
	setGroups = new Array;

class Exercise {
	constructor(name, multiplyer){
		this.name = name;
		this.value = name.split(' ').join('-').toLowerCase();
		this.multiplyer = multiplyer;
		this.calculatedWeights = new Object;
	}
}

class SetGroup {
	constructor(sets, reps, type, multiplyer){
		this.sets = sets;
		this.reps = reps;
		this.type = type;
		this.multiplyer = multiplyer;
	}
}

function addExercise(name, multiplyer){
	let exercise = new Exercise(name, multiplyer);
	exercises.push(exercise);
}

function addSetGroup(sets, reps, type, multiplyer){
	let setGroup = new SetGroup(sets, reps, type, multiplyer);
	setGroups.push(setGroup);
}

addExercise('Squat', 1);
addExercise('Deadlift', 1.2);
addExercise('Power clean', .68);
addExercise('Bench press', .75);
addExercise('Barbell Row', .6);
addExercise('Overhead press', .45);

addSetGroup(5, 5, 'strength', .81);
addSetGroup(3, 10, 'hypertrophy', .7);
addSetGroup(4, 15, 'endurance', .55);