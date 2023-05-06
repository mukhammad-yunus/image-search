const accessKey = 'xIJw2u4xR8yJRrTTzfNeGfzol_znYILU9ZtUwzcnH5E'
const submitBtn = document.querySelector('#search-btn')
const searchInputEl = document.getElementById('search-input')
const showMoreBtn = document.getElementById('show-more-btn')
const searchResults = document.querySelector('.results')

const colum1 = document.getElementById('column1')
const colum2 = document.getElementById('column2')
const colum3 = document.getElementById('column3')

let page = 1
let inputData = ''
let arrayResults=[]

document.body.addEventListener('keypress', (e)=>{
    if(e.key === 'Enter'){
        search(e)
    }
})



document.body.addEventListener('click', (e)=>{
    if(e.target.dataset.download){
        handleDownload(e.target.dataset.download)
    } else if(e.target.id === 'show-more-btn'){
        page++
        if(inputData){
            render()
        }else{
            welcomeRender()
        }
    }else if(e.target.id === 'search-btn'){
        search(e)
    }
})

function search(e){
    e.preventDefault()
    showMoreBtn.style.display = 'none'
    inputData = searchInputEl.value
    if(inputData){
        arrayResults = []
        colum1.innerHTML =''
        colum2.innerHTML =''
        colum3.innerHTML =''
        render()
    }
}

async function searchImages(url){
    const res = await fetch(url)
    const data = await res.json()
    return data
}

async function render(){
    
    const url = `https://api.unsplash.com/search/photos/?page=${page}&query=${inputData}&client_id=${accessKey}`
    const data = await searchImages(url)
    const results = data.results
    if(results.length > 0){
        results.map(result=>{
            return arrayResults.push(result)
        })
        getHtml()
    } else{
        searchResults.innerHTML = `<p class="error-message">Sorry, we couldn't find any matching results for your search, <b>${inputData}</b>. Please try searching for something else, or check your spelling and try again.</p>`
    }
}

async function welcomeRender(){
    const url = `https://api.unsplash.com/photos/?client_id=${accessKey}&page=${page}`
    const results = await searchImages(url)
    if(results.length > 0){
        results.map(result=>{
            return arrayResults.push(result)
        })
        getHtml()
    }
}



async function getHtml(){
    let groups = [[], [], []];
    for (let i = 0; i < arrayResults.length; i++) {
        let html = `
            <div class="result">
            <img src="${arrayResults[i].urls.regular}" alt="${arrayResults[i].alt_description}" class="result-image">
                <div class="user">
                    <img src="${arrayResults[i].user.profile_image.large}" alt="Profile image" class="profile-image">
                    <div class="profile-info">
                        <p class="name">${arrayResults[i].user.name}</p>
                        <a href="${arrayResults[i].user.links.html}" class="username" target="_blank">${arrayResults[i].user.username}</a>
                    </div>
                </div>
                <i class="fa-solid fa-download" data-download="${arrayResults[i].id}"></i>
            </div>`
        groups[i % 3].push(html);
    }
    const [array1, array2, array3] = groups
    
    colum1.innerHTML += array1.join('')
    colum2.innerHTML += array2.join('')
    colum3.innerHTML += array3.join('')
    showMoreBtn.style.display = 'block'
}

function handleDownload(imgId){
    const targetImg = arrayResults.filter(result=>{
        return result.id === imgId
    })[0]
    
    const name = targetImg.alt_description
    const imgUrl = targetImg.urls.raw
    fetch(imgUrl).then(res => res.blob()).then(file =>{
        let tempUrl = URL.createObjectURL(file)
        const aTag = document.createElement('a')
        aTag.href = tempUrl
        aTag.download = `${targetImg.alt_description ? name.replace(/\s+/g, "_"):inputData + "_by_" + targetImg.user.first_name + "_" + targetImg.user.last_name}.jpeg`
        document.body.appendChild(aTag)
        aTag.click()
        URL.revokeObjectURL(tempUrl)
        aTag.remove()
    })
}

welcomeRender()