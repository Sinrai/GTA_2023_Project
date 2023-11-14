
const faqItems = document.querySelectorAll('.faq-item');
  
if (faqItems.length > 0) {
    faqItems.forEach((item, index) => {
    console.log(`Element ${index + 1}:`, item);
    const question = item.querySelector('.faq-question');
  
    question.addEventListener('click', () => {
        // Toggle-Ansicht der Antwort
        const answer = item.querySelector('.faq-answer');
        answer.classList.toggle('show');                      
        // Ändere den Stil der Frage basierend auf geöffnetem/zusammengeklapptem Zustand
        question.classList.toggle('active');
        // Alert zum Testen, ob der Klick funktioniert
    });
  });    
} else {
  console.log('Keine FAQ-Elemente gefunden.');
}