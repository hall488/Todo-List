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

    let sortPriority = tagClass('div', 'new-todo');
    sortPriority.textContent = 'Sort By Priority';

    let sortTitle = tagClass('div', 'new-todo');
    sortTitle.textContent = 'Sort By Title';

    let sortDue = tagClass('div', 'new-todo');
    sortDue.textContent = 'Sort By Date';
    
    //on addbtn click prompt new book

    const setList = l => {
        activeList = l;
        console.log(l);
        if(activeList == undefined || activeList == null) {
            todoContainer.innerHTML = '';
            newBtn.style.display = 'none';
            sortPriority.style.display = 'none';
            sortTitle.style.display = 'none';
            sortDue.style.display = 'none';
            listTitle.textContent = 'You have no lists!'
        } else {
            listTitle.textContent = activeList.getName();
            newBtn.style.display = 'block';
            sortPriority.style.display = 'block';
            sortTitle.style.display = 'block';
            sortDue.style.display = 'block';
            update(activeList);
        }
        
    }

    const getList = () => activeList;

    sortPriority.addEventListener('click', () => {
        activeList.setSort(sortByPriority);
        update(activeList);
    })

    sortTitle.addEventListener('click', () => {
        activeList.setSort(sortByAlphabetical);
        update(activeList);
    })

    sortDue.addEventListener('click', () => {
        activeList.setSort(sortByDue);
        update(activeList);
    })

    let activeEdit;

    const menuFunc = () => {
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
    }


    addBtn.addEventListener('click', e => {
        // dList.addTodo(`Title${count}`, 'desc', 'Minor', 'fart');
        // update(dList.getTodos());
        
        menuFunc();
    });

    todoMenu.addEventListener('keypress', e => {
        var keyCode = e.keyCode || e.which;
        if(keyCode == 13 && !e.shiftKey) {
            e.preventDefault();
            menuFunc();
        } 
        // else if(keyCode == 13 && document.activeElement === todoMenu.querySelector('#description')) {
        //     console.log('d');
        //     todoMenu.querySelector('#description').value += '\n';
        // }
    })

    const editTodo = (t) => {
        todoMenu.querySelector('.todo-title').textContent = 'Edit Todo';
        todoMenu.reset();
        activeEdit = t;
        todoMenu.style.display = 'flex';
        todoMenu.querySelector('#title').defaultValue = t.getTitle();
        todoMenu.querySelector('#description').defaultValue = t.getDescription();
        todoMenu.querySelector('#due').defaultValue = t.getDue();
        todoMenu.querySelector('#priority').defaultValue = t.getPriority();
        todoMenu.querySelector('#title').focus();
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
        todoMenu.querySelector('#title').focus();
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
        description.innerHTML = t.getDescription().replace(/\n/g, "<br />");
        due.textContent = t.getDue();

        let iconArray = [
            ['editTodo', 'fa-solid', 'fa-ellipsis'],
            ['removeTodo', 'fa-solid', 'fa-circle-check']
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
            'Urgent': 'lightcoral',
            'Normal': 'khaki',
            'Minor': 'lightGreen'
        }

        div.style.background = color[t.getPriority()];
        todoContainer.append(div);
    }

    let content = document.querySelector('.content');
    content.innerHTML = '';
    let btnDiv = tagClass('div', 'btnDiv');
    btnDiv.append(newBtn, sortPriority, sortTitle, sortDue);
    content.append(listTitle, btnDiv, todoContainer);
    newBtn.style.display = 'none';
    sortPriority.style.display = 'none';
    sortTitle.style.display = 'none';
    sortDue.style.display = 'none';
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
    let setSort = s => {
        sortBy = s;
        todos.sort( (t1, t2) => {
            return sortBy(t1, t2);
        });
    };

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
    let p1 = a.getTitle().toLowerCase();
    let p2 = b.getTitle().toLowerCase();

    return p1 > p2 ? 1 : -1; 
}

const sortByPriority = (a, b) => {
    let p1 = a.getPriority();
    let p2 = b.getPriority();

    let val;

    switch(p1) {
        case 'Urgent': 
            if(p2 == 'Urgent') {
                val = 1; 
                break;
            } else {
                val = -1; break;
            }
        case 'Normal':
            if(p2 == 'Urgent' || p2 == 'Normal') {
                val = 1; 
                break;
            } else {
                val = -1; break;
            }
                
        case 'Minor':
            val = 1; break;
    }
    return val;
}

const sortByDue = (a, b) => {
    let [a1,a2,a3] = a.getDue().split('-');
    let [b1,b2,b3] = b.getDue().split('-');

    console.log(a1,a2,a3);

    if(a1 > b1) return 1;
    else if(a1 == b1) {
        if(a2 > b2) return 1;
        else if(a2 == b2) {
            if(a3 > b3) return 1;
            else if(a3 == b3) return 1;
        }
    }
    
    return -1;
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