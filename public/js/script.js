window.addEventListener("load",()=>{
  if(window.location.search.includes("posted=true")){
    alert("Place Listed");
  }
  else if(window.location.search.includes("post=updated")){
    alert("Place Details Updated");
  }
  else if(window.location.search.includes("post=deleted")){
    alert("Place Details Updated");
  }
});
// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    let forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
      .forEach(function (form) {
        form.addEventListener('submit', function (event) {
          if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
          }
  
          form.classList.add('was-validated')
        }, false)
      })
  })();
  