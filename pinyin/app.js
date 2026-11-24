// Set verified release details here when the book is ready for sale.
// preorder: true while the book is on pre-order (button reads 「Amazonで予約する」). Set it to false on release day.
const BOOK = { amazonUrl: 'https://www.amazon.co.jp/dp/B0HSQPVJ7K', price: '発売記念価格 500円', releaseDate: '2026年12月26日発売　予約受付中', preorder: true };
const audio = new Audio();
audio.preload = 'none';
let activeButton = null;
const status = document.querySelector('#audio-status');
let statusTimer;
function clearAudioState() {
  document.querySelectorAll('.audio-button').forEach(button => {
    button.classList.remove('is-playing');
    button.setAttribute('aria-pressed', 'false');
  });
  activeButton = null;
}
function audioError() {
  clearAudioState();
  status.textContent = '音声を再生できませんでした。もう一度タップしてください。';
  status.hidden = false;
  clearTimeout(statusTimer);
  statusTimer = setTimeout(() => { status.hidden = true; }, 6000);
}
document.querySelectorAll('.audio-button').forEach(button => {
  button.setAttribute('aria-pressed', 'false');
  button.addEventListener('click', async () => {
    if (activeButton === button && !audio.paused) { audio.pause(); clearAudioState(); return; }
    audio.pause(); clearAudioState(); status.hidden = true;
    activeButton = button;
    audio.src = `assets/${button.dataset.audio}.mp3`;
    button.classList.add('is-playing');
    button.setAttribute('aria-pressed', 'true');
    try { await audio.play(); } catch (error) { if (error.name !== 'AbortError') audioError(); }
  });
});
audio.addEventListener('ended', clearAudioState);
audio.addEventListener('error', audioError);
const feedback = document.querySelector('#quiz-feedback');
const explanation = document.querySelector('#quiz-explain');
document.querySelectorAll('[data-answer]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-answer]').forEach(choice => {
      choice.classList.remove('chosen', 'correct');
      choice.setAttribute('aria-pressed', String(choice === button));
    });
    const isCorrect = button.dataset.answer === 'sell';
    button.classList.add(isCorrect ? 'correct' : 'chosen');
    document.querySelector('[data-answer="sell"]').classList.add('correct');
    feedback.textContent = isCorrect ? '正解！ 耳で「わかった！」' : 'おしい！ 声の下がり方に注目。';
    feedback.hidden = false;
    explanation.hidden = false;
  });
});
document.querySelector('#quiz-reset').addEventListener('click', () => {
  audio.pause(); clearAudioState();
  feedback.hidden = true; explanation.hidden = true;
  document.querySelectorAll('[data-answer]').forEach(button => {
    button.classList.remove('chosen', 'correct'); button.setAttribute('aria-pressed', 'false');
  });
  document.querySelector('.quiz-play').focus();
});
const dialog = document.querySelector('#image-dialog');
document.querySelectorAll('.image-preview').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelector('#dialog-title').textContent = button.dataset.title;
    document.querySelector('#dialog-image').src = button.dataset.image;
    document.querySelector('#dialog-image').alt = button.querySelector('img').alt;
    dialog.showModal();
  });
});
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  const r = dialog.getBoundingClientRect();
  if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
});
if (BOOK.amazonUrl) {
  const link = document.querySelector('#purchase-link');
  link.href = BOOK.amazonUrl; link.hidden = false;
  if (BOOK.preorder) link.firstChild.textContent = 'Amazonで予約する ';
  document.querySelector('#release-status').hidden = true;
  document.querySelector('#book-meta').textContent = [BOOK.price, BOOK.releaseDate].filter(Boolean).join(' ｜ ');
}
const sticky = document.querySelector('#sticky-bar');
const hero = document.querySelector('.hero');
const book = document.querySelector('#book');
let pastHero = false;
let atBook = false;
const updateSticky = () => { sticky.hidden = !pastHero || atBook; };
new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (entry.target === hero) pastHero = !entry.isIntersecting && entry.boundingClientRect.bottom < 0;
    if (entry.target === book) atBook = entry.isIntersecting;
  }
  updateSticky();
}, { threshold: 0 }).observe(hero);
new IntersectionObserver(entries => {
  atBook = entries[0].isIntersecting; updateSticky();
}, { threshold: 0 }).observe(book);
document.addEventListener('visibilitychange', () => { if (document.hidden) { audio.pause(); clearAudioState(); } });
