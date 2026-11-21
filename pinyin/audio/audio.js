(function(){
  var audio=new Audio(),current=null;
  function stop(){if(current){current.classList.remove('is-playing');current=null}}
  audio.addEventListener('ended',stop);
  audio.addEventListener('pause',function(){if(audio.ended||audio.paused)stop()});
  audio.addEventListener('error',function(){if(current){current.classList.add('is-error')}stop()});
  document.addEventListener('click',function(ev){
    var b=ev.target.closest('.play');if(!b)return;
    if(current===b&&!audio.paused){audio.pause();return}
    stop();b.classList.remove('is-error');
    audio.src=b.getAttribute('data-src');current=b;b.classList.add('is-playing');
    var p=audio.play();if(p&&p.catch){p.catch(function(){b.classList.add('is-error');stop()})}
  });
  function mark(){
    var old=document.querySelector('.is-target');if(old)old.classList.remove('is-target');
    var id=decodeURIComponent(location.hash.slice(1));if(!id)return;
    var el=document.getElementById(id);if(!el)return;
    el.classList.add('is-target');el.scrollIntoView({block:'center'});
  }
  window.addEventListener('hashchange',mark);
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',mark)}else{mark()}
  window.addEventListener('load',mark);
})();
