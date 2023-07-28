// Link to documentation: https://cs50.harvard.edu/web/2020/projects/3/mail/
// Branches: Main, post-emails
document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  
  // By default, load the inbox
  load_mailbox('inbox');

  const form = document.querySelector('#compose-form')
  form.onsubmit = () =>{
    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
          recipients: document.querySelector('#compose-recipients').value,
          subject: document.querySelector('#compose-subject').value,
          body: document.querySelector('#compose-body').value
      })
    })
    .then(response => response.json())
    .then(result => {
        // Print result
        console.log(result);
    })
    .catch(error => {
      console.error("Fetch error:", error);
    });
  }

});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(mail => 
    {
      mail.forEach(mail => {
        create_mail(mail)
      });
    })
}

function create_mail(mail){
  const mail_div = document.createElement('div')
  mail_div.className = 'mail-div'
  mail_div.innerHTML = `<strong>${mail.sender}</strong>        ${mail.subject}  <span id='date'>${mail.timestamp}</span>`
  document.querySelector('#emails-view').append(mail_div)
}

// function getCurrentTime(){
//   const d = new Date();
//   const monthNames = [
//     'January', 'February', 'March', 'April', 'May', 'June',
//     'July', 'August', 'September', 'October', 'November', 'December'
//   ];
//   return `${monthNames[d.getMonth()]} ${d.getDate()}, ${d.getHours()}:${d.getMinutes()}`
// }
