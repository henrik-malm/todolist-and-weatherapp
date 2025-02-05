// Kollar efter localstortage, om finns hämtar vi och det och store it in itemsarey , i annat fall skapar vi en tom arrey med namenet
const itemsArray = localStorage.getItem("items") ? JSON.parse(localStorage.getItem("items")) : [];
console.log(itemsArray)

document.querySelector("#enter").addEventListener("click", () => {
    const item = document.querySelector("#item")
    create(item)
})

function create(item){
    itemsArray.push(item.value)
    localStorage.setItem("items", JSON.stringify(itemsArray))
    location.reload() // HHHHHH
}

/* Access the Arrey and display the item*/
function displayItems(){
    let items = ""
    for(let i = 0 ; i < itemsArray.length ; i++){
        items +=` <div class="item">
            <div class="input-controller">
                <textarea disabled>${itemsArray[i]}</textarea>
                <div class="edit-controller">
                    <i class="fa-solid fa-check deleteBtn"></i>
                    <i class="fa-regular fa-pen-to-square EditBtn"></i>
                </div>
            </div>
            <div class="update-controller">
                <button class="saveBtn">Save</button>
                <button class="cancelBtn">Cancel</button>
            </div>
        </div>`
    }


    // Adding EventListerner - place in text right after created so they activated right after created 
    document.querySelector(".to-do-list").innerHTML = items
    activateDeleteListeners() 
    activateEditListeners ()
    activateSaveListeners ()
    activateCancelListeners()
    } 

    function activateDeleteListeners(){
        let deleteBtn = document.querySelectorAll(".deleteBtn")
        deleteBtn.forEach((db, i) => { 
            db.addEventListener("click", () => { deleteItem(i) })
        })
    }

    function activateEditListeners(){
        const editBtn = document.querySelectorAll(".EditBtn")
        const updateController = document.querySelectorAll(".update-controller")
        const inputs = document.querySelectorAll(".input-controller textarea")
        editBtn.forEach((eb,i) => {
            eb.addEventListener("click", () => {
                updateController[i].style.display= "block"
                inputs[i].disabled = false
            })
        })
    }

    function activateSaveListeners(){
        const saveBtn = document.querySelectorAll(".saveBtn")
        const inputs = document.querySelectorAll(".input-controller textarea")
        saveBtn.forEach((sb, i) => {
            sb.addEventListener("click", () => {
                updateItem(inputs[i].value, i)
            })
        })
    }

    function updateItem(text, i) { 
        itemsArray[i] = text
        localStorage.setItem("items", JSON.stringify(itemsArray))
        location.reload()
        // lookup the other , didnt check thorough right, go through
    }

    function activateCancelListeners(){
        const cancelBtn = document.querySelectorAll(".cancelBtn")
        const updateController = document.querySelectorAll(".update-controller")
        const inputs = document.querySelectorAll(".input-controller textarea")
        cancelBtn.forEach((cb, i) => {
            cb.addEventListener("click", () => {
                updateController[i].style.display = "none"
                inputs[i].disabled = true
                // need to wipte any input aswell !!!!!! 
            })
        })
    }


    function deleteItem(i){
        itemsArray.splice(i, 1)
        localStorage.setItem("items", JSON.stringify(itemsArray))
        location.reload()
    }
    




// === Segment written first - to make date and year show in our span
function displayDate(){
    let date = new Date()
    date = date.toString().split(" ")  // konverterar datan till en array 
    document.querySelector("#date").innerHTML = date[1]+" "+" "+date[2]+" "+ date[3]
}

window.onload = function(){
    displayDate()
    displayItems()
}