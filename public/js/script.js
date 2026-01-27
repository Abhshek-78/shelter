// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

// Star Rating Functionality
document.addEventListener('DOMContentLoaded', function() {
  const stars = document.querySelectorAll('.star-rating i');
  const ratingInput = document.getElementById('rating');
  
  if (stars.length > 0) {
    stars.forEach(star => {
      star.addEventListener('click', function() {
        const ratingValue = this.getAttribute('data-value');
        ratingInput.value = ratingValue;
        
        // Update star appearance
        stars.forEach(s => {
          const starValue = s.getAttribute('data-value');
          if (starValue <= ratingValue) {
            s.classList.remove('bi-star');
            s.classList.add('bi-star-fill');
            s.style.color = '#ffc107';
          } else {
            s.classList.remove('bi-star-fill');
            s.classList.add('bi-star');
            s.style.color = '#ddd';
          }
        });
      });
      
      // Hover effect
      star.addEventListener('mouseenter', function() {
        const ratingValue = this.getAttribute('data-value');
        stars.forEach(s => {
          const starValue = s.getAttribute('data-value');
          if (starValue <= ratingValue) {
            s.style.color = '#ffc107';
          } else {
            s.style.color = '#ddd';
          }
        });
      });
    });
    
    // Reset on mouse leave
    const starRating = document.getElementById('starRating');
    starRating.addEventListener('mouseleave', function() {
      const currentRating = ratingInput.value;
      stars.forEach(s => {
        const starValue = s.getAttribute('data-value');
        if (starValue <= currentRating) {
          s.classList.remove('bi-star');
          s.classList.add('bi-star-fill');
          s.style.color = '#ffc107';
        } else {
          s.classList.remove('bi-star-fill');
          s.classList.add('bi-star');
          s.style.color = '#ddd';
        }
      });
    });
  }
});