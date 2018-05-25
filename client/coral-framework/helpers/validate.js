export default {
  email: email => /^.+@.+\..+$/.test(email),
  password: pass => /^(?=.{8,}).*$/.test(pass),
  confirmPassword: () => true,
  username: username => /^[\w.-][\w .-]{1,48}[\w.-]$/.test(username),
  organizationName: org => /^[a-zA-Z0-9_ ]+$/.test(org),
  organizationContactEmail: email => /^.+@.+\..+$/.test(email),
};
