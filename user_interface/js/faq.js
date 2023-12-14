faqItems = document.querySelectorAll('.faq-item'); //get html objects

if (faqItems.length > 0) {
    //go trough every faq question and add the answer
    faqItems.forEach((item, index) => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            const answer = item.querySelector('.faq-answer');
            answer.classList.toggle('show');
            question.classList.toggle('active');
        });
    });
} else {
    console.log('Keine FAQ-Elemente gefunden.');
}
