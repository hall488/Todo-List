import './style.css';
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/brands';
import list from './list';

//home return to default page
//content loads default or todolist

//sidebar needs expand and collapse

const sidebarDOM = () => {
    let expand = false;
    let btn = document.querySelector('.exp-col');
    let nav = document.querySelector('.nav');

    nav.style.transition = 'max-width .5s ease-in-out, padding .5s linear';
    

    let toggleExpand = e => {
        expand = !expand;       

        expand  ?   (nav.classList.add('nav-collapse'), btn.classList.add('exp-col-flip'))
                :   (nav.classList.remove('nav-collapse'), btn.classList.remove('exp-col-flip'));
    }

    btn.addEventListener('click', toggleExpand);

}

window.addEventListener('load', () => {
    sidebarDOM();
    list();
});

