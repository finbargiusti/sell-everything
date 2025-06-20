window.addEventListener('load', () => {
  const emailButton = document.querySelector('.email');
  emailButton.addEventListener('click', () => {
    // copy to clipboard
    const email = 'selleverythingpls@gmail.com';
    const fallback = () => {
      window.location.href = `mailto:${email}`;
    }
    if (!navigator.clipboard) {
      fallback();
      return;
    }
    navigator.clipboard.writeText(email).then(() => {
      // Show a message or change the button text to indicate success
      alert('Copied!');
    }).catch(err => {
      console.error('Failed to copy email: ', err);
      // fallback to using a mailto link
      fallback();
    });
  });
});
