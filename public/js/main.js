/*-----
on page load
-----*/
//default dropdown values
initiateDropdown('exercise-dropdown', 'squat', 'Squat', true);
initiateDropdown('unit-dropdown', 'lbs', 'Lbs', true);
initiateDropdown('set-examples-exercise-dropdown', 'squat', 'Squat', true);

/*-----
main program events
-----*/
$('.dropdown-menu').on('click', e => {
    dropdownSelection(e);
});

$('#calculate-btn').on('click', e => {
    e.preventDefault();
    calculate();
    displayCalculatedData();
});

$('#output-reps-input').on('change', e => {
    boundNumberInput('output-reps-input', 1, 10);
    calculateWeightRange(e.target.value);
    displayCalculatedData();
});

$('#set-examples-exercise-dropdown div a').on('click', e => {
    $('#example-sets-card .results.dynamic').html('');
    displaySetExamples(e.target.textContent.split(' ').join('-').toLowerCase());
});

/*-----
results display functions
-----*/
function displayCalculatedData() {
    $('.results.dynamic').html('');
    $('.results.container').css('display', 'flex');
    $('.footer').css('display', 'flex');
    displayOneRepMaxes();
    displayIdealRanges();
    displaySetExamples('squat');
}

function displayOneRepMaxes() {
    $('#one-rep-maxes-results').append(`<p class="results-header full-card-width"><span class="exercise-name">Exercise</span>
    <span class="exercise-weight-range">1RM</span></p>`)

    exercises.forEach(exercise => {
        $('#one-rep-maxes-results').append(
            `<p class="results-row"><span class="exercise-name">${exercise.name}:</span>
            <span class="exercise-weight-range">${Math.round(exercise.calculated1RMRange.exact)} ${exercises.currentUnit}</span></p>`);
    });
}

function displayIdealRanges() {
    $('#ideal-ranges-results').append(`<p class="results-header full-card-width"><span class="exercise-name">Exercise</span>
    <span class="exercise-weight-range">Range</span></p>`);

    exercises.forEach(exercise => {
        $('#ideal-ranges-results').append(
            `<p class="results-row"><span class="exercise-name">${exercise.name}:</span>
            <span class="exercise-weight-range">${Math.round(exercise.calculatedWeightRange.lower)}
            - ${Math.round(exercise.calculatedWeightRange.upper)} ${exercises.currentUnit}</span></p>`);
    });
}

function displaySetExamples(exercise) {
    let types = ['strength', 'hypertrophy', 'endurance'];

    types.forEach(type => {
        let setGroupsOfType = setGroups.filter(setGroup => setGroup.type == type);
        setGroupsOfType.forEach(setGroupOfType => {
            $(`#${type}-set-examples`).html('');
            let weight = calculateSetGroupWeight(exercise, setGroupOfType.multiplyer);
            $(`#${type}-set-examples`).append(`
                <p>${setGroupOfType.sets}x${setGroupOfType.reps} - ${weight} ${exercises.currentUnit}</p>
            `)
        });
    });
}

/*-----
calculation functions
-----*/
function calculate() {
    boundAllNumberInputs();
    let selectedExercise = $('#exercise-dropdown').attr('data-selected'),
        selectedUnit = $('#unit-dropdown').attr('data-selected'),
        selectedWeight = $('#weight-input').val(),
        selectedReps = $('#reps-input').val();
    calculate1RMRange(selectedExercise, selectedUnit, selectedWeight, selectedReps);
    calculateWeightRange(1);
}

//ideal ranges calculation
function calculateWeightRange(reps) { //to be called every time some input is changed
    exercises.forEach(exercise => {
        exercise.calculatedWeightRange = {
            lower: exercise.calculated1RMRange.lower * repRatios[reps],
            upper: exercise.calculated1RMRange.upper * repRatios[reps]
        }
    });
}

//set examples calculation
function calculateSetGroupWeight(selectedExercise, multiplyer) {
    let exercise1RM = exercises.find(exercise => selectedExercise == exercise.value).calculated1RMRange.exact;

    return Math.floor(exercise1RM * multiplyer);
}

//base calculations
function calculate1RMRange(exercise, unit, weight, reps) {
    let squat1RM = calculateBase(exercise, weight, reps);

    exercises.forEach(exercise => {
        let calculated1RM = squat1RM * exercise.multiplyer;
        exercise.calculated1RMRange = {
            lower: calculated1RM - calculated1RM * deviation,
            upper: calculated1RM + calculated1RM * deviation,
            exact: calculated1RM
        }
    });

    exercises.currentUnit = unit;
}

function calculateBase(exercise, weight, reps) { //squat 1RM used as base
    let exerciseObject = exercises.find(ex => { return ex.value === exercise });
    return (weight / repRatios[reps]) / exerciseObject.multiplyer;
}

/*-----
dropdown functions
-----*/
function dropdownSelection(e) {
    e.preventDefault();
    let clickedDropdown = e.target.parentElement.parentElement.id,
        text = e.target.textContent,
        value = text.split(' ').join('-').toLowerCase();
    updateDropdownValue(clickedDropdown, value, text);
}

function updateDropdownValue(selectedDropdown, value, text) {
    initiateDropdown(selectedDropdown, value, text);
    toggleDropdownMenu(selectedDropdown);
    $('#' + selectedDropdown + ' .dropdown-btn i').removeClass('dropdown-arrow-rotate');
}

function initiateDropdown(selectedDropdown, value, text, onPageLoad = false) {
    $('#' + selectedDropdown + ' .dropdown-btn').html(`<p>${text}</p><i class="fas fa-angle-down"></i>`);
    $('#' + selectedDropdown).attr('data-selected', value);
    if (onPageLoad) {
        $('#' + selectedDropdown + ' .dropdown-menu').hide();
    }
}

function toggleDropdownMenu(selectedDropdown) {
    let dropdownMenu = $('#' + selectedDropdown + ' .dropdown-menu'),
        arrow = $('#' + selectedDropdown + ' .dropdown-btn i');
    dropdownMenu.slideToggle('fast');
    arrow.toggleClass('dropdown-arrow-rotate');
}

/*-----
number input functions
----*/
function boundAllNumberInputs() {
    boundNumberInput('weight-input', 10, 1000);
    boundNumberInput('reps-input', 1, 10);
    boundNumberInput('output-reps-input', 1, 10);
}

function boundNumberInput(selectedInput, min, max) {
    let value = $('#' + selectedInput).val();
    if (value < min) {
        value = min;
    } else if (value > max) {
        value = max;
    }
    $('#' + selectedInput).val(value);
}