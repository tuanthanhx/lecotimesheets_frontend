# TODO

1. Remove sensitive data in localStorage (maybe can fetch /auth/me to check group instead keep it in localStorage) --> DONE
2. Maybe need to split API for ADMIN and USER (member) to protect sensitive data, like revenue --> use makeHidden() --> DONE
3. Remove username in localstorage (because it will be changed when user update in settings page). Or update it when they update settings, etc,... --> DONE
4. Phần quyền API (approve, unapprove, delete,...)