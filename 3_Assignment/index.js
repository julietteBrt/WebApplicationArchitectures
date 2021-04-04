const tmdb_key = '20f67bb08726ecb3ec2537f7324b6542';

const IMG_URL = 'https://image.tmdb.org/t/p/w500';
var movie = '2001: A Space Odyssey'
var url_movie = `https://api.themoviedb.org/3/search/movie?api_key=${tmdb_key}&language=en-US&query=${movie}`;
var movie_id = '62';
var url_credits = `https://api.themoviedb.org/3/movie/${movie_id}/credits?api_key=${tmdb_key}&language=en-US`;
var person = '';
var url_person = `https://api.themoviedb.org/3/search/person?api_key=${tmdb_key}&language=en-US&query=${person}&page=1&include_adult=false`;
var counter = 0;
var actors = [];
var directors = [];
var correct_movies = [];
var correct_name = '';
var exact_title = '';
var known_for = [];
correct_movies.push(movie);

const body = document.getElementsByTagName('body')[0];

getMovieData(movie);

function getMovieData(movie){
    url_movie = `https://api.themoviedb.org/3/search/movie?api_key=${tmdb_key}&language=en-US&query=${movie}`;
    fetch(url_movie).then(res => res.json()).then(data => {
        console.log(data.results[0]);
        displayMovie(data.results[0]);
        getCredits(data.results[0].id);
    })
}

function getPerson(person){
    person = person.replace(' ', '%20');
    url_person = `https://api.themoviedb.org/3/search/person?api_key=${tmdb_key}&language=en-US&query=${person}&page=1&include_adult=false`;
    fetch(url_person).then(res => res.json()).then(data => {
        console.log(data.results[0]);
        displayPerson(data.results[0]);
        tmp = data.results[0].known_for;
        for (i = 0; i < tmp.length; i++){
            known_for.push(tmp[i].original_title.toLowerCase());
        }
    })
}
function getCredits(movie_id){
    url_credits = `https://api.themoviedb.org/3/movie/${movie_id}/credits?api_key=${tmdb_key}&language=en-US`;
    fetch(url_credits).then(res => res.json()).then(data => {
        directors = [];
        actors = [];
        for (i = 0; i < data.crew.length; i++){
            if (data.crew[i].known_for_department == "Directing"){
                directors.push(data.crew[i].name.toLowerCase());
            };
        };
        for (i = 0; i < data.cast.length; i++){
            actors.push(data.cast[i].name.toLowerCase());
        };
        return actors, directors
    })
}

function displayPerson(data){
    const poster_path = data.profile_path;
    const name = data.name;
    const personDiv = document.createElement('div');
    personDiv.classList.add('movie');
    personDiv.innerHTML = `
            <img src="${IMG_URL+poster_path}" alt="${name}">
        <div class="movie-info" id ="display${counter}">
            <h3>${name}</h3>
        </div>
        `;
    const formDiv = document.createElement('div');
    formDiv.classList.add('actor_form');
    formDiv.id = `actor_form${counter}`;
    formDiv.innerHTML = `
        <form onSubmit="return false;">
        <label for="actor">Movie directed by / in which ${name} played:</label><br>
        <input type="text" id="actor${counter}" name="submission">
        <input type="button" value="Submit" id="btn${counter}" onclick="checkSubmissionMovie()">
        </form> 
    `;
    body.appendChild(personDiv);
    body.appendChild(formDiv);
    document.getElementById(`actor${counter}`).addEventListener("keyup", function(event) {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
          // Cancel the default action, if needed
          event.preventDefault();
          // Trigger the button element with a click
          document.getElementById(`btn${counter}`).click();
        }
      });
    var form = document.getElementById(`actor_form${counter}`);
    var submissionDiv = document.createElement('div');
    submissionDiv.id = `subDiv${counter}`;
    body.appendChild(submissionDiv);
}

