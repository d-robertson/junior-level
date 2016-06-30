$(document).ready(function(){
  $('.saveBtn').on('click', function(e){
    e.preventDefault();
    console.log('above if');
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

      var that = this;
      console.log(that);

      $.ajax({
        method: 'POST',
        url: routeUrl,
        data: data,
        success: function (response) {
          console.log('success');
          $(that).attr('used', 'done');
        },
        error: function (xhr, ajaxOptions, thrownError) {
          console.log('error');
          console.log(xhr);
          console.log(ajaxOptions);
          console.log(thrownError);
        }
      });
    }
    console.log('passed if');
  });
});