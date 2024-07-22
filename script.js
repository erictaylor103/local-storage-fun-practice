const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const AddItemButton = document.querySelector('.btn');
const clearButton = document.getElementById('clear');
const deleteIcon = document.querySelectorAll('.fa-solid');
const removeItemButton = document.querySelectorAll('.remove-item');
const filterDiv = document.querySelector('.filter');
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;

//Display items form Local Storage
function displayItems(){
    let itemsFromStorage = getItemsFromStorage();
    
    itemsFromStorage.forEach(item => addItemToDOM(item));

    checkUI();
}

//check if the button clicked has the className of remove-item
function onClickItem(e){
    if(e.target.parentElement.classList.contains('remove-item')){
        deleteItem(e.target.parentElement.parentElement);
    }else{
        setItemToEdit(e.target);
    }
}

//set the item to be editable
function setItemToEdit(item){
    isEditMode = true;

    itemList.querySelectorAll('li').forEach((i) => i.classList.remove('edit-mode'));

    item.classList.add('edit-mode');
    formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
    itemInput.value = item.textContent;
    formBtn.style.backgroundColor = "#228B22";
}

//create button
function createButton(classes){    
    const button = document.createElement('button');
    button.className = classes;
    const icon = createIcon('fa-solid fa-xmark');
    button.appendChild(icon);
    return button;        
}

//create icon
function createIcon(classes){        
    const icon = document.createElement('i');
    icon.className = classes;
    return icon;
}

//add item
function OnaddItemSubmit(e){
    e.preventDefault();
    const newItem = itemInput.value;
    
    //validate input
    if(newItem === ''){
        alert('Please enter an item');
        return;
    }

    //check for Edit Mode
    if(isEditMode){
        const itemToEdit = itemList.querySelector('.edit-mode');

        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove('edit-mode');
        itemToEdit.remove();
        isEditMode = false;
    }else{
        if(checkIfItemExists(newItem)){
            alert("Item already exists");
            return;
        }
    }
    

    //Create item DOM element
    addItemToDOM(newItem);

    //Add item to local storage
    addItemToStorage(newItem);

    checkUI();

    //reset item input
    itemInput.value = '';
}

//Add item to DOM
function addItemToDOM(item){
    //create item list
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(item));
    
    //create the button
    const button = createButton('remove-item btn-link text-red');
    li.appendChild(button);

    //add items to the itemList
    itemList.appendChild(li);
}

//Add item to Local Storage
function addItemToStorage(item){
    let itemsFromStorage = getItemsFromStorage();

    //add new item\ to array
    itemsFromStorage.push(item);

    //convert to JSON String and set(save) to local storage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));

}

//get the items from local storage
function getItemsFromStorage(){
    //check if there are any items in local storage
    if(localStorage.getItem('items') === null){
        itemsFromStorage = [];
    }else{
    //get the data and convert the string data in local storage into an array so we can use it
        itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    }

    return itemsFromStorage;
}

//prevent duplicate entries
function checkIfItemExists(item){
    let itemsFromStorage = getItemsFromStorage();
    if(itemsFromStorage.includes(item)){
        return true;
    }else{
        return false;
    }
}



//clear ALL items
function clearAll(){
    const parentUl = document.getElementById('item-list');
    if(confirm('are you sure')){
        while(parentUl.firstChild){
            parentUl.removeChild(parentUl.firstChild);                    
        }
    }

    //clear all items from local storage
    localStorage.removeItem('items');

    //check if there are any items in the DOM and hide clear and search if there are no items
    checkUI();
}

//remove clicked item
function deleteItem(item){
    if(confirm("are you sure")){
        
        //remove item from DOM
        item.remove();
        
        //remove item from local storage        
        removeItemFromStorage(item.textContent);

        //check if items are present
        checkUI();
    }
}

//remove item from local storage
function removeItemFromStorage(item){
    let itemsFromStorage = getItemsFromStorage();

    //filter out items that were not clicked
    itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

    //Re-add to local storage only the items that were not clicked
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

//filter items list
function filterItems(e){
    const allItems = itemList.querySelectorAll('li');
    let text = e.target.value.toUpperCase();
    
    allItems.forEach((item) => {
        const itemName = item.firstChild.textContent.toUpperCase();
        
        if(itemName.indexOf(text) != -1){
            item.style.display = 'flex';
        }else{
            item.style.display = 'none';
        }
    })
}

//only show if there are items present
function checkUI(){
    const allItems = itemList.querySelectorAll('li');
    if(allItems.length === 0){
        clearButton.style.display = 'none';
        filterDiv.style.display = 'none'
    }else{
        clearButton.style.display = 'block';
        filterDiv.style.display = 'block';
    }
    formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';

    formBtn.style.backgroundColor = "#333";
}


//Initialize app so it all runs from one function/scope
function init(){
    //add event listeners
    itemForm.addEventListener('submit', OnaddItemSubmit);
    clearButton.addEventListener('click', clearAll);
    itemList.addEventListener('click', onClickItem);
    itemFilter.addEventListener('input', filterItems);  
    document.addEventListener('DOMContentLoaded', displayItems);
    
    checkUI();
}

//initialize/run the app
init();
