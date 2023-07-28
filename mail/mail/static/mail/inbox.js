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
  document.querySelector('#mail-view').style.display = 'none';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#mail-view').style.display = 'none';

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
  mail_div.innerHTML = `<strong>${mail.sender}</strong>  ${mail.subject}  <span id='date'>${mail.timestamp}</span>`
  if (mail.read == true){
    mail_div.style.background = '#dbdbdb'
  }

  mail_div.onclick = () =>{
    
    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'none';
    document.querySelector('#mail-view').style.display = 'block';
    document.querySelector('#mail-view').innerHTML = '';

    fetch(`/emails/${mail.id}`)
    .then(response => response.json())
    .then(mail => {

      //Sender

      const sender = document.createElement('div')
      sender.innerHTML = `<strong>From: </strong> ${mail.sender}`
      document.querySelector('#mail-view').append(sender)
      
      //Subject

      const subject = document.createElement('div')
      subject.innerHTML = `<strong>Subject: </strong> ${mail.subject}`
      document.querySelector('#mail-view').append(subject)

      //Timestamp

      const timestamp = document.createElement('div')
      timestamp.innerHTML = `<strong>Timestamp: </strong> ${mail.timestamp}`
      document.querySelector('#mail-view').append(timestamp)

      //Recipients

      const recipients_span = document.createElement('span')
      recipients_span.innerHTML = "<strong>Recipients: </strong>"
      document.querySelector('#mail-view').append(recipients_span)

      const ul = document.createElement('ul')
      document.querySelector('#mail-view').append(ul)
      const recipients = mail.recipients
      recipients.forEach(item => {
        const li = document.createElement('li')
        li.innerHTML = item
        document.querySelector('ul').append(li)
       })

       // Line

       

    })
  }
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
