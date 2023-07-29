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
        create_mail(mail, mailbox)
      });
    })
}

function create_mail(mail, mailbox){
  const mail_div = document.createElement('div')
  mail_div.className = 'mail-div'
  mail_div.innerHTML = `<strong>${mail.sender}</strong>  ${mail.subject}  <span id='date'>${mail.timestamp} </span>`
  if (mail.read == true){
    mail_div.style.background = '#dbdbdb'
  }

  mail_div.onclick = () =>{
    //Create mail_view
    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'none';
    document.querySelector('#mail-view').style.display = 'block';
    document.querySelector('#mail-view').innerHTML = '';

    fetch(`/emails/${mail.id}`)
    .then(response => response.json())
    .then(mail => {

      document.addEventListener('click', event =>{
          if (event.target.id == 'reply_button'){
            reply_mail(mail)
          }
      })
      

      // Sender

      const sender = document.createElement('div')
      sender.innerHTML = `<strong>From: </strong> ${mail.sender}`
      document.querySelector('#mail-view').append(sender)
      
      // Subject

      const subject = document.createElement('div')
      subject.innerHTML = `<strong>Subject: </strong> ${mail.subject}`
      document.querySelector('#mail-view').append(subject)

      // Timestamp

      const timestamp = document.createElement('div')
      timestamp.innerHTML = `<strong>Timestamp: </strong> ${mail.timestamp}`
      document.querySelector('#mail-view').append(timestamp)

      // Recipients

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

       // Reply

       const reply = document.createElement('button')
       reply.innerHTML = 'Reply'
       reply.id = 'reply_button'
       reply.className = "btn btn-sm btn-outline-primary"
       document.querySelector('#mail-view').append(reply)

       // Line

       const hr = document.createElement('hr')
       document.querySelector('#mail-view') .append(hr)

       // Body 

       const body = document.createElement('div')
       body.innerHTML = `${mail.body}`
       document.querySelector('#mail-view').append(body)

      fetch(`/emails/${mail.id}`, {
        method: 'PUT',
        body: JSON.stringify({
            read: true,
        })
      })
      .then(response => response.json())
      .then(result => {
          // Print result
          console.log(result);
      });
      
      

    })
  }

  //Create archive button
  if (mailbox != "sent"){
    const archive = document.createElement('button')
    if (mailbox == "inbox"){
      archive.innerHTML = "Archive"
    }
    else{
      archive.innerHTML = "Unarchive"
    }
    archive.id = 'archive_button'
    archive.className = "btn btn-outline-secondary btn-sm"
    archive.style.marginTop = "5px;"
    archive.style.marginRight = "100%"

    archive.onclick = function (event) {
      fetch(`/emails/${mail.id}`, {
        method: 'PUT',
        body: JSON.stringify({
            "archived": !mail.archived,
        })
      })
      .then(data => load_mailbox("inbox"))
      event.stopPropagation(); // Prevent the event from bubbling up to the parentButton
    };
    mail_div.append(archive)
  }
  document.querySelector('#emails-view').append(mail_div)
}



function reply_mail(mail){
    // Show compose view and hide other views
    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'block';
    document.querySelector('#mail-view').style.display = 'none';
  
    // Populate the fields
    document.querySelector('#compose-recipients').value = mail.sender;
    if (!mail.subject.includes("Re: ")){
      document.querySelector('#compose-subject').value = `Re: ${mail.subject}`;
    } else {
      document.querySelector('#compose-subject').value = `Re: ${mail.subject}`;
    }
    document.querySelector('#compose-body').value = `On ${mail.timestamp} ${mail.sender} wrote: \n${mail.body}`;
}


// function getCurrentTime(){
//   const d = new Date();
//   const monthNames = [
//     'January', 'February', 'March', 'April', 'May', 'June',
//     'July', 'August', 'September', 'October', 'November', 'December'
//   ];
//   return `${monthNames[d.getMonth()]} ${d.getDate()}, ${d.getHours()}:${d.getMinutes()}`
// }
