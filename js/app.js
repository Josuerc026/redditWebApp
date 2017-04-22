$("#sort,#time").change(function() {
        
    $(this).closest('form').submit();

});


$('#domainform, #leftform').on('submit', function (event){
   
    event.preventDefault();
  
    console.log(event);
    
    $('#content').html('<center><img src="https://i.stack.imgur.com/MnyxU.gif" alt="loading..." width="50"></center>');
    
    var query = $('.s').val();
    var sort = $('#sort').val();
    var time = $('#time').val();
  
    ///////// User Search Query String  URL /////////////////////////////
  
    var requrl = "https://www.reddit.com/search.json?q=";
    var sortParameter = "&sort=" + sort;
    var timeParameter = "&t=" + time;
    
    var fullurl = requrl + query + sortParameter + timeParameter;
    
     $.getJSON(fullurl, function(json){
     
    var listing = json.data.children;
    var content = '<h3>You searched: "'+ query + '" </h3><ul class="linkList">\n';
    
    for(var i=0, l=listing.length; i<l; i++) {
    var obj = listing[i].data;
    
    var votes     = scoreFormat(obj.score);
    var title     = obj.title;
    var subtime   = obj.created_utc;
    var thumb     = obj.thumbnail;
    var subrdt    = "/r/"+obj.subreddit;
    var redditurl = "https://www.reddit.com"+obj.permalink;
    var commenturl = "https://www.reddit.com"+obj.permalink.split("?")[0];
    var subrdturl = "https://www.reddit.com/r/"+obj.subreddit+"/";
    var exturl    = obj.url;
	
    var timeago = timeSince(subtime);

    if(obj.thumbnail === 'default' || obj.thumbnail === 'nsfw' || obj.thumbnail === '' || obj.thumbnail == "self"){
      thumb = '/imgs/icon.png';

    }
  
    content += '<li class="clearfix listItem">\n';
    content += '<a href="'+exturl+'" target="_blank"><img src="'+thumb+'" class="thumbimg"></a>';
    content += '<div class="linkdetails"><h2>'+title+'</h2>\n';
    content += '<span>'+votes+' votes</span><p class="subrdt">posted to <a href="'+subrdturl+'" target="_blank">'+subrdt+'</a> '+timeago+'</p>';
    content += '<p><button value="'+commenturl+'" class="commentBtn">comments</button>\n<a href="'+exturl+'" class="blubtn" target="_blank">visit link</a> - <a href="'+redditurl+'" class="blubtn" target="_blank">view on reddit</a></p>';
    content += '</div></li>\n';
      
   
      
  } // end for{} loop
  
  contentOutput(content);
  recentSearch(query, sort, time);
  
  var redditLink = document.getElementsByClassName("commentBtn");
  
  for(var i = 0; i < redditLink.length; i++){
     redditLink[i].addEventListener("click", commentModal, false);
    }
     
  
  }); // end getJSON()
}); // end .on(submit) listener


  function contentOutput(content) {
    content += '</ul>';
    
    $('#content').html(content);
    //console.log(html);
  }

  function recentSearch(querystring, sort, time){
    
    var list = document.getElementById("recent-searches");
    var listItem = document.createElement("li");
    
    
    listItem.innerHTML = "<span class='recent-tags'>" + querystring + "</span> sorted by <span class='recent-tags'>"+ sort + "</span> by <span class='recent-tags'>" + time + "</span>";
    list.prepend(listItem);
    
    var recentListItems = list.innerHTML;
    
    //set recent items in localStorage
    localStorage.recents = recentListItems;
    
  }


//If recent items are found in localStorage, append to the recents list
  if(localStorage.recents){
    var list = document.getElementById("recent-searches");
    list.innerHTML = localStorage.recents;
  }

  function scoreFormat(num) {
    return num > 999 ? (num/1000).toFixed(1) + 'k' : num
  }
  
  /**
   * Return time since link was posted
   * http://stackoverflow.com/a/3177838/477958
  **/
  function timeSince(date) {
    var seconds = Math.floor(((new Date().getTime()/1000) - date))

    var interval = Math.floor(seconds / 31536000);

    if (interval >= 1) {
      if(interval == 1) return interval + " year ago";
      else 
        return interval + " years ago";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
      if(interval == 1) return interval + " month ago";
      else
        return interval + " months ago";
    }
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
      if(interval == 1) return interval + " day ago";
      else
        return interval + " days ago";
    }
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
      if(interval == 1) return interval + " hour ago";
      else
        return interval + " hours ago";
    }
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
      if(interval == 1) return interval + " minute ago";
      else
        return interval + " minutes ago";
    }
    return Math.floor(seconds) + " seconds ago";
  }


  
  function commentModal(event){
   
     
     var openModal = document.getElementById("modal");
     var overlay = document.getElementById("overlay");
     var container = document.getElementById("container");
     var closeButton = document.getElementsByTagName("button")[0];
     
     openModal.classList.remove("hidden");
     container.classList.add("modal-on");
     overlay.classList.add("on");
     
 document.getElementsByTagName("body")[0].setAttribute("style","overflow:hidden");

     
     var commentURL = this.value+".json";
     
  
     $.getJSON(commentURL, function(result){
      
      
      $.each(result[1].data.children.slice(0,25),function(i, post){
              $("#reddit-comments").append('<br><p>'+post.data.body+'</p>');
             
         
              
            }
         )     
       }  
    )
 
  closeButton.onclick = removeComments;
 
 }
  
//Remove comments from modal container
  function removeComments(event){
  
  
       var closeModal = document.getElementById("modal");
       var container = document.getElementById("container");
        var overlay = document.getElementById("overlay");
        
       closeModal.classList.add("hidden");
       container.classList.remove("modal-on");
       overlay.classList.remove("on");
       
       document.getElementsByTagName("body")[0].setAttribute("style","overflow:none");
       
       var comments = document.getElementById("reddit-comments");
       
       while(comments.firstChild){
            comments.removeChild(comments.firstChild);
       }
  }

document.getElementById("clear-all-recents").addEventListener("click",function(){
  var list = document.getElementById("recent-searches");
  while (list.firstChild){
    list.removeChild(list.firstChild);
  }
  window.localStorage.clear();
  
});
     