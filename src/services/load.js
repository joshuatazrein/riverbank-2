var data
var weekdaysStr
var offlinemode = false
var offline
var getting

function display(x) {
  console.log(x)
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

// function load() {
//   // tries to load current cookie's data; if not, redirects to welcome
//   if (!navigator.onLine || window.location.href.includes('file') ||
//     window.parent.location.href.includes('welcome')) {
//     if (!navigator.onLine) {
//       alert('No connection detected; saving locally')
//       offline = true
//     }
//     console.log('offline mode');
//     if (window.location.href.includes('file')) {
//       offlinemode = true;
//     }
//     // offline mode
//     if (window.parent.location.href.includes('welcome')) {
//       // welcome mode; set to demo
//       console.log('yes');
//       data = JSON.parse(resetstring)
//     } else {
//       try {
//         window.data = JSON.parse(localStorage.getItem('data'))
//       } catch (err) {
//         localStorage.setItem('data', resetstring)
//         data = JSON.parse(resetstring)
//       }
//     }
//     try {
//       loadPage(false)
//     } catch (err) {
//       setTimeout(initialize, 500)
//     }
//     return
//   }
//   // try the current cookie (synchronous request)
//   const fname = getCookie('fname')
//   if (fname == '') {
//     console.log('no user loaded');
//     if (window.location != 'https://riverbank.app/welcome.html') {
//       // no user loaded
//       if (offlinemode) {
//         window.location = window.location.href.replace(
//           'index.html', 'welcome.html')
//       } else {
//         window.location = 'https://riverbank.app/welcome.html'
//       }
//     } else {
//       data = resetstring
//       initialize()
//     }
//     return
//   }
//   console.log('getting file', '/users/' + getCookie('fname') + '.json');
//   $.get('users/' + getCookie('fname') + '.json',
//     function (datastr, status, xhr) {
//       if (xhr.responseText == '') { 
//         console.log('get failed');
//         // no file found
//         if (offlinemode) {
//           window.location = window.location.href.replace(
//             'index.html', 'welcome.html')
//         } else {
//           window.location = 'https://riverbank.app/welcome.html'
//         }
//         clearInterval(getting)
//         getting = undefined
//         return
//       } else {
//         console.log('get succeeded');
//         data = JSON.parse(xhr.responseText)
//         clearInterval(getting)
//         getting = undefined
//         initialize()
//       }
//     }
//   )
//   getting = setInterval(function () {console.log('getting...')}, 1000)
//   setTimeout(function() {
//     if (getting) {
//       display('get timed out, downloading from local')
//       data = JSON.parse(localStorage.getItem('data'))
//       while (!data.flop) {
//         data = JSON.parse(data)
//       }
//       display('new data:', data)
//       clearInterval(getting)
//       getting = undefined
//       initialize()
//     }
//   }, 7000)
// }

// function initialize() {
//   // tries to load until it's actually loaded
//   console.log('initializing...');
//   try {
//     loadPage(true)
//   } catch (err) {
//     console.log(err)
//     setTimeout(initialize, 500)
//   }
// }