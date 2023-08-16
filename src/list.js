import todo from './todo';
import tagClass from './util';
import storageAvailable from './storage';

const listDOM = activeList => {

    let todoMenu = document.querySelector('.todo-menu');
    let cnlBtn = document.querySelector('.cancel');
    let newBtn = tagClass('div', 'new-todo');
    let addBtn = document.querySelector('.add-todo');
    let listTitle = tagClass('div', 'list-header');   

    newBtn.textContent = 'Add Todo';
    let todoContainer = tagClass('div', 'todo-container');
    //on addbtn click prompt new book

    const setList = l => {
        activeList = l;
        console.log(l);
        if(activeList == undefined || activeList == null) {
            todoContainer.innerHTML = '';
            newBtn.style.display = 'none';
            listTitle.textContent = 'You have no lists!'
        } else {
            listTitle.textContent = activeList.getName();
            newBtn.style.display = 'block';
            update(activeList);
        }
        
    }

    const getList = () => activeList;

    let activeEdit;

    addBtn.addEventListener('click', e => {
        // dList.addTodo(`Title${count}`, 'desc', 'Minor', 'fart');
        // update(dList.getTodos());
        
        let data = new FormData(todoMenu);
        let val = data.entries();
        let args = [];
        for (let pair of val) {
            args.push(pair[1]);
        }

        todoMenu.reportValidity();

        if (todoMenu.checkValidity()) {
            
            

            if(activeEdit == undefined) {
                activeList.addTodo(...args);
            } else {
                activeList.editTodo(activeEdit, ...args);
            }

            update(activeList);

            todoMenu.reset();
            todoMenu.style.display = 'none';
            // let newB = new Book(...args);
            // bookMenu.reset();
            // bookMenu.style.display = 'none';
        }
    });

    const editTodo = (t) => {
        todoMenu.querySelector('.todo-title').textContent = 'Edit Todo';
        todoMenu.reset();
        activeEdit = t;
        todoMenu.style.display = 'flex';
        todoMenu.querySelector('#title').defaultValue = t.getTitle();
        todoMenu.querySelector('#description').defaultValue = t.getDescription();
        todoMenu.querySelector('#due').defaultValue = t.getDue();
        todoMenu.querySelector('#priority').defaultValue = t.getPriority();
    }

    newBtn.addEventListener('click', () => {
        todoMenu.querySelector('.todo-title').textContent = 'New Todo';
        todoMenu.reset();
        activeEdit = undefined;
        todoMenu.style.display = 'flex';
        todoMenu.querySelector('#title').defaultValue = '';
        todoMenu.querySelector('#description').defaultValue = '';
        todoMenu.querySelector('#due').defaultValue = '';
        todoMenu.querySelector('#priority').defaultValue = '';
    });

    cnlBtn.addEventListener('click', () => {
        todoMenu.reset();
        activeEdit = undefined;
        todoMenu.style.display = 'none';
    });

    const update = l => {
        todoContainer.innerHTML = '';
        l.getTodos().forEach(t => {
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

        iconArray.forEach(a => {
            let [func, ...args] = a;
            let iconDiv = tagClass('div', 'icon');
            let icon = tagClass('i', ...args);
            iconDiv.append(icon);
            icons.append(iconDiv);
            iconDiv.addEventListener('click', () => {
                if (func != 'editTodo') {
                    activeList[func](t.getTitle());
                } else {
                    editTodo(t);
                }
                update(activeList);
            });
        });

        let color = {
            'Urgent': 'red',
            'Normal': 'yellow',
            'Minor': 'green'
        }

        div.style.background = color[t.getPriority()];
        todoContainer.append(div);
    }

    let content = document.querySelector('.content');
    content.innerHTML = '';
    content.append(listTitle, newBtn, todoContainer);
    newBtn.style.display = 'none';
    setList(activeList);

    return {setList, getList};
}

const list = (name, data = []) => {

    let todos = [];



    let getName = () => name;
    let getTodos = () => todos;

    // ['push', 'splice'].forEach( operation => {
    //     todos[operation] = function() {
    //         Array.prototype[operation].apply(this, arguments);
    //         saveList(name, todos);
    //     }
    // });

    let sortBy = sortByAlphabetical;
    let setSort = s => sortBy = s;

    const addTodo = (...args) => {
        todos.push(todo(...args));
        todos.sort((t1, t2) => sortBy);
        saveList(name, todos);
    }

    const removeTodo = (title) => {
        let t = findByTitle(title);
        todos.splice(todos.indexOf(t), 1);
        saveList(name, todos);
    }

    const setComplete = (title) => {
        let t = findByTitle(title);
        t.setCompletion();
        removeTodo(title);
    }

    const editTodo = (t, ...args) => {
        t.setTitle(args[0]);
        t.setDescription(args[1]);
        t.setDue(args[2]);
        t.setPriority(args[3]);
        saveList(name, todos);
    }

    const findByTitle = title => {
        let fTodo = todos.find(t => t.getTitle() == title);
        return fTodo;
    }

    data.forEach(d => {
        addTodo(d.title, d.descripition, d.due, d. priority);
    })


    return { getName, getTodos, addTodo, removeTodo, setSort, setComplete, editTodo }
}

const sortByAlphabetical = (a, b) => {
    return 1;
}

const sortByPriority = (a, b) => {

}

const sortByDue = (a, b) => {

}

const saveList = (name, todos) => {
    if (storageAvailable("localStorage")) {
        // Yippee! We can use localStorage awesomeness
        console.log(`${name}, Saved`);
        let tobeSaved = [];
        todos.forEach(t => {
            tobeSaved.push({
                'title': t.getTitle(),
                'descripition': t.getDescription(),
                'due': t.getDue(),
                'priority': t.getPriority(),                
                'completion': t.getCompletion()
            });
        });
        console.log(JSON.stringify(tobeSaved));
        localStorage.setItem(name, JSON.stringify(tobeSaved));

    } else {
        // Too bad, no localStorage for us
        console.log('Warning: Lists are not being saved!');
    }
}

export { list, listDOM };