function displayMovie(data){
    const poster_path = data.poster_path;
    const release_date = data.release_date;
    const title = data.original_title;
    const movieDiv = document.createElement('div');
    movieDiv.classList.add('movie');
    movieDiv.innerHTML = `
            <img src="${IMG_URL+poster_path}" alt="${title}">
        <div class="movie-info">
            <h3>${title}</h3>
        </div>
        <div class="movie-info">
            <span>Release date: ${release_date}</span>
        </div>
        `;
    const formDiv = document.createElement('div');
    formDiv.classList.add('actor_form');
    formDiv.id = `actor_form${counter}`;
    formDiv.innerHTML = `
        <form onSubmit="return false;">
        <label for="actor">Director or Actor from this movie:</label><br>
        <input type="text" id="actor${counter}" name="submission">
        <input type="button" value="Submit" id="btn${counter}" onclick="checkSubmission()">
        </form> 
    `;
    body.appendChild(movieDiv)
    body.appendChild(formDiv);
    document.getElementById(`actor${counter}`).addEventListener("keyup", function(event) {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
          // Cancel the default action, if needed
          event.preventDefault();
          // Trigger the button element with a click
          document.getElementById(`btn${counter}`).click();
        }
      });
    var form = document.getElementById(`actor_form${counter}`);
    var submissionDiv = document.createElement('div');
    submissionDiv.id = `subDiv${counter}`;
    body.appendChild(submissionDiv);
}

async function getMovieIdThenCredits(movie){
    url_movie = `https://api.themoviedb.org/3/search/movie?api_key=${tmdb_key}&language=en-US&query=${movie}`;
    fetch(url_movie).then(res => res.json()).then(data => {
        exact_title = data.results[0].original_title.toLowerCase();
        getCredits(data.results[0].id);
        return exact_title;
    })
}

function checkSubmissionMovie(){
    var input = document.getElementById(`actor${counter}`).value.toLowerCase();
    var submissionDiv = document.getElementById(`subDiv${counter}`);
    if(actors.includes(correct_name) && known_for.includes(input) && !correct_movies.includes(input)){
        submissionDiv.innerHTML = submissionDiv.innerHTML + `
        <p> Congratulations, ${input} is correct!<p>
        `;
        counter++;
        correct_movies.push(input);
        getMovieData(input);
    }
    else if(directors.includes(correct_name) && known_for.includes(input) && !correct_movies.includes(input)){
        submissionDiv.innerHTML = submissionDiv.innerHTML + `
        <p> Congratulations, ${input} is correct!<p>
        `;
        counter++;
        correct_movies.push(input);
        getMovieData(input);
    }
    else if(correct_movies.includes(input) && known_for.includes(input) && (directors.includes(correct_name) || actors.includes(correct_name))){
        submissionDiv.innerHTML = submissionDiv.innerHTML + `
        <p style="color: red;"> Congratulations, ${input} indeed directed this movie! But you already played with it, try another one :)<p>
        `;
    }
    else{
        submissionDiv.innerHTML = submissionDiv.innerHTML + `
    <p style="color: red;"> ${input} is not a correct answer. Try again!<p>
    `;
    };
}

function checkSubmission(){
    var input = document.getElementById(`actor${counter}`).value.toLowerCase();
    var submissionDiv = document.getElementById(`subDiv${counter}`);
    if(actors.includes(input)){
        submissionDiv.innerHTML = submissionDiv.innerHTML + `
        <p> Congratulations, ${input} indeed played in this movie!<p>
        `;
        counter++;
        getPerson(input);
        correct_name = input;
    }
    else if(directors.includes(input)){
        submissionDiv.innerHTML = submissionDiv.innerHTML + `
        <p> Congratulations, ${input} indeed directed this movie!<p>
        `;
        counter++;
        getPerson(input);
        correct_name = input;
    }
    else{
        submissionDiv.innerHTML = submissionDiv.innerHTML + `
    <p style="color: red;"> ${input} did not direct or play in this movie. Try again!<p>
    `;
    };
    
}
