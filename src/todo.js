const todo = (title, description, due, priority) => {
    
    let completed = false;

    const getCompletion = () => completed;
    const setCompletion = () => completed = true;

    const getTitle = () => title;
    const setTitle = t => title = t;

    const getDescription = () => description;
    const setDescription = d => description = d;

    const getPriority = () => priority;
    const setPriority = p => priority = p;

    const getDue = () => due;
    const setDue = d => due = d;


    return {getCompletion, setCompletion, getTitle, setTitle, getDescription, setDescription,
            getPriority, setPriority, getDue, setDue};
}

export default todo;