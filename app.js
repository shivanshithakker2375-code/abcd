const contacts = [
  { id: '1', name: 'Alice Chen', initials: 'AC', status: 'Online', messages: [{ id: 'm1', text: 'Hey, did you review the PR?', sender: 'them', timestamp: Date.now() - 3600000 }] },
  { id: '2', name: 'Bob Smith', initials: 'BS', status: 'Away', messages: [{ id: 'm2', text: 'Meeting in 10 mins', sender: 'them', timestamp: Date.now() - 7200000 }] },
  { id: '3', name: 'Dana Lee', initials: 'DL', status: 'Online', messages: [] },
];

let activeId = null;

const $ = (sel) => document.getElementById(sel);
const contactListEl = $('contactList');
const headerNameEl = $('headerName');
const headerStatusEl = $('headerStatus');
const headerAvatarEl = $('headerAvatar');
const messageAreaEl = $('messageArea');
const chatFormEl = $('chatForm');
const messageInputEl = $('messageInput');
const sendBtnEl = $('sendBtn');
const replyBtnEl = $('replyBtn');

const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

const formatTime = (ts) => new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const escapeHtml = (text) => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

function renderContacts() {
  contactListEl.innerHTML = '';
  contacts.forEach(c => {
    const li = document.createElement('li');
    li.className = 'contact-item' + (c.id === activeId ? ' active' : '');
    li.innerHTML = `<div class="contact-avatar">${c.initials}</div><div class="contact-info"><h4>${escapeHtml(c.name)}</h4><span>${escapeHtml(c.status)}</span></div>`;
    li.addEventListener('click', () => selectContact(c.id));
    contactListEl.appendChild(li);
  });
}

function renderMessages(contact) {
  messageAreaEl.innerHTML = '';
  if (contact.messages.length === 0) {
    messageAreaEl.innerHTML = '<div class="empty-state">No messages yet. Say hello!</div>';
    return;
  }
  contact.messages.forEach(m => {
    const div = document.createElement('div');
    div.className = `message ${m.sender}`;
    div.innerHTML = `${escapeHtml(m.text)}<span class="time">${formatTime(m.timestamp)}</span>`;
    messageAreaEl.appendChild(div);
  });
  messageAreaEl.scrollTop = messageAreaEl.scrollHeight;
}

function selectContact(id) {
  activeId = id;
  const contact = contacts.find(c => c.id === id);
  if (!contact) return;
  headerNameEl.textContent = contact.name;
  headerStatusEl.textContent = contact.status;
  headerAvatarEl.textContent = contact.initials;
  messageInputEl.disabled = false;
  sendBtnEl.disabled = false;
  replyBtnEl.disabled = false;
  renderContacts();
  renderMessages(contact);
  messageInputEl.focus();
}

function sendMessage(text, sender = 'me') {
  if (!activeId || !text.trim()) return;
  const contact = contacts.find(c => c.id === activeId);
  if (!contact) return;
  contact.messages.push({ id: uid(), text: text.trim(), sender, timestamp: Date.now() });
  renderMessages(contact);
  messageInputEl.value = '';
  messageInputEl.focus();
  if (sender === 'me') {
    setTimeout(() => receiveMockReply(contact), 1200 + Math.random() * 1000);
  }
}

function receiveMockReply(contact) {
  const replies = ['Got it, thanks!', 'Interesting point.', 'Can you elaborate?', 'I will check shortly.', 'Sounds good.'];
  const reply = replies[Math.floor(Math.random() * replies.length)];
  contact.messages.push({ id: uid(), text: reply, sender: 'them', timestamp: Date.now() });
  if (activeId === contact.id) renderMessages(contact);
}

chatFormEl.addEventListener('submit', (e) => {
  e.preventDefault();
  sendMessage(messageInputEl.value, 'me');
});

replyBtnEl.addEventListener('click', () => {
  sendMessage(messageInputEl.value, 'them');
});

renderContacts();
if (contacts.length) selectContact(contacts[0].id);