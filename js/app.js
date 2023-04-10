// Bookmark Toggle
const btnBookmark = document.querySelector('.btn-bookmark')
const btnBookmarked = document.querySelector('.btn-bookmarked')

// Modal Toggles
const toggle = document.querySelector('.toggle')
const btnProject = document.querySelector('.btn-project');
const btnReward = [ ... document.querySelectorAll('.btn-reward')]
const close = document.querySelector('.close-modal')
const btnFinish = document.querySelector('.btn-finish');


// Modal Card Pledge
const cardPledge = [ ... document.querySelectorAll('.card__pledge')]; 
const choices = [ ... document.querySelectorAll('.input-modal')];
const inputs = [ ... document.querySelectorAll('.btn-input') ];
const btnContinue = [ ... document.querySelectorAll('.btn-continue')];

// Modals
const modalContainer = document.querySelector('.modal-container')
const modalNav = document.querySelector('.modal-nav')
const modalProject = document.querySelector('.modal-project')
const modalConfirm = document.querySelector('.modal-confirm')

// Progress bar style on load
const root = document.documentElement;


// Update UI from local storage

populateUI();

function populateUI () {
    const amountPledgedSaved = JSON.parse(localStorage.getItem('amountPledgedSaved'));

    const backersSaved = localStorage.getItem('backersSaved')

    const progressPercentage = localStorage.getItem('progressPercentage')

    if(amountPledgedSaved !== null && amountPledgedSaved.length > 0){
        let sum = amountPledgedSaved.reduce(function(a, b){
            return a + b;
        });
        

        document.querySelector('.money-pledged').innerHTML = ` $${sum.toLocaleString()}`;

        document.querySelector('.total-backers').innerHTML = backersSaved.toLocaleString();

        root.style.setProperty('--progress', progressPercentage + "%");
    }

    const bookmarkCheck = JSON.stringify(localStorage.getItem('bookmarkCheck'))


    if (bookmarkCheck.includes(true)){
        const bookmark = document.querySelector('.bookmark')
        const bookmarked = document.querySelector('.bookmarked')
        const bookmarkText = document.querySelector('.bookmark-text');


        bookmarkText.style.color = 'hsl(176, 50%, 47%)';

    
        bookmarkText.innerText = bookmarkText.innerText.concat('', 'ed');

        bookmark.classList.toggle('show-bookmark')
        bookmarked.classList.toggle('show-bookmark')
    }
}


function showError (i, message) {

    cardPledge[i].classList.add('error')
    cardPledge[i].classList.remove('success')
    
    const small = [ ... document.querySelectorAll('small')];
    small[i].innerText = message;

    valid = false;

}

function showSuccess (i) {

    cardPledge[i].classList.add('success')
    cardPledge[i].classList.remove('error')

    valid = true;
}

function checkPledgeValue (index){

    let amount = parseInt(inputs[index].value.trim());
    let minAmount = parseInt(inputs[index].getAttributeNode("min").value.trim());

    if (inputs[index].value.trim() === '' || inputs[index].value.trim() == 0){
        showError(index, "Amount is required")
    } else if (isNaN(inputs[index].value.trim())){
        showError(index, "Enter a valid amount")
    } else if(amount < minAmount){
        showError(index, "Enter a higher pledge")
    } else {
        showSuccess(index)
    }

    return amount;
}

function increaseMoneyBacked(amountPledged){

    let target = parseInt(document.querySelector('.target').innerText.replace(",", ""));
    let currentAmountPledged = parseInt(document.querySelector(".money-pledged").innerHTML.replace(",", "").replace("$", ""));
    let newAmount = amountPledged + currentAmountPledged;
    document.querySelector('.money-pledged').innerHTML = ` $${newAmount.toLocaleString()}`;

    let amountPledgedSaved;

    if(localStorage.getItem('amountPledgedSaved') === null){
        amountPledgedSaved = [];
    } 
    else{
        amountPledgedSaved = JSON.parse(localStorage.getItem('amountPledgedSaved'));

    }
    amountPledgedSaved.push(amountPledged);

    localStorage.setItem('amountPledgedSaved', JSON.stringify(amountPledgedSaved))

    // Progress bar

    let newWidth = (newAmount / target) * 100;
    root.style.setProperty('--progress', newWidth + "%");

    localStorage.setItem('progressPercentage', newWidth)

}



