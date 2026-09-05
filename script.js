// Keep the footer copyright year current automatically
document.querySelectorAll('.copyright').forEach((el) => {
  el.textContent = el.textContent.replace(/©\s*\d{4}/, `© ${new Date().getFullYear()}`);
});
