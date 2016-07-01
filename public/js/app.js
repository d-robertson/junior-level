$(document).ready(function(){
  //here I set up a event listener on my save job button
  //I use jquery to grab the elements from my index.ejs
  //then i use ajax to hit a post route on my index.js page and update my
  //join table with the user id and job id
  $('.saveBtn').on('click', function(e){
    e.preventDefault();
    if($(this).attr('used') !== 'done'){
      var routeUrl = $(this).attr('action');
      var title = $(this).parent()[0].children[0].textContent;
      var company = $(this).parent()[0].children[1].textContent;
      var location = $(this).parent()[0].children[2].textContent;
      var url = $(this).parent()[0].children[3].href;

      var data = {
        title: title,
        company: company,
        location: location,
        url: url
      }
      //I store the current instance of "this" in a variable for access
      //in the success of my ajax call
      var that = this;

      $.ajax({
        method: 'POST',
        url: routeUrl,
        data: data,
        success: function (response) {
          $(that).attr('used', 'done');
        },
        error: function (xhr, ajaxOptions, thrownError) {
          //I leave these console logs so the user can see the errors if need be
          console.log('error');
          console.log(xhr);
          console.log(ajaxOptions);
          console.log(thrownError);
        }
      });
    }
  });
  //I use jquery again to add and event listener to my delete buttons
  //I use ajax to hit a delete job route and give it the specific job id
  //to delete the association in my join table and in turn through the
  //success ajax function delete the job from my jobs.ejs
  $('.deleteBtn').on('click', function(e){
    e.preventDefault();

    var routeUrl = $(this).attr('action');
    var id = $(this).parent()[0].children[3].textContent;
    //store the current instance of "this" for the success of the delete route
    var that = this;
    $.ajax({
      method: 'DELETE',
      url: routeUrl + '/' + id,
      success: function(response){
        $(that).parent().remove();
      },
      error: function(xhr, ajaxOptions, thrownError){
        console.log('delete error');
        console.log(xhr);
        console.log(ajaxOptions);
        console.log(thrownError);
      }
    });
  });
});