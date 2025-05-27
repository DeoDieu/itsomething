//Generate trending movies
//Generate movie added to list


const trending = document.querySelector(".trending_moive")
const hyperlink_list = document.querySelector(".hyperlink_list")

const list_moive = document.querySelector(".list_moive")




const body = document.body
let arrayOfMovie = []
let logoImg;
let poster_codeList = []
let filepathArray = []
let currentPoster_code;
let popupParent;
let addToListbtn;
let idStorageData = []
let randomFileBackdrop = []
//localStorage.clear()

let idStorage = JSON.parse(localStorage.getItem("listID")) || []
console.log(idStorage)

async function fetchData(){
    try{
        
        const response = await fetch("https://api.themoviedb.org/3/trending/movie/day?api_key=efb6fce1454f9c0d4aa969a0e97b0caa")
        if(!response.ok){
            throw new Error("Could not fetch")
        }
        const data = await response.json()

        arrayOfMovie =  data.results
        const randomMovie = document.querySelector(".randomMovie")
        const mainPoster = document.querySelector(".randomMovie_poster")

        mainPosterImg = data.results[0]
        mainPosterid = mainPosterImg.id
        mainPosterImgBackdrop = mainPosterImg.backdrop_path
        mainPosterImgurl = mainPosterImg.poster_path
        randomMovie.style.backgroundImage = `url('http://image.tmdb.org/t/p/w1920/${mainPosterImgBackdrop}')`
        const getRandomMovieBackdrop = await fetch(`https://api.themoviedb.org/3/movie/${mainPosterid}/images?include_image_language=en&language=english&api_key=efb6fce1454f9c0d4aa969a0e97b0caa`)
        if(!getRandomMovieBackdrop){
            throw new Error("could not find")
        }
        const randomBackdrop = await getRandomMovieBackdrop.json()
        const randomBackdropList = randomBackdrop.backdrops

        randomBackdropList.forEach(element=>{
            
            randomFileBackdrop.unshift(element.file_path)
           
            console.log(element.file_path)
          
          
        })

       for(let i = 0;i < idStorage.length;i++){
       
        const response_list = await fetch(`https://api.themoviedb.org/3/movie/${idStorage[i]}?language=en-US&api_key=efb6fce1454f9c0d4aa969a0e97b0caa`)
        if(!response_list.ok){
            throw new Error("Could not get fetch")
           }
           
           idStorageData = await response_list.json()
           //console.log(idStorageData)
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
           list_moive.append(newListContainer)
        
           
         
        
          
            
       }



       poster_codeList = arrayOfMovie.map(movie => movie.id);
       //console.log(poster_codeList)
    
        for(let i = 0; i < poster_codeList.length; i++){
            const response_AllImg = await fetch(`https://api.themoviedb.org/3/movie/${poster_codeList[i]}/images?include_image_language=en&language=english&api_key=efb6fce1454f9c0d4aa969a0e97b0caa`)

            if(!response_AllImg.ok){
                throw new Error("Could not get the img")
            }
            
            const imgdata = await response_AllImg.json()
            //console.log(imgdata.logos)

            if (imgdata.logos && imgdata.logos.length > 0) {
                const logoImg_parent = imgdata.logos[0]
                //console.log("Logo found:",logoImg_parent );
                const logoImg = logoImg_parent.file_path
                //console.log("Logo filepath:",logoImg );
                filepathArray.push(logoImg)
            } else {
                //console.log(" No logo found for:", poster_codeList[i]);
                filepathArray.push(poster_codeList[i])

            }
        }
        appendMovie()
        randomlooper()
        
     
    
    }
    catch(error){
        console.error(error)
    }
    
    
}

 


fetchData()


function appendMovie(){
    
    let count = 0

    arrayOfMovie.forEach((element,index) => {

        const thecontainer = document.createElement("button")
        thecontainer.classList.add("poster_img")
        thecontainer.addEventListener("click",createPopUp)
        thecontainer.style.backgroundImage = `url('https://image.tmdb.org/t/p/w500${element.poster_path}')`

        poster_idex = document.createElement("h4")
        poster_idex.innerHTML = count++
        poster_idex.classList.add("poster_idex")
        poster_idex.style.display = "none"
        
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

      

       
        thecontainer.append(
            poster_code,
            poster_title,
            poster_idex,
            poster_overview,
            poster_vote,
            poster_date,
            
        )

       
        const poster_logoImg = document.createElement("img");
        poster_logoImg.classList.add("poster_logoImg");
        poster_logoImg.style.display = "none";
    
        poster_logoImg.onerror = () => {
            console.warn("Invalid image source:", poster_logoImg.src);
            poster_logoImg.src = "inprogress.jpg"
        };
    
        poster_logoImg.src = `https://image.tmdb.org/t/p/original${filepathArray[index]}`;
        thecontainer.append(poster_logoImg);

        
        
    
        
        trending.append(thecontainer)

    });

}