function increaseTotalBackers(){

    let totalBackers = parseInt(document.querySelector(".total-backers").innerHTML.replace(",", ""));
    totalBackers++;

    localStorage.setItem('backersSaved', totalBackers)

    document.querySelector('.total-backers').innerHTML = totalBackers.toLocaleString();
}

function resetCardPledge() {
    inputs.forEach(input => {
        input.value = input.defaultValue;
    })

    cardPledge.forEach(pledge => {
        pledge.classList.remove('success')
        pledge.classList.remove('error')
    })

    

}

// Toggle nav
toggle.addEventListener('click', () => {
    modalNav.classList.add('show-modal')
})

// Bookmark Toggle
btnBookmark.addEventListener('click' , () => {
    const bookmark = document.querySelector('.bookmark')
    const bookmarked = document.querySelector('.bookmarked')
    const bookmarkText = document.querySelector('.bookmark-text')

    bookmarkText.style.color = bookmarkText.style.color === 'grey' ? 'hsl(176, 50%, 47%)' : 'grey';

    let bookmarkCheck;

    bookmarkText.innerText = bookmarkText.innerHTML === 'Bookmark' ? bookmarkText.innerText.concat('', 'ed') : bookmarkText.innerText.slice(0, -2);

    bookmark.classList.toggle('show-bookmark')
    bookmarked.classList.toggle('show-bookmark')

    if (bookmarked.classList.contains('show-bookmark')){
        bookmarkCheck = true;
    } else {
        bookmarkCheck = false
    }

    localStorage.setItem('bookmarkCheck', bookmarkCheck)

})


// Open Pledge Modal
btnProject.addEventListener('click', () =>{
    modalProject.classList.add('show-modal')
    modalContainer.classList.add('show-modal')
})

btnReward.forEach(reward => {

    reward.addEventListener('click', () =>{
        modalProject.classList.add('show-modal')
        modalContainer.classList.add('show-modal')
    })

})


// Hide modal
close.addEventListener('click', () => {
    modalProject.classList.remove('show-modal')
    modalContainer.classList.remove('show-modal')
})

// Input radio choice on project modal

choices.forEach(choice => {

    choice.addEventListener('click', () => {

        cardPledge.forEach((pledge, index) => {
            // if (choice.value === `choice-${index + 1}`){
            //     pledge.style.display = 'grid';
            // } else {
            //     pledge.style.display = 'none';
            // }

            // choice.value !== `choice-${index + 1}` ? pledge.style.display = 'none' : false
            choice.value === `choice-${index + 1}` ? pledge.style.display = 'grid' : pledge.style.display = 'none'
        })

    })
})

inputs.forEach((input, i) => {

    input.addEventListener('blur', () => {

        checkPledgeValue(i)

    })

})

// Show confirmation modal 
btnContinue.forEach((cont, i) => {
    cont.addEventListener('click', () => {

        let amountPledged =  checkPledgeValue(i)
        if (valid === true){
            modalConfirm.classList.add('show-modal')
            modalProject.classList.remove('show-modal')
            increaseMoneyBacked(amountPledged)
            increaseTotalBackers();
        }
    })
})

// Close confirmation modal
btnFinish.addEventListener('click', () => {
    modalConfirm.classList.remove('show-modal')
    modalContainer.classList.remove('show-modal')

    resetCardPledge();
})

//Hide modal on outside click
window.addEventListener('click', e => {
    const showModal = document.querySelectorAll('.show-modal');

    if (e.target == modalNav || e.target == modalProject || e.target == modalConfirm || e.target == modalContainer){
        showModal.forEach((element) => {
            element.classList.remove('show-modal');
      });
    }

})
