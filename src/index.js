import './style.css';
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/brands';
import {list, listDOM} from './list';
import storageAvailable from './storage';
import tagClass from './util';

//home return to default page
//content loads default or todolist

//sidebar needs expand and collapse

let listArray = [];
let contentDOM;
let sidebarD;
let poo = [];

const sidebarDOM = () => {
    let expand = false;
    let container = document.querySelector('.container');
    let expColBtn = document.querySelector('.exp-col');
    let nav = document.querySelector('.nav');
    let header = document.querySelector('.header');
    let footer = document.querySelector('.footer');
    let sidebar = document.querySelector('.sidebar');
    let addBtn = document.querySelector('.nav-add');
    let ul = document.querySelector('.lists');
    let newListMenu = document.querySelector('.new-list');


    let verticalLayout = false;

    let toggleExpand = e => {
        expand = !expand;       

        setSidebar();        
            
    }

    let setSidebar = () => {
        if(verticalLayout) {
            expand  ?   (nav.classList.remove('nav-collapse'), nav.classList.add('nav-collapse-vertical'), expColBtn.classList.add('exp-col-flip'))
                    :   (nav.classList.remove('nav-collapse-vertical'), nav.classList.remove('nav-collapse'), expColBtn.classList.remove('exp-col-flip'));
        } else {
            expand  ?   (nav.classList.remove('nav-collapse-vertical'), nav.classList.add('nav-collapse'), expColBtn.classList.add('exp-col-flip'))
                    :   (nav.classList.remove('nav-collapse-vertical'), nav.classList.remove('nav-collapse'), expColBtn.classList.remove('exp-col-flip'));
        }
    }

    expColBtn.addEventListener('click', toggleExpand);

    let setVerticalLayout = bool => {
        verticalLayout = bool;
        if(bool) {
            setTimeout(() => {nav.style.transition = 'max-height .5s ease-in-out, padding-bottom .5s linear, padding-top .5s linear'}, 500);
            container.classList.add('container-vertical');
            footer.classList.add('footer-vertical');
            header.classList.add('header-vertical');
            sidebar.classList.add('sidebar-vertical');
            nav.classList.add('nav-vertical');

        } else {
            setTimeout(()=>{nav.style.transition = 'max-width .5s ease-in-out, padding-left .5s linear, padding-right .5s linear'}, 500);
            container.classList.remove('container-vertical');
            footer.classList.remove('footer-vertical');
            header.classList.remove('header-vertical');
            sidebar.classList.remove('sidebar-vertical');
            nav.classList.remove('nav-vertical');
        }

        setSidebar();
    }

    const newList = () => {
        
        // for(;;) {
        //     name = prompt('Enter list name');
        //     if(name != '' && !poo.includes(name)) break;
        // }

        newListMenu.style.display = 'flex';
    }

    document.querySelector('.cancel-list').addEventListener('click', () => {
        newListMenu.style.display = 'none';
    })
    
    document.querySelector('.add-list').addEventListener('click', () => {
        let data = new FormData(newListMenu);
        let val = data.entries();
        let args = [];
        for (let pair of val) {
            args.push(pair[1]);
        }

        

        newListMenu.reportValidity();
        if(poo.includes(args[0])) {
            alert('You cannot have two lists with the same name!');
        }
        else if (newListMenu.checkValidity()) {
            
            addList(...args);

            newListMenu.reset();
            newListMenu.style.display = 'none';
            // let newB = new Book(...args);
            // bookMenu.reset();
            // bookMenu.style.display = 'none';
        }
    })

    const addList = (name) => {
        poo.push(name);
        localStorage.setItem('christopherhLists', poo);
        populateSidebar(name);
    }

    addBtn.addEventListener('click', newList);

    const populateSidebar = (listName) => {
        let del = tagClass('div', 'del-list');
        let delIcon = tagClass('i', 'fa-solid', 'fa-trash')
        let li = tagClass('li');
        let div = tagClass('div', 'list-goto');
        div.textContent = listName;

        let test = JSON.parse(localStorage.getItem(listName));

        let newList = list(listName, test == null ? [] : test);
        listArray.push(newList);

        del.addEventListener('click', () => {
            
            localStorage.removeItem(listName);
            poo.splice(poo.indexOf(listName), 1);
            listArray.splice(listArray.indexOf(newList), 1);
            localStorage.setItem('christopherhLists', poo);
            if(contentDOM.getList() === newList) {
                contentDOM.setList(listArray[0]);
            }
            
            ul.removeChild(li);
            
        });

        div.addEventListener('click', () => {
            contentDOM.setList(newList);
        });
        del.append(delIcon);
        li.append(div);
        li.append(del);
        ul.append(li);
    }

    

    return { setVerticalLayout, populateSidebar }
}






window.addEventListener('load', () => {
    sidebarD = sidebarDOM();
    sidebarD.setVerticalLayout(document.documentElement.clientWidth <= 768); 
    

    if (storageAvailable("localStorage")) {
        // Yippee! We can use localStorage awesomeness
        let test = localStorage.getItem('christopherhLists');
        console.log(test);
        if(test != null && test != '') {
            poo = test.split(',');
            

            if(typeof(poo) == String) {
                sidebarD.populateSidebar(poo);
            } else {
                poo.forEach(p => {
                    sidebarD.populateSidebar(p);
                });
            }
            contentDOM = listDOM(listArray[0]);
        } else {
            contentDOM = listDOM();
        }
        
    } else {
        // Too bad, no localStorage for us
        console.log('No available storage!');
    }

    
});

window.addEventListener('resize', (e) => {
    console.log(document.documentElement.clientWidth, document.documentElement.clientHeight);
    sidebarD.setVerticalLayout(document.documentElement.clientWidth <= 768); 
});



