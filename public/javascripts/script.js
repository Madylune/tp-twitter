function goto () {
  this.closest('form').style.display = 'none' ;
  document.querySelector(this.getAttribute('href')).style.display = '';
}

function submitForm(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  let els = this.querySelectorAll('input, select, textarea') ;
  let datas = {} ;
  for (var i in els) {
    if(!els[i].type ||!els[i].name)
      continue ;
    if(els[i].type && ['radio', 'checkbox'].indexOf(els[i].type) !=-1) {
      if(!els[i].checked) {
        continue ;
      }
    }
    if (!!els[i].value)
      datas[els[i].name] = els[i].value ;
  }
  fetch(this.action, {
    method : this.getAttribute('method'),
    headers: {
      'Content-Type': 'application/json',
    },
    body:JSON.stringify(datas) })
    .then(r => r.text())
    .then(response => {
      if(response === 'user.login') {
        document.getElementById('loginArea').style.display = 'none' ;
        document.getElementById('tweetArea').style.display = '' ;
        document.getElementById('logout').style.display = '' ;
        document.getElementById('userWrapper').style.display = '' ;
        document.getElementById('username').innerText = document.cookie.replace(/(?:(?:^|.*;\s*)loggedIn\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        return loadTweets();
      }
      if(response === 'tweet.sent') {
        return this.reset();
      }
      alert('Veuillez vérifier le formulaire');
  })
}

function loadTweets () {
  fetch('/tweets', {credentials:'same-origin'}).then(r => r.json()).then(response => {
    document.getElementById('tweets').innerHTML = response.response;
  });
}

var socket ;

document.body.onload = evt => {
  let userName = document.cookie.replace(/(?:(?:^|.*;\s*)loggedIn\s*\=\s*([^;]*).*$)|^.*$/, "$1");
  if(userName) {
    loadTweets () ;
  }
  socket = io('http://localhost:8000');
  
  socket.on('tweet', function (data) {
    if(data)
    fetch('/tweets/'+data, {credentials:'same-origin'}).then(r => r.json()).then(response => {
      document.getElementById('tweets').innerHTML = response.response + document.getElementById('tweets').innerHTML;
    });
  });
}
function logout (event) {
  event.stopPropagation();
  event.preventDefault();
  fetch(event.target.href, {method:'DELETE'})
    .then(r=>r.text())
    .then(r=>{
      document.getElementById('loginArea').style.display = '' ;
      document.getElementById('tweetArea').style.display = 'none' ;
      document.getElementById('logout').style.display = 'none' ;
      document.getElementById('userWrapper').style.display = 'none' ;
      document.getElementById('username').innerText = 'userName' ;
    })
} ;
