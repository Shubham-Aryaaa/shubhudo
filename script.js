 

let currentSong = new Audio()
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}


async function getsongs(folder) {
  currFolder = folder
  let a = await fetch(`/${folder}/`)
  let responce = await a.text();
  let div = document.createElement("div");
  div.innerHTML = responce;
  let as = div.getElementsByTagName("a");
  console.log(as);
  songs = [];
  for (let i = 0; i < as.length; i++) {
    const element = as[i];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }

  let songUl = document.querySelector(".songlist").getElementsByTagName("ul")[0]
  songUl.innerHTML = ""
  for (const song of songs) {
    songUl.innerHTML = songUl.innerHTML + `<li>
 

<i class="fa-solid fa-headphones"></i>
<div class="info">
 <div>  ${song.replaceAll("%20", " ")}</div>
 <div>sachin</div>
 </div>
 <div class="playnow">
     <span>Play Now</span>
     <i class="fa-regular fa-circle-play"></i>
 </div>
</li>`;

  }

  Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
    e.addEventListener("click", element => {
      console.log(e.querySelector(".info").firstElementChild.innerHTML)
      Playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    })

  });
  return songs;
}

const Playmusic = (track, pause = false) => {
  // let audio = new Audio("/songs/" + track)
  currentSong.src = `/${currFolder}/` + track
  if (!pause) {
    currentSong.play()
    play.src = "pause.svg"
  }
  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00/00:00"

}

async function displayAlbums() {
  let a = await fetch(`/songs/`)
  let responce = await a.text();
  let div = document.createElement("div");
  div.innerHTML = responce;
  let cardContainer = document.querySelector(".cardcontainer")
  let anchors = div.getElementsByTagName("a")
  let array = Array.from(anchors)

  for (let index = 0; index < array.length; index++) {
    const e = array[index];

    if (e.href.includes("/songs/")) {
      console.log(e.href)
      console.log(e.href.split("/").slice(-1)[0])
      let folder = e.href.split("/").slice(-1)[0];

      let a = await fetch(`/songs/${folder}/info.json`)
      let responce = await a.json();
      console.log(responce);
      cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
    <div class="play"><svg width="2vw" height="2vw" viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" fill="green" />
            <polygon points="32,23 78,50 32,77" fill="white" />
        </svg>
    </div>
    <img src="/songs/${folder}/cover.jpeg" alt="">
        
 
    <h2>${responce.title}</h2>
    <p>${responce.description}</p>
</div> `
    }
  }



  Array.from(document.getElementsByClassName("card")).forEach(e => {
    e.addEventListener("click", async item => {
      songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
      Playmusic(songs[0])
    })
  })

}

async function main() {
  await getsongs("songs/cs");
  Playmusic(songs[0], true);

  await displayAlbums();

  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play()
      play.src = "pause.svg"
    }
    else {
      currentSong.pause()
      play.src = "play.svg"
    }
  })

  currentSong.addEventListener("timeupdate", () => {
    console.log(currentSong.currentTime, currentSong.duration)
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`
    document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"
  })

  document.querySelector(".seekbar").addEventListener("click", e => {
    let percent = e.offsetX / (e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = ((currentSong.duration) * percent) / 100;
  })
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0"
  })
  document.querySelector(".cross").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%"

  })
  previus.addEventListener("click", () => {
     currentSong.pause()
    console.log("previus was clicked")
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if ((index - 1) >= 0) {
      Playmusic(songs[index - 1])
    }
    
  })
  next.addEventListener("click", () => {
    console.log("next was clicked")
     currentSong.pause();
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);

    if ((index + 1) < songs.length) {
      Playmusic(songs[index + 1])
    }
  })


  document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
    console.log("Setting volume to", e.target.value, "/ 100")
    currentSong.volume = parseInt(e.target.value) / 100; 
    if (currentSong.volume >0){
      document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg")
  }
  })
     
  
  document.querySelector(".volume>img").addEventListener("click", e=>{ 
    console.log(e.target.src)
    if(e.target.src.includes("volume.svg")){
      e.target.src = e.target.src.replace("volume.svg", "mute.svg")
      currentSong.volume = 0;
      document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
  }
  else{
      e.target.src = e.target.src.replace("mute.svg", "volume.svg")
      currentSong.volume = .10;
      document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
  }

})


  }




main();

