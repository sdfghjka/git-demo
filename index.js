const BASE_URL = 'https://webdev.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const movies = []
let filteredMovies = []
// https://webdev.alphacamp.io/api/movies/
const dataPanel = document.querySelector("#data-panel")
// 

const paginator = document.querySelector('#paginator')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const change = document.querySelector(".change")
const MOVIES_PER_PAGE = 12
// 
let currentPage = 1

// 搜尋
searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()

  filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyword)
  )
  //錯誤處理：無符合條件的結果
  if (filteredMovies.length === 0) {
    return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的電影`)
  }
  view.renderPaginator(filteredMovies.length)
  console.log(dataPanel.dataset.mode)
  if (dataPanel.dataset.mode === "list-mode") {
    view.displayByList(model.getMoviesByPage(1))
  }
  else if (dataPanel.dataset.mode === "card-mode") {
    view.renderMovieList(model.getMoviesByPage(1))
  }
})
//添加至我的最愛

function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favoriteMovies'))
  const movie = movies.find((movie) => movie.id === id)
  if (list.some((movie) => movie.id === id)) {
    return alert('此電影已經在收藏清單中！')
  }
  list.push(movie)
  localStorage.setItem('favoriteMovies', JSON.stringify(list))
}
// More和加入最愛按鈕
dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-show-movie")) {
    console.log(event.target.dataset)
    view.showMovieMadal(Number(event.target.dataset.id))
  } else if (event.target.matches(".btn-add-favorite")) {
    console.log(event.target.dataset)
    addToFavorite(Number(event.target.dataset.id))
  }
})

// 初始狀態
axios
  .get(INDEX_URL)
  .then((response) => {
    movies.push(...response.data.results)
    console.log(movies)
    view.renderPaginator(movies.length)
    view.renderMovieList(model.getMoviesByPage(1))
    dataPanel.dataset.mode = "card-mode"
    console.log(dataPanel.dataset.mode)
    // displayByList(getMoviesByPage(1))

  })
  .catch((err) => console.log(err))

// 分頁點擊
paginator.addEventListener('click', event => {
  if (event.target.tagName !== "A") return
  const page = Number(event.target.dataset.page)
  currentPage = page
  console.log(page)
  if (dataPanel.dataset.mode === "list-mode") {
    view.displayByList(model.getMoviesByPage(currentPage))
  }
  else if (dataPanel.dataset.mode === "card-mode") {
    view.renderMovieList(model.getMoviesByPage(currentPage))
  }


})


// 切換模式
change.addEventListener("click", function onSwitch(event) {
  if (event.target.matches("#list-btn")) {
    dataPanel.dataset.mode = "list-mode"
    return view.displayByList(model.getMoviesByPage(currentPage))
  }
  dataPanel.dataset.mode = "card-mode"
  view.renderMovieList(model.getMoviesByPage(currentPage))

})


const model = {

  getMoviesByPage(page) {
    const data = filteredMovies.length ? filteredMovies : movies

    const startIndex = (page - 1) * MOVIES_PER_PAGE

    return data.slice(startIndex, startIndex + MOVIES_PER_PAGE)
  }


}
const view = {
  // 卡片模式顯示電影
  renderMovieList(data) {

    let rawHTML = ''
    data.forEach((item) => {
      // title, image
      rawHTML += `<div class="col-sm-3">
    <div class="mb-2">
      <div class="card">
        <img src="${POSTER_URL + item.image}" class="card-img-top" alt="Movie Poster">
        <div class="card-body">
          <h5 class="card-title">${item.title}</h5>
        </div>
        <div class="card-footer">
          <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id}">More</button>
          <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
        </div>
      </div>
    </div>
  </div>`
    })
    dataPanel.innerHTML = rawHTML
  },
  // 清單模式顯示電影
  displayByList(data) {
    let html = `<ul class="list-group col-sm-12 mb-2">`

    data.forEach((item) => {
      html += `<li class="list-group-item d-flex justify-content-between"><h5 class="card-title">${item.title}</h5> 
            <div>
            <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal"
              data-id="${item.id}">More</button>
            <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>
          </li>`
    })
    html += `</ul>`
    dataPanel.innerHTML = html

  },

  showMovieMadal(id) {
    const modalTitle = document.querySelector("#movie-modal-title")
    const modalImage = document.querySelector("#movie-modal-image")
    const modalDate = document.querySelector("#movie-modal-date")
    const modalDesription = document.querySelector("#movie-modal-description")

    axios.get(INDEX_URL + id).then(response => {
      const data = response.data.results
      modalTitle.innerHTML = data.title
      modalDate.innerHTML = "Release Date:" + data.release_date
      modalDesription.innerHTML = data.description
      modalImage.innerHTML = `<img
      src="${POSTER_URL + data.image}"
      alt="movie-poster" class="img-fluid">`


    })
  },
  renderPaginator(amount) {
    //計算總頁數
    const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE)
    //製作 template
    console.log(amount)
    let rawHTML = ''

    for (let page = 1; page <= numberOfPages; page++) {
      rawHTML += `<li class="page-item"><a class="page-link fuck" href="#" data-page="${page}">${page}</a></li>`
    }
    //放回 HTML
    paginator.innerHTML = rawHTML
  }







}

