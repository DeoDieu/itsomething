const listPage_movies = document.querySelector(".listPage_movies")

const body = document.body

let idStorage = JSON.parse(localStorage.getItem("listID")) || []
console.log(idStorage)

async function loadlist() {
    
    for(let i = 0;i < idStorage.length;i++){
      
       
        const response_list = await fetch(`https://api.themoviedb.org/3/movie/${idStorage[i]}?language=en-US&api_key=efb6fce1454f9c0d4aa969a0e97b0caa`)
        if(!response_list.ok){
            throw new Error("Could not get fetch")
           }
           
           idStorageData = await response_list.json()
           console.log(idStorageData)
           let listposter = idStorageData.poster_path
           let listId = idStorageData.id

           const currentItem = idStorageData[i]
           const newListContainer = document.createElement("button")
           const listIdcode = document.createElement("h4")
           listIdcode.style.display = "none"
           
           listIdcode.innerHTML = listId
           //const newListPosterUrl = currentItem.poster_path
           newListContainer.style.backgroundImage = `url('https://image.tmdb.org/t/p/w500${listposter}')`
           newListContainer.classList.add("poster_img","IntheList")
           //console.log(newListPosterUrl)
           newListContainer.append(listIdcode)
           
        
           listPage_movies.append(newListContainer)
           
         
           console.log("added to list page")
          
            
       }
}

loadlist()

const search_container_btn = document.querySelector(".search_container_btn")
search_container_btn.addEventListener("click",()=>{
    const search_container_display = document.querySelector(".search_container_display") 
    if(search_container_display){
        search_container_display.remove()
    }
    getSearchMovie()
})


let resultslist = []

async function getSearchMovie(){
    const search_container_input = document.querySelector(".search_container_input")
    const searchValue = search_container_input.value

    const getresult = await fetch(`https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-US&page=1&api_key=efb6fce1454f9c0d4aa969a0e97b0caa&query=${searchValue}`)
    if(!getresult.ok){
        throw new Error("no movies found")
    }
    const resultsData = await getresult.json()
    resultslist = resultsData.results;
    console.log(`You search for ${searchValue}`)
    console.log(resultslist)
    
    const mainscreen = document.getElementsByTagName("main")[0]
    mainscreen.style.display = "none"

    
    movieBox_list()
}

function movieBox_list(){
    const search_container_display = document.createElement("div")
    search_container_display.classList.add("search_container_display")

    resultslist.forEach(element =>{
        const movieBox_kids = document.createElement("button")
        movieBox_kids.classList.add("movieBox_kids")
        movieBox_kids.style.backgroundImage = `url('https://image.tmdb.org/t/p/w500${element.poster_path}')`
        

        
        const poster_code = document.createElement("h4")
        poster_code.innerHTML = element.id
        poster_code.classList.add("poster_code")
        //poster_codeList.push(poster_code.innerHTML)

        const poster_title = document.createElement("h4")
        poster_title.classList.add("poster_title")
        poster_title.innerHTML = element.title
        poster_title.style.display = "none"

        const poster_overview = document.createElement("h4")
        poster_overview.classList.add("poster_overview")
        poster_overview.innerHTML = element.overview
        poster_overview.style.display = "none"

        const poster_vote = document.createElement("h4")
        poster_vote.classList.add("poster_vote")
        poster_vote.innerHTML = element.vote_average
        poster_vote.style.display = "none"

        const poster_date = document.createElement("h4")
        poster_date.classList.add("poster_date")
        poster_date.innerHTML = element.release_date
        poster_date.style.display = "none"

      

       
        movieBox_kids.append(
            poster_code,
            poster_title,
            poster_overview,
            poster_vote,
            poster_date,
        )
        
        search_container_display.append(movieBox_kids)


    })



    body.append(search_container_display)
}
