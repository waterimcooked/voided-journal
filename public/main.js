let mainTitle = document.querySelector(".main-title")
let mainNotes = document.querySelector(".main-notes")

let mainIntro = document.querySelector(".main-intro")
let randomQuote = document.querySelector(".random-quote")

let cardButton = document.querySelector(".card-button")
let cardTitle = document.querySelector(".card-title")
let cardBody = document.querySelector(".card-body")

let cards = document.querySelectorAll(".post-card")

let editModal = document.querySelector(".edit-modal")
let editSubmit = document.querySelector(".edit-button")
let editTitle = document.querySelector(".edit-title")
let editBody = document.querySelector(".edit-body")

let viewModal = document.querySelector(".view-modal")
let viewTitle = document.querySelector(".view-title")
let viewBody = document.querySelector(".view-body")
let viewButton = document.querySelector(".view-button")

const appearDelay = 50
const maxTitleLength = 14
const maxBodyLength = 25

// helpers

appearAll()

function attachCardListeners(card) {
    const handleEditSubmit = () => {
        editSubmit.removeEventListener("click", handleEditSubmit)
        disappearElement(editModal)
        fetch("/edit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                id: card.dataset.id,
                newTitle: editTitle.value,
                newBody: editBody.value,
            })
        }).then(() => {
            card.querySelector(".post-title").innerHTML = editTitle.value
            card.querySelector(".post-body").innerHTML = editBody.value
            card.dataset.fullTitle = editTitle.value
            card.dataset.fullBody = editBody.value

            cutTitle(card.querySelector(".post-title"))
            cutBody(card.querySelector(".post-body"))
        })
    }

    const handleView = () => {
        viewButton.removeEventListener("click", handleEditSubmit)
        disappearElement(viewModal)
    }

    card.querySelector(".delete").addEventListener("click", () => {
        fetch("/delete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: card.dataset.id })
        }).then(() => card.remove())
    })

    card.querySelector(".edit").addEventListener("click", () => {
        editModal.style.display = "block"
        appearElement(editModal)
        editTitle.value = card.dataset.fullTitle
        editBody.value = card.dataset.fullBody 
        editSubmit.addEventListener("click", handleEditSubmit)
    })

    card.querySelector(".view").addEventListener("click", () => {
        viewModal.style.display = "block"
        appearElement(viewModal)
        viewTitle.innerHTML = card.dataset.fullTitle
        viewBody.innerHTML = card.dataset.fullBody
        viewButton.addEventListener("click", handleView)
    })
}

function appearAll() {
    console.log("appearing all...")
    let content = document.querySelectorAll(".content")
    content.forEach((element, index) => {
        setTimeout(() => {
            appearElement(element)
        }, index * appearDelay);
    })
}

function cutTitle(text) {
    if (text.textContent.length > maxTitleLength) {
        text.textContent = text.textContent.slice(0, maxTitleLength) + "..."
    }
}

function cutBody(text) {
    if (text.textContent.length > maxBodyLength) {
        text.textContent = text.textContent.slice(0, maxBodyLength) + "..."
    }
}

function appearElement(element) {
    element.classList.add("appear")
    setTimeout(() => {
        element.style.pointerEvents = "auto"
        element.classList.add("visible")
    }, 100)
}

function disappearElement(element) {
    element.classList.remove("visible")
    setTimeout(() => {
        element.style.pointerEvents = "none"
    }, 500)
}

// letter hiding or wtv

let postTitles = document.querySelectorAll(".post-title")
postTitles.forEach(title => {
    cutTitle(title)
})

let postBodies = document.querySelectorAll(".post-body")
postBodies.forEach(body => {
    cutBody(body)
})

// buttons

cards.forEach(card => {
    console.log(card.dataset.id)
    attachCardListeners(card)
})

// anti-post

let loaded = document.querySelector(".loaded")

cardButton.disabled = true

function checkInput() {
    if (cardTitle.value.trim().length > 0 && cardBody.value.trim().length > 0) {
        cardButton.disabled = false
    } else {
        cardButton.disabled = true
    }
    console.log(cardButton.disabled)
}

cardTitle.addEventListener("input", checkInput)
cardBody.addEventListener("input", checkInput)

// posting

cardButton.addEventListener("click", () => {
    fetch("/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            TITLE: cardTitle.value,
            BODY: cardBody.value
        })
    }).then(res => res.json())
    .then(data => {
        // build the new card
        console.log("whattt")

        const card = document.createElement("div")
        card.classList.add("post-card", "content")
        card.dataset.id = data.id  // server needs to send back the new id

        card.dataset.fullTitle = cardTitle.value
        card.dataset.fullBody = cardBody.value

        card.innerHTML = `
            <h4 class="post-title black">${cardTitle.value.slice(0, maxTitleLength)}${cardTitle.value.length > maxTitleLength ? "..." : ""}</h4>
            <p class="post-body black">${cardBody.value.slice(0, maxBodyLength)}${cardBody.value.length > maxBodyLength ? "..." : ""}</p>
            <div class="button-container">
                <button type="submit" class="button mx-1 delete">
                    <img src="/images/delete.svg" alt="delete" class="content appear">
                </button>
                <button type="submit" class="button mx-1 edit">
                    <img src="/images/edit.svg" alt="edit" class="content appear">
                </button>
                <button type="submit" class="button mx-1 view">
                    <img src="/images/view.svg" alt="view" class="content appear">
                </button>
            </div>
        `

        card.querySelectorAll(".content").forEach(el => appearElement(el))
        attachCardListeners(card)

        cardTitle.value = ""
        cardBody.value = ""
        cardButton.disabled = true

        document.querySelector(".posts-container").appendChild(card)
        appearElement(card)
        document.querySelector(".empty-warning").remove()
    })
})

// settings

document.querySelector("input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") e.preventDefault()
})

document.querySelector(".edit-modal").style.display = "none"
document.querySelector(".view-modal").style.display = "none"