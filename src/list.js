import todo from './todo';
import tagClass from './util';

const listDOM = (dList) => {

    let addBtn = tagClass('div', 'add-todo');
    addBtn.textContent = 'Add Todo';
    let todoContainer = tagClass('div', 'todo-container');

    //on addbtn click prompt new book
    addBtn.addEventListener('click', e => {
        
        dList.addTodo('title', 'desc', 'Urgent', 'fart');
        update(dList.getTodos());
    });

    const update = l => {
        todoContainer.innerHTML = '';
        l.forEach( t => {
            formatTodo(t);
        });
    };

    const formatTodo = t => {
        let div = tagClass('div', 'todo');
        let title = tagClass('div', 'title');
        let description = tagClass('div', 'description');
        let due = tagClass('div', 'due');
        let icons = tagClass('div', 'icons');

        div.append(title, description, due, icons);

        title.textContent = t.getTitle();
        description.textContent = t.getDescription();
        due.textContent = t.getDue();

        let iconArray = [
            ['removeTodo', 'fa-solid', 'fa-trash'],
            ['editTodo', 'fa-solid', 'fa-ellipsis'],
            ['setComplete', 'fa-solid', 'fa-circle-check']
        ];

        iconArray.forEach( a => {
            let [func, ...args] = a;
            let iconDiv = tagClass('div', 'icon');
            let icon = tagClass('i', ...args);
            iconDiv.append(icon);
            icons.append(iconDiv);
            iconDiv.addEventListener('click', (e, title) => dList[func]);
        });

        let color = {
            'Urgent' : 'red',
            'Normal' : 'yellow',
            'Minor' : 'green'
        }

        div.style.background = color[t.getPriority()];
        todoContainer.append(div);        
    }

    let content = document.querySelector('.content');
    content.innerHTML = '';
    content.append(addBtn, todoContainer);
}

const list = () => {

    let todos = [];
    let getTodos = () => todos;

    // ['push', 'splice', 'sort'].forEach( operation => {
    //     todos[operation] = function() {
    //         Array.prototype[operation].apply(this, arguments);
    //         dom.update(todos);
    //     }
    // });

    let sortBy = sortByAlphabetical;
    let setSort = s => sortBy = s;

    const addTodo = (...args) => {
        todos.push(todo(...args));
        todos.sort((t1, t2) => sortBy);
    }

    const removeTodo = (e, title) => {
        let t = findByTitle(title);
        todos.splice(todos.indexOf(t), 1);
    }

    const setComplete = (e, title) => {
        let t = findByTitle(title);
        t.setCompletion();
        removeTodo(title);
    }

    const findByTitle = title => {
        let fTodo = todos.find(t => t == title);
        return fTodo;
    }
    

    return{ getTodos, addTodo, removeTodo, setSort, setComplete }
}

const sortByAlphabetical = (a,b) => {
    return 1;
}

const sortByPriority = (a,b) => {

}

const sortByDue = (a,b) => {

}

const listaroo = () => {
    let listy = list();
    let dommy = listDOM(listy);
}

export default listaroo;