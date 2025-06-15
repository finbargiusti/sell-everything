window.addEventListener('load', () => {
  const emailButton = document.querySelector('.email');
  emailButton.addEventListener('click', () => {
    // copy to clipboard
    const email = 'selleverythingpls@gmail.com';
    navigator.clipboard.writeText(email).then(() => {
      // Show a message or change the button text to indicate success
      alert('Copied!');
    }).catch(err => {
      console.error('Failed to copy email: ', err);
    });
  });
});
