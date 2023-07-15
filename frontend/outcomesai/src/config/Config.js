export const config = {
  baseUrl: 'https://1q35lcvj4f.execute-api.us-west-2.amazonaws.com/',
  stage: 'dev',
  accessToken:
    'eyJraWQiOiJkY0ppXC93NFFGU1VCXC9xTFlvR0t6U25IbElEaEFxQzE5dnlOVVc5eURSM3c9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiI3NTBkNWQ4Ny0wOTJlLTQxMmUtYjk0ZS01NDRlYTUzZTVkZWEiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtd2VzdC0yLmFtYXpvbmF3cy5jb21cL3VzLXdlc3QtMl9BQ0RFU25iMUciLCJ2ZXJzaW9uIjoyLCJjbGllbnRfaWQiOiJ1aDVjZDloanB1dnA0OHNia2dwZDVsczRiIiwiZXZlbnRfaWQiOiJlOTg2YTIzOC02NmUxLTRiYzUtYmY0Ni1mYWFhZmJjMWZmNDciLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6Im91dGNvbWVzYWlcL3JlYWQgb3V0Y29tZXNhaVwvZGVsZXRlIG91dGNvbWVzYWlcL3dyaXRlIiwiYXV0aF90aW1lIjoxNjg5MjkwMjMxLCJleHAiOjE2ODkzNzY2MzEsImlhdCI6MTY4OTI5MDIzMSwianRpIjoiY2NjZmM0ZTUtYmJlZS00Njk3LTg0YmYtMjhjZTNlYTQzNmRkIiwidXNlcm5hbWUiOiI3NTBkNWQ4Ny0wOTJlLTQxMmUtYjk0ZS01NDRlYTUzZTVkZWEifQ.iqh5bn3nV1s60LTsWWpiOiPDtddfOLv7noNUG9DpRd3u8lSG0LkxKR7HZiafP4r15je9a97wtbvqt4pLi_9V4gWmt-yhd06ow4L3FnHagurXdT4NAZTjjQS1Ywx-Xg5m9yNDaWch7r4h-CxULg1CIcwhSK4fj5itm3gzigA2bQc0T7ut7QSUxSpuI2sWQyEmX78eSywaxhF1o-O_VMJsOYu6Ix9SH2ejskBmb1O8sXJRtU6h8YChVnin7CVmCgC38egh2ThSG4Qh4IxlDpmRQvQy_9stJ387Gq9hQnGKJQqG8Sr1Rq-8VnuCF0_BADihYTZ5VFY1RrD6aRnTHxE_kA',
};

export const awsConfig = {
  Auth: {
    region: 'us-west-2',
    userPoolId: 'us-west-2_ACDESnb1G',
    userPoolWebClientId: 'uh5cd9hjpuvp48sbkgpd5ls4b',
    oauth: {
      domain: 'https://outcomesai-api.auth.us-west-2.amazoncognito.com',
      scope: ['email', 'openid', 'phone'],
      redirectSignIn: 'https://outcomesai.com',
      redirectSignOut: 'https://outcomesai.com',
      responseType: 'code',
    },
  },
};
