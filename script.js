document.querySelector('#change-theme').addEventListener('click', () => {
    const bgUrl = window.getComputedStyle(document.querySelector('#change-theme'), 'background').backgroundImage;
    const currentIconName = bgUrl.substring(bgUrl.lastIndexOf("/") + 1, bgUrl.indexOf(".svg"));
    const currentStyle = document.getElementById("theme-switch");

    if (currentIconName == "icon-sun") {
        currentStyle.href = currentStyle.href.replace("dark-theme", "light-theme");
    } else if (currentIconName == "icon-moon") {
        currentStyle.href = currentStyle.href.replace("light-theme", "dark-theme");
    }
});

let toDoItems = [
    {text: "Morning walk with dog", status: 'completed'},
    {text: "Make breakfast", status: 'completed'},
    {text: "Watch some videos about CSS", status: 'completed'},
    {text: "Continue improving practive task #2", status: 'active'}
]

const toDoItemsBlock = document.querySelector('#to-do-items-block');
const actionsBlock = document.querySelector('.actions');

function drawToDoItems(toDoItems) {
    const ul = document.createElement('ul');
    ul.setAttribute('class', 'todo-items-container');
    toDoItemsBlock.appendChild(ul);

    let currentMode = document.querySelector('.active-mode').getAttribute('data-mode');

    for (let i = 0; i < toDoItems.length; i++) {
        const li = document.createElement('li');
        li.setAttribute('class', 'todo-item');
        li.classList.add(`${toDoItems[i].status}`);

        if (currentMode != 'all' && !li.classList.contains(currentMode)) {
            li.classList.add('hidden');
        }

        li.setAttribute('data-key', `${i}`);

        const wrap = document.createElement('div');
        wrap.setAttribute('class', 'todo-item-check-label-wrap')
    
        const checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.setAttribute('id', `todo-item-${i}`);
        toDoItems[i].status == "completed" ? checkbox.checked = true : checkbox.checked = false;
    
        const label = document.createElement('label');
        label.setAttribute('for', `todo-item-${i}`);
        label.textContent = toDoItems[i].text;
    
        wrap.append(checkbox, label);

        const deleteIcon = document.createElement('div');
        deleteIcon.setAttribute('class', 'delete-todo-item');

        li.append(wrap, deleteIcon);
        ul.appendChild(li);
    }
    activateDeleteIcon();
    getItemsLeftValue();
    enableCheckboxUpdate();
}

function activateDeleteIcon() {
    let deleteIcons = document.querySelectorAll('.delete-todo-item');

    for (let i = 0; i < deleteIcons.length; i++) {
        deleteIcons[i].addEventListener('click', (e) => {
            const key = e.target.parentNode.getAttribute('data-key');
            toDoItems.splice(key, 1);
            toDoItemsBlock.removeChild(toDoItemsBlock.firstElementChild);
            drawToDoItems(toDoItems);
        });
    }
}

function getItemsLeftValue() {
    const itemsLeftEl = document.querySelector('#items-left-count');
    let ctr = 0;
    toDoItems.forEach(el => {
        el.status == 'active' ? ctr++ : '';
    });
    itemsLeftEl.textContent = `${ctr} items left`;
}

function enableCheckboxUpdate() {
    let checkBoxes = document.querySelectorAll("#to-do-items-block input[type='checkbox']");
    checkBoxes.forEach(el => {
        el.addEventListener('change', () => {
            let id = el.id.substring(10, 11);

            if (el.checked) {
                toDoItems[id].status = 'completed'
                el.parentElement.parentElement.classList.replace('active', 'completed');
            } else {
                toDoItems[id].status = 'active';
                el.parentElement.parentElement.classList.replace('completed', 'active');
            } 
            getItemsLeftValue();
        });
    });
}

function enableModeChange() {
    let modes = document.querySelector(".filters").children;

    function removeModes() {
        for (let j = 0; j < modes.length; j++) {
            modes[j].removeAttribute('class', 'active-mode');
        }
    }

    for (let i = 0; i < modes.length; i++) {
        modes[i].addEventListener('click', () => {
            removeModes();
            modes[i].setAttribute('class', 'active-mode');

            const dataMode = modes[i].getAttribute('data-mode');
            const liArr = document.querySelectorAll('.todo-item');
            const activeLiArr = document.querySelectorAll('.active');
            const completedLiArr = document.querySelectorAll('.completed');

            if (dataMode == 'all') {
                liArr.forEach(el => el.classList.remove('hidden'));
            } else if (dataMode == 'active') {
                liArr.forEach(el => el.classList.remove('hidden'));
                completedLiArr.forEach(el => el.classList.add('hidden'));
            } else if (dataMode == 'completed') {
                liArr.forEach(el => el.classList.remove('hidden'));
                activeLiArr.forEach(el => el.classList.add('hidden'));
            }
        });
    }
}

document.querySelector('#clear-completed').addEventListener('click', () => {
    toDoItems = toDoItems.filter(el => el.status != 'completed');
    toDoItemsBlock.removeChild(toDoItemsBlock.firstElementChild);
    drawToDoItems(toDoItems);
});

document.querySelector('#add-item').addEventListener('click', () => {
    const itemText = document.querySelector('#new-item-input');
    if (itemText.value && itemText.value.trim()) {
        toDoItems.push({
            text: itemText.value,
            status: 'active'
        });
    } else {
        alert('This field is empty!');
    }

    itemText.value = '';
    toDoItemsBlock.removeChild(toDoItemsBlock.firstElementChild);
    drawToDoItems(toDoItems);
});

document.querySelector('#all-items').setAttribute('class', 'active-mode');
enableModeChange();
drawToDoItems(toDoItems);