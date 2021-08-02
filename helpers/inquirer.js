const inquirer = require('inquirer');
require('colors');

const questions = [{
    type: 'list',
    name: 'option',
    message: '¿Qué desea hacer?',
    choices: [{
            value: '1',
            name: `${'1.'.green} Buscar ciudad`
        },
        {
            value: '2',
            name: `${'2.'.green} Historial`
        },
        {
            value: '3',
            name: `${'3.'.green} Salir`
        }
    ]
}];

const listPlaces = async(places = []) => {
    const choices = places.map((place, i) => {
        const index = (i + 1 + '.').green;
        return {
            value: place.id,
            name: `${index} ${place.name}`
        }
    });
    choices.unshift({
        value: '0',
        name: '0.'.green + ' Cancelar'
    });
    const questions = [{
        type: 'list',
        name: 'id',
        message: 'Seleccione lugar: ',
        choices
    }];
    const { id } = await inquirer.prompt(questions);
    return id;
}

const inquirerMenu = async() => {
    console.log('======================'.green);
    console.log('Seleccione una opción:');
    console.log('======================\n'.green);
    const { option } = await inquirer.prompt(questions);
    return option;
}

const pause = async() => {
    await inquirer.prompt([{
        type: 'input',
        message: `Presione ${'ENTER'.green} para continuar`,
        name: 'enter'
    }]);
}

const readInput = async(message) => {
    const question = [{
        type: 'input',
        name: 'desc',
        message,
        validate(value) {
            if (value.length === 0) {
                return 'Por favor, ingrese un valor';
            }
            return true;
        }
    }];
    const { desc } = await inquirer.prompt(question);
    return desc;
}

const confirm = async(message) => {
    const question = [{
        type: 'confirm',
        name: 'ok',
        message
    }];
    const { ok } = await inquirer.prompt(question);
    return ok;
}

const questionsCompleteTask = async(tasks = []) => {
    const choices = tasks.map((task, i) => {
        const index = (i + 1 + '.').green;
        return {
            value: task.id,
            name: `${index} ${task.description}`,
            checked: (task.completed) ? true : false
        }
    });
    const questions = [{
        type: 'checkbox',
        name: 'ids',
        message: 'Seleccione tarea(s) a marcar como completa(s)/pendiente(s)',
        choices
    }];
    const { ids } = await inquirer.prompt(questions);
    return ids;
}

module.exports = {
    inquirerMenu,
    pause,
    readInput,
    listPlaces,
    confirm,
    questionsCompleteTask
}