function createPopUp(){
    popupParent = this
    const poster_title = popupParent.querySelector(".poster_title")
    const poster_idex = popupParent.querySelector(".poster_idex").innerHTML
    currentPoster_code = popupParent.querySelector(".poster_code").innerHTML
    const poster_overview = popupParent.querySelector(".poster_overview").innerHTML
    const poster_vote = popupParent.querySelector(".poster_vote").innerHTML
    const poster_date = popupParent.querySelector(".poster_date").innerHTML
    const thelogo_img = popupParent.querySelector(".poster_logoImg")
    const hasClass = popupParent.classList.contains("IntheList")

    
    const clone_logoImg = thelogo_img.cloneNode(true)

    const popMovie = arrayOfMovie[poster_idex]
    const popMovie_backdrop = popMovie.backdrop_path

    

    
    const movie_popup =  document.createElement("div")
    movie_popup.id = "movie_popup"

    const movie_popup_backdrop = document.createElement("div")
    movie_popup_backdrop.id = "movie_popup_backdrop"
    movie_popup_backdrop.style.backgroundImage = `url('http://image.tmdb.org/t/p/w1920/${popMovie_backdrop}')`


    const popup_logo_container = document.createElement("div")
    popup_logo_container.id = "popup_logo_container"
    popup_logo_container.append(clone_logoImg)

    if (clone_logoImg) {
        clone_logoImg.style.display = "block";
    } else {
        console.warn("thelogo_img is undefined or not found.");
    }


    const movie_popup_close = document.createElement("button")
    movie_popup_close.id = "movie_popup_close"

    addToListbtn = document.createElement("button")
    addToListbtn.id = "addToListbtn"

   

    const movie_popup_poster_and_info_box = document.createElement("div")
    movie_popup_poster_and_info_box.id = "movie_popup_poster_and_info_box"

    const movie_popup_info = document.createElement("div")
    movie_popup_info.id = "movie_popup_info"
    movie_popup_info.innerHTML = poster_overview;

    const movie_popup_info2 = document.createElement("div")
    movie_popup_info2.id = "movie_popup_info2"
    const movie_popup_info2_date = document.createElement("h4")
    const movie_popup_info2_vote = document.createElement("h4")
    movie_popup_info2_date.innerHTML =  `Release: ${poster_date}`;
    movie_popup_info2_vote.innerHTML = `Score: ${ poster_vote}`;


    const movie_popup_trailer = document.createElement("div")
    movie_popup_trailer.id = "movie_popup_trailer"

    movie_popup_info2.append(movie_popup_info2_vote,movie_popup_info2_date,)
    movie_popup_backdrop.append(popup_logo_container,movie_popup_close,addToListbtn)
    movie_popup_poster_and_info_box.append(movie_popup_info,movie_popup_info2)
    movie_popup.append(movie_popup_backdrop,movie_popup_poster_and_info_box,movie_popup_trailer)
    body.append(movie_popup)



    if(hasClass){
        addToListbtn.style.backgroundColor =" red"
     }


    if(movie_popup){
        const allbtn = document.querySelectorAll(".poster_img")
        allbtn.forEach(element =>{
            element.disabled = true
        })
        setTimeout(()=>{
            movie_popup_close.addEventListener("click",popUpRemove)

        },100)  
    }
    addToListbtn.addEventListener("click",addToList)

   

    

    
}


function popUpRemove(){
    const movie_popup = document.getElementById("movie_popup")
    const movie_popup_addlist = document.querySelectorAll(".movie_popup_addlist")
    movie_popup.remove()

    const allbtn = document.querySelectorAll(".poster_img")
        allbtn.forEach(element =>{
            element.disabled = false
        })


}

function addToList(){
    const listMovies_movie_code = list_moive.querySelectorAll(".poster_code")

    const addMovie = popupParent.cloneNode(true)
    //const addMoiveCode = addMovie.poster_code

    //console.log(listMovies_movie_code.length)

    let isAMatch = false; 
    let isAMatch2 = false; 

   
   

    for(let i = 0;i<idStorage.length;i++){
        if (idStorage[i] === currentPoster_code) {
            //console.log(idStorage[i],currentPoster_code )
            isAMatch2 = true;
            break; 
        }
    }

    if (listMovies_movie_code.length >= 1 ) {
        for (let listCode of listMovies_movie_code) {
            if (listCode.innerHTML === currentPoster_code) {
                //console.log(listCode)
                isAMatch = true;
                break; 
            }
        }
    }

    if(isAMatch2){
        isAMatch = true
    }

    if (!isAMatch2 || !isAMatch) {
        popupParent.classList.add("IntheList")
        list_moive.append(addMovie);
        idStorage.unshift(currentPoster_code)
        localStorage.setItem("listID",JSON.stringify(idStorage))

    } else {
       
        console.log("Movie already exists, not appending");
    }
   


}


hyperlink_list.addEventListener("click",linkTolist)

function linkTolist(){
    const listOfMovie = document.querySelector(".listOfMovie")
    const list_moive = document.querySelector(".list_moive")
    const list_moive_item = list_moive.querySelector(".poster_img")

    const list_moive_itemClone = list_moive_item.cloneNode(true)
    listOfMovie.append(list_moive_itemClone)

    

}

function randomlooper(){
    const randomMovie = document.querySelector(".randomMovie")
    randomMovie.style.opacity = 0.5

    for(let i = 0; i < randomFileBackdrop.length;i++){

        setTimeout(()=>{
           randomMovie.style.backgroundImage = `url('http://image.tmdb.org/t/p/w1920/${randomFileBackdrop[i]}')`
           //randomMovie.style.backgroundImage = `-webkit-linear-gradient(left, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0) 20%, rgba(0, 0, 0, 0) 80%, rgba(0, 0, 0, 0.9) 100%), url('http://image.tmdb.org/t/p/w1920/${randomFileBackdrop[i]}')`;
           randomMovie.style.opacity = 1

        },i*5000)
    }

}
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
        movieBox_kids.addEventListener("click",createPopUp)

        
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
