async function sendEmail(event) {
  try {
    //why why
    event.preventDefault();
    const email = document.getElementById('email').value;
    const authCode = document.getElementById('authCode').value;
    const nickname = document.getElementById('nickname').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const address = document.getElementById('address').value;

    console.log(email);

    const result = {
      email: email,
    };
    await $.ajax({
      type: 'POST',
      url: '/api/signUp/confirm',
      data: { email },
      success: (data) => {
        alert(data.message);
      },
      error: (error) => {
        alert(error.responseJSON.errorMessage);
      },
    });
  } catch (error) {
    console.log(error);
  }
}
const confirmBtn = document.getElementById('confirm');
confirmBtn.addEventListener('click', sendEmail);

// 회원가입 정보를 서버로 전송
async function a(reg) {
  try {
    reg.preventDefault();
    const email = document.getElementById('email').value;
    const authCode = document.getElementById('authCode').value;
    const nickname = document.getElementById('nickname').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const address = document.getElementById('address').value;

    const signUp = {
      email,
      AuthCode: authCode,
      nickname,
      password,
      confirmPassword,
      userAddress: address,
    };

    const response = await fetch('/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signUp),
    });
    await response.json();
    if (response.ok) {
      alert('회원가입이 성공하였습니다!');
      location.reload();
    }
  } catch (error) {
    console.log(error);
  }
}
const signupBtn = document.getElementById('signup');
signupBtn.addEventListener('click', a);